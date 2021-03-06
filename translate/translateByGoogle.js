// (c) Infocatcher 2009-2011, 2013-2015
// version 0.1.3.6 - 2015-10-02

(function() {

var tl = "ru";

// getSel module
// (c) Infocatcher 2009, 2011, 2013-2014
// version 0.3.0 - 2014-02-23
function getSel(trim, includeFrames, win) {
	getSel = function(trim, win) {
		var sels = [];
		if(includeFrames == false)
			getWinSel(win || window, sels, trim);
		else
			parseWin(win || window, sels, trim);
		return sels;
	};
	return getSel(trim, win);
	function parseWin(win, out, trim) {
		var sel = getWinSel(win, out, trim);
		sel && out.push(sel);
		for(var i = 0, l = win.frames.length; i < l; ++i)
			parseWin(win.frames[i], out, trim);
	}
	function getWinSel(win, out, trim) {
		try {
			var doc = win.document;
			var sel = doc.selection && doc.selection.createRange && doc.selection.createRange().text
				|| win.getSelection && win.getSelection()
				|| doc.getSelection && doc.getSelection();
			if(!sel)
				throw "Bad selection";
			var selText = sel.toString();
			if(trim)
				selText = selText.replace(/^\s+|\s+$/g, "");
		}
		catch(e) { // Permission denied to get property Window.document
			return;
		}
		if(sel) try { // Multiselection
			var rngCnt = sel.rangeCount;
			if(typeof rngCnt != "number" || rngCnt <= 0)
				throw "Bad range";
			var sels = [];
			for(var i = 0; i < rngCnt; ++i) {
				var rngSel = sel.getRangeAt(i).toString();
				if(trim)
					rngSel = rngSel.replace(/^\s+|\s+$/g, "");
				if(rngSel)
					sels.push(rngSel);
			}
			// Strange things may happens in Firefox
			if(!/[\n\r]/.test(selText) || /[\n\r]/.test(sels.join(""))) {
				out.push.apply(out, sels);
				return;
			}
		}
		catch(e) {
		}
		out.push(selText);
	}
}
var sel = getSel(true).join("\n");

var loc = location.href;
if(/^(about|chrome|resource):/.test(loc)) {
	location.href = "https://translate.google.ru/" + "#auto/" + tl + "/";
	window.focus();
}
else
	window.open(
		sel
			? "https://translate.google.ru/" + "#auto/" + tl + "/" + encodeURIComponent(sel)
			: "https://translate.google.ru/translate?sl=auto&tl=" + tl + "&ie=" + document.characterSet + "&u=" + encodeURIComponent(loc)
	);
})();