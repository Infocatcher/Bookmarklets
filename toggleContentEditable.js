(function() {
function getBody(doc) {
	return doc.body || doc.documentElement;
}
function toggleEditable(win) {
	getBody(win.document).contentEditable = ce;
}
function parseWin(win) {
	try { toggleEditable(win); }
	catch(e) {}
	for(var i = 0, len = win.frames.length; i < len; ++i)
		try { parseWin(win.frames[i]); }
		catch(e) {}
}
var ce = String(getBody(document).contentEditable != "true");
parseWin(window);
})();