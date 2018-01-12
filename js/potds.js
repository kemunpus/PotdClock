/**
 * @author kemunpus@hotmail.com
 */
var potdTitle = {};
var potdUrl = {};

potdTitle['wikimedia'] = "Wikimedia Commons 'Photo of the day'";
potdUrl['wikimedia'] = "https://commons.wikimedia.org/wiki/Main_Page";

potdTitle['nasa'] = "NASA 'Photo of the day'";
potdUrl['nasa'] = "https://example.org";

potdTitle['nationalgeographic'] = "National Geographic 'Photo of the day'";
potdUrl['nationalgeographic'] = "https://example.org";

var currentPotd = localStorage['currentPotd'] ? localStorage['currentPotd'] : "wikimedia";
