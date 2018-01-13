/**
 * @author <kemunpus@hotmail.com>
 */
var currentPotd = localStorage["currentPotd"] ? localStorage["currentPotd"] : "wikimedia";

var potdTitle = {};
var potdUrl = {};
var updateWallpaperBy = {};

potdTitle["wikimedia"] = "Wikimedia Commons 'Picture of the day'";
potdUrl["wikimedia"] = "https://commons.wikimedia.org/wiki/Main_Page";
updateWallpaperBy["wikimedia"] = function() {
  // see https://www.mediawiki.org/wiki/API:Showing_interesting_content
  updateWallpaper("wikimedia", "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=images&formatversion=2&iiprop=url&titles=Template%3APotd%2F", "", "url", null, "jpg");
};

potdTitle["nasa"] = "NASA 'Astronomy Picture of the day'";
potdUrl["nasa"] = "https://apod.nasa.gov/";
updateWallpaperBy["nasa"] = function() {
  // see https://api.nasa.gov/api.html#apod
  updateWallpaper("nasa", "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=", "", "url", null, "jpg");
};

potdTitle["nationalgeographic"] = "National Geographic 'Photo of the day'";
potdUrl["nationalgeographic"] = "https://www.nationalgeographic.com/photography/photo-of-the-day/";
updateWallpaperBy["nationalgeographic"] = function() {
  // see https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json
  updateWallpaper("nationalgeographic", "https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.", ".json", "url", "originalUrl", null);
};
