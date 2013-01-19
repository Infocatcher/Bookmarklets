(function() {
function getFavicon() {
	var relRegExp = /(^|\s)icon(\s|$)/i;
	var lnks = document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "link");
	for(var i = 0, len = lnks.length; i < len; ++i) {
		var lnk = lnks[i];
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