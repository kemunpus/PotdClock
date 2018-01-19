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

        time.firstChild.data = ('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + (showSec ? ':' + ('00' + now.getSeconds()).slice(-2) : '');
        date.firstChild.data = showDate ? now.toLocaleDateString() : '';

        if (showMemory) {
            chrome.system.memory.getInfo(function (info) {
                memory.value = 1.0 - info.availableCapacity / info.capacity;
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

    sites.setWallpaper(localStorage.currentPotd);
})();

