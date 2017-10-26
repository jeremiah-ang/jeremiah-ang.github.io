// JavaScript Document

function $import(src)
{
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("src", src);
	scriptElement.setAttribute("type", "text/javascript");
	
	document.getElementsByTagName('head')[0].appendChild(scriptElement);
	
	scriptElement.onload = function()
	{
		var hash = window.location.hash;
		hash = hash.substring(1,hash.length);
		init(hash);
	}
}