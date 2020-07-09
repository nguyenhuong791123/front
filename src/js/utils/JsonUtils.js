// import React from 'react';
import ImageBox from './Compoment/ImageBox';
import TimeBox from './Compoment/TimeBox';
import CheckBoxSingle from './Compoment/CheckBoxSingle';
import CheckBoxInline from './Compoment/CheckBoxInline';
import { TYPE, CUSTOMIZE, HTML_TAG } from './HtmlTypes';

import Utils from './Utils';

export const JSON_OBJ = {
  getJsonSchema: (obj, itemName, key, idx) => {
    obj['item_name'] = itemName;
    var type = 'string';
    const array = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.PASSWORD, TYPE.DATE, TYPE.DATETIME, TYPE.TIME, TYPE.FILE, TYPE.IMAGE, TYPE.COLOR, TYPE.DISABLE, TYPE.CHECKBOX , TYPE.LIST ];
    if(!array.includes(obj[CUSTOMIZE.TYPE])) {
      type = obj[CUSTOMIZE.TYPE];
    }
  
    var json = { type: type, title: obj[key], idx: idx, obj: obj };
    // if(!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT])) {
    //   if(obj[CUSTOMIZE.TYPE] === TYPE.FILE) {
    //     json['file_name'] = obj[CUSTOMIZE.DEFAULT];
    //   } else {
    //     json['default'] = obj[CUSTOMIZE.DEFAULT];
    //   }
    // }
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

    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX && Utils.inJson(obj, 'lists') && obj['lists'].length > 1) {
      json['type'] = 'array';
      json['uniqueItems'] = true;
      json['items'] = { type: 'string', '$ref': '#/definitions/' + itemName };
    }

    if(Utils.inJson(obj, 'lists') && (obj[CUSTOMIZE.TYPE] === TYPE.RADIO || obj[CUSTOMIZE.TYPE] === TYPE.LIST)) {
        json['$ref'] = '#/definitions/' + itemName;
        delete json['type'];
    }

    return json;
  }
  ,getJsonUi: (obj, key) => {
    // console.log(obj);
    var json = {};
    if(!Utils.isEmpty(obj[key])) {
      if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
        json['ui:help'] = obj[key];
      } else {
        json['ui:placeholder'] = obj[key];        
      }
    }
    if(!Utils.isEmpty(obj[CUSTOMIZE.BOX_WIDTH])) json['classNames'] = 'div-box div-box-' + obj[CUSTOMIZE.BOX_WIDTH];
    if(obj[CUSTOMIZE.TYPE] === TYPE.IMAGE) json['classNames'] += ' div-image-box';

    const array = [ TYPE.PASSWORD, TYPE.COLOR, TYPE.TEXTAREA, TYPE.RADIO ];
    if(array.includes(obj[CUSTOMIZE.TYPE])) {
        json['ui:widget'] = obj[CUSTOMIZE.TYPE];
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.DISABLE) {
      json['ui:disabled'] = true;
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
      if(obj['list_checked']) {
        json['classNames'] += ' not_inline';
      } else {
        json['ui:options'] = { "inline": true };
      }
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX) {
      if(Utils.inJson(obj, 'lists') && obj['lists'].length > 1) {
        if(obj['list_checked']) {
          json['ui:widget'] = 'checkboxes';
          json['ui:autofocus'] = true;
          json['classNames'] += ' not_inline';
        } else {
          json['ui:widget'] = CheckBoxInline;
        }
      } else {
        json['ui:widget'] = CheckBoxSingle;
      }
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
      json['ui:widget'] = ImageBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.TIME) {
      json['ui:widget'] = TimeBox;
    }
    // console.log(json);
    return json;
  }
  ,getDefinitions:(obj) => {
    if(obj[CUSTOMIZE.TYPE] !== TYPE.CHECKBOX && obj[CUSTOMIZE.TYPE] !== TYPE.RADIO && obj[CUSTOMIZE.TYPE] !== TYPE.LIST) return null;
    const items = Object.keys(obj['lists']).map(key => obj['lists'][key]);
    var anyOf = [];
    items.map((o) => {
      if(obj[CUSTOMIZE.TYPE] !== TYPE.RADIO) {
        anyOf.push({ type: 'string', enum: [ o['value'] ], title: o['label'] });
      } else {
        anyOf.push({ const: o['value'], title: o['label'] });
      }
    });  
    if(Utils.isEmpty(anyOf)) return null;
    if(obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
      return { type: 'string', oneOf: anyOf };
    } else {
      return { type: 'string', anyOf: anyOf };
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
  ,getEditJSONObject:(div, idx, language) => {
    var jObj = {};
    jObj[CUSTOMIZE.LANGUAGE] = language;
    jObj[CUSTOMIZE.BOX_WIDTH] = 100;
    if(div) {
      jObj[CUSTOMIZE.TYPE] = TYPE.DIV;
      jObj[CUSTOMIZE.LABEL + '_' + language] = HTML_TAG.DIV + '_' + (idx+'').padStart(2, '0');
    } else {
      jObj[CUSTOMIZE.TYPE] = TYPE.TAB;
      jObj[CUSTOMIZE.LABEL + '_' + language] = HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0');
    }
    return jObj;
  }
  ,addTempData:(obj) => {
    if(Utils.inJson(obj.data, 'reload')) {
      delete obj.data['reload']
    } else {
      obj.data['reload'] = true;
    }
  }
  ,getDafaultDivOrTab:(div, idx, jObj) => {
    if(div) {
      return {
        object_type: 'div'
        ,class_name: 'div-box-100'
        ,idx: idx
        ,object: {
          schema: {
            type: 'object',
            title: HTML_TAG.DIV + '_' + (idx+'').padStart(2, '0'),
            block: HTML_TAG.DIV,
            fIdx: idx,
            idx: 0,
            properties: {},
            definitions: {},
            obj: jObj
          },
          ui: {},
          data: {}
        }
      }
    } else {
      return {
        object_type: 'tab'
        ,active: 0
        ,idx: idx
        ,class_name: 'div-box-100'
        ,object: [
          {
            schema: {
                type: 'object',
                tab_name: HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0'),
                block: HTML_TAG.TAB,
                fIdx: idx,
                idx: 0,
                properties: {},
                definitions: {},
                obj: jObj
            },
            ui: {},
            data: {}
          }
          // ,{
          //   schema: { type: 'object', tab_name: HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0'), block: HTML_TAG.TAB, fIdx: idx, idx: 1, properties: {}, definitions: {}, obj: jObj }, ui: {}, data: {}
          // }
        ]
      }
    }
  }
};

// module.exports.objectjson = objectjson;