// (c) Infocatcher 2008, 2011
// version 0.1.2 - 2011-04-03

// Add Style module:
// (c) Infocatcher 2008-2009, 2011
// version 0.1.3 - 2011-01-27

(function() {
// See https://developer.mozilla.org/en/CSS/Privacy_and_the_%3Avisited_selector#Limits_to_visited_link_styles
var style = [
	"/*** Highlight Unvisited Links bookmarklet ***/",
	"%*%:root %*%:visited, %*%:root %*%:visited %*% { color: #aaa !important; text-decoration: none !important; }",
	"%*%:root %*%:visited { border-bottom: 1px dashed #aaa !important; }",
	"%*%:root %*%:link, %*%:root %*%:link %*% { color: #00a !important; background: #e5e5e5 !important; border: none !important; text-decoration: none !important; }",
	"%*%:root %*%:link { border-bottom: 1px dashed #00a !important; line-height: 1.28em !important; }",
	"%*%:root %*%:visited:hover, %*%:root %*%:visited:hover %*% { color: #555 !important; }",
	"%*%:root %*%:visited:hover { border-bottom: 1px solid #555 !important; }",
	"%*%:root %*%:link:hover, %*%:root %*%:link:hover %*% { color: #00d !important; }",
	"%*%:root %*%:link:hover { border-bottom: 1px solid #00d !important; }"
].join("\n")
.replace(/%\*%/g, (function() {
	var rnd = Math.random().toFixed(16).substr(2);
	var hack = "*|*";
	for(var i = 0; i < 16; i++)
		hack += ":not(#__priorityHack__" + rnd + "__" + i + ")";
	return hack;
})());
var styleId = "__bookmarkletCustomStyleHighlightUnvisitedLinks";

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