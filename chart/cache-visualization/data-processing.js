
// is RecordRepresentation object
function isRecord(key) {
    return key.includes('UiApi::RecordRepresentation') && !key.includes('__fields__');
}

// recursive function that builds Tree JSON object
function makeTreeJSON(key, recs) {
    let obj = { 'name': key };

    // if RecordRepresentation, do filtering logic
    if (key === 'root' | key.includes('UiApi::RecordRepresentation')) {
        if (!('fields' in recs[key]) && (recs[key]['value'] === null || typeof (recs[key]['value']) !== 'object')) { // is a leaf
            return obj;
        }

        obj['children'] = [];

        // must be field
        if (!('fields' in recs[key])) {
            // special check for child Record
            let ref = recs[key]['value']['__ref']
            let ref_obj = makeTreeJSON(ref, recs);
            obj['children'].push(ref_obj);
            return obj;
        }

        let fields = recs[key]['fields'];
        for (let field in fields) {
            let ref = fields[field]['__ref'];
            let ref_obj = makeTreeJSON(ref, recs);
            obj['children'].push(ref_obj);
        }
    }
    return obj;
}

// format Response JSON to pass into makeTreeJSON
function formatResponse(recs) {
    let isRoot = {};

    if (recs) {
        for (let key in recs) {
            if (key.includes('UiApi::RecordRepresentation')) {
                // is a field Record
                if (key.includes('__fields__') && recs[key]['value'] !== null && typeof (recs[key]['value']) == 'object' && ('__ref' in recs[key]['value'])) {
                    let ref = recs[key]['value']['__ref']
                    if (isRecord(ref)) {
                        isRoot[ref] = false;
                    }
                }
                else if (isRecord(key)) {
                    if (!(key in isRoot)) {
                        isRoot[key] = true;
                    }
                    // get all fields
                    if (recs[key]['fields']) {
                        let fields = recs[key]['fields'];
                        for (let field in fields) {
                            let ref = fields[field]['__ref'];
                            if (isRecord(ref)) {
                                isRoot[ref] = false;
                            }

                        }
                    }
                }
            } else {
                isRoot[key] = true;
            }
        }

        // get root and root children
        let root = 'root';
        recs[root] = { "apiName": "root", "fields": {} };
        for (let key in isRoot) {
            if (isRoot[key]) {
                recs[root]['fields'][key] = { '__ref': key };
            }
        }
        return recs;
    }
}