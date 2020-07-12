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

import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';
import Msg from '../../msg/Msg';
import { HTML_TAG, CUSTOMIZE, TYPE, MOUSE } from '../utils/HtmlTypes';
import { PAGE_ACTION, ACTION, SYSTEM, VARIANT_TYPES } from '../utils/Types';

class Create extends C {
  constructor(props) {
    super(props);

    this._onClickBack = this._onClickBack.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onUpdateFormData = this._onUpdateFormData.bind(this);
    this._onError = this._onError.bind(this);
    this._onRequiredOrValidate = this._onRequiredOrValidate.bind(this);
    this._onResetClick = this._onResetClick.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,options: this.props.options
      ,alertActions: { show: false, style: {} }
      ,overObject: null
      ,isValidate: true
      ,form: []
    }
  };

  componentWillMount(){
    console.log("Data submitted: ", this.props.onUpdateStateIsUser);
    this.state.form = [
      {
        "object_type": "div",
        "object_key": "page_qkornt3vme",
        "class_name": "div-box-100",
        "idx": 0,
        "object": {
          "schema": {
            "type": "object",
            "title": "DIV_00",
            "block": "DIV",
            "fIdx": 0,
            "idx": 0,
            "properties": {
              "text_0tzpo5qw47": {
                "type": "string",
                "title": "Text",
                "idx": 1,
                "obj": {
                  "label_ja": "Text",
                  "placeholder_ja": "Placeholder",
                  "item_type": "text",
                  "language": "ja",
                  "label_color": "#a65e5e",
                  "label_layout_color": "#349698",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "デフォルト",
                  "max_length": "30",
                  "required": true,
                  "item_name": "text_0tzpo5qw47"
                }
              }
            },
            "definitions": {},
            "requireds": [
              {
                "item_name": "text_0tzpo5qw47",
                "label_ja": "Text"
              }
            ],
            "obj": {
              "language": "ja",
              "box_width": 100,
              "label_ja": "DIV_00"
            }
          },
          "ui": {
            "text_0tzpo5qw47": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "max_length": "30",
              "style": "color:#a65e5e;background-color:#349698;",
              "required": true
            },
            "hidden_form_reload": {
              "ui:widget": "hidden"
            }
          },
          "data": {
            "text_0tzpo5qw47": "デフォルト"
          }
        }
      }
    ]

    this._onSortForms();
  }

  _onSortForms() {
    var forms = this.state.form;
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
    const uiKeys = Object.keys(ui);
    const targets = [ TYPE.IMAGE, TYPE.TIME, TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT ];
    uiKeys.map((o) => {
      const field = o.split('_')[0];
      if(!Utils.isEmpty(field) && (targets.includes(field))) {
        if(field === TYPE.IMAGE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = ImageBox;
        if(field === TYPE.TIME && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TimeBox;
        if(field === TYPE.RADIO && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = RadioBox;
        if(field === TYPE.CHECKBOX && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = CheckBox;
        if(field === TYPE.SELECT && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = SelectBox;
      }
    });
  }

  _onClickBack() {
    this.state.isUser.path = ACTION.SLASH + ACTION.LIST;
    const auth = { info: this.state.isUser, options: this.state.options };
    this.props.onUpdateStateIsUser(auth);
    // this.props.history.push(ACTION.SLASH + ACTION.LIST);
    // this.forceUpdate();
  }

  _onClickSubmit() {
    this._onRequiredOrValidate(false);
    if(this.state.isValidate) return

    console.log("Data submitted: ", this.state.formData);
    this._onClickBack();
  }

  _onUpdateFormData(e) {
    if(!Utils.inJson(e, 'schema') || !Utils.inJson(e, 'formData')) return;
    console.log(e);
    const fIdx = e.schema.fIdx;
    const idx = e.schema.idx;
    if(e.schema.block === HTML_TAG.DIV) {
      this.state.form[fIdx].object.data = e.formData;
    }
    if(e.schema.block === HTML_TAG.TAB) {
      this.state.form[fIdx].object[idx].data = e.formData;
    }
  }

  _onError(errors) {
    console.log("I have", errors.length, "errors to fix");
  }

  _addRequiredOrErrorMsgToDom(requireds, required) {
    var objs = Object.keys(requireds);
    if(!Array.isArray(objs) || objs.length <= 0) return;
    const targets = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.NUMBER ];
    objs.map((o) => {
      const field = o;
      const type = field.split('_')[0];
      const obj = requireds[o];
      if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
        || (Utils.inJson(obj, CUSTOMIZE.STYLE) && !Utils.isEmpty([CUSTOMIZE.STYLE]))) {

        const root = document.getElementById('root_' + field);
        if(!Utils.isEmpty(root)) {
          const div = root.parentElement;
          var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
          if(!Utils.isEmpty(root) && !Utils.isEmpty(root.parentElement)) {
            if(Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED]) {
              const label = l.innerHTML;
              if(!required) {
                var msg = '';
                if(targets.includes(type)) {
                  msg = label + Msg.getMsg(null, this.state.isUser.language, 'required');
                } else {
                  msg = label + Msg.getMsg(null, this.state.isUser.language, 'selected');
                }
                l.innerHTML = "<font class='required'>" + msg + "</font>";
                setTimeout(function() {
                  l.innerHTML = label;
                }, 3000);
              } else {
                l.innerHTML = label + "<font class='required'>*</font>";
              }
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
  //             }, 3000);
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

  _onValidate() {
    this.state.form.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.map((obj) => {
          if(Utils.inJson(obj.schema, 'requireds'))
            this._addRequiredOrErrorMsgToDom(obj.schema['requireds'], false);
        });
      } else {
        if(Utils.inJson(objs.schema, 'requireds'))
          this._addRequiredOrErrorMsgToDom(objs.schema['requireds'],false);
      }
    });
  }

  _onRequiredOrValidate(required) {
    this.state.form.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.map((obj) => {
          // if(Utils.inJson(obj.ui, 'requireds'))
          //   this._addRequiredOrErrorMsgToDom(obj.schema['requireds'], required);
          this._addRequiredOrErrorMsgToDom(obj.ui, required);
        });
      } else {
        // if(Utils.inJson(objs.schema, 'requireds'))
        //   this._addRequiredOrErrorMsgToDom(objs.schema['requireds'],required);
        this._addRequiredOrErrorMsgToDom(objs.ui,required);
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
    const fIdx = div.id.split('_')[2];
    const nav = div.childNodes[0];
    var object = null;
    if(nav.tagName === HTML_TAG.NAV) {
      object = this.state.form[fIdx].object[Html.getIdxTabSelected(nav)];
    } else {
      object = this.state.form[fIdx].object;
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
      if(isArray) {
        object.data[field] = [];
      } else {
        object.data[field] = '';
      }
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
    this.state.alertActions.style = { top: obj.offsetTop, left : (obj.offsetLeft + obj.offsetWidth) - 30 };
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
      const obj = o.childNodes[0].childNodes[0].childNodes[0];
      if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.FIELDSET) {
        const objs = Array.from(obj.childNodes);
        objs.map((d) => {
          if(d.tagName === HTML_TAG.DIV) {
            const l = d.getElementsByTagName(HTML_TAG.LABEL)[0];
            if(!Utils.isEmpty(l.getAttribute('for'))) {
              var type = l.getAttribute('for').replace('root_', '');
              type = type.split('_')[0];
              if(!Utils.isEmpty(l) && type !== TYPE.IMAGE && type !== TYPE.DISABLE)
                l.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);    
            }
          }
        });
      }
    });
  }
  
  componentDidMount() {
    this._onRequiredOrValidate(true);
    this._onFindFields();
  }

  render() {
    this.state.isUser.actions = PAGE_ACTION.CREATE;

    return (
      <div>
        { this._onResetButtons() }
        <CForm
          isUser={ this.state.isUser }
          form={ this.state.form }
          updateFormData={ this._onUpdateFormData.bind(this) } />
        <Actions
          isUser={ this.state.isUser }
          onClickBack={ this._onClickBack.bind(this) }
          onClickSubmit={ this._onClickSubmit.bind(this) } />
      </div>
    )

  };
};

export default connect()(withRouter(Create));