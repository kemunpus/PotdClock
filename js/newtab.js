"use strict";

import { DEFAULT_SITE, SITES } from "./sites.js";

setInterval(() => {
    const now = new Date();

    time.textContent = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + (Boolean(localStorage.showSec) ? ":" + String(now.getSeconds()).padStart(2, "0") : "");
    date.textContent = Boolean(localStorage.showDate) ? now.toLocaleDateString() : "";

    if (Boolean(localStorage.showMemory)) {
        chrome.system.memory.getInfo((info) => {
            memory.value = 1.0 - (info.availableCapacity / info.capacity);
            memory.style.display = "block";
        });

    } else {
        memory.style.display = "none";
    }
}, 500);

const site = SITES[localStorage.site ? localStorage.site : DEFAULT_SITE];
console.log(`source site title : ${site.title}`);
console.log(`source site url : ${site.url}`);

const today = new Date();
today.setDate(today.getDate() + site.dayOffset);
console.log(`today for source site : ${today}`);

const apiUrl = site.apiUrl.replace("_TODAY_", today.getUTCFullYear() + "-" + String(today.getUTCMonth() + 1).padStart(2, "0") + "-" + String(today.getUTCDate()).padStart(2, "0"));

console.log(`calling site api : ${apiUrl}`);

chrome.runtime.sendMessage({ online: window.navigator.onLine, url: apiUrl }, (response) => {
    try {
        const json = response.json;
        let imageUrl = localStorage.lastUrl;

        if (json) {
            console.log(`api returns : ${JSON.stringify(json)}`);

            const url = site.imageUrl(json);
            console.log(`detected image url : ${url}`);

            if (url) {
                imageUrl = url;

                wallpaper.onload = () => {
                    console.log(`image loaded : ${wallpaper.src}`);
                    localStorage.lastUrl = wallpaper.src;

                    info.text = site.title;
                    info.href = site.url;
                };

                wallpaper.onerror = () => {
                    console.log(`image load error : ${wallpaper.src}`);

                    wallpaper.onload = null;
                    wallpaper.onerror = null;

                    console.log(`retry with the last image : ${localStorage.lastUrl}`);
                    wallpaper.src = localStorage.lastUrl;
                };
            }
        }

        if (imageUrl) {
            console.log(`loading image : ${imageUrl}`);
            wallpaper.src = imageUrl;
        }

    } catch (error) {
        console.log(error);

        wallpaper.onload = null;
        wallpaper.onerror = null;

        console.log(`use the last image anyway : ${localStorage.lastUrl}`);
        wallpaper.src = localStorage.lastUrl;
    }
});