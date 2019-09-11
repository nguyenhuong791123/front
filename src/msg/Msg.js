const req = require.context('./', true, /\.json.*$/);

let messages = {};
req.keys().forEach(function (file) {
    const msg = file.replace('./', '').replace('.json', '');
    messages[msg] = req(file);
});

function getJsonValue(json, key) {
    if(key === undefined || key === null) return '';
    if(json === undefined || json === null) return key;
    if(key in json) return json[key];
    return key;
}

const GetMsg = function(type, language, key) {
    const field = (type === undefined || type === null)?language:(type + '/' + language);
    const json = messages[field];
    return getJsonValue(json, key);
}

// module.exports = messages;
module.exports = GetMsg;
