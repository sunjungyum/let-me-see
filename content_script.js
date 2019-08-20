/*global chrome*/

// Listener is called by 'popup.js' to get info about the selected text in the context of the webpage
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection") {
        sendResponse({ data: window.getSelection().toString() });
    } else {
        sendResponse({});
    }
});