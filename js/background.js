/**
 * @author kemunpus
 */
'use strict';

(() => {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {

        if (message.online && message.url) {
            fetch(message.url)
                .then(response => response.json())
                .then(json => sendResponse({ json: json }))
                .catch(_error => sendResponse({ json: "{}" }));

        } else {
            sendResponse({ json: "{}" });
        }

        return true;
    });
})();