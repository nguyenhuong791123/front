import { TYPE, CUSTOMIZE, OPTIONS_KEY } from './HtmlTypes';

export const fileToBase64 = function(files, obj) {
    if(files.length <= 0) return;
    obj.obj[OPTIONS_KEY.OPTIONS_FILE] = [];
    Object.keys(files).map(i => {
        var f = {};
        var reader = new FileReader();
        reader.onload = function () {
            f['idx'] = i;
            f['name'] = files[i].name;
            f['size'] = files[i].size;
            f['type'] = files[i].type;
            f['data'] = reader.result;
            obj.obj[OPTIONS_KEY.OPTIONS_FILE].push(f);
        };
        reader.readAsDataURL(files[i]);
    });
}

export const fileFormatBase64 = function(obj) {
    var value = '';
    if(obj[CUSTOMIZE.TYPE] === TYPE.FILE && obj[OPTIONS_KEY.OPTIONS_FILE].length > 0) {
        if(obj[CUSTOMIZE.MULTIPLE_FILE]) {
            value = obj[OPTIONS_KEY.OPTIONS_FILE].map((o) => {
                const data = o['data'].split(';base64');
                return (data[0] + ';name=' + o['name'] + ';base64' + data[1]);
            });
        } else {
            const data = obj[OPTIONS_KEY.OPTIONS_FILE][0]['data'].split(';base64');
            value = (data[0] + ';name=' + obj[OPTIONS_KEY.OPTIONS_FILE][0]['name'] + ';base64' + data[1]);
        }
    }
    return value;
}

export const base64ToFile = function(base64, name) {
    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    var types = base64.split(';base64')[0];
    types = types.split(';');
    return new File([buffer.buffer], name, { type: types[1] });
};

export const byteToUnit = function(size, fixed) {
    if(Number.isNaN(Number(size))) return 0;
    if(Number.isNaN(Number(fixed))) fixed = 2;
    var s = (size / (1024*1024));
    if(parseInt(s) > 0) return (Math.round(s * 100) / 100).toFixed(fixed) + 'MB';
    s = size / 1024;
    if(parseInt(s) > 0) return (Math.round(s * 100) / 100).toFixed(fixed) + 'KB';
    return size + 'B';
}

export const toBlob = function(base64, mime_ctype) {
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }

    try {
        var blob = new Blob([bom, buffer.buffer], {
            type: mime_ctype,
        });
    } catch (e) {
        return false;
    }
    return blob;
}