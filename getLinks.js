﻿// (c) Infocatcher 2008, 2014, 2019
// version 0.0.5 - 2019-08-07
(function() {

var blockId = "__getLinksBlock";
var containerClass = "__getLinksContainer";

if(removeLinksList())
	return;

function _localize(s) {
	var _s = {
		"Close":                    { ru: "Закрыть" },
		"Select all":               { ru: "Выделить всё" },
		"Filter: ":                 { ru: "Фильтр: " },
		"regular expression: \\d+": { ru: "регулярное выражение: \\d+" },
		"Links not found!":         { ru: "Ссылки не найдены!" },
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

var isNoScript = window.getComputedStyle(document.createElement("noscript"), null).display != "none";
// Based on code from https://github.com/Infocatcher/Bookmarklets/blob/master/showAnchors.js
var setTimeout = "bind" in window.setTimeout
	? window.setTimeout.bind(window) // For Greasemonkey 4.7 (Firefox 64)
	: window.setTimeout;
if(isNoScript) {
	if("postMessage" in window) {
		setTimeout = function fakeTimeout(callback) {
			var key = "getLinks#fakeTimeout#" + Math.random().toFixed(16).substr(2);
			window.addEventListener("message", function onMessage(e) {
				if(e.data !== key)
					return;
				var origin = e.origin;
				if(!origin || location.href.substr(0, origin.length) !== origin)
					return;
				window.removeEventListener("message", onMessage, false);
				callback();
			}, false);
			window.postMessage(key, location.href);
		}
	}
	else {
		setTimeout = function fakeTimeoutLegacy(callback) {
			var et = "getLinks#fakeTimeout#" + Math.random().toFixed(16).substr(2);
			window.addEventListener(et, function onEvent(e) {
				window.removeEventListener(et, onEvent, false);
				callback();
			}, false);
			var evt = document.createEvent("Event");
			evt.initEvent(et, true, false);
			window.dispatchEvent(evt);
		}
	}
}

var allLinks = {};
var hasLinks = false;

function err(str) {
	if(window.console && console.error)
		console.error(str);
	else
		setTimeout(function() { throw new Error(str); }, 0);
}

function getLinks(doc, rng) {
	if(rng) {
		var div = doc.createElement("div");
		div.appendChild(rng.cloneContents());
		doc = div;
	}
	var links = doc.getElementsByTagName("a");
	for(var i = 0, l = links.length; i < l; ++i) {
		var a = links[i];
		var h = a.href;
		if(h) {
			allLinks[h] = a.textContent;
			hasLinks = true;
		}
	}
}

function parseNodes(win) {
	try {
		var sel = null;
		var sel = win.getSelection();
		var rngCnt = sel.rangeCount;
		if(!rngCnt) {
			getLinks(win.document, null);
			return;
		}
		for(var i = 0; i < rngCnt; ++i)
			getLinks(win.document, sel.getRangeAt(i));
	}
	catch(e) {
		err("parseNodes error for " + win.location + ":\n" + e);
	}
}

function parseWin(win) {
	parseNodes(win);
	var fs = win.frames;
	for(var i = 0, l = fs.length; i < l; ++i)
		parseWin(fs[i]);
}
parseWin(window);

function deselect(win) {
	try {
		win.getSelection().removeAllRanges();
	}
	catch(e) {
		err("deselect error for " + win.location + ":\n" + e);
	}
	var fs = win.frames;
	for(var i = 0, l = fs.length; i < l; ++i)
		deselect(fs[i]);
}

if(!hasLinks) {
	deselect(window);
	parseWin(window);
}

if(!hasLinks) {
	alert(_localize("Links not found!"));
	return;
}

var body = document.body || document.documentElement;

var container = document.createElement("div");
container.id = blockId;
var cBorder = 20;
var btnHeight = 22;
container.setAttribute(
	"style",
	"position: fixed !important; "
	+ "z-index: 2147483647 !important; "
	+ "text-align: left !important; "
	+ "top: " + cBorder + "px !important; "
	+ "left: " + cBorder + "px !important; "
	+ "right: " + cBorder + "px !important; "
	+ "overflow: auto !important; "
	+ "max-height: " + (window.innerHeight - cBorder*2) + "px !important; "
	+ "max-height: calc(100% - " + (cBorder*2) + "px) !important; "
	+ "color: black !important; "
	+ "background: #f8f8f8 !important; "
	+ "border: 1px solid #00a !important; "
	+ "opacity: 0.9 !important; "
	+ "display: block !important; "
	+ "outline: none !important; "
);

var stl  = document.createElement("style");
stl.type = "text/css";
var linkStl = "color: #00b !important;\n"
	+ "border: none !important;\n"
	+ "outline: none !important;\n"
	+ "margin: 0 !important;\n"
	+ "padding: 0 !important;\n"
	+ "background: none !important;\n"
	+ "opacity: 1.0 !important;\n"
	+ "position: static !important;\n"
	+ "font: 13px \"Courier New\",monospace !important;\n";
stl.appendChild(document.createTextNode(
	"#" + blockId + " *:not(style) {\n"
		+ "all: unset;\n"
		+ "font: 13px Verdana,sans-serif !important;\n"
		+ "}\n"
	+ "#" + blockId + " ." + containerClass + " > a {\n"
		+ linkStl
		+ "text-decoration: none !important;\n"
		+ "cursor: pointer !important;\n"
		+ "}\n"
	+ "#" + blockId + " ." + containerClass + " > a:hover {\n"
		+ linkStl
		+ "text-decoration: underline !important;\n"
		+ "}\n"
	+ "object { visibility: hidden !important; }" // bugfix
));
container.appendChild(stl);

var header = document.createElement("div");
header.setAttribute(
	"style",
	"display: block !important; "
	+ "position: fixed !important; "
	+ "top: " + cBorder + "px !important; "
	+ "left: " + cBorder + "px !important; "
	+ "padding: 4px !important;"
	+ "background: #f8f8f8 !important; "
	+ "border: 1px solid #00a !important; "
);
container.appendChild(header);

var linksContainer = document.createElement("div");
linksContainer.setAttribute(
	"style",
	"display: block !important; "
	+ "margin: " + (btnHeight + 14) + "px 0 0 !important; "
);
container.appendChild(linksContainer);

function appendButton(fnc, lbl) {
	var btt = document.createElement("button");
	btt.onclick = fnc;
	btt.setAttribute(
		"style",
		"margin: 0 4px 0 0 !important; "
		+ "padding: 1px 6px !important; "
		+ "height: " + btnHeight + "px !important; "
		+ "max-height: " + btnHeight + "px !important; "
		+ "min-height: 0 !important; "
		+ "font-size: 13px !important; "
		+ "background: #ddf !important; "
		+ "border: 1px solid #00a !important; "
		+ "-moz-user-select: none !important; "
		+ "user-select: none !important; "
	);
	btt.appendChild(document.createTextNode(lbl));
	header.appendChild(btt);
}

function removeLinksList() {
	var container = document.getElementById(blockId);
	container && container.parentNode.removeChild(container);
	return container;
}

appendButton(
	removeLinksList,
	_localize("Close")
);

function selectAll() {
	deselect(window);
	var rng = document.createRange();
	rng.selectNode(linksContainer);
	window.getSelection().addRange(rng);
}

appendButton(
	selectAll,
	_localize("Select all")
);

var linkContainer = document.createElement("div");
linkContainer.setAttribute(
	"style",
	"display: block !important; "
	+ "padding: 0 4px !important; "
);
linkContainer.className = containerClass;

function appendLinks(regExp) {
	var df = document.createDocumentFragment();
	var hasRegExp = !!regExp;
	var num = 0;
	for(var h in allLinks) if(allLinks.hasOwnProperty(h)) {
		if(hasRegExp && !regExp.test(h))
			continue;
		var a = document.createElement("a");
		var cnt = linkContainer.cloneNode(false);
		if(++num % 2)
			cnt.style.backgroundColor = "#e9e9e9";
		a.href = h;
		a.appendChild(document.createTextNode(h));
		a.title = allLinks[h];
		cnt.appendChild(a);
		df.appendChild(cnt);
	}
	linksContainer.textContent = "";
	linksContainer.appendChild(df);
}

var fltStr = document.createElement("input");
fltStr.type = "search";
fltStr.placeholder = _localize("regular expression: \\d+");
fltStr.setAttribute(
	"style",
	"width: 16em !important; "
	+ "background: white !important; "
	+ "border: 1px solid #00a !important; "
	+ "padding: 1px 4px !important; "
	+ "height: " + btnHeight + "px !important; "
	+ "max-height: " + btnHeight + "px !important; "
	+ "min-height: 0 !important; "
);
fltStr.__regExpError = false;
function filter(str) {
	if(str) try {
		var regExp = new RegExp(str);
	}
	catch(e) {
		if(!fltStr.__regExpError) {
			fltStr.__regExpError = true;
			fltStr.style.setProperty("background", "#fee", "important");
		}
		return;
	}
	if(fltStr.__regExpError) {
		fltStr.__regExpError = false;
		fltStr.style.setProperty("background", "white", "important");
	}
	appendLinks(str && regExp); // Firefox will copy hidden links =/
	_lastSearch = new Date().getTime();
}
var _timeout = 0;
var _lastSearch = 0;
fltStr.onkeydown = function(e) {
	var _this = this;
	clearTimeout(_timeout);
	if(e.keyCode == 27) // KeyEvent.DOM_VK_ESCAPE
		_timeout = setTimeout(function() { _this.value = ""; filter(""); }, 0);
	else {
		var delay = Math.max(0, 150 + _lastSearch - new Date().getTime());
		_timeout = setTimeout(function() { filter(_this.value); }, delay);
	}
};
header.appendChild(document.createTextNode(_localize("Filter: ")));
header.appendChild(fltStr);

appendLinks();

body.appendChild(container);
selectAll();
})();