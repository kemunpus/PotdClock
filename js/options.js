/**
 * @author kemunpus
 */
'use strict';

(() => {
    function setup() {
        const selectedSite = localStorage.site ? localStorage.site : defaultSite;

        siteList.innerHTML = '';

        for (let i in sites) {
            const s = document.createElement('option');

            if (i === selectedSite) {
                s.setAttribute('selected', 'selected');
                site.setAttribute('href', sites[i].url);
            }

            s.setAttribute('value', i);
            s.innerHTML = sites[i].title;

            siteList.appendChild(s);
        }

        showSec.checked = Boolean(localStorage.showSec);
        showDate.checked = Boolean(localStorage.showDate);
        showMemory.checked = Boolean(localStorage.showMemory);
    };

    for (let element of document.getElementsByTagName('html')) {
        element.innerHTML = element.innerHTML.toString().replace(/__MSG_(\w+)__/g, (match, value) => {
            return value ? chrome.i18n.getMessage(value) : '';
        });
    }

    siteList.onchange = () => {
        site.setAttribute('href', sites[siteList.value].url);
    };

    save.onclick = () => {
        localStorage.site = siteList.value;
        localStorage.showSec = showSec.checked ? '1' : '';
        localStorage.showDate = showDate.checked ? '1' : '';
        localStorage.showMemory = showMemory.checked ? '1' : '';
        localStorage.lastUrl = '';

        setup();
    };

    reset.onclick = () => {
        localStorage.site = '';
        localStorage.showSec = '';
        localStorage.showDate = '';
        localStorage.showMemory = '';
        localStorage.lastUrl = '';

        setup();
    };

    setup();
})();