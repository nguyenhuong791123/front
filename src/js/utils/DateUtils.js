var SYMBOL = {
    SLASH: '/'
    ,HYPHEN: '-'
    ,COLON: ':'
}

var isDateTime = function (symbol, locale) {
  let date = new Date();
  let YMD = isDate(symbol, locale);
  var h = date.getHours();
  var m = date.getMinutes();
  if(h < 10) h = '0' + h;
  if(m < 10) m = '0' + m;
  if(symbol === undefined || symbol === null) {
    return YMD + '' + h.toString() + '' + m.toString();
  } else {
    return YMD + ' ' + h.toString() + SYMBOL.COLON + m.toString();
  }
}

var isFullDateTime = function (symbol, locale) {
  let date = new Date();
  let YMD = isDate(symbol, locale);
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  if(h < 10) h = '0' + h;
  if(m < 10) m = '0' + m;
  if(s < 10) s = '0' + s;
  if(symbol === undefined || symbol === null) {
    return YMD + '' + h.toString() + '' + m.toString() + '' + s.toString();
  } else {
    return YMD + ' ' + h.toString() + SYMBOL.COLON + h.toString() + SYMBOL.COLON + s.toString();
  }
}

var isDate = function (symbol, locale) {
  let date = new Date();
  if(symbol === undefined || symbol === null) symbol = '';
  var m = date.getMonth() + 1;
  var d = date.getDate();
  if(m < 10) m = '0' + m;
  if(d < 10) d = '0' + d;
  if(locale === 'ja') {
    return date.getFullYear().toString() + symbol + m.toString() + symbol + d.toString();
  } else {
    return d.toString() + symbol + m.toString() + symbol + date.getFullYear().toString();
  }
}

var isMonthDay = function (symbol, locale) {
  let date = new Date();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  if(m < 10) m = '0' + m;
  if(d < 10) d = '0' + d;
  if(locale === 'ja') {
    return m.toString() + symbol + d.toString();
  } else {
    return d.toString() + symbol + m.toString();
  }
}

function isDateType(date) {
  return!!(function(d){return(d!=='Invalid Date'&&!isNaN(d))})(new Date(date));
}


module.exports.SYMBOL = SYMBOL;
module.exports.isDate = isDate;
module.exports.isMonthDay = isMonthDay;
module.exports.isDateTime = isDateTime;
module.exports.isFullDateTime = isFullDateTime;
module.exports.isDateType = isDateType;
