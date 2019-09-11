
import React, { Component as C } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Form from "react-jsonschema-form-bs4";
import { Alert, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaReply } from 'react-icons/fa';

import Actions from '../utils/Actions';
import { ACTION, HTML_TAG, VARIANT_TYPES } from '../utils/Types';
import { DRAG, MOUSE } from '../utils/HtmlTypes';
import Html from '../utils/HtmlUtils'
import Utils from '../utils/Utils';

// import GetMsg from '../../msg/Msg';

class Customize extends C {
  constructor(props) {
    super(props);

    this._onClickReturn = this._onClickReturn.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onError = this._onError.bind(this);
    this._onValidate = this._onValidate.bind(this);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDragDrop = this._onDragDrop.bind(this);

    this._onClickDelete = this._onClickDelete.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,alertActions: { show: false, class: '', style: {} }
      ,alertDelete: { show: false, msg: '', class: 'div-overlay-box', style: {} }
      ,alertEdit: { show: false, msg: '', class: 'div-overlay-box', style: {} }
      ,draggable: 0
      ,dragobject: null
    }
  };

  _onClickReturn() {
    this.props.history.push(ACTION.SLASH + ACTION.LIST);
    this.forceUpdate();
  }

  _onClickSubmit() {
    console.log(this.state.schema.properties);
    var oks = Object.keys(this.state.schema.properties);
    for(var i=0; i<oks.length; i++) {
      console.log(this.state.schema.properties[oks[i]]);
    }
    console.log("Data submitted: ", document.forms[0]);
  }

  _onChange(type) {
    console.log.bind(console, type);
  }

  _onError(errors) {
    console.log("I have", errors.length, "errors to fix");
  }

  _onValidate(formData, errors) {
    // if (formData.base_info.email === undefined || formData.base_info.email.length <= 0) {
    //   errors.base_info.email.addError("を入力してください。");
    // }
    // if (formData.base_info.checkboxs === undefined || formData.base_info.checkboxs.length <= 0) {
    //   errors.base_info.checkboxs.addError("を選択してください。");
    // }
    // if (formData.base_info.user_flag === undefined || formData.base_info.user_flag.length <= 0) {
    //   errors.base_info.user_flag.addError("を選択してください。");
    // }
    // if (formData.base_info.file === undefined || formData.base_info.file.length <= 0) {
    //   errors.base_info.file.addError("を選択してください。");
    // }
    // if (formData.base_info.files === undefined || formData.base_info.files.length <= 0) {
    //   errors.base_info.files.addError("を選択してください。");
    // }
    return errors;
  }

  UNSAFE_componentWillMount(){
    this.state.schema = {
        // title: "Widgets",
        type: "object",
        properties: {
          cust_info: {
            type: "object"
            ,title: "顧客情報"
            ,required: [ "cust_name_hira", "cust_name_kana" ]
            ,properties: {
              cust_name_hira: { type: "string" }
              ,cust_name_kana: { type: "string" }
            }
          },
          base_info: {
            type: "object"
            ,title: "基本情報"
            // ,required: [ "email", "uri" ]
            ,properties: {
              email: { type: "string", title: "メール", format: "email", }
              ,uri: { type: "string", format: "uri", }
            },
          },
          project_info: {
            type: "object"
            ,title: "顧客情報2"
            ,required: [ "cust_name_hira", "cust_name_kana" ]
            ,properties: {
              cust_name_hira: { type: "string" }
              ,cust_name_kana: { type: "string" }
            }
          }
        },
    }
    this.state.uiSchema = {
        base_info: {
          classNames: "draggable-top-box div-top-box div-top-box-50"
          ,email: { "ui:placeholder": "メール", classNames: "div-box div-box-50" }
          ,uri: { "ui:placeholder": "URL", classNames: "div-box div-box-50" }
        }
        ,cust_info: {
          classNames: "draggable-top-box div-top-box div-top-box-50"
          ,cust_name_hira: { "ui:placeholder": "顧客名", classNames: "div-box div-box-50" }
          ,cust_name_kana: { "ui:placeholder": "顧客カナ", classNames: "div-box div-box-50" }
        }
        ,project_info: {
          classNames: "draggable-top-box div-top-box div-top-box-50"
          ,cust_name_hira: { "ui:placeholder": "案件名", classNames: "div-box div-box-50" }
          ,cust_name_kana: { "ui:placeholder": "カナ", classNames: "div-box div-box-50" }
        }
    }
    this.state.formData = {}
  }

  UNSAFE_componentWillReceiveProps(props) {
    // console.log('CREATE componentWillReceiveProps');
    this.state.isUser = props.isUser;
    // console.log(this.state.isUser);
  }

  componentDidMount() {
    const div = document.getElementById('div-form');
    if(Utils.isEmpty(div)) return;
    if(Utils.isEmpty(div.childNodes[0])) return;
    if(Utils.isEmpty(div.childNodes[0].childNodes[0])) return;
    const divDrags = div.childNodes[0].childNodes[0].childNodes;
    div.childNodes[0].childNodes[0].addEventListener(MOUSE.MOUSEDOWN, this._onMouseDown.bind(this), true);
    div.childNodes[0].childNodes[0].addEventListener(DRAG.OVER, this._onDragOver.bind(this), false);
    div.childNodes[0].childNodes[0].addEventListener(DRAG.DROP, this._onDragDrop.bind(this), false);
    div.childNodes[0].childNodes[0].addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);

    // console.log(div.childNodes[0]);
    for(var i=0; i<divDrags.length; i++) {
      const drags = divDrags[i];
      const dragChilds = drags.childNodes[0].childNodes;
      if(Utils.isEmpty(dragChilds)) continue;
      drags.id = DRAG.ABLE + '_' + i;
      drags.setAttribute(DRAG.ABLE, 'true');
      drags.addEventListener(DRAG.START, this._onDragStart.bind(this), false);
      for(var c=0; c<dragChilds.length; c++) {
        const dDrag = dragChilds[c];
        if(c === 0 && dDrag.tagName === HTML_TAG.LEGEND) continue;
        dDrag.setAttribute(DRAG.ABLE, 'true');
        dDrag.ondragstart = this._onDragStart.bind(this);
      }
    }
  }

  _onMouseDown(e) {
    // console.log(e.target.tagName);
    if(e.target.tagName === HTML_TAG.LEGEND) {
      this.state.draggable = 1;
      this.state.dragobject = e.target.parentElement.parentElement;
    } else if(e.target.tagName === HTML_TAG.LABEL) {
      this.state.draggable = 2;
      this.state.dragobject = e.target.parentElement;
    } else {
      this.state.draggable = 0;
      this.state.dragobject = null;
    }
  }

  _onDragStart(e) {
    if(this.state.draggable !== 1 && this.state.draggable !== 2) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('_onDragStart');
  }

  _onDragOver(e) {
    e.preventDefault();
    // console.log('_onDragOver');
    // console.log(e);
  }

  _onDragDrop(e) {
    e.preventDefault();
    if(Utils.isEmpty(this.state.dragobject)) {
      e.stopPropagation();
      return;
    }
    console.log('_onDragDrop');
    if(this.state.draggable === 1 && e.target.tagName === HTML_TAG.LEGEND) {
      const div = e.target.parentElement.parentElement;
      var nps = [];
      var keys = Object.keys(this.state.schema.properties);
      var json = {};
      if(Utils.isEmpty(div.id) || Utils.isEmpty(div.parentElement.childNodes) || div.parentElement.childNodes.length <= 0) return;
      const dragId = Array.from(div.parentElement.childNodes).indexOf(div);
      const dropId = Array.from(div.parentElement.childNodes).indexOf(this.state.dragobject);
      // var id = div.parentElement.id.replace('root_', '');
      if(dragId < dropId) {
        div.before(this.state.dragobject);
        for(var drag=0; drag<keys.length; drag++) {
          if(drag === dropId) continue;
          if(drag === dragId) {
            json[keys[dropId]] = this.state.schema.properties[keys[dropId]];
            nps.push(json);
            json = {};
            json[keys[dragId]] = this.state.schema.properties[keys[dragId]];
            nps.push(json);
          } else {
            json = {};
            json[keys[drag]] = this.state.schema.properties[keys[drag]];
            nps.push(json);
          }
        }
        json = {};
        console.log(nps);
        for(var i=0; i<nps.length; i++) {
          console.log(nps[i]);
          var oks = Object.keys(nps[i]);
          for(var l=0; l<oks.length; l++) {
            json[oks[l]] = nps[i][oks[l]];
          }
        }
        console.log(json);
        this.state.schema.properties = json;
        console.log(this.state.schema.properties);
      } else {
        div.after(this.state.dragobject);
        for(var drop=0; drop<keys.length; drop++) {
          if(drop === dropId) continue;
          if(drop === dragId) {
            json[keys[dragId]] = this.state.schema.properties[keys[dragId]];
            nps.push(json);
            json = {};
            json[keys[dropId]] = this.state.schema.properties[keys[dropId]];
            nps.push(json);
          } else {
            json = {};
            json[keys[drop]] = this.state.schema.properties[keys[drop]];
            nps.push(json);
          }
        }
        json = {};
        for(var o=0; o<nps.length; o++) {
          var oks = Object.keys(nps[o]);
          for(var u=0; u<oks.length; u++) {
            json[oks[u]] = nps[o][oks[u]];
          }
        }
        console.log(json);
        this.state.schema.properties = json;
        console.log(this.state.schema.properties);
      }
    }
    if(this.state.draggable === 2) {
      const div = e.target.parentElement;
      const tPDiv = div.parentElement;
      const dPObj = this.state.dragobject.parentElement;
      if(tPDiv.id !== dPObj.id) return;
      const dragId = Array.from(tPDiv.childNodes).indexOf(div);
      const dropId = Array.from(tPDiv.childNodes).indexOf(this.state.dragobject);
      if(dragId < dropId) {
        div.before(this.state.dragobject);
      } else {
        div.after(this.state.dragobject);
      }
      // console.log(dragId);
      // console.log(dropId);
      // console.log(this.state.schema.properties);
    }
  }

  // _onDragEnd(e) {
  //   console.log('_onDragEnd');
  //   console.log(e);
  //   console.log(this.state.draggable);
  // }

  _onMouseOver(e) {
    const obj = e.target;
    if(obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL) return;
    obj.addEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    this.state.alertActions.show = true;
    this.state.alertActions.style = { top: obj.offsetTop, left: (obj.offsetLeft + obj.offsetWidth) - 70 };
    var className = 'div-customize-actions';
    if(obj.tagName === HTML_TAG.LABEL) {
      className += ' div-customize-actions-child';
      this.state.alertActions.style.left = (this.state.alertActions.style.left + 25);
    }
    this.state.alertActions.class = className;
    this.state.dragobject = obj;
    this.forceUpdate();
  }

  _onMouseOut(e) {
    const obj = this._getButton(e);
    // console.log(obj.tagName);
    if(obj.tagName === HTML_TAG.BUTTON) {
      this.state.alertActions.show = true;
    } else {
      this.state.alertActions.show = false;
    }
    if(!Utils.isEmpty(this.state.dragobject)) {
      this.state.dragobject.removeEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    }
    this.forceUpdate();
  }

  _getButton(e) {
    var obj = e.target;
    if(obj.tagName === HTML_TAG.BUTTON) return obj;
    if(obj.tagName === HTML_TAG.PATH) {
      obj = e.target.parentElement.parentElement;
    }
    if(obj.tagName === HTML_TAG.SVG) {
      obj = e.target.parentElement;
    }
    return obj;
  }

  _onAlertEdit() {
    this.state.alertDelete.show = true;
    this.forceUpdate();
  }

  _onOpenDelete() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL)) return;
    this.state.alertDelete.msg = '「' + obj.innerText + '」' + 'を削除してよろしくですか？';
    this.state.alertDelete.show = true;
    this.forceUpdate();
  }

  _onClickClose() {
    this.state.alertDelete.show = false;
    this.forceUpdate();
  }

  _onClickDelete() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL)) return;
    if(obj.tagName === HTML_TAG.LEGEND) {
      if(!Html.hasAttribute(obj.parentElement, 'id')) return;
      var id = obj.parentElement.id.replace('root_', '');
      // console.log(id);
      delete this.state.schema.properties[id];
      delete this.state.uiSchema[id];
      // console.log(this.state.schema.properties);
      // console.log(this.state.uiSchema);
    }
    if(obj.tagName === HTML_TAG.LABEL) {
      if(!Html.hasAttribute(obj.parentElement.parentElement, 'id')
        || !Html.hasAttribute(obj, 'for')) return;
      var cId = obj.parentElement.parentElement.id.replace('root_', '');
      var oId = obj.getAttribute('for').replace('root_' + cId + '_', '');
      // console.log(cId);
      // console.log(oId);
      delete this.state.schema.properties[cId].properties[oId];
      delete this.state.uiSchema[id][oId];
      // console.log(this.state.schema.properties);
      // console.log(this.state.uiSchema);
    }

    this.state.alertActions.show = false;
    this.state.alertDelete.show = false;
    this.forceUpdate();
  }

  _onAlertActions() {
    return(
      <Alert
        show={ this.state.alertActions.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.alertActions.class }
        style={ this.state.alertActions.style }>
        <Button
          type={ HTML_TAG.BUTTON }
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onClickSubmit.bind(this) }
          variant={ VARIANT_TYPES.SECONDARY }>
          <FaEdit />
        </Button>
        <Button
          type={ HTML_TAG.BUTTON }
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onOpenDelete.bind(this) }
          variant={ VARIANT_TYPES.DANGER }>
          <FaTrash />
        </Button>
      </Alert>
    );
  }

  _onAlertDelete() {
    return(
      <Alert
        show={ this.state.alertDelete.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.alertDelete.class }>
        <div className="alert alert-light" style={ this.state.alertDelete.style }>
          <h4>{ this.state.alertDelete.msg }</h4>
          <Button
            type={ HTML_TAG.BUTTON }
            onClick={ this._onClickDelete.bind(this) }
            variant={ VARIANT_TYPES.WARNING }>
            <FaTrash />
          </Button>
          <Button
            type={ HTML_TAG.BUTTON }
            onClick={ this._onClickClose.bind(this) }
            variant={ VARIANT_TYPES.INFO }>
            <FaReply />
          </Button>
        </div>
      </Alert>
    );
  }

  render() {
    return (
      <div>
        { this._onAlertDelete() }
        <Form
          id='div-form'
          schema={ this.state.schema }
          uiSchema={ this.state.uiSchema } 
          widgets={ this.state.widgets }
          formData={ this.state.formData }
          onChange={ this._onChange("changed") }
          onSubmit={ this._onClickSubmit.bind(this) }
          validate={ this._onValidate.bind(this) }
          onError={ this._onError.bind(this) }>

          <Actions
            isUser={ this.state.isUser }
            onClickReturn={ this._onClickReturn.bind(this) }
            onClickSubmit={ this._onClickSubmit.bind(this) } />
          { this._onAlertActions() }
        </Form>
      </div>
    )
  };
};

export default connect()(withRouter(Customize));