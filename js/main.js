/**
 * @author <kemunpus@hotmail.com>
 */
'use strict';

updateClock();

updateWallpaperBy[currentPotd]();

function updateClock() {
    const showSec = localStorage['showSec'] === 'true' ? true : false;
    const showDate = localStorage['showDate'] === 'true' ? true : false;
    const showMemory = localStorage['showMemory'] === 'true' ? true : false;

    const now = new Date();

    time.firstChild.data = ('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + (showSec ? ':' + ('00' + now.getSeconds()).slice(-2) : '');
    date.firstChild.data = showDate ? now.toLocaleDateString() : '';

    if (showMemory) {
        memory.style.display = 'block';

        chrome.system.memory.getInfo(function (info) {
            memory.value = 1.0 - info.availableCapacity / info.capacity;
        });

    } else {
        memory.style.display = 'none';
    }

    setTimeout(updateClock, 1000);
}
