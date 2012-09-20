// (c) Infocatcher 2008
// version 0.1.0 - 2008-11-16

// Add Style module:
// (c) Infocatcher 2008-2009, 2011
// version 0.1.3 - 2011-01-27

(function() {
var style = "* { color: black !important; background-color: white !important; }\n"
	+ "a, a * { color: #009 !important; background-color: white !important; text-decoration: underline !important; }\n"
	+ "a:hover, a:hover * { color: #009 !important; background-color: #eef !important; text-decoration: underline !important; }\n"
	+ "a:visited, a:visited * { color: gray !important; }\n"
	+ "a:visited:hover, a:visited:hover * { background-color: #eee !important; }\n";
var styleId = "__bookmarkletCustomStyleContrastColors";

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