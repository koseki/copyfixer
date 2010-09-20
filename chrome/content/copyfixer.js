function copyfixer() {
    if (isSelected()) {
	var controller = document.commandDispatcher.getControllerForCommand("cmd_copy");
	if (controller.isCommandEnabled("cmd_copy")) controller.doCommand("cmd_copy");
	return;
    }

    var w = window._content;
    var d = w.document;
    var txt = d.title + '\n' + d.location.href + '\n\n';
    const CLIPBOARD = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    CLIPBOARD.copyString(txt);
}


function isSelected() {
    var focusedWindow = document.commandDispatcher.focusedWindow;
    var sel = focusedWindow.getSelection();
    if (sel.rangeCount == 0) return false;
    if (sel.rangeCount > 1)  return true;

    var range = sel.getRangeAt(0);
    if (range.startContainer != range.endContainer) return true;
    if (range.startOffset    != range.endOffset)    return true;
    return false;
}
