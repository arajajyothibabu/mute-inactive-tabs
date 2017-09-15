/**
 * Created by jyothi on 13/9/17.
 */

var enabled = true, extensionId;

function updateTabAudibleState(tabId, mute) {
    chrome.tabs.update(tabId, {muted: mute});
}

function muteAllTabsExcept(tabId) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.audible && tab.id !== tabId) {
                updateTabAudibleState(tab.id, true);
            }
        });
    });
}

function unmuteAllTabs() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if(tab.audible) {
                updateTabAudibleState(tab.id, false);
            }
        });
    });
}

function unmuteIfOnlyOneAvailable() {
    chrome.tabs.query({}, function (tabs) {
        var tabsWithSound = tabs.some(function (tab) {
            return tab.audible && !tab.mutedInfo.muted;
        });
        if(!tabsWithSound) {
            var tabsWithSoundButMuted = tabs.filter(function (tab) {
                return tab.audible && tab.mutedInfo.muted && tab.mutedInfo.extensionId === extensionId;
            });
            if (tabsWithSoundButMuted.length > 0) {
                updateTabAudibleState(tabsWithSoundButMuted[0].id, false);
            }
        }
    });
}

function executeIfCurrentTabAudible(callback, fallback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var activeTab = tabs[0];
        if(tabs.length > 0) {
            updateTabAudibleState(activeTab.id, false);
            if(activeTab.audible) {
                callback(activeTab.id);
            }else{
                fallback(activeTab.id);
            }
        }
    });
}

chrome.management.getSelf(function (info) {
    extensionId = info.id;
});

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
    manageAudio();
    if(!enabled){
        unmuteAllTabs();
    }else{
        unmuteIfOnlyOneAvailable();
    }
});

function manageAudio(activeTab) {
    updateTabAudibleState(activeTab.id, false);
    if(activeTab.audible && enabled) {
        muteAllTabsExcept(activeTab.id);
    }else{
        unmuteIfOnlyOneAvailable();
    }
}

var AUDIBLE = "audible";

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo.hasOwnProperty(AUDIBLE)){
        manageAudio(tab);
    }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, windowId){
    chrome.tabs.get(tabId, function(tab){
        manageAudio(tab);
    });
});