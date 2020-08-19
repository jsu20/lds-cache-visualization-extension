/*
data format:

[
  {
    group: "group1name",
    data: [
      {
        label: "label1name",
        data: [
          {
            timeRange: [<date>, <date>],
            val: <val: number (continuous dataScale) or string (ordinal dataScale)>
          },
          {
            timeRange: [<date>, <date>],
            val: <val>
          },
          (...)
        ]
      },
      {
        label: "label2name",
        data: [...]
      },
      (...)
    ],
  },
  {
    group: "group2name",
    data: [...]
  },
  (...)
]
*/

function generateTimeline(rawData) {
    // 3 groups
    let groups = ["AdapterCall", "storeIngest", "storeBroadcast"];
    // adapterCall, storeIngest will have labels

    let data = []; //array of objs
    let labelsData = {}; // map label to arr of all data
    // instantiate data obj
    for (let i in groups) {
        labelsData[groups[i]] = {};
    }

    function getLabel(method, request) {
        if (method == groups[0]) { // adapterCall
            return request.name + ' ' + request.isCacheHit; // hit or miss
        }
        if (method == groups[1]) {
            let name = request.args[0];
            if (name == "") {
                return "aura";
            }
            if (name == "UiApi::RecordAvatarsBulk") { // special case
                return "RecordAvatarsBulk";
            }
            // else UiApi::Representation
            let ind = name.indexOf("Representation");
            let result = name.slice("UiApi::".length, ind + "Representation".length); // gets "_Representation"

            return result;
        }
        if (method == groups[2]) {
            return "broadcast";
        }
    }

    function getExtraData(method, request) {
        if (method == groups[0]) { // adapterCall
            return {
                "config": request.config,
                "result-data": request.data
            }; // config obj, unique
        }
        if (method == groups[1]) {
            let result = {
                "request": request.args[1],
                "result": request.args[2]
            };
            return result;
        }
        if (method == groups[2]) {
            return {};
        }
    }

    //instantiate labelsData
    for (let i in rawData) {
        let request = rawData[i];
        let method = request.method; // equal to group
        let label = getLabel(method, request);
        let start = new Date(request.startTime);
        let end = new Date(request.endTime);
        let val = label;

        let obj = {
            "timeRange": [start, end],
            "val": val,
            "extraData": getExtraData(method, request)
        };

        if (label in labelsData[method]) {
            labelsData[method][label].push(obj); // push into existing arr
        } else {
            labelsData[method][label] = [obj]; // new arr
        }
    }

    // instantiate data
    for (let i in groups) {
        let group = groups[i];
        let groupObj = {
            "group": group,
            "data": []
        }
        for (let label in labelsData[group]) {
            let dataArr = labelsData[group][label];
            // pushes in correct label data
            groupObj["data"].push({
                "label": label,
                "data": dataArr
            });
        }
        // pushes in correct group data
        data.push(groupObj);
    }

    TimelinesChart()(document.getElementById("chart_timeline"))
        .zQualitative(true)
        .onSegmentClick(function (s) {
            let f = new JSONFormatter(s.extraData);
            let top = document.getElementById("bottom");
            top.innerHTML = "";
            top.appendChild(f.render()); 
        })
        .timeFormat("%I:%M:%S.%L %p") // hour:minute:second:ms
        .data(data);

}