"use strict";

import { DEFAULT_SITE, SITES } from "./sites.js";

function update() {
    const selectedSite = localStorage.site ? localStorage.site : DEFAULT_SITE;

    siteList.innerHTML = "";

    for (let s in SITES) {
        const opt = document.createElement("option");

        if (s === selectedSite) {
            opt.setAttribute("selected", "selected");
            site.setAttribute("href", SITES[s].url);
        }

        opt.setAttribute("value", s);
        opt.innerHTML = SITES[s].title;

        siteList.appendChild(opt);
    }

    showSec.checked = Boolean(localStorage.showSec);
    showDate.checked = Boolean(localStorage.showDate);
    showMemory.checked = Boolean(localStorage.showMemory);
}

for (let element of document.getElementsByTagName("html")) {
    element.innerHTML = element.innerHTML.toString().replace(/__MSG_(\w+)__/g, (match, value) => {
        return value ? chrome.i18n.getMessage(value) : "";
    });
}

siteList.onchange = () => {
    site.setAttribute("href", SITES[siteList.value].url);
}

save.onclick = () => {
    localStorage.site = siteList.value;
    localStorage.showSec = showSec.checked ? "1" : "";
    localStorage.showDate = showDate.checked ? "1" : "";
    localStorage.showMemory = showMemory.checked ? "1" : "";
    localStorage.lastUrl = "";

    update();
}

reset.onclick = () => {
    localStorage.site = "";
    localStorage.showSec = "";
    localStorage.showDate = "";
    localStorage.showMemory = "";
    localStorage.lastUrl = "";

    update();
}

update();