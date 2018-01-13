/**
 * @author <kemunpus@hotmail.com>
 */
'use strict';

function i18nConvert() {
    for (let element of document.getElementsByTagName('html')) {
        element.innerHTML = element.innerHTML.toString().replace(/__MSG_(\w+)__/g, function (match, value) {
            return value ? chrome.i18n.getMessage(value) : '';
        });
    }
}
