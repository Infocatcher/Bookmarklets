(function() {
function getFavicon() {
	var favicon = "";
	var relRegExp = /(^|\s)icon(\s|$)/i;
	var lnks = document.getElementsByTagName("link"), lnk;
	for(var i = 0, len = lnks.length; i < len; i++) {
		lnk = lnks[i];
		if(relRegExp.test(lnk.rel) && lnk.href)
			return lnk.href;
	}
	var m = location.href.match(/[\w-]+:\/*[^\/]+/);
	if(!m)
		return alert("Error...");
	return m[0] + "/favicon.ico";
}
var fav = getFavicon();
if(fav)
	//location.href = fav;
	window.open(fav);
})();