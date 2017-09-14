/**
 * Created by jyothi on 13/9/17.
 */

var enabled = true;

chrome.browserAction.onClicked.addListener(function(tab) {
    enabled = !enabled;
    var t = enabled ? 'Unm' : 'M';
    var d = enabled ? '' : 'd';
    chrome.browserAction.setTitle({title: t + "ute Inactive Tabs"});
    chrome.browserAction.setIcon({
        path: {
            '16': 'icons/icon' + d + '-16.png',
            '32': 'icons/icon' + d + '-32.png',
            '48': 'icons/icon' + d + '-48.png',
            '128': 'icons/icon' + d + '-128.png'
        }
    });
    if(!enabled){
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.update(tab.id, {muted: false});
            });
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
        case "check-for-sound":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                var activeTab = tabs[0];
                if(tabs.length > 0) {
                    chrome.tabs.update(activeTab.id, {muted: false});
                    if(enabled){
                        if (activeTab.audible) {
                            chrome.tabs.query({}, function (tabs) {
                                tabs.forEach(function (tab) {
                                    if (tab.audible && tab.id !== activeTab.id) {
                                        chrome.tabs.update(tab.id, {muted: true});
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