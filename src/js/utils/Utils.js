function isNumber(val) {
    if(isEmpty(val)) return false;
    return !Number.isNaN(Number(val));
}
  
function isTel(val) {
    if(isEmpty(val)) return false;
    return /^([0-9]|#|\*|-)+$/.test(val.toString().replace(/[-()\s]/g,''));
    // return true;///^([0-9]|#|\*|-)+$/.test(val.replace(/[-()\s]/g,''));
}

function isUrl(val){
    if (isEmpty(val) || val.match(/^(http|https|ftp|ftps):\/\//i) == null) return false
    return true;
}

function isMail(val) {
    if(isEmpty(val)) return false;
    const regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
    const regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
    if(val.match(regex1) && val.match(regex2)) {
        // 全角チェック
        if(val.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ )) return false
        // 末尾TLDチェック（〜.co,jpなどの末尾ミスチェック用）
        if(!val.match( /\.[a-z]+$/ )) return false
        return true;
    } else {
        return false;
    }
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
  
const getLocale = function(props, language) {
    if(!isEmpty(props.ua)
        && !isEmpty(props.ua.language)) {
      return props.ua.language;
    }
    return isEmpty(language)?'ja':language;
}

const getQueryLocale = function(props, language) {
    if(!isEmpty(props.location)
        && !isEmpty(props.location.query)
        && !isEmpty(props.location.query.language)) {
      return props.location.query.language;
    }
    return isEmpty(language)?'ja':language;
}

const getLocationURL = function() {
    const url = window.location.origin;
    if(!isEmpty(url)) return url;
    return window.location.protocol + '//' + window.location.host;
}

const getUUID = function() {
    // return new Date().getTime().toString(16).toUpperCase() + Math.random().toString(36).slice(2).toUpperCase();
    return new Date().getTime().toString(16);
}

const isFunc = function(obj, name) {
    if(inJson(obj, name) && (typeof obj[name] === 'function')) return true;
    return false;
}

module.exports.isNull = isNull;
module.exports.isEmpty = isEmpty;
module.exports.isReplace = isReplace;
module.exports.isNumber = isNumber;
module.exports.isTel = isTel;
module.exports.isUrl = isUrl;
module.exports.isMail = isMail;
module.exports.getLocale = getLocale;
module.exports.inArray = inArray;
module.exports.inJson = inJson;
module.exports.isFunc = isFunc;
module.exports.getJsonValue = getJsonValue;
module.exports.getQueryLocale = getQueryLocale;
module.exports.getLocationURL = getLocationURL;
module.exports.getUUID = getUUID;
