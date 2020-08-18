// var connections = {};
// stores this tabId
let tabId = null;
chrome.runtime.onConnect.addListener(function (port) {
    var devToolsListener = function(message, sender, sendResponse) {
        // Inject a content script into the identified tab
        tabId = message.tabId;
        chrome.tabs.executeScript(message.tabId,
            { file: message.scriptToInject });
    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(devToolsListener);

    port.onDisconnect.addListener(function(port) {
        port.onMessage.removeListener(devToolsListener);
    });
});

const MessageAction = {
    InitialPutSource: 'InitialPutSource',
    PutSource: 'PutSource',
    AdapterCall: 'AdapterCall',
    Broadcast: 'Broadcast'
};

let source = null; // will be set after putSource executed

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === MessageAction.InitialPutSource) {
        source = request.source;
    }

    // sent from content.js, intended for saving source
    if (request.action === MessageAction.PutSource) {
        let method = request.method;
        let args = request.args;
        chrome.runtime.sendMessage({
            action: 'giveSource', 
            source: request.source, 
            tabId: tabId, 
            method: method, 
            args: args,
            startTime: request.startTime,
            endTime: request.endTime
        });
    }
    // sent from Devtools, to get the source
    if(request.action === 'getSource') {
        sendResponse({ 
            source: source,
            tabId: tabId,
            startTime: request.startTime,
            endTime: request.endTime 
        });
    }

    if (request.action === MessageAction.AdapterCall) {
        chrome.runtime.sendMessage({
            action: 'giveSource', 
            startTime: request.startTime,
            endTime: request.endTime,
            method: request.method,
            name: request.name,
            isCacheHit: request.isCacheHit,
            config: request.config,
            tabId: tabId,
            data: request.data
        });
    }

    if (request.action === MessageAction.Broadcast) {
        chrome.runtime.sendMessage({ 
            action: 'giveSource',
            startTime: request.startTime,
            endTime: request.endTime,
            method: request.method,
            tabId: tabId
        });
    }
});
