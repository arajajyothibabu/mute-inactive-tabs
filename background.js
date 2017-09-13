/**
 * Created by jyothi on 13/9/17.
 */

var enabled = true;
var path = {"32": "icon.png"};
var disablePath = {"32": "icond.png"};
var title = "Mute Inactive Tabs";
var disableTitle = "Disable Mute Inactive Tabs";
chrome.browserAction.onClicked.addListener(function(tab) {
    var currentTitle = title;
    enabled = !enabled;
    if(enabled){
        currentTitle = disableTitle;
    }
    chrome.browserAction.setTitle({title: currentTitle});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
        case "check-for-sound":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) { //gets current Tab
                var activeTab = tabs[0];
                if(tabs.length > 0) {
                    chrome.tabs.update(activeTab.id, {muted: false});
                    if(enabled){
                        if (activeTab.audible) { //if active tab has sound muting rest
                            chrome.tabs.query({}, function (tabs) {
                                tabs.forEach(function (tab) {
                                    if (tab.audible && tab.id !== activeTab.id) {
                                        chrome.tabs.update(tab.id, {
                                            muted: true
                                        }, function (tab) {
                                            //Address if any
                                        });
                                    }
                                });
                            });
                        }
                    }
                }
            });
            break;
        default:
    }
    return true;
});