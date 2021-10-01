/**
 * @author kemunpus
 */

'use strict';

const sites = {
    defaultPotd: 'wikimedia',

    wikimedia: {
        title: "Wikimedia Commons 'Picture of the day'",
        url: 'https://commons.wikimedia.org/wiki/Main_Page',
        apiUrl: 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=images&formatversion=2&iiprop=url&titles=Template%3APotd%2FTODAY',
        dayoffset: 0,
        getImageUrl: (json) => {
            return json.query.pages[0].imageinfo[0].url;
        }
    },

    bing: {
        title: "Bing 'Photo of the day'",
        url: 'https://www.bing.com/',
        apiUrl: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&DUMMY=TODAY',
        dayoffset: 0,
        getImageUrl: (json) => {
            return 'http://www.bing.com/' + json.images[0].url;
        }
    },

    nasa: {
        title: "NASA 'Astronomy Picture of the day'",
        url: 'https://apod.nasa.gov/',
        apiUrl: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=TODAY',
        dayoffset: -1,
        getImageUrl: (json) => {
            return json.url;
        }
    }
};