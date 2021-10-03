/**
 * @author kemunpus
 */
'use strict';

const newtab = {
    updateClock: () => {
        const showSec = Boolean(localStorage.showSec);
        const showDate = Boolean(localStorage.showDate);
        const showMemory = Boolean(localStorage.showMemory);

        const now = new Date();

        time.firstChild.data = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + (showSec ? ':' + String(now.getSeconds()).padStart(2, '0') : '');
        date.firstChild.data = showDate ? now.toLocaleDateString() : '';

        if (showMemory) {
            chrome.system.memory.getInfo((info) => {
                memory.value = 1.0 - (info.availableCapacity / info.capacity);
                memory.style.display = 'block';
            });

        } else {
            memory.style.display = 'none';
        }

        setTimeout(newtab.updateClock, 1000);
    }
};

(() => {
    newtab.updateClock();

    if (localStorage.lastUrl) {
        wallpaper.src = localStorage.lastUrl;
    }

    const site = sites[localStorage.site ? localStorage.site : defaultSite];

    const date = new Date();
    date.setDate(date.getDate() + site.dayOffset);
    const today = date.getUTCFullYear() + '-' + String(date.getUTCMonth() + 1).padStart(2, '0') + '-' + String(date.getUTCDate()).padStart(2, '0');
    const apiUrl = site.apiUrl.replace('TODAY', today);

    chrome.runtime.sendMessage({ online: window.navigator.onLine, url: apiUrl }, (response) => {
        const json = response.json;

        if (json) {
            const imageUrl = site.imageUrl(json);

            if (imageUrl) {
                wallpaper.onload = () => {
                    info.text = site.title;
                    info.href = site.url;
                    localStorage.lastUrl = imageUrl;
                };

                wallpaper.onerror = () => {
                    localStorage.lastUrl = '';
                };

                wallpaper.src = imageUrl;
            }
        }
    });
})();