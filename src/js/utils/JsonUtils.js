// import React from 'react';
import ImageBox from './Compoment/ImageBox';
import TimeBox from './Compoment/TimeBox';
import CheckBox from './Compoment/CheckBox';
import RadioBox from './Compoment/RadioBox';
import SelectBox from './Compoment/SelectBox';
import TableBox from './Compoment/TableBox';
import Calendar from './Calendar';
import CalendarBox from './Compoment/CalendarBox';
import QRCodeBox from './Compoment/QRCodeBox';
import FileBox from './Compoment/FileBox';
import EditorBox from './Compoment/EditorBox';

import { TYPE, CUSTOMIZE, HTML_TAG, OPTIONS_KEY, OPTION_AUTH } from './HtmlTypes';
import Utils from './Utils';

export const JSON_OBJ = {
  getJsonSchema: (obj, itemName, idx) => {
    obj['item_name'] = itemName;
    var type = 'string';
    const array = [
      TYPE.TEXT,
      TYPE.TEXTAREA,
      TYPE.EDITOR,
      TYPE.PASSWORD,
      TYPE.DATE,
      TYPE.DATETIME,
      TYPE.TIME,
      TYPE.FILE,
      TYPE.COLOR,
      TYPE.DISABLE,
      TYPE.HIDDEN,
      TYPE.IMAGE,
      TYPE.CHECKBOX,
      TYPE.RADIO,
      TYPE.SELECT,
      TYPE.CHILDENS,
      TYPE.QRCODE ];
    if(!array.includes(obj[CUSTOMIZE.TYPE])) {
      type = obj[CUSTOMIZE.TYPE];
    }
  
    var json = { type: type, title: obj[CUSTOMIZE.LABEL][obj[CUSTOMIZE.LANGUAGE]], idx: idx, language: obj[CUSTOMIZE.LANGUAGE], obj: obj };
    if(obj[CUSTOMIZE.TYPE] === TYPE.DATETIME || obj[CUSTOMIZE.TYPE] === TYPE.DATE || obj[CUSTOMIZE.TYPE] === TYPE.TIME) {
      // json['datetime'] = (obj[CUSTOMIZE.TYPE] === TYPE.DATE)?false:true;
      json['datetype'] = obj[CUSTOMIZE.TYPE];
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.FILE) {
      json[CUSTOMIZE.MULTIPLE_FILE] = obj[CUSTOMIZE.MULTIPLE_FILE];
    }

    if(Utils.inJson(obj, OPTIONS_KEY.OPTIONS)
      && (obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO || obj[CUSTOMIZE.TYPE] === TYPE.SELECT)) {
        json[OPTIONS_KEY.OPTION_CHECKED] = obj[OPTIONS_KEY.OPTION_CHECKED];
        json[OPTIONS_KEY.OPTION_TARGET] = obj[OPTIONS_KEY.OPTION_TARGET];
        json[OPTIONS_KEY.OPTIONS] = obj[OPTIONS_KEY.OPTIONS];
        json[CUSTOMIZE.REQUIRED] = obj[CUSTOMIZE.REQUIRED];
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.QRCODE && obj[CUSTOMIZE.QRAPPLINK]) {
      json[CUSTOMIZE.QRAPPLINK] = obj[CUSTOMIZE.QRAPPLINK];
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.IMAGE && obj[CUSTOMIZE.REQUIRED]) {
      json[CUSTOMIZE.CHANGED] = obj[CUSTOMIZE.REQUIRED];
    }

    if(Utils.inJson(obj, OPTION_AUTH.AUTH)) {
      json[OPTION_AUTH.AUTH] = obj[OPTION_AUTH.AUTH];
    }

    return json;
  }
  ,getJsonUi: (obj, pl) => {
    var json = {};
    if(Utils.inJson(obj, CUSTOMIZE.PLACEHOLDER)) {
      const placeholder = obj[CUSTOMIZE.PLACEHOLDER][obj[CUSTOMIZE.LANGUAGE]];
      if(!Utils.isEmpty(placeholder)) {
        if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
          json['ui:help'] = placeholder;
        } else {
          json['ui:placeholder'] = placeholder;        
        }
      }  
    }
    let classNames = '';
    if(Utils.isNumber(pl) && pl === 1) classNames = 'hori-';
    if(!Utils.isEmpty(obj[CUSTOMIZE.BOX_WIDTH])) json['classNames'] = 'div-box div-box-' + obj[CUSTOMIZE.BOX_WIDTH];
    if(!Utils.isEmpty(obj[CUSTOMIZE.BOX_HEIGHT])) json['classNames'] += ' div-box-height-' + classNames + obj[CUSTOMIZE.BOX_HEIGHT];
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO || obj[CUSTOMIZE.TYPE] === TYPE.SELECT) {
      if(!obj[OPTIONS_KEY.OPTION_CHECKED] && obj[CUSTOMIZE.TYPE] !== TYPE.SELECT) {
        json['classNames'] += ' div-inline';
      } else {
        json['classNames'] += ' div-not-inline';
      }
    }

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
      json['classNames'] += ' div-image-box';
      json['ui:widget'] = ImageBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.DATE || obj[CUSTOMIZE.TYPE] === TYPE.DATETIME || obj[CUSTOMIZE.TYPE] === TYPE.TIME) {
      json['ui:widget'] = Calendar;
    }
    // if(obj[CUSTOMIZE.TYPE] === TYPE.TIME) {
    //   json['ui:widget'] = TimeBox;
    // }
    if(obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS) {
      // if(TYPE.CHILDENS && idx === 1) json['classNames'] += ' div-list-not-title';
      json['classNames'] += ' div-customize-table';
      json['ui:widget'] = TableBox;
    }
    if(obj[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
      json['classNames'] += ' div-cavans-box';
      json['ui:widget'] = QRCodeBox;
    }
  
    if(obj[CUSTOMIZE.TYPE] === TYPE.FILE) {
      json['ui:widget'] = FileBox;
    }

    if(obj[CUSTOMIZE.TYPE] === TYPE.EDITOR) {
      json['ui:widget'] = EditorBox;
    }

    if(!Utils.isEmpty(obj[CUSTOMIZE.MAX_LENGTH]) && !Number.isNaN(Number(obj[CUSTOMIZE.MAX_LENGTH]))) {
      json[CUSTOMIZE.MAX_LENGTH] = obj[CUSTOMIZE.MAX_LENGTH];
    }

    let style = '';
    if(!Utils.isEmpty(obj[CUSTOMIZE.LABEL_CSS])) {
      const color = obj[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.COLOR];
      if(!Utils.isEmpty(color) && color !== '#') {
        style += 'color:' + color + ';';
      }
      const layout = obj[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.LAYOUT_COLOR];
      if(!Utils.isEmpty(layout) && layout !== '#') {
        style += 'background-color:' + layout + ';';
      }
      const css = obj[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.STYLE];
      if(!Utils.isEmpty(css)) {
        style += css;
      }
      json[CUSTOMIZE.LABEL_CSS] = style;
    }

    style = '';
    if(!Utils.isEmpty(obj[CUSTOMIZE.TEXT_CSS])) {
      const color = obj[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.COLOR];
      if(!Utils.isEmpty(color) && color !== '#') {
        style += 'color:' + color + ';';
      }
      const layout = obj[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.LAYOUT_COLOR];
      if(!Utils.isEmpty(layout) && layout !== '#') {
        style += 'background-color:' + layout + ';';
      }
      const css = obj[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.STYLE];
      if(!Utils.isEmpty(css)) {
        style += css;
      }
      json[CUSTOMIZE.TEXT_CSS] = style;
    }
    // if(!Utils.isEmpty(obj[CUSTOMIZE.LABEL_COLOR]) && obj[CUSTOMIZE.LABEL_COLOR] !== '#') {
    //   style += 'color:' + obj[CUSTOMIZE.LABEL_COLOR] + ';';
    // }
    // if(!Utils.isEmpty(obj[CUSTOMIZE.LABEL_LAYOUT_COLOR]) && obj[CUSTOMIZE.LABEL_LAYOUT_COLOR] !== '#') {
    //   style += 'background-color:' + obj[CUSTOMIZE.LABEL_LAYOUT_COLOR] + ';';
    // }
    // if(!Utils.isEmpty(obj[CUSTOMIZE.STYLE])) {
    //   style += obj[CUSTOMIZE.STYLE];
    // }
    // if(!Utils.isEmpty(style)) {
    //   json['style'] = style;
    // }

    if(obj[CUSTOMIZE.REQUIRED]) {
      json[CUSTOMIZE.REQUIRED] = obj[CUSTOMIZE.REQUIRED];
    }
    console.log(json);
    return json;
  }
  ,getDefaultDatas:(obj) => {
    if((obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.SELECT)
      && (obj[OPTIONS_KEY.OPTIONS].length > 1)) {
      // && (obj[OPTIONS_KEY.OPTION_CHECKED] || obj[OPTIONS_KEY.OPTIONS].length > 1)) {
        if(obj[OPTIONS_KEY.OPTION_CHECKED]) {
          return (!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT]))?[obj[CUSTOMIZE.DEFAULT]]:[];
        } else {
          return (!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT]))?obj[CUSTOMIZE.DEFAULT]:'';
        }
    } else {
      if(obj[CUSTOMIZE.TYPE] === TYPE.FILE || obj[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
        if(obj[CUSTOMIZE.TYPE] === TYPE.FILE) {
          // return fileFormatBase64(obj);
          return obj[OPTIONS_KEY.OPTIONS_FILE];
        } else {
          return obj[OPTIONS_KEY.OPTIONS_FILE][0];
        }
      } else if(obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS) {
        return (!Utils.isEmpty(obj[TYPE.CHILDENS]) && !Number.isNaN(Number(obj[TYPE.CHILDENS])))?parseInt(obj[TYPE.CHILDENS]):obj[TYPE.CHILDENS];
      } else if(obj[CUSTOMIZE.TYPE] === TYPE.HIDDEN || obj[CUSTOMIZE.TYPE] === TYPE.DISABLE || obj[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
        var value = (!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT]))?('default=' + obj[CUSTOMIZE.DEFAULT]):'';
        if(!Number.isNaN(Number(obj[TYPE.CHILDENS])) && !Utils.isEmpty(obj[OPTIONS_KEY.OPTIONS_ITEM])) {
          var fields = '';
          if(Array.isArray(obj[OPTIONS_KEY.OPTIONS_ITEM])) {
            obj[OPTIONS_KEY.OPTIONS_ITEM].map((o, idx) => {
              if(idx === 0) {
                fields = o.toString();
              } else {
                fields += ((Utils.isEmpty(obj[OPTIONS_KEY.OPTION_REGEX]))?':':obj[OPTIONS_KEY.OPTION_REGEX]) + o.toString();
              }
            });
          } else {
            fields = obj[OPTIONS_KEY.OPTIONS_ITEM];
          }
          return (value + '&page=' + obj[TYPE.CHILDENS] + '&field=' + fields);
        } else {
          return value;
        }
      } else {
        return (!Utils.isEmpty(obj[CUSTOMIZE.DEFAULT]) && !Number.isNaN(Number(obj[CUSTOMIZE.DEFAULT])))?parseInt(obj[CUSTOMIZE.DEFAULT]):obj[CUSTOMIZE.DEFAULT];
      }
    }
  }
  ,getEditJSONObject:(div, idx, language) => {
    var jObj = {};
    jObj[CUSTOMIZE.LANGUAGE] = language;
    jObj[CUSTOMIZE.BOX_WIDTH] = 100;
    if(Utils.isEmpty(jObj[CUSTOMIZE.LABEL]))
      jObj[CUSTOMIZE.LABEL] = {}
    if(div) {
      jObj[CUSTOMIZE.TYPE] = TYPE.DIV;
      jObj[CUSTOMIZE.LABEL][language] = HTML_TAG.DIV + '_' + (idx+'').padStart(2, '0');
    } else {
      jObj[CUSTOMIZE.TYPE] = TYPE.TAB;
      jObj[CUSTOMIZE.LABEL][language] = HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0');
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
        ,object_key: 'form_'+ Utils.getUUID()
        ,className: 'div-box-100'
        ,idx: idx
        ,object: {
          schema: {
            type: 'object',
            title: HTML_TAG.DIV + '_' + (idx+'').padStart(2, '0'),
            schema_type: HTML_TAG.DIV,
            schema_key: 'schema_'+ Utils.getUUID(),
            form_idx: idx,
            idx: 0,
            properties: {},
            // definitions: {},
            // requireds: [],
            obj: jObj
          },
          ui: {},
          data: {}
        }
      }
    } else {
      return {
        object_type: 'tab'
        ,object_key: 'form_'+ Utils.getUUID()
        ,active: 0
        ,idx: idx
        ,className: 'div-box-100'
        ,object: [
          {
            schema: {
                type: 'object',
                tab_name: HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0'),
                schema_type: HTML_TAG.TAB,
                schema_key: 'schema_'+ Utils.getUUID(),
                form_idx: idx,
                idx: 0,
                properties: {},
                // definitions: {},
                // requireds: [],
                obj: jObj
            },
            ui: {},
            data: {}
          }
          // ,{
          //   schema: { type: 'object', tab_name: HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0'), schema_type: HTML_TAG.TAB, form_idx: idx, idx: 1, properties: {}, definitions: {}, obj: jObj }, ui: {}, data: {}
          // }
        ]
      }
    }
  }
  ,getTabJson:(form_idx, idx, jObj) => {
    return {
      schema: {
          type: 'object',
          tab_name: HTML_TAG.TAB + '_' + (idx+'').padStart(2, '0'),
          schema_type: HTML_TAG.TAB,
          schema_key: 'schema_'+ Utils.getUUID(),
          form_idx: form_idx,
          idx: idx,
          properties: {},
          // definitions: {},
          // requireds: [],
          obj: jObj
      },
      ui: {},
      data: {}
    }
  }
};
