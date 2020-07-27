import React, { Component as C } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import Actions from '../utils/Actions';
import CForm from '../utils/CForm';
import ImageBox from '../utils/Compoment/ImageBox';
import TimeBox from '../utils/Compoment/TimeBox';
import RadioBox from '../utils/Compoment/RadioBox';
import CheckBox from '../utils/Compoment/CheckBox';
import SelectBox from '../utils/Compoment/SelectBox';
import TableBox from '../utils/Compoment/TableBox';
import QRCodeBox from '../utils/Compoment/QRCodeBox';
import FileBox from '../utils/Compoment/FileBox';
import InputCalendarBox from '../utils/Compoment/CalendarBox';
import EditorBox from '../utils/Compoment/EditorBox';

import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';
import StringUtil from 'util';
import Msg from '../../msg/Msg';
import { HTML_TAG, CUSTOMIZE, TYPE, MOUSE } from '../utils/HtmlTypes';
import { PAGE_ACTION, ACTION, SYSTEM, VARIANT_TYPES, MSG_TYPE } from '../utils/Types';

class Create extends C {
  constructor(props) {
    super(props);

    this._onClickBack = this._onClickBack.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onUpdateFormData = this._onUpdateFormData.bind(this);
    this._onError = this._onError.bind(this);
    this._onResetClick = this._onResetClick.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,options: this.props.options
      ,alertActions: { show: false, style: {} }
      ,overObject: null
      ,isValidate: true
      ,page: {}
    }
  };

  UNSAFE_componentWillMount(){
    console.log("Data submitted: ", this.props.onUpdateStateIsUser);
    this.state.page = {
      "page_id": 1,
      "page_name": "Create",
      "page_mode": 0,
      "form": [
        {
          "page_id": 1,
          "object_type": "tab",
          "object_key": "form_0.gw6yqa642dq",
          "className": "div-box-100",
          "idx": 0,
          "object": [
            {
              "schema_id": 1,
              "schema": {
                "idx": 0,
                "type": "object",
                "tab_name": "DIV_00",
                "box_type": "TAB",
                "form_idx": 0,
                "properties": {
                  "text_0.xtadqn6yuz": {
                    "idx": 1,
                    "type": "string",
                    "title": "dd",
                    "language": "ja"
                  }
                }
              },
              "ui": {
                "text_0.xtadqn6yuz": {
                  "classNames": "div-box div-box-25 div-box-height-80"
                }
              },
              "data": {
                "text_0.xtadqn6yuz": "aaaaa"
              }
            }
          ]
        }
      ]
    }

    this._onSortForms();
  }

  _onFormatJson(obj) {
    if(Utils.isEmpty(obj) || !Array.isArray(obj)) return;
    var objs = {};
    obj.map((o) => {
      Object.keys(o).map((k) => { objs[k] = o[k] });
    });
    return objs;
  }

  _onSortForms() {
    var forms = this.state.page.form;
    console.log(forms);
    forms.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        return objs.map((obj) => {
          // this._formatUiWidget(obj.ui, obj.schema.definitions);  
          this._formatUiWidget(obj.ui);  
          var lists = Object.keys(obj.schema.properties).map((o) => { 
            return { key: o, obj: obj.schema.properties[o] };
          });
          lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
          var properties = {};
          for(let i=0; i<lists.length; i++) {
            properties[lists[i].key] = lists[i].obj;
          }
          obj.schema.properties = properties;
          return obj;
        });
      } else {
        this._formatUiWidget(objs.ui);
        var lists = Object.keys(objs.schema.properties).map((o) => { 
          return { key: o, obj: objs.schema.properties[o] };
        });
        lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
        var properties = {};
        for(let i=0; i<lists.length; i++) {
          properties[lists[i].key] = lists[i].obj;
        }
        objs.schema.properties = properties;
        return objs;
      }
    });
    forms.sort((a, b) => ((a.idx > b.idx)?1:-1));
  }

  _formatUiWidget(ui) {
    if(Utils.isEmpty(ui)) return;
    const uiKeys = Object.keys(ui);
    const targets = [ TYPE.IMAGE, TYPE.TIME, TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT, TYPE.CHILDENS, TYPE.DATE, TYPE.DATETIME, TYPE.QRCODE, TYPE.FILE, TYPE.EDITOR ];
    uiKeys.map((o) => {
      const field = o.split('_')[0];
      if(!Utils.isEmpty(field) && (targets.includes(field))) {
        if(field === TYPE.IMAGE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = ImageBox;
        if(field === TYPE.TIME && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TimeBox;
        if(field === TYPE.RADIO && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = RadioBox;
        if(field === TYPE.CHECKBOX && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = CheckBox;
        if(field === TYPE.SELECT && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = SelectBox;
        if(field === TYPE.CHILDENS && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TableBox;
        if(field === TYPE.QRCODE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = QRCodeBox;
        if(field === TYPE.FILE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = FileBox;  
        if((field === TYPE.DATE || field === TYPE.DATETIME) && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = InputCalendarBox;
        if(field === TYPE.EDITOR && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = EditorBox;  
      }
    });
  }

  _onClickBack() {
    this.state.isUser.path = ACTION.SLASH + ACTION.LIST;
    // const auth = { info: this.state.isUser, options: this.state.options };
    // this.props.onUpdateStateIsUser(auth);
    this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    // this.props.history.push(ACTION.SLASH + ACTION.LIST);
    // this.forceUpdate();
  }

  _onClickSubmit() {
    this._onFormValidate();
    if(this.state.isValidate) return

    console.log("Data submitted: ", this.state.page.formData);
    this._onClickBack();
  }

  _onUpdateFormData(e) {
    if(!Utils.inJson(e, 'schema') || !Utils.inJson(e, 'formData')) return;
    console.log(e);
    const fidx = e.schema.form_idx;
    const idx = e.schema.idx;
    var form = this.state.page.form;
    if(e.schema.box_type === HTML_TAG.DIV) {
      form[fidx].object.data = e.formData;
    }
    if(e.schema.box_type === HTML_TAG.TAB) {
      form[fidx].object[idx].data = e.formData;
    }
    this.setState({ form });
    // this.forceUpdate();
  }

  _onError(errors) {
    console.log("I have", errors.length, "errors to fix");
  }

  _onCheckValidate(object) {
    var objs = Object.keys(object.ui);
    if(!Array.isArray(objs) || objs.length <= 0) return;
    const targets = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.NUMBER ];
    objs.map((o) => {
      const field = o;
      const type = field.split('_')[0];
      const obj = object.ui[o];
      if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
        || (Utils.inJson(obj, CUSTOMIZE.MAX_LENGTH) && !Utils.isEmpty(obj[CUSTOMIZE.MAX_LENGTH]))) {

        const root = document.getElementById('root_' + field);
        if(!Utils.isEmpty(root)) {
          const div = root.parentElement;
          var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
          if(!Utils.isEmpty(root) && !Utils.isEmpty(root.parentElement)) {
            if(!Utils.isEmpty(l) && l.tagName === HTML_TAG.LABEL) {
              const label = l.innerHTML;
              const value = object.data[field];
              var error = null;
              const rIdx = label.indexOf('<font');
              error = (rIdx > 0)?label.substr(0, rIdx):label;
              var viewError = false;
              if(Utils.inJson(obj, CUSTOMIZE.REQUIRED)
                && obj[CUSTOMIZE.REQUIRED]
                && Utils.isEmpty(value)) {
                if(targets.includes(type)) {
                  error += Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'required');
                } else {
                  error += Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'selected');
                }
                viewError = true;
              } else if(Utils.inJson(obj, CUSTOMIZE.MAX_LENGTH)
                        && !Utils.isEmpty(value)
                        && value.length > obj[CUSTOMIZE.MAX_LENGTH]) {
                  error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'max_length'), error, obj[CUSTOMIZE.MAX_LENGTH], (value.length - obj[CUSTOMIZE.MAX_LENGTH]));
                  viewError = true;
              }
              if(!Utils.isEmpty(error) && viewError) {
                l.innerHTML = "<font class='required'>" + error + "</font>";
                setTimeout(function() {
                  l.innerHTML = label;
                }, 2000);  
              }
            }
          }
        }
      }
    });
  }

  _onAddAttribute(object) {
    var objs = Object.keys(object.ui);
    if(Utils.isEmpty(objs) || !Array.isArray(objs) || objs.length <= 0) return;
    objs.map((o) => {
      const field = o;
      const obj = object.ui[o];
      if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
        || (Utils.inJson(obj, CUSTOMIZE.STYLE) && !Utils.isEmpty(obj[CUSTOMIZE.STYLE]))) {

        const root = document.getElementById('root_' + field);
        if(!Utils.isEmpty(root)) {
          var div = root.parentElement;
          var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
          if(field.split('_')[0] === TYPE.FILE) {
            div = root.parentElement.parentElement.parentElement;
            l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
          }
          if(!Utils.isEmpty(l) && !Utils.isEmpty(div)) {
            if(Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED]) {
              const label = l.innerHTML;
              l.innerHTML = label + "<font class='required'>*</font>";
            }
            if(Utils.inJson(obj, CUSTOMIZE.STYLE) && !Utils.isEmpty(obj[CUSTOMIZE.STYLE])) {
              l.setAttribute('style', obj[CUSTOMIZE.STYLE]);
            }
          }  
        }
      }
    });
  }

  // _addRequiredOrErrorMsgToDom(requireds, required) {
  //   if(!Array.isArray(requireds) || requireds.length <= 0) return;
  //   const targets = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.NUMBER ];
  //   requireds.map((o) => {
  //     const field = o['item_name'];
  //     const type = field.split('_')[0];
  //     if((Utils.inJson(o, CUSTOMIZE.REQUIRED) && o[CUSTOMIZE.REQUIRED])
  //       || (Utils.inJson(o, CUSTOMIZE.STYLE) && !Utils.isEmpty(o[CUSTOMIZE.STYLE]))) {

  //       const root = document.getElementById('root_' + field);
  //       const div = root.parentElement;
  //       var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
  //       if(!Utils.isEmpty(root) && !Utils.isEmpty(root.parentElement)) {
  //         if(Utils.inJson(o, CUSTOMIZE.REQUIRED) && o[CUSTOMIZE.REQUIRED]) {
  //           const label = l.innerHTML;
  //           if(!required) {
  //             var msg = '';
  //             if(targets.includes(type)) {
  //               msg = label + Msg.getMsg(null, this.state.isUser.language, 'required');
  //               // msg = o[CUSTOMIZE.LABEL + '_' + this.state.isUser.language] + Msg.getMsg(null, this.state.isUser.language, 'required');
  //             } else {
  //               msg = label + Msg.getMsg(null, this.state.isUser.language, 'selected');
  //               // msg = o[CUSTOMIZE.LABEL + '_' + this.state.isUser.language] + Msg.getMsg(null, this.state.isUser.language, 'selected');
  //             }
  //             l.innerHTML = "<font class='required'>" + msg + "</font>";
  //             setTimeout(function() {
  //               l.innerHTML = label;
  //             }, 2000);
  //           } else {
  //             l.innerHTML = label + "<font class='required'>*</font>";
  //           }
  //         }
  //         if(Utils.inJson(o, CUSTOMIZE.STYLE) && !Utils.isEmpty(o[CUSTOMIZE.STYLE])) {
  //           l.setAttribute('style', o[CUSTOMIZE.STYLE]);
  //         }
  //       }
  //     }
  //   });
  // }

  _onFormValidate() {
    this.state.page.form.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.map((obj) => {
          this._onCheckValidate(obj);
        });
      } else {
        this._onCheckValidate(objs);
      }
    });
  }

  _onFormAddAttribute() {
    this.state.page.form.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.map((obj) => {
          this._onAddAttribute(obj);
        });
      } else {
        this._onAddAttribute(objs);
      }
    });
  }

  _onResetButtons() {
    return(
        <Alert
          show={ this.state.alertActions.show }
          variant={ VARIANT_TYPES.LIGHT }
          style={ this.state.alertActions.style }
          className={ 'div-customize-actions div-customize-actions-child' }>

        <Button
          type={ HTML_TAG.BUTTON }
          className={ 'btn-hidden' }
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onResetClick.bind(this) }
          variant={ VARIANT_TYPES.SECONDARY }>
          <FaTimes />
        </Button>
      </Alert>
    );
  }

  _onResetClick() {
    const obj = this.state.overObject;
    if(Utils.isEmpty(obj)) return;
    const div = Html.getDivParent(obj);
    if(Utils.isEmpty(div) || Utils.isEmpty(div.id)) return;
    const form_idx = div.id.split('_')[2];
    const nav = div.childNodes[0];
    var object = null;
    if(nav.tagName === HTML_TAG.NAV) {
      object = this.state.page.form[form_idx].object[Html.getIdxTabSelected(nav)];
    } else {
      object = this.state.page.form[form_idx].object;
    }
    if(Utils.isEmpty(object)) return;
    var objs = Array.from(obj.parentElement.childNodes);
    if(Utils.isEmpty(objs) || obj.length < 2) return;
    const target = objs[0];
    if(Utils.isEmpty(target) && Utils.isEmpty(target.getAttribute('for'))) return;
    const field = target.getAttribute('for').replace('root_', '');
    if(Utils.isEmpty(field)) return;
    const type = field.split('_')[0];
    if(type === TYPE.CHECKBOX || type === TYPE.FILE) {
      var p = objs[1].childNodes[0];
      var isArray = false;
      if(p.tagName === HTML_TAG.DIV) isArray = (objs[1].childNodes.length > 1);
      if(type === TYPE.FILE && !isArray) {
        const input = objs[1].childNodes[0].getElementsByTagName(HTML_TAG.INPUT)[0];
        input.value = '';
        if(!Utils.isEmpty(input)) isArray = input.multiple;
      }
      if(isArray && type === TYPE.CHECKBOX) {
        object.data[field] = [];
      } else {
        object.data[field] = '';
      }
    } else if(type === TYPE.CHILDENS) {
      const key = target.getAttribute('for');
      const div = document.getElementById(key);
      if(Utils.isEmpty(div) || Array.from(div.childNodes).length < 2) return;
      const headers = div.childNodes[1];
      if(Utils.isEmpty(headers) || Utils.isEmpty(headers.id) || headers.id.indexOf(key) === -1) return;
      const tr = headers.childNodes[0].getElementsByTagName(HTML_TAG.TR)[0];
      if(Utils.isEmpty(tr)) return;
      const ths = Array.from(tr.childNodes);
      ths.map((o) => {
        const obj = o.childNodes[0];
        if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.INPUT) {
          if(obj.getAttribute('type') === TYPE.CHECKBOX && obj.checked) {
            // obj.checked = false;
            obj.click();
          } else {
            obj.value = '';
          }
        }
      });
    } else {
      object.data[field] = '';
    }
    this.state.overObject = null;
    this.forceUpdate();
  }

  _onMouseOver(e) {
    const obj = e.target;
    const attr = obj.getAttribute('for');
    if(Utils.isEmpty(attr)) return;
    obj.addEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    this.state.overObject = obj;
    const pos = obj.getBoundingClientRect();
    this.state.alertActions.style = { top: (pos.y - 45), left : (pos.x + pos.width) - 35, zIndex: 1 };
    this.state.alertActions.show = true;
    this.forceUpdate();
  }

  _onMouseOut(e) {
    const obj = Html.getButton(e);
    if(!Utils.isEmpty(obj.className) && obj.className.startsWith('form-')) return;
    if(obj.tagName === HTML_TAG.BUTTON && obj.className.indexOf('btn-hidden') !== -1) {
      this.state.alertActions.show = true;
    } else {
      this.state.alertActions.show = false;
    }
    if(!Utils.isEmpty(this.state.overObject)) {
      this.state.overObject.removeEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    }
    this.forceUpdate();
  }

  _onFindFields() {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    const childs = Array.from(div.childNodes);
    childs.map((o) => {
      var obj = o.childNodes[0];
      if(obj.tagName === HTML_TAG.NAV) {
        const tabs = Array.from(o.childNodes[1].childNodes);
        tabs.map((t) => {
          obj = t.childNodes[0].childNodes[0].childNodes[0];
          this._onSetMouseOver(obj);
        });
      } else {
        obj = o.childNodes[0].childNodes[0].childNodes[0];
        this._onSetMouseOver(obj);
      }
    });
  }

  _onSetMouseOver(obj) {
    if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.FIELDSET) return;
    const objs = Array.from(obj.childNodes);
    objs.map((d) => {
      if(d.tagName === HTML_TAG.DIV) {
        const l = d.getElementsByTagName(HTML_TAG.LABEL)[0];
        if(!Utils.isEmpty(l.getAttribute('for'))) {
          var type = l.getAttribute('for').replace('root_', '');
          type = type.split('_')[0];
          if(!Utils.isEmpty(l) && type !== TYPE.IMAGE && type !== TYPE.DISABLE && type !== TYPE.QRCODE)
            l.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);    
        }
      }
    });
  }
  
  componentDidMount() {
    this._onFormAddAttribute();
    this._onFindFields();
  }

  render() {
    var labelKey = 'bt_create';
    const pageMode = this.state.page['page_mode'];
    if(Utils.isEmpty(pageMode) || pageMode === 0) {
      this.state.isUser.actions = PAGE_ACTION.CREATE;
    } else {
      labelKey = 'bt_edit';
      this.state.isUser.actions = PAGE_ACTION.CREATE;
      this.state.isUser.actions.create = false;
    }

    return (
      <div className={ 'div-list-box' }>
        { this._onResetButtons() }
        <Actions
            isUser={ this.state.isUser }
            onClickBack={ this._onClickBack.bind(this) }
            onClickSubmit={ this._onClickSubmit.bind(this) } />
        <div className="div-title-box">
          {/* <h5>{ this.state.isUser.path + '/' + this.state.isUser.action }</h5> */}
          <h5>{ this.state.page.page_name  + '/' + Msg.getMsg(null, this.state.isUser.language, labelKey) }</h5>
        </div>

        <CForm
          isUser={ this.state.isUser }
          form={ this.state.page.form }
          updateFormData={ this._onUpdateFormData.bind(this) } />
      </div>
    )

  };
};

export default connect()(withRouter(Create));