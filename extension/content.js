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
    let data = event.data;
    if (data.type == MessageName.INITIAL_CACHE_CONTENTS) {
        // get source
        chrome.runtime.sendMessage({ 
            action: MessageAction.InitialPutSource, 
            source: data.source,
            startTime: data.startTime,
            endTime: data.endTime 
        });
    }

    if (data.type == MessageName.CACHE_CONTENTS) {
        chrome.runtime.sendMessage({ 
            action: MessageAction.PutSource, 
            source: data.source, 
            method: data.method, // storeIngest or storeEvict
            args: data.args,
            startTime: data.startTime,
            endTime: data.endTime 
        });
    }

    if (event.data.type == MessageName.ADAPTER_CALL) {
        chrome.runtime.sendMessage({ 
            action: MessageAction.AdapterCall, 
            config: data.config, 
            name: data.name,
            startTime: data.startTime,
            endTime: data.endTime,
            method: data.method,
            isCacheHit: data.isCacheHit,
            name: data.name, 
            data: data.data
        });
    }

    if (event.data.type == MessageName.BROADCAST) {
        chrome.runtime.sendMessage({ 
            action: MessageAction.Broadcast,
            startTime: data.startTime,
            endTime: data.endTime,
            method: data.method
        });
    }
});
