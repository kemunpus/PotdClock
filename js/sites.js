/**
 * @author kemunpus
 */

'use strict';

const sites = {
    defaultPotd: 'wikimedia',

    wikimedia: {
        title: "Wikimedia Commons 'Picture of the day'",
        url: 'https://commons.wikimedia.org/wiki/Main_Page',
        apiUrl: 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=images&formatversion=2&iiprop=url&titles=Template%3APotd%2F',
        apiSuffix: '',
        firstKey: 'url',
        secondKey: '',
        baseUrl: ''
    },

    nasa: {
        title: "NASA 'Astronomy Picture of the day'",
        url: 'https://apod.nasa.gov/',
        apiUrl: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=',
        apiSuffix: '',
        firstKey: 'url',
        secondKey: '',
        baseUrl: ''
    },

    nationalgeographic: {
        title: "National Geographic 'Photo of the day'",
        url: 'https://www.nationalgeographic.com/photography/photo-of-the-day/',
        apiUrl: 'https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.',
        apiSuffix: '.json',
        firstKey: 'url',
        secondKey: 'originalUrl',
        baseUrl: ''
    },

    bing: {
        title: "Bing 'Photo of the day'",
        url: 'https://www.bing.com/',
        apiUrl: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&DUMMY=',
        apiSuffix: '',
        firstKey: 'url',
        secondKey: '',
        baseUrl: 'http://www.bing.com/'
    },

    setWallpaper: (potd) => {

        if (!potd) {
            potd = sites.defaultPotd;
        }

        const lastImageUrl = localStorage.lastImageUrl;

        if (!window.navigator.onLine) {

            if (lastImageUrl) {
                sites.setImage(potd, lastImageUrl);
            }

            return;
        }

        const potdSite = sites[potd];
        const now = new Date();
        const today = now.getUTCFullYear() + '-' + ('00' + (now.getUTCMonth() + 1)).slice(-2) + '-' + ('00' + now.getUTCDate()).slice(-2);

        const apiRequest = potdSite.apiUrl + today + potdSite.apiSuffix;

        site.text = chrome.i18n.getMessage('calling');
        site.href = apiRequest;

        let done = false;
        let imageUrl = potdSite.baseUrl;

        console.log(`calling api : ${apiRequest}`);

        const xmlhttpRequest = new XMLHttpRequest();

        xmlhttpRequest.open('GET', apiRequest, true);
        xmlhttpRequest.setRequestHeader('Pragma', 'no-cache');
        xmlhttpRequest.setRequestHeader('Cache-Control', 'no-cache');

        xmlhttpRequest.onreadystatechange = () => {

            if (xmlhttpRequest.readyState === 4) {

                if (xmlhttpRequest.status === 200) {
                    console.log(`parsing api response as json : ${xmlhttpRequest.response}`);

                    JSON.parse(xmlhttpRequest.response, (key, value) => {

                        if (!done && value) {

                            if (key === potdSite.firstKey) {
                                imageUrl += value;

                                if (!potdSite.secondKey) {
                                    done = true;
                                }

                            } else if (key === potdSite.secondKey) {
                                imageUrl += value;

                                done = true;
                            }

                            if (done) {
                                sites.setImage(potd, imageUrl);
                            }
                        }

                        return value;
                    });

                    if (!done) {
                        console.log(`no image url: ${apiRequest}`);

                        site.text = chrome.i18n.getMessage('load_error');
                    }

                } else {
                    console.log(`api call failed : ${apiRequest}`);

                    site.text = chrome.i18n.getMessage('load_error');
                }
            }
        };

        xmlhttpRequest.send();
    },

    setImage: (potd, imageUrl) => {
        wallpaper.style.opacity = 0.0;

        site.text = chrome.i18n.getMessage('loading');
        site.href = imageUrl;

        console.log(`loading image from : ${imageUrl}`);

        wallpaper.onload = () => {
            localStorage.lastPotd = potd;
            localStorage.lastImageUrl = imageUrl;

            let f = 0.0;

            const id = setInterval(() => {

                if (f >= 1.0) {
                    clearInterval(id);

                    wallpaper.style.opacity = 1.0;

                    site.text = sites[potd].title;
                    site.href = sites[potd].url;

                    return;
                }

                f += 0.1;

                wallpaper.style.opacity = f;

            }, 100);
        };

        wallpaper.onerror = () => {
            console.log(`could not load image from : ${imageUrl}`);

            site.text = chrome.i18n.getMessage('load_error');
        };

        wallpaper.src = imageUrl;
    }
};