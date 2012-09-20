// (c) Infocatcher 2009, 2011
// version 0.1.1 - 2011-01-27

(function() {
var styleIdPrefix = "__bookmarkletCustomStyle";
var _sipl = styleIdPrefix.length;
function removeCustomStyles(win) {
	var doc = win.document;
	var elt = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "head");
	elt = elt.length ? elt[0] : document.documentElement;

	var styles = elt.getElementsByTagName("style"), stl;
	for(var i = styles.length - 1; i >= 0; i--) {
		stl = styles[i];
		if(stl.id && stl.id.substr(0, _sipl) == styleIdPrefix)
			stl.parentNode.removeChild(stl);
	}
}
function parseWin(win) {
	try { removeCustomStyles(win); }
	catch(e) {};
	for(var i = 0, len = win.frames.length; i < len; i++)
		try { parseWin(win.frames[i]); }
		catch(e) {}
}
parseWin(window);
})();