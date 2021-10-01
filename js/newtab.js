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

    site.text = chrome.i18n.getMessage('calling');

    const currentPotd = localStorage.currentPotd ? localStorage.currentPotd : sites.defaultPotd;
    const potd = sites[currentPotd];
    const now = new Date();
    now.setDate(now.getDate() + potd.dayoffset);
    const today = now.getUTCFullYear() + '-' + String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + String(now.getUTCDate()).padStart(2, '0');
    const apiRequestUrl = potd.apiUrl.replace('TODAY', today);

    chrome.runtime.sendMessage({ online: window.navigator.onLine, url: apiRequestUrl }, (response) => {
        let imageUrl = potd.getImageUrl(response.json);

        if (!imageUrl) {
            imageUrl = localStorage.lastImageUrl;
        }

        wallpaper.onload = () => {
            wallpaper.style.opacity = 1.0;
            site.text = potd.title;
            localStorage.lastImageUrl = imageUrl;
        };

        wallpaper.onerror = () => {
            site.text = chrome.i18n.getMessage('fail');
        };

        site.text = chrome.i18n.getMessage('loading');
        site.href = imageUrl;

        wallpaper.style.opacity = 0.0;
        wallpaper.src = imageUrl;
    });

})();