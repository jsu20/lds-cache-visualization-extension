chrome.devtools.panels.create("LDS Cache Visualization",
    null,
    "chart/index.html",
    function(panel) {
      // code invoked on panel creation
    }
);

var backgroundPageConnection = chrome.runtime.connect({
   name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

backgroundPageConnection.postMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: "extension/content.js"
});