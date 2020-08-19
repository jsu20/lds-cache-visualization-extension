const MessageAction = {
    InitialPutSource: 'InitialPutSource',
    PutSource: 'PutSource',
    AdapterCall: 'AdapterCall',
    Broadcast: 'Broadcast',
    GiveSource: 'giveSource',
    GetSource: 'getSource'
};

let source = null; // will be set after putSource executed

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // initial message from LDS page
    if (request.action === MessageAction.InitialPutSource) {
        source = request.source;
    }

    // sent from content.js, intended for saving source
    if (request.action === MessageAction.PutSource) {
        chrome.runtime.sendMessage({
            action: MessageAction.GiveSource, 
            source: request.source, 
            tabId: tabId, 
            method: request.method, 
            args: request.args,
            startTime: request.startTime,
            endTime: request.endTime
        });
    }
    // sent from Devtools, to get the source
    if(request.action === MessageAction.GetSource) {
        sendResponse({ 
            source: source,
            tabId: tabId,
            startTime: request.startTime,
            endTime: request.endTime 
        });
    }

    if (request.action === MessageAction.AdapterCall) {
        chrome.runtime.sendMessage({
            action: MessageAction.GiveSource, 
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
            action: MessageAction.GiveSource,
            startTime: request.startTime,
            endTime: request.endTime,
            method: request.method,
            tabId: tabId
        });
    }
});
