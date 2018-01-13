/**
 * @author <kemunpus@hotmail.com>
 */
'use strict';

const currentPotd = localStorage['currentPotd'] ? localStorage['currentPotd'] : 'wikimedia';

const potdTitle = {};
const potdUrl = {};
const updateWallpaperBy = {};

potdTitle['wikimedia'] = "Wikimedia Commons 'Picture of the day'";
potdUrl['wikimedia'] = 'https://commons.wikimedia.org/wiki/Main_Page';
updateWallpaperBy['wikimedia'] = function () {
    // see https://www.mediawiki.org/wiki/API:Showing_interesting_content
    updateWallpaper('wikimedia', 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=images&formatversion=2&iiprop=url&titles=Template%3APotd%2F', '', 'url', null, 'jpg');
};

potdTitle['nasa'] = "NASA 'Astronomy Picture of the day'";
potdUrl['nasa'] = 'https://apod.nasa.gov/';
updateWallpaperBy['nasa'] = function () {
    // see https://api.nasa.gov/api.html#apod
    updateWallpaper('nasa', 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=', '', 'url', null, 'jpg');
};

potdTitle['nationalgeographic'] = "National Geographic 'Photo of the day'";
potdUrl['nationalgeographic'] = 'https://www.nationalgeographic.com/photography/photo-of-the-day/';
updateWallpaperBy['nationalgeographic'] = function () {
    // see https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json
    updateWallpaper('nationalgeographic', 'https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.', '.json', 'url', 'originalUrl', null);
};

function updateWallpaper(potdName, apiUrl, suffix, firstKey, secondKey, ext) {
    console.log(`trying to update wallpaper from : ${potdName}`);

    potd.text = chrome.i18n.getMessage('loading');
    potd.href = '';

    const lastPotd = localStorage['lastPotd'];
    const lastApiRequest = localStorage['lastApiRequest'];
    const lastImageUrl = localStorage['lastImageUrl'];

    const now = new Date();
    const utc = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
    const today = utc.getFullYear() + '-' + ('00' + (utc.getMonth() + 1)).slice(-2) + '-' + ('00' + utc.getDate()).slice(-2);

    const apiRequest = apiUrl + today + suffix;

    if (apiRequest === lastApiRequest) {
        console.log(`api request might be same as the last one : ${lastApiRequest}`);

        setWallpaper(lastPotd, lastApiRequest, lastImageUrl);

        return;
    }

    const xmlhttpRequest = new XMLHttpRequest();
    let done = false;
    let imageUrl = '';

    xmlhttpRequest.open('GET', apiRequest, true);
    console.log(`calling api : ${apiRequest}`);

    xmlhttpRequest.onreadystatechange = function () {
        console.log(`returning api request with readyState :${this.readyState} status : ${this.status}`);

        if (this.readyState === 4) {

            if (this.status === 200) {
                console.log(`parsing api response as json : ${this.response}`);

                JSON.parse(this.response, function (key, value) {

                    if (!done && value) {

                        if (key === firstKey) {

                            if (!ext || value.endsWith(ext)) {
                                imageUrl = value;

                                if (!secondKey) {
                                    setWallpaper(potdName, apiRequest, imageUrl);
                                    done = true;
                                }
                            }

                        } else if (key === secondKey) {

                            if (!ext || value.endsWith(ext)) {
                                imageUrl = imageUrl + value;
                                setWallpaper(potdName, apiRequest, imageUrl);
                                done = true;
                            }
                        }
                    }

                    return value;
                });

            } else {
                console.log(`api call failed : ${apiRequest}`);

                potd.text = chrome.i18n.getMessage('load_error');
                potd.href = apiRequest;
            }
        }
    };

    xmlhttpRequest.send();
}

function setWallpaper(potdName, apiRequest, imageUrl) {
    wallpaper.style.opacity = 0.0;

    if (!apiRequest || apiRequest.length == 0 || !imageUrl || imageUrl.length === 0) {
        console.log(`trying to use the last data due to invalid imageUrl : ${imageUrl} and/or api request : ${apiRequest}`);

        potdName = localStorage['lastPotd'];
        apiRequest = localStorage['lastApiRequest'];
        imageUrl = localStorage['lastImageUrl'];
    }

    if (!apiRequest || apiRequest.length == 0 || !imageUrl || imageUrl.length === 0) {
        console.log(`cancel image loading due to invalid imageUrl : ${imageUrl} and/or api request : ${apiRequest}`);

        return;
    }

    console.log(`loading image from : ${imageUrl}`);

    wallpaper.onload = function () {
        console.log(`image successfully loaded from : ${imageUrl}`);

        localStorage['lastPotd'] = potdName;
        localStorage['lastApiRequest'] = apiRequest;
        localStorage['lastImageUrl'] = imageUrl;

        let f = 0.0;

        const id = setInterval(function () {

            if (f >= 1.0) {
                clearInterval(id);

                wallpaper.style.opacity = 1.0;

                potd.text = potdTitle[potdName];
                potd.href = potdUrl[potdName];

                return;
            }

            f += 0.1;

            wallpaper.style.opacity = f;

        }, 100);

    };

    wallpaper.onerror = function () {
        console.log(`could not load image from : ${imageUrl}`);

        potd.text = chrome.i18n.getMessage('load_error');
        potd.href = imageUrl;
    };

    wallpaper.src = imageUrl;
}
