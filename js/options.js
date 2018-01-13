/**
 * @author <kemunpus@hotmail.com>
 */
'use strict';

i18nConvert();

showSec.checked = localStorage['showSec'] === 'true' ? true : false;
showDate.checked = localStorage['showDate'] === 'true' ? true : false;
showMemory.checked = localStorage['showMemory'] === 'true' ? true : false;

potds.onchange = doSelect;
save.onclick = doSave;
reset.onclick = doReset;
cancel.onclick = doCancel;

for (let potd in potdTitle) {
    const option = document.createElement('option');

    if (currentPotd === potd) {
        option.setAttribute('selected', 'selected');
    }

    option.setAttribute('value', potd);
    option.innerHTML = potdTitle[potd];

    potds.appendChild(option);

    updateWallpaperBy[currentPotd]();
}

function doSelect() {
    updateWallpaperBy[potds.value]();
}

function doSave() {
    localStorage['currentPotd'] = potds.value;
    localStorage['showSec'] = showSec.checked ? 'true' : 'false';
    localStorage['showDate'] = showDate.checked ? 'true' : 'false';
    localStorage['showMemory'] = showMemory.checked ? 'true' : 'false';
    localStorage['lastPotd'] = '';
    localStorage['lastApiRequest'] = '';
    localStorage['lastImageUrl'] = '';

    closeOptions();
}

function doReset() {
    localStorage['currentPotd'] = '';
    localStorage['showSec'] = 'false';
    localStorage['showDate'] = 'false';
    localStorage['showMemory'] = 'false';
    localStorage['lastPotd'] = '';
    localStorage['lastApiRequest'] = '';
    localStorage['lastImageUrl'] = '';

    closeOptions();
}

function doCancel() {
    closeOptions();
}

function closeOptions() {

    chrome.tabs.create({
        'url': 'chrome://newtab',
        'selected': true
    }, null);

    window.close();
}
