/**
 * Created by jyothi on 13/9/17.
 */
/**
 * Checks for window load and triggers the background
 */
window.addEventListener("load", function() {
    var ticker = setInterval(function () {
        chrome.runtime.sendMessage({
            type: "check-for-sound",
            data: {}
        });
    }, 1000);
}, true);