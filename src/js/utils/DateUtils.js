const SYMBOL = {
    SLASH: '/'
    ,HYPHEN: '-'
    ,COLON: ':'
}

const DATE_REGX = {
  DATE_HYPHEN: 'YYYY-MM-DD'
  ,DATETIME_HYPHEN: 'YYYY-MM-DD HH:mm:ss'
  ,DATE_SLASH: 'YYYY/MM/DD'
  ,DATETIME_SLASH: 'YYYY/MM/DD HH:mm:ss'
}

const isDateTime = function (symbol, locale) {
  let date = new Date();
  let YMD = isDate(symbol, locale);
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  h = date.getHours();
  let m = date.getMinutes();
  if(h < 10) h = '0' + h;
  if(m < 10) m = '0' + m;
  if(symbol === undefined || symbol === null) {
    return YMD + '' + h.toString() + '' + m.toString();
  } else {
    return YMD + ' ' + h.toString() + SYMBOL.COLON + m.toString();
  }
}

const isFullDateTime = function (symbol, locale) {
  let date = new Date();
  let YMD = isDate(symbol, locale);
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if(h < 10) h = '0' + h;
  if(m < 10) m = '0' + m;
  if(s < 10) s = '0' + s;
  if(symbol === undefined || symbol === null) {
    return YMD + '' + h.toString() + '' + m.toString() + '' + s.toString();
  } else {
    return YMD + ' ' + h.toString() + SYMBOL.COLON + h.toString() + SYMBOL.COLON + s.toString();
  }
}

const isDate = function (symbol, locale) {
  let date = new Date();
  if(symbol === undefined || symbol === null) symbol = '';
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  let m = date.getMonth() + 1;
  let d = date.getDate();
  if(m < 10) m = '0' + m;
  if(d < 10) d = '0' + d;
  if(locale === 'ja') {
    return date.getFullYear().toString() + symbol + m.toString() + symbol + d.toString();
  } else {
    return d.toString() + symbol + m.toString() + symbol + date.getFullYear().toString();
  }
}

const isMonthDay = function (symbol, locale) {
  let date = new Date();
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  let m = date.getMonth() + 1;
  let d = date.getDate();
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

const isStringToDate = function (dateStr, symbol, locale) {
  if(!isDateType(dateStr)) return '';
  let date =  new Date(Date.parse(dateStr));
  if(symbol === undefined || symbol === null) symbol = '';
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  let m = date.getMonth() + 1;
  let d = date.getDate();
  if(m < 10) m = '0' + m;
  if(d < 10) d = '0' + d;
  if(locale === 'ja') {
    return date.getFullYear().toString() + symbol + m.toString() + symbol + d.toString();
  } else {
    return d.toString() + symbol + m.toString() + symbol + date.getFullYear().toString();
  }
}

const isStringToDateTime = function (dateStr, symbol, locale) {
  if(!isDateType(dateStr)) return '';
  let date =  new Date(Date.parse(dateStr));
  let YMD = isStringToDate(dateStr, symbol, locale);
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  h = date.getHours();
  let m = date.getMinutes();
  if(h < 10) h = '0' + h;
  if(m < 10) m = '0' + m;
  if(symbol === undefined || symbol === null) {
    return YMD + '' + h.toString() + '' + m.toString();
  } else {
    return YMD + ' ' + h.toString() + SYMBOL.COLON + m.toString();
  }
}

const isStringToFullDateTime = function (dateStr, symbol, locale) {
  if(!isDateType(dateStr)) return '';
  let date =  new Date(Date.parse(dateStr));
  let YMD = isStringToDate(dateStr, symbol, locale);
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if(h < 10) h = '0' + h;
  if(m < 10) m = '0' + m;
  if(s < 10) s = '0' + s;
  if(symbol === undefined || symbol === null) {
    return YMD + '' + h.toString() + '' + m.toString() + '' + s.toString();
  } else {
    return YMD + ' ' + h.toString() + SYMBOL.COLON + h.toString() + SYMBOL.COLON + s.toString();
  }
}

const isDateGetTime = function (locale) {
  let date = new Date();
  let h = date.getHours();
  if(locale === 'ja') {
    date.setHours(h + 9);
  } else if(locale === 'vi') {
    date.setHours(h + 7);
  }
  return date.getTime()
}

module.exports.SYMBOL = SYMBOL;
module.exports.DATE_REGX = DATE_REGX;
module.exports.isDate = isDate;
module.exports.isMonthDay = isMonthDay;
module.exports.isDateTime = isDateTime;
module.exports.isFullDateTime = isFullDateTime;
module.exports.isDateType = isDateType;
module.exports.isStringToDate = isStringToDate;
module.exports.isStringToDateTime = isStringToDateTime;
module.exports.isStringToFullDateTime = isStringToFullDateTime;
module.exports.isDateGetTime = isDateGetTime;
