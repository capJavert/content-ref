var self = require('sdk/self');
var panels = require("sdk/panel");
var buttons = require('sdk/ui/button/toggle');

var button = buttons.ToggleButton({
    id: "content-ref",
    label: "Ref It!",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },


    badge: null,
    badgeColor: "#f00",
    onChange: changed,
    onChange: handleClick,
    onClick: disableForThisWindow
});

function disableForThisWindow(state) {
    button.state("window", {
        disabled: true
    });

    button.state("window", {
        icon: {
            "16": "./icon-16-fade.png",
            "32": "./icon-32-fade.png",
            "64": "./icon-64-fade.png"
        }
    });
}

var panel = panels.Panel({
    contentURL: self.data.url("../html/urlPanel.html"),
    contentScriptFile: self.data.url("../scripts/urlList.js"),
    onHide: handleHide
});

require("sdk/simple-prefs").on("", onPrefsChange);

function intervalCheck (state, i, end) {
    require("sdk/timers").setTimeout(function () {
        button.state("window", {
            disabled: true
        });

        button.state("window", {
            icon: {
                "16": "./icon-16-fade.png",
                "32": "./icon-32-fade.png",
                "64": "./icon-64-fade.png"
            }
        });

        var refURLs = require("sdk/simple-prefs").prefs.contentRefUrl.split(";");
        var refKeywords = require("sdk/simple-prefs").prefs.contentRefKeywords.split(";");

        refUrls(state, refURLs, refKeywords, [], 0, refURLs.length);

        intervalCheck(state, i, end);
    }, require("sdk/simple-prefs").prefs.contentRefInterval*1000)
}

function onPrefsChange() {
    if(require("sdk/simple-prefs").prefs.contentRefIntervalCheck) {
        intervalCheck(button.state, 0, 0);
    }
}

//var listener = 'false';
panel.port.on("click-link", function(data) {
    //listener = data.listener;
    require("sdk/tabs").open(data.url);
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button,
            height: (36+notifications.length*47)
        });

        panel.port.emit("urlList", {notifications:notifications});
        notifications = [];
        button.badge = null;
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

function changed(state, refUpdates) {
    if(refUpdates>0) button.badge = refUpdates;
    else button.badge = null;
}

function refUrls(state, refURLs, refKeywords, found, i, end) {
    if(refURLs[i] == '') {
        i++;
        refUrls(state, refURLs, refKeywords, found, i, end);
    }

    pageWorker = require("sdk/page-worker").Page({
        contentScriptFile: self.data.url("../scripts/urlInfo.js"),
        contentURL: refURLs[i]
    });

    pageWorker.port.on("document", function(doc) {
        var matches = 0;
        for(j=0;j<refKeywords.length;j++) {
            if(doc.DOM.search(refKeywords[j])>0) {
                matches++;
            }
        }

        if(matches)
            found[i] = {url:refURLs[i], favicon:doc.favicon, title:doc.title.substr(0, 36)+'...', matches:matches};

        if (++i<end) refUrls(state, refURLs, refKeywords, found, i, end);
        else  {
            changed(state, found.length);
            notifications = found;

            button.state("window", {
                disabled: false
            });

            button.state("window", {
                icon: {
                    "16": "./icon-16.png",
                    "32": "./icon-32.png",
                    "64": "./icon-64.png"
            }});
        }
    });
}

var notifications = [];
function handleClick(state) {
    if(button.badge == null) {
        var refURLs = require("sdk/simple-prefs").prefs.contentRefUrl.split(";");
        var refKeywords = require("sdk/simple-prefs").prefs.contentRefKeywords.split(";");

        refUrls(state, refURLs, refKeywords, [], 0, refURLs.length);
    } else {
        handleChange(state);
    }
}