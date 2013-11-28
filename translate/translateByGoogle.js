// (c) Infocatcher 2009-2011
// version 0.1.3.3 - 2011-07-19

// getSel module:
// (c) Infocatcher 2009, 2011
// version 0.2.1 - 2011-07-19

(function() {

var tl = "ru";

function getSelWnd(trim, win, sels) {
	if(!win)  win = window;
	if(!sels) sels = [];
	try {
		var doc = win.document;
		var sel = doc.selection && doc.selection.createRange && doc.selection.createRange().text
			|| win.getSelection && win.getSelection()
			|| doc.getSelection && doc.getSelection();
		if(!sel)
			throw "Bad selection";
	}
	catch(e) { // Permission denied to get property Window.document
		return sels;
	}
	var _sel;
	try { // Multiselection
		var rngCnt = sel.rangeCount;
		if(typeof rngCnt != "number")
			throw "Bad range";
		for(var i = 0; i < rngCnt; i++) {
			_sel = sel.getRangeAt(i).toString();
			if(trim)
				_sel = _sel.replace(/^\s+|\s+$/g, "");
			_sel && sels.push(_sel);
		}
	}
	catch(e) {
		_sel = sel.toString();
		if(trim)
			_sel = _sel.replace(/^\s+|\s+$/g, "");
		_sel && sels.push(_sel);
	}
	return sels;
}
function getSel(trim, win, sels) {
	if(!win)  win = window;
	if(!sels) sels = [];
	getSelWnd(trim, win, sels);
	for(var i = 0, len = win.frames.length; i < len; i++)
		getSel(trim, win.frames[i], sels);
	return sels;
}
var sel = getSel(true).join("\n");

var loc = location.href;
if(loc == "about:blank")
	location.href = "https://translate.google.ru/" + "#auto/" + tl + "/";
else
	window.open(
		sel
			? "https://translate.google.ru/" + "#auto/" + tl + "/" + encodeURIComponent(sel)
			: "https://translate.google.ru/translate?sl=auto&tl=" + tl + "&ie=" + document.characterSet + "&u=" + encodeURIComponent(loc)
	);
})();