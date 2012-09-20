// (c) Infocatcher 2008-2009
// version 0.1.1 - 2009.02.25 16:30

(function() {
var inc = false; // true => ++, false => --
var newWin = true;

var loc = location.href;
try { loc = decodeURIComponent(loc); }
catch(e) {}
var m = loc.match(/^(.*\D)(\d+)(\D+\d+\D*)$/);
if(!m) {
	alert("Here was no two numbers:\n\n" + loc);
	return;
}
var urlStart = m[1];
var orgNum = m[2];
var urlEnd = m[3];
m = orgNum.match(/(0*)(\d+)/);
var zeros = m[1];
var num = parseInt(m[2]);
var newNum = inc ? ++num : --num;
if(newNum == -1) {
    alert(loc + "\n\nNext is -1");
    return;
}
newNum = zeros + newNum;
if(zeros && newNum.length > orgNum.length)
	newNum = newNum.substr(1);
else if(newNum.length < orgNum.length)
	newNum = "0" + newNum;
loc = urlStart + newNum + urlEnd;
if(newWin)
	window.open(loc);
else
	location.href = loc;
})();