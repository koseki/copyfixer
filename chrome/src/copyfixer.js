window.addEventListener('keydown', copyfixer, true);

function copyfixer(event) {
    if (event.keyCode != 67) return;
    var isWin = (navigator.platform.indexOf("Win") != -1);
    var isMac = (navigator.platform.indexOf("Mac") != -1);
    if ((! isMac && ! event.ctrlKey) || (isMac && ! event.metaKey)) return;
    if (isSelected()) return;
    var crlf  = isWin ? "\r\n" : "\n";
    var txt   = document.title + crlf + document.location.href + crlf + crlf;
    chrome.extension.sendRequest({command: "copyfixerCopy", data: txt });
}

function isSelected() {
    var sel = window.getSelection();
    if (sel.rangeCount <= 0) return false;
    if (sel.rangeCount > 1)  return true;

    var range = sel.getRangeAt(0);
    if (! range.collapsed) return true;
    if (range.startContainer != range.endContainer) return true;
    if (range.startOffset    != range.endOffset)    return true;
    if (document.activeElement.tagName.toLowerCase() != "body") return true;

    return false;
}
