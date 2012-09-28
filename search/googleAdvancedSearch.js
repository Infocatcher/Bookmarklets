// (c) Infocatcher 2009, 2011
// version 0.2.2.1 - 2011-07-19

// getSel module:
// (c) Infocatcher 2009, 2011
// version 0.2.1 - 2011-07-19

(function() {

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

var loc = location.href;
var host = "";
try { host = location.hostname; }
catch(e) {}
if(loc == "about:blank" || loc == "about:newtab")
	location.href = "http://www.google.ru/advanced_search";
else if(!host || /^(www\d*\.)?google\.[a-z]{2,10}$/.test(host) || /^(about|chrome|resource):/.test(loc))
	window.open("http://www.google.ru/advanced_search");
else {
	var sel = getSel(true).join(" ");
	var q = prompt("Google: поиск по сайту \"" + host + "\"", sel) || "";
	q = q.replace(/^\s+|\s+$/, "");
	if(q)
		window.open("http://www.google.ru/search?as_q=" + encodeURIComponent(q)
			+ "&as_sitesearch=" + encodeURIComponent(host));
}
})();