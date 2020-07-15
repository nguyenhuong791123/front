// import React from 'react';
import ImageBox from './Compoment/ImageBox';
import TimeBox from './Compoment/TimeBox';
import CheckBox from './Compoment/CheckBox';
import RadioBox from './Compoment/RadioBox';
import SelectBox from './Compoment/SelectBox';
import TableBox from './Compoment/TableBox';

// import CheckBoxSingle from './Compoment/CheckBoxSingle';
// import CheckBoxInline from './Compoment/CheckBoxInline';
import Html from '../utils/HtmlUtils'
import { TYPE, CUSTOMIZE, HTML_TAG, OPTIONS_KEY } from './HtmlTypes';

import Utils from './Utils';

export const JSON_OBJ = {
  // getRequiredItem:(obj, itemName, requireds) => {
  //   var reqs = requireds;
  //   if(obj[CUSTOMIZE.REQUIRED]) {
  //     const errorMsg = { item_name: itemName };
  //     const objs = Html.getLanguages();
  //     objs.map((o) => {
  //       errorMsg[CUSTOMIZE.LABEL + '_' + o] = obj[CUSTOMIZE.LABEL + '_' + o];
  //     });
  //     if(!Utils.inArray(reqs, itemName)) reqs.push(errorMsg);
  //   } else {
  //     if(Utils.inArray(reqs, itemName)) reqs.splice(reqs.indexOf(itemName), 1);
  //   }
  //   return reqs;
  // },
  getJsonSchema: (obj, itemName, key, idx) => {
    obj['item_name'] = itemName;
    var type = 'string';
    const array = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.PASSWORD, TYPE.DATE, TYPE.DATETIME, TYPE.TIME, TYPE.FILE, TYPE.COLOR, TYPE.DISABLE, TYPE.HIDDEN, TYPE.IMAGE, TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT, TYPE.CHILDENS ];
    if(!array.includes(obj[CUSTOMIZE.TYPE])) {
      type = obj[CUSTOMIZE.TYPE];
    }
  
    var json = { type: type, title: obj[key], idx: idx, language: obj['language'], obj: obj };
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

    if(Utils.inJson(obj, OPTIONS_KEY.OPTIONS)
      && (obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO || obj[CUSTOMIZE.TYPE] === TYPE.SELECT)) {
        json[OPTIONS_KEY.OPTION_CHECKED] = obj[OPTIONS_KEY.OPTION_CHECKED];
        json[OPTIONS_KEY.OPTION_TARGET] = obj[OPTIONS_KEY.OPTION_TARGET];
        json[OPTIONS_KEY.OPTIONS] = obj[OPTIONS_KEY.OPTIONS];
        json[CUSTOMIZE.REQUIRED] = obj[CUSTOMIZE.REQUIRED];
    }

    // if([ TYPE.IMAGE, TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT ].includes(type)) {
    //   delete json['type']; 
    // }

    return json;
  }
  ,getJsonUi: (obj, key, idx) => {
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
    if(!Utils.isEmpty(obj[CUSTOMIZE.BOX_HEIGHT])) json['classNames'] += ' div-box-height-' + obj[CUSTOMIZE.BOX_HEIGHT];
    if(obj[CUSTOMIZE.TYPE] === TYPE.IMAGE) json['classNames'] += ' div-image-box';
    if(obj[CUSTOMIZE.TYPE] === TYPE.FILE) json['classNames'] += ' div-file-box';
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO || obj[CUSTOMIZE.TYPE] === TYPE.SELECT) {
      if(!obj[OPTIONS_KEY.OPTION_CHECKED] && obj[CUSTOMIZE.TYPE] !== TYPE.SELECT) {
        json['classNames'] += ' div-inline';
      } else {
        json['classNames'] += ' div-not-inline';
      }
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS && idx === 1) json['classNames'] += ' div-list-not-titile';

    const array = [ TYPE.PASSWORD, TYPE.COLOR, TYPE.TEXTAREA, TYPE.RADIO ];
    if(array.includes(obj[CUSTOMIZE.TYPE])) {
        json['ui:widget'] = obj[CUSTOMIZE.TYPE];
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.HIDDEN) {
      json['ui:widget'] = 'hidden';
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.DISABLE) {
      json['ui:disabled'] = true;
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX) {
      if(obj[OPTIONS_KEY.OPTION_CHECKED]) {
        json['classNames'] += ' div-not-inline';
      }
      json['ui:widget'] = CheckBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
      json['ui:widget'] = RadioBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.SELECT) {
      json['ui:widget'] = SelectBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
      json['ui:widget'] = ImageBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.TIME) {
      json['ui:widget'] = TimeBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS) {
      json['classNames'] += ' div-customize-table';
      json['ui:widget'] = TableBox;
    }
  
    if(!Utils.isEmpty(obj[CUSTOMIZE.MAX_LENGTH]) && !Number.isNaN(Number(obj[CUSTOMIZE.MAX_LENGTH]))) {
      json[CUSTOMIZE.MAX_LENGTH] = obj[CUSTOMIZE.MAX_LENGTH];
    }

    var style = '';
    if(!Utils.isEmpty(obj[CUSTOMIZE.LABEL_COLOR]) && obj[CUSTOMIZE.LABEL_COLOR] !== '#') {
      style += 'color:' + obj[CUSTOMIZE.LABEL_COLOR] + ';';
    }
    if(!Utils.isEmpty(obj[CUSTOMIZE.LABEL_LAYOUT_COLOR]) && obj[CUSTOMIZE.LABEL_LAYOUT_COLOR] !== '#') {
      style += 'background-color:' + obj[CUSTOMIZE.LABEL_LAYOUT_COLOR] + ';';
    }
    if(!Utils.isEmpty(obj[CUSTOMIZE.STYLE])) {
      style += obj[CUSTOMIZE.STYLE];
    }
    if(!Utils.isEmpty(style)) {
      json['style'] = style;
    }

    if(obj[CUSTOMIZE.REQUIRED]) {
      json[CUSTOMIZE.REQUIRED] = obj[CUSTOMIZE.REQUIRED];
    }
    console.log(json);
    return json;
  }
  // ,getDefinitions:(obj) => {
  //   if(obj[CUSTOMIZE.TYPE] !== TYPE.CHECKBOX && obj[CUSTOMIZE.TYPE] !== TYPE.RADIO && obj[CUSTOMIZE.TYPE] !== TYPE.SELECT) return null;
  //   const items = Object.keys(obj[OPTIONS_KEY.OPTIONS]).map(key => obj[OPTIONS_KEY.OPTIONS][key]);
  //   var anyOf = [];
  //   items.map((o) => {
  //     if(obj[CUSTOMIZE.TYPE] !== TYPE.RADIO) {
  //       anyOf.push({ type: 'string', enum: [ o['value'] ], title: o['label'] });
  //     } else {
  //       anyOf.push({ const: o['value'], title: o['label'] });
  //     }
  //   });  
  //   if(Utils.isEmpty(anyOf)) return null;
  //   if(obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
  //     return { type: 'string', oneOf: anyOf };
  //   } else {
  //     return { type: 'string', anyOf: anyOf };
  //   }
  // }
  ,getDefaultDatas:(obj) => {
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX && (obj[OPTIONS_KEY.OPTION_CHECKED] || obj[OPTIONS_KEY.OPTIONS].length > 1)) {
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
      } else if(obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS) {
        return (!Utils.isEmpty(obj[TYPE.CHILDENS]) && !Number.isNaN(Number(obj[TYPE.CHILDENS])))?parseInt(obj[TYPE.CHILDENS]):obj[TYPE.CHILDENS];
      } else {
        return (!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT]) && !Number.isNaN(Number(obj[CUSTOMIZE.DEFAULT])))?parseInt(obj[CUSTOMIZE.DEFAULT]):obj[CUSTOMIZE.DEFAULT];
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
  ,addHiddenFieldFormReload:(obj) => {
    if(Utils.inJson(obj.schema.properties, 'hidden_form_reload')) {
      delete obj.schema.properties['hidden_form_reload'];
      delete obj.ui['hidden_form_reload'];
      delete obj.data['hidden_form_reload'];
    } else {
      obj.schema.properties['hidden_form_reload'] = { 'type': 'string' };
      obj.ui['hidden_form_reload'] = { 'ui:widget': 'hidden'};
      obj.data['hidden_form_reload'] = true;
    }
  }
  ,getDafaultDivOrTab:(isDiv, idx, jObj) => {
    if(isDiv) {
      return {
        object_type: 'div'
        ,object_key: 'page_'+ Math.random().toString(36).slice(-10)
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
            requireds: [],
            obj: jObj
          },
          ui: {},
          data: {}
        }
      }
    } else {
      return {
        object_type: 'tab'
        ,object_key: 'page_'+ Math.random().toString(36).slice(-10)
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
                // definitions: {},
                requireds: [],
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
  ,getTabJson:(fIdx, idx, jObj) => {
    return {
      schema: {
          type: 'object',
          tab_name: HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0'),
          block: HTML_TAG.TAB,
          fIdx: fIdx,
          idx: idx,
          properties: {},
          // definitions: {},
          requireds: [],
          obj: jObj
      },
      ui: {},
      data: {}
    }
  }
};

// module.exports.objectjson = objectjson;