/**
 * @author kemunpus@hotmail.com
 */
var potdHandler = {};

potdHandler['wikimedia'] = updateWallpaperByWikimedia;
potdHandler['nasa'] = updateWallpaperByNasa;
potdHandler['nationalgeographic'] = updateWallpaperByNationalGeograpic;

updateClock();

potdHandler[currentPotd]();

function updateClock() {
  var showSec = localStorage['showSec'] === "true" ? true : false;
  var showDate = localStorage['showDate'] === "true" ? true : false;
  var showMemory = localStorage['showMemory'] === "true" ? true : false;

  var now = new Date();

  time.firstChild.data = ("00" + now.getHours()).slice(-2) + ":" + ("00" + now.getMinutes()).slice(-2) + (showSec ? ":" + ("00" + now.getSeconds()).slice(-2) : "");
  date.firstChild.data = showDate ? now.toLocaleDateString() : "";

  if (showMemory) {
    memory.style.display = "block";

    chrome.system.memory.getInfo(function(info) {
      memoryMeter.value = (1.0 - (info.availableCapacity / info.capacity));
    });

  } else {
    memory.style.display = "none";
  }

  setTimeout(updateClock, 1000);
}

function updateWallpaperByWikimedia() {
  var apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=images&formatversion=2&iiprop=url&titles=Template%3APotd%2F";

  try {
    potd.text = potdTitle['wikimedia'];
    potd.href = potdUrl['wikimedia'];

    var lastApiRequest = localStorage['lastApiRequest'];
    var lastImageUrl = localStorage['lastImageUrl'];

    var now = new Date();
    var utc = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
    var today = utc.getFullYear() + "-" + ("00" + (utc.getMonth() + 1)).slice(-2) + "-" + ("00" + utc.getDate()).slice(-2);

    var apiRequest = apiUrl + today;

    if (lastApiRequest && lastApiRequest === apiRequest && lastImageUrl) {
      console.log("today is same, so using lastIimage=" + lastImageUrl);
      wallpaper.style.backgroundImage = "url(" + lastImageUrl + ")";

      return;
    }

    var xmlhttpRequest = new XMLHttpRequest();
    var done = false;

    xmlhttpRequest.open("GET", apiRequest, true);
    xmlhttpRequest.onreadystatechange = function() {

      if (this.readyState === 4 && this.status === 200) {
        console.log("parseing respnse as json=" + this.response);

        JSON.parse(this.response, function(key, value) {

          if (!done && key === "url" && value && value.endsWith(".jpg")) {
            console.log("set image from url=" + value);
            wallpaper.style.backgroundImage = "url(" + value + ")";

            localStorage['lastApiRequest'] = apiRequest;
            localStorage['lastImageUrl'] = value;

            done = true;
          }

          return value;
        });

        if (!done && lastImageUrl) {
          console.log("may be the image is not jpeg, so using lastIimage=" + lastImageUrl);

          wallpaper.style.backgroundImage = "url(" + lastImageUrl + ")";
        }
      }
    };

    xmlhttpRequest.send();

  } catch (e) {
    console.log("updateWallpaper() : exception=" + e);
  }
}

function updateWallpaperByNasa() {

}

function updateWallpaperByNationalGeograpic() {

}
