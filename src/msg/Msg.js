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

const getMsg = function(type, language, key) {
    const field = (type === undefined || type === null)?language:(type + '/' + language);
    const json = messages[field];
    if(type === 'system')
        return getJsonValue(messages['system'], key);
    return getJsonValue(json, key);
}

const getSystemMsg = function(key1, key2) {
    if(key1 == undefined || key1 == null) return;
    if(key2 == undefined || key2 == null) return messages['system'][key1];
    return messages['system'][key1][key2];
}

// module.exports = messages;
// module.exports = GetMsg;
module.exports.getMsg = getMsg;
module.exports.getSystemMsg = getSystemMsg;

