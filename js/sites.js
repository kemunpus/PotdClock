/**
 * @author kemunpus
 */
'use strict';

const defaultSite = 'wikimedia';

const sites = {
    wikimedia: {
        title: "Wikimedia Commons 'Picture of the day'",
        url: 'https://commons.wikimedia.org/wiki/Main_Page',
        apiUrl: 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=images&formatversion=2&iiprop=url&titles=Template%3APotd%2FTODAY',
        dayOffset: 0,
        imageUrl: (json) => {
            return json.query.pages[0].imageinfo[0].url;
        }
    },
    bing: {
        title: "Bing 'Image of the Day'",
        url: 'https://www.bing.com/',
        apiUrl: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&DUMMY=TODAY',
        dayOffset: 0,
        imageUrl: (json) => {
            return 'https://www.bing.com/' + json.images[0].url;
        }
    },
    nasa: {
        title: "NASA 'Astronomy Picture of the Day'",
        url: 'https://apod.nasa.gov/',
        apiUrl: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=TODAY',
        dayOffset: -1,
        imageUrl: (json) => {
            return json.url;
        }
    }
};