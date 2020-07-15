function dateTime(date, language, datetime, pattern) {
    var y = date.getFullYear();
    var m = (date.getMonth() + 1);
    var d = date.getDate();
    if(pattern === undefined || pattern === null) pattern = '-';
    if(m < 10) m = '0' + m;
    if(d < 10) d = '0' + d;
    var time = '';
    if(datetime) {
        var h = date.getHours();
        var mm = date.getMinutes();
        if(h < 10) h = '0' + h;
        if(mm < 10) mm = '0' + mm;
        time = ' ' + h + ':' + mm;  
    }
    if(language === 'ja') {
        return y + pattern + m + pattern + d + time
    } else {
        return d + pattern + m + pattern + y + time
    }
}

module.exports.dateTime = dateTime;