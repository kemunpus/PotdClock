/**
 * @author kemunpus
 */

'use strict';

(() => {

    for (let element of document.getElementsByTagName('html')) {
        element.innerHTML = element.innerHTML.toString().replace(/__MSG_(\w+)__/g, (match, value) => {
            return value ? chrome.i18n.getMessage(value) : '';
        });
    }

    showSec.checked = Boolean(localStorage.showSec);
    showDate.checked = Boolean(localStorage.showDate);
    showMemory.checked = Boolean(localStorage.showMemory);

    for (let potd in sites) {

        if (sites[potd].title) {
            const option = document.createElement('option');

            if (potd === localStorage.currentPotd) {
                option.setAttribute('selected', 'selected');
            }

            option.setAttribute('value', potd);
            option.innerHTML = sites[potd].title;

            potdList.appendChild(option);
        }
    }

    const finish = () => {
        window.close();

        chrome.tabs.create({
            url: 'chrome://newtab',
            selected: true
        }, null);
    };

    save.onclick = () => {
        localStorage.currentPotd = potdList.value;
        localStorage.showSec = showSec.checked ? '1' : '';
        localStorage.showDate = showDate.checked ? '1' : '';
        localStorage.showMemory = showMemory.checked ? '1' : '';
        localStorage.lastPotd = '';
        localStorage.lastApiRequest = '';
        localStorage.lastImageUrl = '';

        finish();
    };

    reset.onclick = () => {
        localStorage.currentPotd = '';
        localStorage.showSec = '';
        localStorage.showDate = '';
        localStorage.showMemory = '';
        localStorage.lastPotd = '';
        localStorage.lastApiRequest = '';
        localStorage.lastImageUrl = '';

        finish();
    };

})();
