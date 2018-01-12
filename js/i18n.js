/**
 * @author <kemunpus@hotmail.com>
 */
function i18nConvert() {
  var html = document.getElementsByTagName('html');

  for (var i = 0; i < html.length; i++) {
    html[i].innerHTML = html[i].innerHTML.toString().replace(/__MSG_(\w+)__/g, function(match, value) {
      return value ? chrome.i18n.getMessage(value) : "";
    });
  }
}
