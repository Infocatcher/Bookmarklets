(function() {
function toggleEditable(win) {
	var body = win.document.body;
	body.contentEditable = body.contentEditable == "true" ? "false" : "true";
}
function parseWin(win) {
	try { toggleEditable(win); }
	catch(e) {}
	for(var i = 0, len = win.frames.length; i < len; i++)
		try { parseWin(win.frames[i]); }
		catch(e) {}
}
parseWin(window);
})();