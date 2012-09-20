(function() {
var prop = "__savedDisabledValue";
function toggleDisabled(win) {
	var nodes = win.document.getElementsByTagName("*");
	var node, dis, oldDis;
	for(var i = 0, len = nodes.length; i < len; i++) {
		node = nodes[i];
		dis = node.disabled;
		if(dis) {
			node[prop] = dis;
			node.disabled = !dis;
			continue;
		}
		oldDis = node[prop];
		if(oldDis) {
			node.disabled = oldDis;
			delete node[prop];
		}
	}
}
function parseWin(win) {
	try { toggleDisabled(win); }
	catch(e) {}
	for(var i = 0, len = win.frames.length; i < len; i++)
		try { parseWin(win.frames[i]); }
		catch(e) {}
}
parseWin(window);
})();