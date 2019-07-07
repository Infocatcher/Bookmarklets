// (c) Infocatcher 2008, 2014
// version 0.0.4.2 - 2014-02-23
(function() {

var blockId = "__getLinksBlock";
var containerClass = "__getLinksContainer";

if(removeLinksList())
	return;

function _localize(s) {
	var _s = {
		"Close":             { ru: "Закрыть" },
		"Select all":        { ru: "Выделить всё" },
		"Filter (RegExp): ": { ru: "Фильтр (RegExp): " },
		"Links not found!":  { ru: "Ссылки не найдены!" },
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
var setTimeout = window.setTimeout.bind(window); // Used .bind() for Greasemonkey 4.7 (Firefox 64)
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
		setTimeout = function(callback) {
			callback();
		};
	}
}

var allLinks = {};
var linksCnt = 0;

function err(str) {
	setTimeout(function() { throw new Error(str); }, 0);
}

function getLinks(doc, rng) {
	if(rng) {
		var div = doc.createElement("div");
		div.appendChild(rng.cloneContents());
		doc = div;
	}
	var links = doc.getElementsByTagName("a"), a, h;
	for(var i = 0, len = links.length; i < len; ++i) {
		a = links[i];
		h = a.href;
		if(h) {
			allLinks[h] = a.textContent;
			++linksCnt;
		}
	}
}

function parseNodes(win) {
	try {
		var sel = null;
		var sel = win.getSelection();
		var rngCnt = sel.rangeCount;
		if(rngCnt == 0) {
			getLinks(win.document, null);
			return;
		}
		for(var i = 0; i < rngCnt; ++i)
			getLinks(win.document, sel.getRangeAt(i));
	}
	catch(e) {
		err("parseNodes error:\n" + e);
	}
}

function parseWin(win) {
	parseNodes(win);
	for(var i = 0, len = win.frames.length; i < len; ++i)
		parseWin(win.frames[i]);
}
parseWin(window);

function deselect(win) {
	try {
		win.getSelection().removeAllRanges();
	}
	catch(e) {
		err("deselect error:\n" + e);
	}
	for(var i = 0, len = win.frames.length; i < len; ++i)
		deselect(win.frames[i]);
}

if(linksCnt == 0) {
	deselect(window);
	parseWin(window);
}

if(linksCnt == 0) {
	alert(_localize("Links not found!"));
	return;
}

var body = document.body || document.documentElement;

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
	"#" + blockId + " *:not(style) { all: unset; }\n"
	+ "div." + containerClass + " > a {\n"
		+ linkStl
		+ "text-decoration: none !important;\n"
		+ "cursor: pointer !important;\n"
		+ "}\n"
	+ "div." + containerClass + " > a:hover {\n"
		+ linkStl
		+ "text-decoration: underline !important;\n"
		+ "}\n"
	+ "object { visibility: hidden !important; }" // bugfix
));

var container = document.createElement("div");
container.id = blockId;
container.appendChild(stl);
var cBorder = 20;
var mHeight = window.innerHeight - cBorder*2;
var bHeight = 28;
container.setAttribute(
	"style",
	"position: fixed !important; "
	+ "color: black !important; "
	+ "background-color: white !important; "
	+ "z-index: 65535 !important; "
	+ "text-align: left !important; "
	+ "top: " + cBorder + "px !important; "
	+ "left: " + cBorder + "px !important; "
	+ "right: " + cBorder + "px !important; "
	+ "max-height: " + mHeight + "px !important; "
	+ "background-color: #f8f8f8 !important; "
	+ "border: 1px solid #00a !important; "
	+ "padding: 4px !important; "
	+ "opacity: 0.9 !important; "
	+ "display: block !important; "
	+ "margin: 0 !important; "
	+ "outline: none !important; "
);

var _cnt = document.createElement("div");
_cnt.setAttribute(
	"style",
	"overflow: auto !important; "
	+ "max-height: " + (mHeight - bHeight) + "px !important; "
	+ "display: block !important; "
	+ "margin: 0 !important; "
	+ "padding: 0 !important; "
	+ "border: none !important; "
	+ "outline: none !important; "
	+ "opacity: 1.0 !important; "
);
container.appendChild(_cnt);

var linksContainer = document.createElement("div");
linksContainer.setAttribute(
	"style",
	"display: block !important; "
);
_cnt.appendChild(linksContainer);

function appendButton(fnc, lbl) {
	var btt = document.createElement("button");
	btt.onclick = fnc;
	btt.setAttribute(
		"style",
		"margin: 0 4px 4px 0 !important; "
		+ "padding: 1px 6px !important; "
		+ "height: " + (bHeight - 8) + "px !important; "
		+ "max-height: " + (bHeight - 8) + "px !important; "
		+ "min-height: 0 !important; "
		+ "font-size: 13px !important; "
		+ "background: #ddf !important; "
		+ "border: 1px solid #00a !important; "
		+ "-moz-user-select: none !important; "
		+ "user-select: none !important; "
	);
	btt.appendChild(document.createTextNode(lbl));
	container.insertBefore(btt, _cnt);
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
	"display: block !important;"
);
linkContainer.className = containerClass;

function appendLinks(regexp) {
	//while(linksContainer.hasChildNodes())
	//	linksContainer.removeChild(linksContainer.lastChild);
	linksContainer.textContent = "";
	var _regexp = !!regexp;
	var a, cnt, num = 0;
	for(var h in allLinks) if(allLinks.hasOwnProperty(h)) {
		if(_regexp && !regexp.test(h))
			continue;
		a = document.createElement("a");
		cnt = linkContainer.cloneNode(false);
		if(num++ % 2)
			cnt.style.backgroundColor = "#e9e9e9";
		a.href = h;
		a.appendChild(document.createTextNode(h));
		a.title = allLinks[h];
		cnt.appendChild(a);
		linksContainer.appendChild(cnt);
	}
}

var fltStr = document.createElement("input");
fltStr.type = "text";
fltStr.setAttribute(
	"style",
	"width: 200px !important; "
	+ "background: white !important; "
	+ "border: 1px solid #00a !important; "
	+ "padding: 1px 4px !important; "
	+ "height: " + (bHeight - 8) + "px !important; "
	+ "max-height: " + (bHeight - 8) + "px !important; "
	+ "min-height: 0 !important; "
);
function filter(str) {
	try {
		var regexp = new RegExp(str);
		fltStr.style.setProperty("background", "white", "important");
	}
	catch(e) {
		fltStr.style.setProperty("background", "#fee", "important");
		return;
	}
	appendLinks(regexp); // Firefox copy hidden links =/
	_lastSearch = new Date().getTime();
}
var _timeout = 0;
var _lastSearch = 0;
fltStr.onkeypress = function(e) {
	var _this = this;
	clearTimeout(_timeout);
	if(e.keyCode == 27) // KeyEvent.DOM_VK_ESCAPE
		_timeout = setTimeout(function() { _this.value = ""; filter(""); }, 0);
	else {
		var delay = Math.max(0, 150 + _lastSearch - new Date().getTime());
		_timeout = setTimeout(function() { filter(_this.value); }, delay);
	}
};
container.insertBefore(document.createTextNode(_localize("Filter (RegExp): ")), _cnt);
container.insertBefore(fltStr, _cnt);

appendLinks();

body.appendChild(container);
selectAll();
})();