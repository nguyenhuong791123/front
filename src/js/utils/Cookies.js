function getCookie(name) {
    var result = null;
    var cn = name + '=';
    var all = document.cookie;
    var p = all.indexOf(cn);
    if(p != -1) {
        var s = p + cn.length;
        var e = all.indexOf(';', s);
        if( e == -1 ) {
            e = all.length;
        }
        result = decodeURIComponent(all.substring(s, e));
    }
    return result;
}

function setCookie(key, value, response) {
    const escapedValue = escape(value);
    response.setHeader('Set-Cookie', [`${key}=${escapedValue}`]);
}

module.exports.getCookie = getCookie;
module.exports.setCookie = setCookie;
  