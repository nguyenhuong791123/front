var SYMBOL = {
    SLASH: '/'
    ,HYPHEN: '-'
    ,COLON: ':'
}
  
var isDateTime = function (symbol, locale) {
    let date = new Date();
    let YMD = isDate(symbol, locale);
    return YMD + ' ' + date.getHours() + SYMBOL.COLON + date.getMinutes();
}
  
var isDate = function (symbol, locale) {
    let date = new Date();
    if(locale === 'ja') {
      return date.getFullYear() + symbol + date.getMonth() + symbol + date.getDate();
    } else {
      return date.getDate() + symbol + date.getMonth() + symbol + date.getFullYear();
    }
}

var isMonthDay = function (symbol, locale) {
  let date = new Date();
  if(locale === 'ja') {
    return date.getMonth() + symbol + date.getDate();
  } else {
    return date.getDate() + symbol + date.getMonth();
  }
}

module.exports.SYMBOL = SYMBOL;
module.exports.isDate = isDate;
module.exports.isMonthDay = isMonthDay;
module.exports.isDateTime = isDateTime;
  