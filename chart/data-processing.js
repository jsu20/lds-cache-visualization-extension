// stores tabId that opened this DevTools window
let tabId;
let treeData;
let rawData; 

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request && request.tabId && request.action) {
        if (request.tabId == tabId && request.action == 'giveSource') {
            rawData.push(request);
            // if storeIngest or storeEvict, update store
            if (request.method != 'storeBroadcast' && request.method != 'AdapterCall') {
                let store = request.source.records;
                let new_recs = formatResponse(store);
                treeData = makeTreeJSON('root', new_recs);
            }
        }
    } 
});

// initial request for data from page
chrome.runtime.sendMessage({ action: 'getSource' }, function (response) {
    if (response && response.tabId && response.source) {
        tabId = response.tabId;

        let store = response.source[response.source.length - 1].source.records; // actual store is last element
        rawData = response.source.slice(0, response.source.length - 1); // everything but last element is call data
        let new_recs = formatResponse(store);
        
        treeData = makeTreeJSON('root', new_recs);
    }
});



document.getElementById("button_circles").addEventListener("click", function () {
    if (treeData !== undefined) {
        let f = new JSONFormatter(treeData);
        let top = document.getElementById("chart_circles");
        top.innerHTML = "";
        top.appendChild(f.render());
    }
})


document.getElementById("button_timeline").addEventListener("click", function () {
    document.getElementById("chart_timeline").innerHTML = ""; // reset
    if (rawData !== undefined) {
        generateTimeline(rawData);
    }
})

document.getElementById("button_circles2").addEventListener("click", function () {
    document.getElementById("chart_circles").innerHTML = ""; // reset
})

document.getElementById("button_timeline2").addEventListener("click", function () {
    document.getElementById("chart_timeline").innerHTML = ""; // reset
    document.getElementById("bottom").innerHTML = "";
})