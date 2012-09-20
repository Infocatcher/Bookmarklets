// (c) Infocatcher 2009, 2011
// version 0.1.4 - 2011-08-16
// Style and idea based on Web Developer Firefox extension

(function() {
var anchorClass = "__anchorsBookmarkletLink";

var remove = anchorClass in window;
if(remove)
	delete window[anchorClass];
else {
	window[anchorClass] = true;
	var _baseURI;
	var _anch = document.createElement("a");
	var s = _anch.style;
	_anch.style.cssText =
		"background: #ff9 !important;\n" +
		"outline: 1px solid #fc6 !important;\n" +
		"color: black !important;\n" +
		"opacity: 0.85 !important;\n" +
		"display: inline !important;\n" +
		"/*margin-right: 2px !important;*/\n" +
		"font: 11px Verdana,Arial,Helvetica,sans-serif !important;\n" +
		"border: none !important;";
	_anch.className = anchorClass;
}

function anchor() {
	return _anch.cloneNode(true);
}
function createAnchor(h, t) {
	var a = anchor();
	a.href = h;
	a.appendChild(document.createTextNode(t));
	return a;
}
function addAnchors(win) {
	_baseURI = win.location.href.replace(/#.*$/, "");
	var elts = win.document.getElementsByTagName("*"), elt;
	var anch;
	for(var i = elts.length - 1; i >= 0; i--) {
		elt = elts[i];
		anch = elt.id || elt.name;
		if(!anch)
			continue;
		anch = "#" + anch;
		elt.parentNode.insertBefore(createAnchor(_baseURI + anch, anch), elt);
	}
}
function removeAnchors(win) {
	var doc = win.document;
	if("getElementsByClassName" in doc) {
		var anchs = doc.getElementsByClassName(anchorClass);
		for(var i = anchs.length - 1; i >= 0; i--)
			rmv(anchs[i]);
		return;
	}
	var anchs = doc.getElementsByTagName("a");
	for(var i = anchs.length - 1; i >= 0; i--) {
		anch = anchs[i];
		if(anch.className == anchorClass)
			rmv(anch);
	}
}
function rmv(node) {
	node.parentNode.removeChild(node);
}
function toggleAnchors(win) {
	beginBatch(win);
	if(remove)
		removeAnchors(win);
	else
		addAnchors(win);
	endBatch(win);
}
function parseWin(win) {
	try { toggleAnchors(win); }
	catch(e) {}
	for(var i = 0, len = win.frames.length; i < len; i++)
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