// stores tabId that opened this devtools window
let tabId = null;
let treeData;
let rawData = []; 

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.tabId == tabId && request.action == 'giveSource') {
        rawData.push(request);
        console.log(request.method);
    }

    if (request.tabId == tabId && request.action == 'giveSource' && request.method != 'storeBroadcast' && request.method != 'AdapterCall') {
        let store = request.source;
        let new_recs = formatResponse(store);
        treeData = makeTreeJSON('root', new_recs);
        console.log("TREEDATA");
        console.log(treeData);
    }

});

// 
chrome.runtime.sendMessage({ action: 'getSource' }, function (response) {
    console.log(response);
    tabId = response.tabId;

    let store = response.source[response.source.length - 1].source; // actual store is last element
    console.log("store");
    console.log(store);
    rawData = response.source.slice(0, response.source.length - 1); // everything but last
    console.log("rawData");
    console.log(rawData);
    let new_recs = formatResponse(store);
    console.log('new recs');
    console.log(new_recs);
    
    treeData = makeTreeJSON('root', new_recs);
    console.log("TREEDATA");
    console.log(treeData);
});



document.getElementById("button_circles").addEventListener("click", function () {
    console.log('treeData');
    console.log(treeData);

    let f = new JSONFormatter(treeData);
    let top = document.getElementById("chart_circles");
    top.innerHTML = "";
    console.log(f.render());
    top.appendChild(f.render());
})


document.getElementById("button_timeline").addEventListener("click", function () {
    console.log('click rawData');
    console.log(rawData);
    document.getElementById("chart_timeline").innerHTML = ""; // reset
    generateTimeline(rawData);
})

document.getElementById("button_circles2").addEventListener("click", function () {
    document.getElementById("chart_circles").innerHTML = ""; // reset
})

document.getElementById("button_timeline2").addEventListener("click", function () {
    document.getElementById("chart_timeline").innerHTML = ""; // reset
    document.getElementById("bottom").innerHTML = "";
})