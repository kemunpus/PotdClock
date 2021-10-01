/**
 * @author kemunpus
 */

'use strict';

(() => {

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

        if (message.online) {
            console.log(`calling api : ${message.url}`);

            fetch(message.url)
                .then(response => response.json())
                .then(json => sendResponse({ json: json }))
                .catch(error => sendResponse({ json: "{}" }));

        } else {
            sendResponse({ json: "{}" });
        }

        return true;
    });

})();