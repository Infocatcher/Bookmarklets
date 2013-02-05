// https://github.com/Infocatcher/Bookmarklets/blob/master/showAnchors.js

// Show Anchors bookmarklet
// Style and idea based on Web Developer Firefox extension
// Replace "var showOver = confirm(_localize("Show over?"));"
// with "var showOver = true;" to suppress prompt.
// Also you can use Custom Buttons https://addons.mozilla.org/addon/custom-buttons/
// to launch the code (place it into "code" section)

// (c) Infocatcher 2009, 2011-2013
// version 0.2.0pre6 - 2013-02-05

(function() {
var window = top;
var document = top.document;
if(window.content && content != window) try { // Custom Buttons extension?
	if(
		content instanceof Components.interfaces.nsIDOMWindow
		&& !(content instanceof Components.interfaces.nsIDOMChromeWindow)
	) {
		window = content.wrappedJSObject || content; // Only for better compatibility with bookmarklet
		document = window.document;
	}
}
catch(e) {
}

var ns = "__anchorsBookmarklet";
var anchorClass      = ns + "Link"; // Don't change this for backward compatibility
var anchorBlockClass = ns + "Block";
var anchorLinkClass  = ns + "LinkHref";
var anchorCloseClass = ns + "Close";
var styleId          = ns + "Style";

function _localize(s) {
	var _s = {
		"Show over?": { ru: "Показывать поверх?" },
		"Close":      { ru: "Закрыть" },
		"Link:":      { ru: "Ссылка:" }
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

var remove = anchorClass in window;
if(remove) {
	var oldClickHandler = window[anchorClass];
	delete window[anchorClass];
}
else {
	window[anchorClass] = clickHandler;
	var showOver = confirm(_localize("Show over?"));
}

// http://forums.informaction.com/viewtopic.php?f=10&t=10266&p=43618#p43618
var setTimeout = window.setTimeout;
var isNoScript = String(setTimeout).indexOf("new Function") != -1;
var isSync = false;
if(isNoScript) {
	if("postMessage" in window) {
		setTimeout = function fakeTimeout(callback) {
			var key = "anchorsBookmarkletFakeTimeout#" + Math.random().toFixed(16).substr(2);
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
		isSync = true;
		addAnchorDelayed = addAnchor;
		rmvDelayed = rmv;
	}
}

function anchor() {
	var resetStyles = {
		display:       "inline",
		background:    "transparent",
		color:         "black",
		font:          "11px/15px Verdana,Arial,Helvetica,sans-serif",
		"text-decoration": "none",
		border:        "none",
		height:        "auto",
		margin:        0,
		padding:       0,
		"white-space": "pre",
		"text-shadow": "none",
		"min-height":  0,
		"max-height":  "none",
	};
	function style(node, override) {
		var s = [];
		for(var p in override)
			s.push(p + ": " + override[p] + " !important;");
		for(var p in resetStyles)
			if(!(p in override))
				s.push(p + ": " + resetStyles[p] + " !important;");
		node.style.cssText = s.join("\n");
	}

	var _s = document.createElementNS("http://www.w3.org/1999/xhtml", "span");
	_s.className = anchorClass;
	style(_s, {
		position: "relative",
	});

	var block = document.createElementNS("http://www.w3.org/1999/xhtml", "span");
	block.className = anchorBlockClass;
	style(block, {
		position: showOver ? "absolute" : "relative",
		top: 0,
		left: 0,
		background: "#ff9",
		padding: "1px"
	});

	var anch = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	anch.className = anchorLinkClass;
	style(anch, {
	});
	block.appendChild(anch);

	var close = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	close.className = anchorCloseClass;
	close.appendChild(document.createTextNode("x"));
	close.title = _localize("Close");
	style(close, {
		color: "#900",
		padding: "1px 1px 1px 2px"
	});
	close.href = "javascript: void 0;";
	block.appendChild(close);

	_s.appendChild(block);

	anchor = function() {
		return _s.cloneNode(true);
	};
	return anchor();
}
function windowStyle(win, add) {
	var d = win.document;
	if(!add) {
		var s = d.getElementById(styleId);
		s && rmv(s);
		return;
	}
	var s = d.createElementNS("http://www.w3.org/1999/xhtml", "style");
	s.id = styleId;
	s.type = "text/css";
	var ph = (function() {
		var rnd = Math.random().toFixed(16).substr(2);
		var hack = "*|*";
		for(var i = 0; i < 16; ++i)
			hack += ":not(#__priorityHack__" + rnd + "__" + i + ")";
		return hack;
	})();
	s.appendChild(d.createTextNode(
		ph + "." + anchorClass + " { z-index: 2147483646 !important; opacity: 0.8 !important; }\n" +
		ph + "." + anchorClass + " a:focus { outline: 1px dotted !important; }\n" +
		ph + "." + anchorClass + ":hover { z-index: 2147483647 !important; opacity: 0.95 !important; }\n" +
		ph + "." + anchorBlockClass + " { outline: 1px solid #fc6 !important; }\n" +
		ph + "." + anchorBlockClass + ":hover { outline: 1px solid #fa6 !important; }"
	));
	var h = d.getElementsByTagName("head")[0] || d.documentElement;
	h.appendChild(s);
}
function createAnchor(h, t) {
	var s = anchor();
	var a = s.firstChild.firstChild;
	a.href = h;
	a.appendChild(document.createTextNode(t));
	a.title = t;
	return s;
}
function clickHandler(e) {
	if(e.button != 0)
		return;
	var trg = e.target;
	var c = trg.className;
	if(trg.className == anchorLinkClass) {
		e.preventDefault();
		e.stopPropagation();
		prompt(_localize("Link:"), trg.href);
	}
	else if(trg.className == anchorCloseClass) {
		e.preventDefault();
		e.stopPropagation();
		rmv(trg.parentNode.parentNode);
	}
}
function addAnchors(win) {
	var _baseURI = win.location.href.replace(/#.*$/, "");
	var root = win.document.body || win.document;
	var elts = root.getElementsByTagName("*");
	if(isSync)
		elts = Array.prototype.slice.call(elts);
	for(var i = 0, l = elts.length; i < l; ++i) {
		var elt = elts[i];
		var anch = elt.id || elt.name;
		if(!anch)
			continue;
		anch = "#" + anch;
		addAnchorDelayed(elt, anch, _baseURI);
	}
}
function addAnchorDelayed(elt, anch, _baseURI) {
	setTimeout(function() {
		addAnchor(elt, anch, _baseURI);
	}, 0);
}
function addAnchor(elt, anch, _baseURI) {
	var s = createAnchor(_baseURI + anch, anch);
	var top = 0;
	var left = 0;
	var hasRect = "getBoundingClientRect" in elt;
	if(hasRect && showOver && /^t([drh]|head|body|foot)$/i.test(elt.nodeName)) {
		for(var table = elt.parentNode; table; table = table.parentNode) {
			if(table.nodeName.toLowerCase() == "table") {
				var rc1 = elt.getBoundingClientRect();
				var rc2 = table.getBoundingClientRect();
				top = rc1.top - rc2.top;
				left = rc1.left - rc2.left;
				elt = table;
				break;
			}
		}
	}
	elt.parentNode.insertBefore(s, elt);
	if(!hasRect)
		return;
	var b = s.firstChild;
	var rc = b.getBoundingClientRect();
	if(!top && !left) {
		rc = getAbsRect(b, rc);
		if(rc.top < 0)
			top -= rc.top;
		if(rc.left < 0)
			left -= rc.left;
	}
	else {
		top += rc.height;
	}
	if(top || left) {
		var st = b.style;
		st.setProperty("top",  top  + "px", "important");
		st.setProperty("left", left + "px", "important");
	}
}
function getAbsRect(node, rc) {
	// Based on code from http://javascript.ru/ui/offset
	if(!rc)
		rc = node.getBoundingClientRect();
	var document = node.ownerDocument;
	var window = document.defaultView;

	var b = document.body;
	var de = document.documentElement;
	var scrollTop  = window.pageYOffset || de.scrollTop  || b.scrollTop;
	var scrollLeft = window.pageXOffset || de.scrollLeft || b.scrollLeft;
	var clientTop  = de.clientTop  || b.clientTop  || 0;
	var clientLeft = de.clientLeft || b.clientLeft || 0;
	var top  = rc.top  + scrollTop  - clientTop;
	var left = rc.left + scrollLeft - clientLeft;
	return {
		top:  Math.round(top),
		left: Math.round(left)
	};
}
function removeAnchors(win) {
	var doc = win.document;
	if("getElementsByClassName" in doc) {
		var anchs = doc.getElementsByClassName(anchorClass);
		for(var i = anchs.length - 1; i >= 0; --i)
			rmvDelayed(anchs[i]);
		return;
	}
	var anchs = doc.getElementsByTagName("span");
	for(var i = anchs.length - 1; i >= 0; --i) {
		anch = anchs[i];
		if(anch.className == anchorClass)
			rmvDelayed(anch);
	}
}
function rmvDelayed(node) {
	setTimeout(function() {
		rmv(node);
	}, 0);
}
function rmv(node) {
	node.parentNode.removeChild(node);
}
function toggleAnchors(win) {
	beginBatch(win);
	if(remove) {
		win.removeEventListener("click", oldClickHandler, true);
		setTimeout(function() {
			removeAnchors(win);
			windowStyle(win, false);
		}, 0);
	}
	else {
		try { windowStyle(win, true); }
		catch(e) {}
		win.addEventListener("click", clickHandler, true);
		setTimeout(function() {
			addAnchors(win);
		}, 0);
	}
	setTimeout(function() {
		endBatch(win);
	}, 0);
}
function parseWin(win) {
	try { toggleAnchors(win); }
	catch(e) {}
	for(var i = 0, len = win.frames.length; i < len; ++i)
		try { parseWin(win.frames[i]); }
		catch(e) {}
}
function stopEvent(e) {
	e.preventDefault();
	e.stopPropagation();
}
function beginBatch(win) {
	win.addEventListener("DOMNodeInserted", stopEvent, true);
	win.addEventListener("DOMNodeRemoved", stopEvent, true);
}
function endBatch(win) {
	win.removeEventListener("DOMNodeInserted", stopEvent, true);
	win.removeEventListener("DOMNodeRemoved", stopEvent, true);
}
parseWin(window);
})();