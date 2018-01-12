/**
 * @author <kemunpus@hotmail.com>
 */

updateClock();

updateWallpaperBy[currentPotd]();

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

function updateWallpaper(potdName, apiUrl, suffix, firstKey, secondKey, ext) {
  console.log("trying to update wallpaper from " + potdName);

  potd.text = potdTitle[potdName];
  potd.href = potdUrl[potdName];

  var lastApiRequest = localStorage['lastApiRequest'];
  var lastImageUrl = localStorage['lastImageUrl'];

  var now = new Date();
  var utc = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
  var today = utc.getFullYear() + "-" + ("00" + (utc.getMonth() + 1)).slice(-2) + "-" + ("00" + utc.getDate()).slice(-2);

  var apiRequest = apiUrl + today + suffix;

  if (lastApiRequest && lastApiRequest === apiRequest && lastImageUrl) {
    console.log("generated api request might be same as the last one, so using lastIimage : " + lastImageUrl);
    wallpaper.style.backgroundImage = "url(" + lastImageUrl + ")";

    return;
  }

  try {
    var xmlhttpRequest = new XMLHttpRequest();
    var done = false;
    var imageUrl = "";

    xmlhttpRequest.open("GET", apiRequest, true);
    console.log("calling api : " + apiRequest);

    xmlhttpRequest.onreadystatechange = function() {

      if (this.readyState === 4 && this.status === 200) {
        console.log("parseing api respnse as json : " + this.response);

        JSON.parse(this.response, function(key, value) {

          if (!done && value) {

            if (key === firstKey) {

              if (!ext || value.endsWith(ext)) {
                imageUrl = value;

                if (!secondKey) {
                  done = true;
                }
              }

            } else if (key === secondKey) {

              if (!ext || value.endsWith(ext)) {
                imageUrl = imageUrl + value;
                done = true;
              }
            }
          }

          return value;
        });

        if (done && imageUrl.length > 0) {
          console.log("set background image from url : " + imageUrl);
          wallpaper.style.backgroundImage = "url(" + imageUrl + ")";

          localStorage['lastApiRequest'] = apiRequest;
          localStorage['lastImageUrl'] = imageUrl;

        } else if (lastImageUrl) {
          console.log("can not find the correct key, or may be the image does not have a valid ext. so using lastIimage : " + lastImageUrl);
          wallpaper.style.backgroundImage = "url(" + lastImageUrl + ")";
        }
      }
    };

    xmlhttpRequest.send();

  } catch (e) {
    console.log("exception : " + e);

    if (lastImageUrl) {
      wallpaper.style.backgroundImage = "url(" + lastImageUrl + ")";
    }
  }
}
