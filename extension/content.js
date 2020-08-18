const MessageName = {
    ADAPTER_CALL: 'ADAPTER_CALL',
    BROADCAST: 'BROADCAST',
    CACHE_CONTENTS: 'CACHE_CONTENTS',
    INITIAL_CACHE_CONTENTS: 'INITIAL_CACHE_CONTENTS',
};

const MessageAction = {
    InitialPutSource: 'InitialPutSource',
    PutSource: 'PutSource',
    AdapterCall: 'AdapterCall',
    Broadcast: 'Broadcast'
};

// requests cache data from LDS page
window.postMessage({ type: 'InitialCache' }, "*");

window.addEventListener("message", function (event) {
    // only accept messages from ourselves
    if (event.source !== window && event.source !== window.frames[0])
        return;
    if (event.data.type == MessageName.INITIAL_CACHE_CONTENTS) {
        // get source
        let source = event.data.source;
        chrome.runtime.sendMessage({ 
            action: MessageAction.InitialPutSource, 
            source: source,
            startTime: event.data.startTime,
            endTime: event.data.endTime 
        });
    }
    // checks if is proper request
    if (event.data.type == MessageName.CACHE_CONTENTS) {
        let source = event.data.source;
        let args = event.data.args; // 
        let method = event.data.method; // storeIngest or storeEvict
        chrome.runtime.sendMessage({ 
            action: MessageAction.PutSource, 
            source: source, 
            method: method, 
            args: args,
            startTime: event.data.startTime,
            endTime: event.data.endTime 
        });
    }

    if (event.data.type == MessageName.ADAPTER_CALL) {
        chrome.runtime.sendMessage({ 
            action: MessageAction.AdapterCall, 
            config: event.data.config, 
            name: event.data.name,
            startTime: event.data.startTime,
            endTime: event.data.endTime,
            method: event.data.method,
            isCacheHit: event.data.isCacheHit,
            name: event.data.name, 
            data: event.data.data
        });
    }

    if (event.data.type == MessageName.BROADCAST) {
        chrome.runtime.sendMessage({ 
            action: MessageAction.Broadcast,
            startTime: event.data.startTime,
            endTime: event.data.endTime,
            method: event.data.method
        });
    }
});
