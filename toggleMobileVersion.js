// m.example.com <-> example.com
if(/^(https?:\/+)(m\.)?/.test(location))
	location = RegExp.$1 + (RegExp.$2 ? "" : "m.") + RegExp.rightContext;