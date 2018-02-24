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
    },

    setWallPaperArgs: {
        currentPotd: localStorage.currentPotd,
        lastImageUrl: localStorage.lastImageUrl,

        onStart: (apiRequestUrl, potd) => {
            site.text = chrome.i18n.getMessage('calling');
            site.href = apiRequestUrl;
        },

        onApply: (imageUrl, potd) => {
            site.text = chrome.i18n.getMessage('loading');
            site.href = imageUrl;

            let opacity = 0.0;
            wallpaper.style.opacity = opacity;

            wallpaper.onload = () => {
                localStorage.lastImageUrl = imageUrl;

                const id = setInterval(() => {
                    opacity += 0.1;

                    wallpaper.style.opacity = opacity;

                    if (opacity >= 1.0) {
                        wallpaper.style.opacity = 1.0;

                        site.text = potd.title;
                        site.href = potd.url;

                        clearInterval(id);

                        return;
                    }

                }, 100);
            };

            wallpaper.onerror = () => {
                site.text = chrome.i18n.getMessage('fail');
            };

            wallpaper.src = imageUrl;
        },

        onFail: (apiRequestUrl, potd) => {
            site.text = chrome.i18n.getMessage('fail');
            site.href = apiRequestUrl;
        }
    }
};

(() => {
    newtab.updateClock();

    if (window.navigator.onLine) {
        sites.setWallpaper(newtab.setWallPaperArgs);

    } else {
        console.log('using last image in case of offline');

        if (localStorage.currentPotd && localStorage.lastImageUrl) {
            newtab.setWallPaperArgs.onApply(localStorage.lastImageUrl, sites[localStorage.currentPotd]);
        }
    }

})();

