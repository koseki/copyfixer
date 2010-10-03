let browser = require("tab-browser");
let clipboard = require("clipboard");

function copyfixer(event, window) {
    if (event.keyCode != 67) return;
    var isWin = (window.navigator.platform.indexOf("Win") != -1);
    var isMac = (window.navigator.platform.indexOf("Mac") != -1);
    if ((! isMac && ! event.ctrlKey) || (isMac && ! event.metaKey)) return;
    if (isSelected(window)) return;
    var crlf  = isWin ? "\r\n" : "\n";
    var txt   = window.document.title + crlf + window.document.location.href + crlf + crlf;
    clipboard.set(txt);
}

function isSelected(window) {
    var sel = window.getSelection();
    if (sel.rangeCount <= 0) return false;
    if (sel.rangeCount > 1)  return true;

    var range = sel.getRangeAt(0);
    if (! range.collapsed) return true;
    if (range.startContainer != range.endContainer) return true;
    if (range.startOffset    != range.endOffset)    return true;
    if (window.document.activeElement.tagName.toLowerCase() != "body") return true;

    return false;
}

exports.main = function(options, callbacks) {
    browser.whenContentLoaded(function(window){
        var f = function(event){ copyfixer(event, window); };
        window.document.addEventListener("keydown", f, true);
    });
};



