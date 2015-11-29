var self = require('sdk/self');

var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "content-ref",
  label: "Ref It!",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
	var refURL = require("sdk/simple-prefs").prefs.contentRefUrl;
	var refKeywords = require("sdk/simple-prefs").prefs.contentRefKeywords.split(";");
	
	var found = false;
	for(i=0;i<refKeywords.length-1;i++) {
		var domHTML = "";
		pageWorker = require("sdk/page-worker").Page({
			contentScript: "domHTML = document.body.innerHTML;",
			contentURL: refURL,
		});
		
		if(domHTML.search(refKeywords[i])>0) {
			require('sdk/tabs').open(refURL);
			found = true;
			break;
		}
	}
	
	if(!found) console.log('Nothing yet...');
}