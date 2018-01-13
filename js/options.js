/**
 * @author <kemunpus@hotmail.com>
 */
"use strict";

setWallpaper(localStorage['lastApiRequest'], localStorage['lastImageUrl'], 0.5);

i18nConvert();

showSec.checked = localStorage["showSec"] === "true" ? true : false;
showDate.checked = localStorage["showDate"] === "true" ? true : false;
showMemory.checked = localStorage["showMemory"] === "true" ? true : false;

save.onclick = doSave;
reset.onclick = doReset;
cancel.onclick = doCancel;

for (var p in potdTitle) {
  var option = document.createElement("option");

  if (currentPotd === p) {
    option.setAttribute("selected", "selected");
  }

  option.setAttribute("value", p);
  option.innerHTML = potdTitle[p];
  potd.appendChild(option);
}

function doSave() {
  localStorage["currentPotd"] = potd.value;
  localStorage["showSec"] = showSec.checked ? "true" : "false";
  localStorage["showDate"] = showDate.checked ? "true" : "false";
  localStorage["showMemory"] = showMemory.checked ? "true" : "false";
  localStorage["lastApiRequest"] = "";
  localStorage["lastImageUrl"] = "";

  closeOptions();
}

function doReset() {
  localStorage["currentPotd"] = "";
  localStorage["showSec"] = "false";
  localStorage["showDate"] = "false";
  localStorage["showMemory"] = "false";
  localStorage["lastApiRequest"] = "";
  localStorage["lastImageUrl"] = "";

  closeOptions();
}

function doCancel() {
  closeOptions();
}

function closeOptions() {

  chrome.tabs.create({
    "url": "chrome://newtab",
    "selected": true
  }, null);

  //open("", "_self").close();
  window.close();
}
