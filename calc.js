// (c) Infocatcher 2008-2010
// version 0.8.1 - 2010-11-29

// getSel module:
// (c) Infocatcher 2009
// version 0.1.2 - 2009-02-22 23:52

(function() {

var undefined;

var cName = "Calc";
var cVers = "0.8.1 - 2010-11-29";
var cMaxHistItems = 5;
var cMaxErrTitleLen = 280;
var cMaxErrLen = 60;

function _getSel(win, sels) {
	sels = sels || [];
	try {
		var doc = win.document;
		var sel = doc.selection && doc.selection.createRange && doc.selection.createRange().text
			|| win.getSelection && win.getSelection()
			|| doc.getSelection && doc.getSelection();
	}
	catch(e) { // Permission denied to get property Window.document
		return sels;
	}
	var _sel;
	try {
		var rngCnt = sel.rangeCount;
		if(typeof rngCnt != "number")
			throw 0;
		if(rngCnt == 0)
			return sels;
		for(var i = 0; i < rngCnt; i++) {
			_sel = sel.getRangeAt(i).toString();
			if(_sel)
				sels.push(_sel);
		}
	}
	catch(e) {
		_sel = sel.toString();
		if(_sel)
			sels.push(sel.toString());
	}
	return sels;
}
function getSel(win, sels) {
	win = win || window;
	sels = _getSel(win, sels || []);
	for(var i = 0, len = win.frames.length; i < len; i++)
		sels = _getSel(win.frames[i], sels || []);
	return sels;
}

function getSelStr() {
	return getSel().join(" ");
}
var addFnc = (
	"[%name %vers]\n"
	+ "\u2022 Additionnal functions: fact(n), Log(b, n), log10(n), sign(n), radToGrad(r), gradToRad(g) .okr(p)\n"
	+ "\u2022 Other: cls(), hist(max)\n"
	+ "\u2022 Converter: =expression\n\n"
	).replace(/%name/g, cName).replace(/%vers/g, cVers);

function fact(n) {
	//return n == 0 || n == 1 ? 1 : n * fact(n - 1);
	var res = 1;
	while(n)
		res *= n--;
	return res;
}
function Log(b, n) {
	return b && n && b > 0 && n > 0
		? Math.log(n) / Math.log(b)
		: NaN;
}
function log10(n) {
	return n && n > 0
		? Math.log(n) * Math.LOG10E
		: NaN;
}
function sign(n) {
	return n
		? n > 0
			? 1
			: -1
		: NaN;
}
function radToGrad(r) {
	return typeof r == "number"
		? 180*r/Math.PI
		: NaN;
}
var r2g = radToGrad;
function gradToRad(g) {
	return typeof g == "number"
		? Math.PI*g/180
		: NaN;
}
var g2r = gradToRad;
function p(s) {
	return String(s).replace(/^(\d+)\.(\d+)$/, "$1,$2");
}
var _hasOkr = "okr" in Number.prototype;
if(_hasOkr)
	var _oldOkr = Number.prototype.okr;
Number.prototype.okr = function(p) {
	return parseFloat(this.toFixed(p));
};

function _fixMaxHist(m) {
	return typeof m == "number" && m >= 0 ? m : cMaxHistItems;
}

function _conv(s) {
	if(typeof s != "string")
		return s;
	return s
		.replace(/^=/, "")
		.replace(/(^|\D)(\d+),(\d+)(?=\D|$)/g, "$1$2.$3")
		.replace(/(\d)\s*\.\s*(?=\d)/g, "$1.")
		.replace(/\u2219/g, "*")
		.replace(/\u2013|\u2014|\u2212/g, "-");
}

function destroy() {
	delete(Number.prototype.okr);
	if(_hasOkr)
		Number.prototype.okr = _oldOkr;
}
function calc(_cmd, _history, _maxHist) {
	_cmd = _cmd || prompt(addFnc + "Execute:", getSelStr());
	_history = _history || [];
	_maxHist = _fixMaxHist(_maxHist);
	var _clsFlag = false;
	if(!_cmd) {
		destroy();
		return false;
	}
	var err = "", origErr = "", cmdRes;
	function cls() { _clsFlag = true; return ""; }
	function hist(m) { _maxHist = _fixMaxHist(m); return "History: " + _maxHist; }
	with(Math) {
		try {
			cmdRes = eval(_cmd);
		}
		catch(e) {
			var e2;
			try {
				var _cmd2 = _conv(_cmd);
				cmdRes = eval(_cmd2);
				_cmd = "[Converted] " + _cmd2;
			}
			catch(_e) {
				e2 = _e;
			}
			e = e2 ? "[Converted] " + e2 : "" + e;
			origErr = e;
			err = "[Error]:\n" + (e.length > cMaxErrTitleLen ? e.substr(0, cMaxErrTitleLen) + " [...]" : e) + "\n\n";
		}
	}
	if(_clsFlag)
		_history = [];
	var _origErr = origErr.length > cMaxErrLen ? origErr.toString().substr(0, cMaxErrLen) + " [...]" : origErr;
	_history.push(_cmd + " = " + cmdRes + (origErr ? " <" + _origErr.replace(/[\n\r]+/g, " ") + ">" : ""));
	if(_history.length > _maxHist)
		_history.splice(0, _history.length - _maxHist);
	var _hist = _history.slice(0, _history.length - 1);
	var _hist = _hist.length ? _hist.join("\n") + "\n\n" : "";
	var res = prompt(addFnc + err + _hist + _cmd + " =", cmdRes);
	if(!res) {
		destroy();
		return false;
	}
	calc(res, _history, _maxHist);
	return true;
};
calc();
})();