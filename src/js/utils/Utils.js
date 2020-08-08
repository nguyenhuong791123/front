function isNumber(val) {
    if(isEmpty(val)) return false;
    return !Number.isNaN(Number(val));
}
  
function isTelNumber(val) {
    if(isEmpty(val)) return false;
    return /^([0-9]|#|\*|-)+$/.test(val.replace(/[-()\s]/g,''));
    // return true;///^([0-9]|#|\*|-)+$/.test(val.replace(/[-()\s]/g,''));
}
  
function isReplace(symbol, val) {
    if(isNull(symbol) || isNull(val)) return '';
    return val.replace(symbol,'');
}
  
function isNull(val) {
    if(val === undefined || val === null) return true;
    return false;
}
  
function isEmpty(val) {
    if(val === undefined || val === null || val === 'null' || val === 'NULL' || val === '') return true;
    return false;
}

function inJson(json, key) {
    if(isEmpty(json) || isEmpty(key)) return '';
    if(key in json) return true;
    return false;
}

function inArray(array, key) {
    if(isEmpty(array) || array.length <= 0 || isEmpty(key)) return '';
    for(var i=0; i<array.length; i++) {
        if(array[i] !== key) continue;
        return true;
    }
    return false;
}

function getJsonValue(json, key) {
    if(isEmpty(json) || isEmpty(key)) return '';
    if(key in json) return json[key];
    return key;
}
  
var getLocale = function(props, language) {
    if(!isEmpty(props.ua)
        && !isEmpty(props.ua.language)) {
      return props.ua.language;
    }
    return isEmpty(language)?'ja':language;
}

var getQueryLocale = function(props, language) {
    if(!isEmpty(props.location)
        && !isEmpty(props.location.query)
        && !isEmpty(props.location.query.language)) {
      return props.location.query.language;
    }
    return isEmpty(language)?'ja':language;
}

var getLocationURL = function() {
    var url = window.location.origin;
    if(!isEmpty(url)) return url;
    return window.location.protocol + '//' + window.location.host;
}

var getUUID = function() {
    return Math.random().toString(36).slice(2).toUpperCase();
}

var isFunc = function(obj, name) {
    if(Utils.inJson(obj, name)
        && (typeof obj[name] === 'function')) return true;
    return false;
}

module.exports.isNull = isNull;
module.exports.isEmpty = isEmpty;
module.exports.isReplace = isReplace;
module.exports.isNumber = isNumber;
module.exports.isTelNumber = isTelNumber;
module.exports.getLocale = getLocale;
module.exports.inArray = inArray;
module.exports.inJson = inJson;
module.exports.isFunc = isFunc;
module.exports.getJsonValue = getJsonValue;
module.exports.getQueryLocale = getQueryLocale;
module.exports.getLocationURL = getLocationURL;
module.exports.getUUID = getUUID;
