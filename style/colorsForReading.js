// (c) Infocatcher 2009, 2012
// version 0.1.2 - 2012-06-15

// Add Style module:
// (c) Infocatcher 2008-2009, 2011
// version 0.1.3 - 2011-01-27

(function() {
var style = [
	"/*** Colors for Reading bookmarklet ***/",
	"%*%:root %*% {",
	"	color: black !important; background: #e5e5e5 !important; border-color: #bbb !important;",
	"	font: 500 100%/1.2 Verdana,Arial,Helvetica,sans-serif !important;",
	"}",
	"%*%:root %*%:link, %*%:root %*%:link * { color: #008 !important; }",
	"%*%:root %*%:visited, %*%:root %*%:visited * { color: #77a !important; }",
	"%*%:root %*%::selection { color: highlightText !important; background: highlight !important; }",
	"%*%:root %*%::-moz-selection { color: highlightText !important; background: highlight !important; }"
].join("\n")
.replace(/%\*%/g, (function() {
	var rnd = Math.random().toFixed(16).substr(2);
	var hack = "*|*";
	for(var i = 0; i < 16; ++i)
		hack += ":not(#__priorityHack__" + rnd + "__" + i + ")";
	return hack;
})());


var styleId = "__bookmarkletCustomStyleColorsForReading";

function addStyle(win) {
	var doc = win.document;
	var elt = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "head");
	elt = elt.length ? elt[0] : document.documentElement;

	var stlIt = doc.getElementById(styleId);
	if(stlIt)
		elt.removeChild(stlIt);
	else {
		var stl = doc.createElementNS("http://www.w3.org/1999/xhtml", "style");
		stl.type = "text/css";
		stl.id = styleId;
		stl.appendChild(doc.createTextNode(style));
		elt.appendChild(stl);
	}
}
function parseWin(win) {
	try { addStyle(win); }
	catch(e) {};
	for(var i = 0, len = win.frames.length; i < len; i++)
		try { parseWin(win.frames[i]); }
		catch(e) {}
}
parseWin(window);
})();