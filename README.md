# lds-cache-visualization-extension
Chrome DevTools extension for data visualization of LDS cache.

Extension outline:
- manifest.json file: metadata
- devtools.js: on open, triggers `content.js`
- content.js: sends message to LDS page, receives data response and posts it for `background.js`
— *also modified `lds lightning platform ldsInstrumentation` to post data  
- background.js: passes along messages from content.js to chart/data-processing.js
- chart/index.html and chart/data-processing.js: receives and processes data to display graphs

Timeline Chart:
- displays adapter calls, network calls (storeIngest, storeEvict, storeBroadcast) in timeline
- on click, displays detailed info e.g. config, response data

