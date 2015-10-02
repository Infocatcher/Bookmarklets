// (c) Infocatcher 2009, 2011-2012, 2014-2015
// version 0.2.3.2 - 2015-10-02

(function() {

function _localize(s) {
	var _s = {
		"www.google.com":                  { ru: "www.google.ru" },
		"Google: search on the site “%S”": { ru: "Google: поиск по сайту «%S»" }
	};
	var lng = "en";
	if(navigator.language && /^\w+/.test(navigator.language))
		lng = RegExp.lastMatch;
	else if(/\s[а-я]{3,}\s/i.test(new Date().toLocaleString()))
		lng = "ru";
	_localize = function(s) {
		return _s[s] && _s[s][lng] || s;
	};
	return _localize(s);
}

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

var loc = location.href;
var host = "";
try { host = location.hostname; }
catch(e) {}
var domain = _localize("www.google.com");
if(/^(about|chrome|resource):/.test(loc))
	location.href = "https://" + domain + "/advanced_search";
else if(!host || /^(www\d*\.)?google\.[a-z]{2,10}$/.test(host) || /^(about|chrome|resource):/.test(loc))
	window.open("https://" + domain + "/advanced_search");
else {
	var sel = getSel(true).join(" ");
	var q = prompt(
		_localize("Google: search on the site “%S”").replace("%S", host),
		sel + " site:" + host
	) || "";
	q = q.replace(/^\s+|\s+$/, "");
	if(!q)
		return;
	if(!/ +site: *\S+$/.test(q))
		q += " site:" + host;
	q && window.open("https://" + domain + "/search?q=" + encodeURIComponent(q));
}
})();