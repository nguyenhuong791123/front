import { TYPE, CUSTOMIZE } from './HtmlTypes';
import Utils from './Utils';

export const JSON_OBJ = {
  getJsonSchema: (obj, itemName, key, idx) => {
    obj['item_name'] = itemName;
    var type = 'string';
    const array = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.PASSWORD, TYPE.DATE, TYPE.DATETIME, TYPE.FILE, TYPE.IMAGE, TYPE.COLOR, TYPE.DISABLE, TYPE.CHECKBOX ];
    if(!array.includes(obj[CUSTOMIZE.TYPE])) {
      type = obj[CUSTOMIZE.TYPE];
    }
  
    var json = { type: type, title: obj[key], idx: idx, obj: obj };
    if(!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT])) {
      if(obj[CUSTOMIZE.TYPE] === TYPE.FILE) {
        json['file_name'] = obj[CUSTOMIZE.DEFAULT];
      } else {
        json['default'] = obj[CUSTOMIZE.DEFAULT];
      }
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.DATE || obj[CUSTOMIZE.TYPE] === TYPE.DATETIME) {
      json['format'] = (obj[CUSTOMIZE.TYPE] === TYPE.DATE)?'date':'date-time';
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.FILE) {
      if(obj[CUSTOMIZE.MULTIPLE_FILE]) {
        json['type'] = 'array';
        json['items'] = { 'type': 'string', 'format': 'data-url' };
      } else {
        json['format'] = 'data-url';
      }
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
      if(obj['list_checked'] && Utils.inJson(obj, 'lists')) {
        if(obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
          json['type'] = 'number';
          // json['enum'] = items;
        } else {
          json['type'] = 'array';
        }
        json['items'] = { type: 'string', '$ref': '#/definitions/' + itemName };
        if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX) json['uniqueItems'] = true;
      } else {
        json['type'] = 'boolean';
        // json['default'] = false;
      }
    }
    console.log(json);
    return json;
  }
  ,getJsonUi: (obj, key) => {
    console.log(obj);
    var json = {};
    if(!Utils.isEmpty(obj[key])) {
      if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
        json['ui:help'] = obj[key];
      } else {
        json['ui:placeholder'] = obj[key];        
      }
    }
    if(!Utils.isEmpty(obj[CUSTOMIZE.BOX_WIDTH])) json['classNames'] = 'div-box div-box-' + obj[CUSTOMIZE.BOX_WIDTH];

    const array = [ TYPE.PASSWORD, TYPE.COLOR, TYPE.TEXTAREA, TYPE.RADIO ];
    if(array.includes(obj[CUSTOMIZE.TYPE])) {
        json['ui:widget'] = obj[CUSTOMIZE.TYPE];
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.DISABLE) {
      json['ui:disabled'] = true;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX && obj['list_checked'] || obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
      if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX) {
        // json['ui:enumDisabled'] = ['multiply'];
        json['ui:widget'] = 'checkboxes';
        json['ui:autofocus'] = true;
      } else {
        // json['ui:widget'] = TYPE.RADIO;
        if(!obj['list_checked']) json['ui:options'] = { inline: true };
      }
      if(obj['list_inline']) {
        json['ui:options'] = { inline: true };
      } else {
        json['classNames'] += ' not_inline';
      }
    }

      //{ "ui:widget": "checkboxes", "ui:options": { inline: true }, "ui:autofocus": true, classNames: "div-box div-box-25" }
  
    console.log(json);
    return json;
  }
  ,getDefinitions:(obj) => {
    if(obj[CUSTOMIZE.TYPE] !== TYPE.CHECKBOX && obj[CUSTOMIZE.TYPE] !== TYPE.RADIO && obj[CUSTOMIZE.TYPE] !== TYPE.LIST) return null;
    if(obj['list_checked']) {
      const items = Object.keys(obj['lists']).map(key => obj['lists'][key]);
      var anyOf = [];
      items.map((o) => {
        if(obj[CUSTOMIZE.TYPE] !== TYPE.RADIO) {
          anyOf.push({ type: 'string', const: o['value'], title: o['label'] });
        } else {
          anyOf.push({ type: 'string', enum: [ o['value'] ], title: o['label'] });
        }
      });  
      if(Utils.isEmpty(anyOf)) return null;
      return { type: 'string', anyOf: anyOf };
      } else {
        return { type: 'boolean' };
    }
  }
  ,getDatas:(obj) => {
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX && obj['list_checked']) {
      return (!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT]))?[obj[CUSTOMIZE.DEFAULT]]:[];
    } else {
      if(obj[CUSTOMIZE.TYPE] === TYPE.FILE || obj[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
        if(!Utils.isEmpty(obj['file_data']) && obj['file_data'].length >= 1) {
          if(obj['file_data'].length > 1) {
            return obj['file_data'];
          } else {
            return obj['file_data'][0];
          }
        }
      } else {
        return (!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT]))?obj[CUSTOMIZE.DEFAULT]:'';
      }
    }
  }
};

// module.exports.objectjson = objectjson;