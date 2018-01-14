/**
 * @author <kemunpus@hotmail.com>
 */
'use strict';

i18nConvert();

showSec.checked = localStorage.showSec === 'true' ? true : false;
showDate.checked = localStorage.showDate === 'true' ? true : false;
showMemory.checked = localStorage.showMemory === 'true' ? true : false;

for (let potd in potdTitle) {
    const option = document.createElement('option');

    if (currentPotd === potd) {
        option.setAttribute('selected', 'selected');
    }

    option.setAttribute('value', potd);
    option.innerHTML = potdTitle[potd];

    potdList.appendChild(option);
}

potdList.onchange = function () {
    updateWallpaperBy[potdList.value]();
};

save.onclick = function () {
    localStorage.currentPotd = potdList.value;
    localStorage.showSec = showSec.checked ? 'true' : 'false';
    localStorage.showDate = showDate.checked ? 'true' : 'false';
    localStorage.showMemory = showMemory.checked ? 'true' : 'false';
    localStorage.lastPotd = '';
    localStorage.lastApiRequest = '';
    localStorage.lastImageUrl = '';

    closeOptions();
};

reset.onclick = function () {
    localStorage.currentPotd = '';
    localStorage.showSec = 'false';
    localStorage.showDate = 'false';
    localStorage.showMemory = 'false';
    localStorage.lastPotd = '';
    localStorage.lastApiRequest = '';
    localStorage.lastImageUrl = '';

    closeOptions();
};

cancel.onclick = function () {
    closeOptions();
};

updateWallpaperBy[currentPotd]();

function closeOptions() {

    chrome.tabs.create({
        url: 'chrome://newtab',
        selected: true
    }, null);

    window.close();
}
