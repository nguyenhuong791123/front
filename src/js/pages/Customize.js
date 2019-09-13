
import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormBS4 from 'react-jsonschema-form-bs4';
import { Alert, Button, Form, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrash, FaReply, FaPlus, FaCheck, FaBars, FaRegEye } from 'react-icons/fa';
import CForm from '../utils/CForm';

import { ACTION, VARIANT_TYPES, SYSTEM } from '../utils/Types';
import { DRAG, MOUSE, TYPE, ALIGN, HTML_TAG, CUSTOMIZE } from '../utils/HtmlTypes';
import Html from '../utils/HtmlUtils'
import Utils from '../utils/Utils';

import '../../css/Customize.css';
import GetMsg from '../../msg/Msg';

class Customize extends C {
  constructor(props) {
    super(props);

    this._onClickReturn = this._onClickReturn.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onError = this._onError.bind(this);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDragDrop = this._onDragDrop.bind(this);

    this._onClickDelete = this._onClickDelete.bind(this);
    // this._onAlerEdit = this._onAlerEdit.bind(this);
    // this._onAlerEdit = this._onOpenEdit.bind(this);
    this._onSelectChange = this._onSelectChange.bind(this);
    this._onCreateEditChange = this._onCreateEditChange.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,form: {}
      ,alertActions: { show: false, class: '', style: {} }
      ,alertDelete: { show: false, msg: '', class: 'div-overlay-box', style: { textAlign: 'center' } }
      ,alertCreateEdit: { show: false, msg: '', class: 'div-overlay-box', style: {}, obj: {} }
      ,draggable: 0
      ,dragobject: null
      ,mode: ACTION.CREATE
      ,menus: [
        { id: 1, target: 'target_00', label: 'label_00' }
        ,{ id: 3, target: 'target_001', label: 'label_001' }
        ,{ id: 5, target: 'target_0000', label: 'label_0000' }
        ,{ id: 7, target: 'target_003', label: 'label_003' }
        ,{ id: 8, target: 'target_0000003', label: 'label_0000003' }
        ,{ id: 10, target: 'target_0000031', label: 'target_0000031'} 
      ]
    }
  };

  _onClickReturn() {
    this.props.history.push(ACTION.SLASH + ACTION.LIST);
    this.forceUpdate();
  }

  _onClickSubmit() {
    console.log(this.state.form.schema.properties);
    var oks = Object.keys(this.state.form.schema.properties);
    for(var i=0; i<oks.length; i++) {
      console.log(this.state.form.schema.properties[oks[i]]);
    }
    console.log('Data submitted: ', document.forms[0]);
  }

  _onChange(type) {
    console.log(type);
  }

  _onError(errors) {
    console.log('I have', errors.length, 'errors to fix');
  }

  UNSAFE_componentWillMount(){
    this.state.form = [
      {
          object_type: 'div'
          ,class_name: 'div-box-50'
          ,object: {
              schema: {
                  type: 'object'
                  ,properties: {
                      cust_info: {
                          type: 'object'
                          ,title: '顧客情報'
                          ,background: ''
                          ,properties: {
                              cust_name_hira: { type: 'string' }
                          }
                      }
                  }
              },
              ui: {
                  cust_info: {
                      // classNames: 'draggable-top-box div-top-box div-top-box-50',
                      cust_name_hira: { 'ui:placeholder': '顧客', classNames: 'div-box div-box-50' }
                  }
              },
              data: {}
          }
      },
      {
          object_type: 'tab'
          ,active: 0
          ,class_name: 'div-box-50'
          ,object: [
              {
                  schema: {
                      type: 'object'
                      ,tab_name: '顧客情報1'
                      ,properties: {
                          cust_info: {
                              type: 'object'
                              ,background: ''
                              ,properties: {
                                  cust_name_hira: { type: 'string' }
                                  ,cust_name_kana: { type: 'string' }
                                  ,phone: { type: 'string' }
                              }
                          }
                      }
                  },
                  ui: {
                      cust_info: {
                          // classNames: 'draggable-top-box div-top-box div-top-box-50',
                          cust_name_hira: { 'ui:placeholder': '顧客1', classNames: 'div-box div-box-50' }
                          ,cust_name_kana: { 'ui:placeholder': '顧客カナ1', classNames: 'div-box div-box-50' }
                          ,phone: { 'ui:placeholder': 'Phone', classNames: 'div-box div-box-50' }
              }
                  },
                  data: {}
              },
              {
                  schema: {
                      type: 'object'
                      ,tab_name: '顧客情報2'
                      ,properties: {
                          cust_info: {
                              type: 'object'
                              ,background: ''
                              ,properties: {
                                  cust_name_hira: { type: 'string' }
                                  ,cust_name_kana: { type: 'string' }
                                  ,phone: { type: 'string' }
                              }
                          }
                      }
                  },
                  ui: {
                      cust_info: {
                          // classNames: 'draggable-top-box div-top-box div-top-box-50',
                          cust_name_hira: { 'ui:placeholder': '顧客1', classNames: 'div-box div-box-50' }
                          ,cust_name_kana: { 'ui:placeholder': '顧客カナ1', classNames: 'div-box div-box-50' }
                          ,phone: { 'ui:placeholder': 'Phone', classNames: 'div-box div-box-50' }
              }
                  },
                  data: {}
              }
          ]
      }
  ]
    // this.state.form.schema = {
    //     // title: 'Widgets',
    //     type: 'object'
    //     ,page_name: '顧客情報'
    //     ,properties: {
    //       cust_info: {
    //         type: 'object'
    //         ,title: '顧客情報'
    //         ,object_type: 'div'
    //         ,background: ''
    //         // ,required: [ 'cust_name_hira', 'cust_name_kana' ]
    //         ,properties: {
    //           cust_name_hira: { type: 'string' }
    //           ,cust_name_kana: { type: 'string' }
    //         }
    //       },
    //       base_info: {
    //         type: 'object'
    //         ,title: '基本情報'
    //         ,object_type: 'tab'
    //         ,background: ''
    //         // ,required: [ 'email', 'uri' ]
    //         ,properties: {
    //           email: { type: 'string', title: 'メール', format: 'email', }
    //           ,uri: { type: 'string', format: 'uri', }
    //         },
    //       },
    //       project_info: {
    //         type: 'object'
    //         ,object_type: 'tab'
    //         ,title: '顧客情報2'
    //         ,background: ''
    //         // ,required: [ 'cust_name_hira', 'cust_name_kana' ]
    //         ,properties: {
    //           project_hira: { type: 'string' }
    //           ,project_kana: { type: 'string' }
    //         }
    //       }
    //     },
    // }
    // this.state.form.uiSchema = {
    //     base_info: {
    //       classNames: 'draggable-top-box div-top-box div-top-box-50'
    //       ,email: { 'ui:placeholder': 'メール', classNames: 'div-box div-box-50' }
    //       ,uri: { 'ui:placeholder': 'URL', classNames: 'div-box div-box-50' }
    //     }
    //     ,cust_info: {
    //       classNames: 'draggable-top-box div-top-box div-top-box-50'
    //       ,cust_name_hira: { 'ui:placeholder': '顧客名', classNames: 'div-box div-box-50' }
    //       ,cust_name_kana: { 'ui:placeholder': '顧客カナ', classNames: 'div-box div-box-50' }
    //     }
    //     ,project_info: {
    //       classNames: 'draggable-top-box div-top-box div-top-box-50'
    //       ,project_hira: { 'ui:placeholder': '案件名', classNames: 'div-box div-box-50' }
    //       ,project_kana: { 'ui:placeholder': 'カナ', classNames: 'div-box div-box-50' }
    //     }
    // }
    // this.state.form.formData = {}
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
    var tabs = [];
    const schema = this.state.form.schema.properties;
    var keys = Object.keys(schema);
    for(var i=0; i<keys.length; i++) {
      console.log(schema[keys[i]]);
      if(Utils.isEmpty(schema[keys[i]]['object_type']) || schema[keys[i]]['object_type'] !== 'tab') continue;
      var obj = { label: schema[keys[i]]['title'] };
      tabs.push(obj);
    }
    const divTabs = document.createElement(HTML_TAG.DIV);
    if(!Utils.isEmpty(tabs) && tabs.length > 0) {
      divTabs.setAttribute('id', 'div_customize_0');
      div.appendChild(divTabs);
      ReactDOM.render(<CTabs isActive={ '1' } objs={ tabs } />, divTabs);
    }

    const divDrags = div.childNodes[0].childNodes[0].childNodes;
    div.childNodes[0].childNodes[0].addEventListener(MOUSE.MOUSEDOWN, this._onMouseDown.bind(this), true);
    div.childNodes[0].childNodes[0].addEventListener(DRAG.OVER, this._onDragOver.bind(this), false);
    div.childNodes[0].childNodes[0].addEventListener(DRAG.DROP, this._onDragDrop.bind(this), false);
    div.childNodes[0].childNodes[0].addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);

    // var tabIdx = 0;
    console.log(divTabs);
    console.log(divTabs.childNodes);
    for(var i=0; i<divTabs.childNodes.length; i++) {
      console.log(divTabs.childNodes[i]);
    }
    const divTabChilds = divTabs.childNodes[1];
    console.log(divTabChilds);
    for(var i=0; i<divDrags.length; i++) {
      const drags = divDrags[i];
      const dragChilds = drags.childNodes[0].childNodes;
      console.log(drags.childNodes[0]);
      const objtype = drags.childNodes[0]['object_type'];
      if(objtype === 'tab') {
        divTabs.childNodes[tabIdx].appendChild(drags.childNodes[0]);
        tabIdx++;
      }
      if(Utils.isEmpty(dragChilds)) continue;
      // drags.id = DRAG.ABLE + '_' + i;
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
    var nps = [];
    var json = {};
    if(this.state.draggable === 1 && e.target.tagName === HTML_TAG.LEGEND) {
      const div = e.target.parentElement.parentElement;
      var keys = Object.keys(this.state.form.schema.properties);
      if(Utils.isEmpty(div.parentElement.childNodes) || div.parentElement.childNodes.length <= 0) return;
      const dragId = Array.from(div.parentElement.childNodes).indexOf(div);
      const dropId = Array.from(div.parentElement.childNodes).indexOf(this.state.dragobject);
      if(dragId < dropId) {
        div.before(this.state.dragobject);
        for(var drag=0; drag<keys.length; drag++) {
          if(drag === dropId) continue;
          if(drag === dragId) {
            json[keys[dropId]] = this.state.form.schema.properties[keys[dropId]];
            nps.push(json);
            json = {};
            json[keys[dragId]] = this.state.form.schema.properties[keys[dragId]];
            nps.push(json);
          } else {
            json = {};
            json[keys[drag]] = this.state.form.schema.properties[keys[drag]];
            nps.push(json);
          }
        }
      } else {
        div.after(this.state.dragobject);
        for(var drop=0; drop<keys.length; drop++) {
          if(drop === dropId) continue;
          if(drop === dragId) {
            json[keys[dragId]] = this.state.form.schema.properties[keys[dragId]];
            nps.push(json);
            json = {};
            json[keys[dropId]] = this.state.form.schema.properties[keys[dropId]];
            nps.push(json);
          } else {
            json = {};
            json[keys[drop]] = this.state.form.schema.properties[keys[drop]];
            nps.push(json);
          }
        }
      }
      json = {};
      for(var o=0; o<nps.length; o++) {
        var oks = Object.keys(nps[o]);
        for(var u=0; u<oks.length; u++) {
          json[oks[u]] = nps[o][oks[u]];
        }
      }
      this.state.form.schema.properties = json;
    }

    if(this.state.draggable === 2) {
      const div = e.target.parentElement;
      const tPDiv = div.parentElement;
      const dPObj = this.state.dragobject.parentElement;
      if(tPDiv.id !== dPObj.id) return;
      var dragId = Array.from(tPDiv.childNodes).indexOf(div);
      var dropId = Array.from(tPDiv.childNodes).indexOf(this.state.dragobject);
      if(!Utils.isEmpty(tPDiv.childNodes[0]) && tPDiv.childNodes[0].tagName === HTML_TAG.LEGEND) {
        if(dragId > 0) dragId -= 1;
        if(dropId > 0) dropId -= 1;
      }
      const jKey = tPDiv.id.replace('root_', '');
      const isJson = this.state.form.schema.properties[jKey].properties;
      keys = Object.keys(isJson);
      if(dragId < dropId) {
        div.before(this.state.dragobject);
        for(var drag=0; drag<keys.length; drag++) {
          if(drag === dropId) continue;
          if(drag === dragId) {
            json[keys[dropId]] =isJson[keys[dropId]];
            nps.push(json);
            json = {};
            json[keys[dragId]] = isJson[keys[dragId]];
            nps.push(json);
          } else {
            json = {};
            json[keys[drag]] = isJson[keys[drag]];
            nps.push(json);
          }
        }
      } else {
        div.after(this.state.dragobject);
        for(var drop=0; drop<keys.length; drop++) {
          if(drop === dropId) continue;
          if(drop === dragId) {
            json[keys[dragId]] =isJson[keys[dragId]];
            nps.push(json);
            json = {};
            json[keys[dropId]] = isJson[keys[dropId]];
            nps.push(json);
          } else {
            json = {};
            json[keys[drop]] = isJson[keys[drop]];
            nps.push(json);
          }
        }
      }
      json = {};
      for(var i=0; i<nps.length; i++) {
        var oks = Object.keys(nps[i]);
        for(var l=0; l<oks.length; l++) {
          json[oks[l]] = nps[i][oks[l]];
        }
      }
      this.state.form.schema.properties[jKey].properties = json;
      console.log(this.state.form.schema.properties[jKey].properties);
      console.log(this.state.form.schema.properties);
    }
  }

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
    console.log(obj.tagName);
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
          onClick={ this._onOpenEdit.bind(this) }
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

  _onAlertPageActions() {
    const className = (!Utils.isEmpty(window.name) && window.name===SYSTEM.IS_ACTIVE_WINDOWN)?'div-actions-box':'div-not-windown-actions-box';
    return (
        <div id='div_button_action' className={ className }>
            <Button onClick={ this._onOpenEdit.bind(this) } variant={ VARIANT_TYPES.SECONDARY }>
              <FaPlus />
              { GetMsg(null, this.state.isUser.language, 'bt_add') }
            </Button>
            <br />
            <Button onClick={ this._onClickSubmit.bind(this) } variant={ VARIANT_TYPES.WARNING }>
              <FaCheck />
              { GetMsg(null, this.state.isUser.language, 'bt_insert') }
            </Button>
            <br />
            <Button onClick={ this._onClickReturn.bind(this) } variant={ VARIANT_TYPES.INFO }>
              <FaReply />
              { GetMsg(null, this.state.isUser.language, 'bt_return') }
            </Button>
            <br />
        </div>
    )  
  }

  _onOpenEdit() {
    const obj = this.state.dragobject;
    console.log(obj);
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL)) return;
    this.state.alertCreateEdit.msg = '「' + obj.innerText + '」' + 'を修正';
    this.state.alertCreateEdit.show = true;
    this.state.alertDelete.show = false;
    this.forceUpdate();
  }

  _onSelectChange() {
    console.log(this.state.dragobject);
  }

  _onCreateEditChange(e) {
    const obj = e.target;
    if(Utils.isEmpty(obj)) return;
    var val = obj.value;
    const name = obj.name;
    if(e.target.type === TYPE.CHECKBOX) val = obj.checked;
    this.state.alertCreateEdit.obj[name] = val;
    console.log(e);
    console.log(e.target);
    console.log(e.target.type);
    console.log(e.target.name);
    console.log(e.target.value);
    console.log(e.target.checked);
    console.log(this.state.alertCreateEdit.obj);
    // console.log(this.state.alertCreateEdit.obj);
  }

  _onAlerEdit() {
    if(!this.state.alertCreateEdit.show) return '';
    var items = [];
    var aligns = [];
    var objs = Object.keys(TYPE);
    for (let i=0; i<objs.length; i++) {
      items.push( <option key={ i } value={ TYPE[objs[i]] }>{ '' + TYPE[objs[i]] }</option> );
    }
    objs = Object.keys(ALIGN);
    for (let i=0; i<objs.length; i++) {
      aligns.push( <option key={ i } value={ ALIGN[objs[i]] }>{ '' + ALIGN[objs[i]] }</option> );
    }

    return(
      <Alert
        show={ this.state.alertCreateEdit.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.alertCreateEdit.class }>
        <div className='alert-light' style={ this.state.alertCreateEdit.style }>
          <div>
            <Button
              type={ HTML_TAG.BUTTON }
              onClick={ this._onClickClose.bind(this) }
              variant={ VARIANT_TYPES.WARNING }>
              <FaCheck />
            </Button>
            <Button
              type={ HTML_TAG.BUTTON }
              onClick={ this._onClickClose.bind(this) }
              variant={ VARIANT_TYPES.INFO }>
              <FaReply />
            </Button>
            {/* <Button
              type={ HTML_TAG.BUTTON }
              onClick={ this._onClickView.bind(this) }
              variant={ VARIANT_TYPES.WARNING }>
              <FaRegEye />
            </Button> */}
          </div>
          <table className='table-overlay-box'>
            <tbody>
              <tr>
                <td colSpan='4'><h4>{ this.state.alertCreateEdit.msg }</h4></td>
              </tr>
              <tr>
                <td className='td-not-break'>種類</td>
                <td colSpan='3'>
                  <Form.Control
                    as={ HTML_TAG.SELECT }
                    name={ CUSTOMIZE.TYPE }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.TYPE] }
                    onChange={ this._onCreateEditChange.bind(this) }> { items }</Form.Control>
                </td>
              </tr>
              <tr>
                <td className='td-not-break'>Required</td>
                <td>
                  <Form.Check
                    type={ HTML_TAG.CHECKBOX }
                    name={ CUSTOMIZE.REQUIRED }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.REQUIRED] }
                    onChange={ this._onCreateEditChange.bind(this) }/>
                  </td>
                <td className='td-not-break'>横幅</td>
                <td>
                  <input
                    type={ HTML_TAG.RANGE }
                    name={ CUSTOMIZE.BOX_WIDTH }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.BOX_WIDTH] }
                    min='20'
                    max='100'
                    step='10'
                    onChange={ this._onCreateEditChange.bind(this) }></input>
                  </td>
              </tr>
              <tr>
                <td className='td-not-break'>Label</td>
                <td>
                  <Form.Control type={ TYPE.TEXT }
                    name={ CUSTOMIZE.LABEL }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.LABEL] }
                    onChange={ this._onCreateEditChange.bind(this) }/>
                  </td>
                <td className='td-not-break'>Placeholder</td>
                <td>
                  <Form.Control
                    type={ TYPE.TEXT }
                    name={ CUSTOMIZE.PLACEHOLDER }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.PLACEHOLDER] }
                    onChange={ this._onCreateEditChange.bind(this) }/>
                  </td>
              </tr>
              <tr>
                <td className='td-not-break'>Default</td>
                <td>
                  <Form.Control
                    type={ TYPE.TEXT }
                    name={ CUSTOMIZE.DEFAULT }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.DEFAULT] }
                    onChange={ this._onCreateEditChange.bind(this) }/>
                  </td>
                <td className='td-not-break'>MaxLength</td>
                <td>
                  <Form.Control
                    type={ TYPE.NUMBER }
                    name={ CUSTOMIZE.MAX_LENGTH }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.MAX_LENGTH] }
                    onChange={ this._onCreateEditChange.bind(this) }/>
                  </td>
              </tr>
              <tr>
                <td className='td-not-break'>タイトル</td>
                <td>
                  <input
                    type={ TYPE.COLOR }
                    name={ CUSTOMIZE.LABEL_COLOR }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.LABEL_COLOR] }
                    onChange={ this._onCreateEditChange.bind(this) }></input>
                  <span>背景</span>
                  <input
                    type={ TYPE.COLOR }
                    name={ CUSTOMIZE.LABEL_LAYOUT_COLOR }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.LABEL_LAYOUT_COLOR] }
                    onChange={ this._onCreateEditChange.bind(this) }></input>
                </td>
                <td className='td-not-break'>align</td>
                <td>
                  <Form.Control
                    as={ HTML_TAG.SELECT }
                    name={ CUSTOMIZE.LABEL_ALIGN }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.LABEL_ALIGN] }
                    onChange={ this._onCreateEditChange.bind(this) }>
                    { aligns }
                  </Form.Control>
                </td>
              </tr>
              <tr>
                <td className='td-not-break'>テキスト</td>
                <td>
                  <input
                    type={ TYPE.COLOR }
                    name={ CUSTOMIZE.TEXT_COLOR }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.TEXT_COLOR] }
                    onChange={ this._onCreateEditChange.bind(this) }></input>
                  <span>背景</span>
                  <input
                    type={ TYPE.COLOR }
                    name={ CUSTOMIZE.TEXT_LAYOUT_COLOR }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.TEXT_LAYOUT_COLOR] }
                    onChange={ this._onCreateEditChange.bind(this) }></input>
                </td>
                <td className='td-not-break'>align</td>
                <td>
                  <Form.Control
                    as={ HTML_TAG.SELECT }
                    name={ CUSTOMIZE.TEXT_ALIGN }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.TEXT_ALIGN] }
                    onChange={ this._onCreateEditChange.bind(this) }>
                    { aligns }
                  </Form.Control>
                </td>
              </tr>
              <tr>
                <td className='td-not-break'>CSS Style</td>
                <td colSpan='3'>
                  <Form.Control
                    type={ TYPE.TEXT }
                    name={ CUSTOMIZE.STYLE }
                    value={ this.state.alertCreateEdit.obj[CUSTOMIZE.STYLE] }
                    onChange={ this._onCreateEditChange.bind(this) }/>
                </td>
              </tr>
              {/* <tr>
                <td colSpan='4' id='td_view_box' className='td-view-box'></td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </Alert>
    );
  }

  _onOpenDelete() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL)) return;
    this.state.alertDelete.msg = '「' + obj.innerText + '」' + 'を削除してよろしくですか？';
    this.state.alertDelete.show = true;
    this.state.alertCreateEdit.show = false;
    this.forceUpdate();
  }

  _onClickDelete() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL)) return;
    if(obj.tagName === HTML_TAG.LEGEND) {
      if(!Html.hasAttribute(obj.parentElement, 'id')) return;
      var id = obj.parentElement.id.replace('root_', '');
      delete this.state.form.schema.properties[id];
      delete this.state.form.uiSchema[id];
    }
    if(obj.tagName === HTML_TAG.LABEL) {
      if(!Html.hasAttribute(obj.parentElement.parentElement, 'id')
        || !Html.hasAttribute(obj, 'for')) return;
      var cId = obj.parentElement.parentElement.id.replace('root_', '');
      var oId = obj.getAttribute('for').replace('root_' + cId + '_', '');
      delete this.state.form.schema.properties[cId].properties[oId];
      delete this.state.form.uiSchema[id][oId];
    }

    this.state.alertActions.show = false;
    this.state.alertDelete.show = false;
    this.forceUpdate();
  }

  _onClickView() {
    const td = document.getElementById('td_view_box');
    if(Utils.isEmpty(td)) return;
    td.style.display = 'table-cell';
    td.innerText = '';
    if(Utils.isEmpty(this.state.dragobject)) return;
    var obj = this.state.dragobject.cloneNode(true);
    if(obj.tagName !== HTML_TAG.LEGEND)  obj = this.state.dragobject.parentElement.cloneNode(true);
    td.appendChild(obj);
  }

  _onClickClose() {
    this.state.dragobject = null;
    this.state.alertDelete.show = false;
    this.state.alertCreateEdit.show = false;
    this.forceUpdate();
  }

  _onAlertDelete() {
    if(!this.state.alertDelete.show) return '';
    return(
      <Alert
        show={ this.state.alertDelete.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.alertDelete.class }>
        <div className='alert-light' style={ this.state.alertDelete.style }>
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

  _onClickChangeMode() {
    this.state.mode = (this.state.mode === ACTION.CREATE)?ACTION.EDIT:ACTION.CREATE;
    this.forceUpdate();
  }

  _getTitle() {
    var items = [];
    const menus = this.state.menus;
    for (let i=0; i<menus.length; i++) {
      items.push( <option key={ i } value={ menus[i].id }>{ menus[i].label }</option> );
    }
    return(
      <div>
        {(() => {
          if (this.state.mode === ACTION.CREATE) {
            return (
              <div className='div-customize-title-box'>
                <FormControl type="text" placeholder="Input" className="mr-sm-2" />
                <Button
                  type={ HTML_TAG.BUTTON }
                  onClick={ this._onClickChangeMode.bind(this) }
                  variant={ VARIANT_TYPES.INFO }>
                  <FaBars />
                </Button>
              </div>
            );
          }
          if (this.state.mode === ACTION.EDIT) {
            return (
              <div className='div-customize-title-box'>
                <Form.Control
                  as={ HTML_TAG.SELECT }
                  onChange={ this._onSelectChange.bind(this) }
                  defaultValue={ TYPE.TEXT }> { items }</Form.Control>
                <Button
                  type={ HTML_TAG.BUTTON }
                  onClick={ this._onClickChangeMode.bind(this) }
                  variant={ VARIANT_TYPES.INFO }>
                  <FaPlus />
                </Button>
              </div>
            );
          }
        })()}
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* { this._onAlertDelete() }
        { this._onAlerEdit() }
        { this._onAlertPageActions() }
        { this._getTitle() } */}
        {/* <FormBS4
          id='div-form'
          schema={ this.state.form.schema }
          uiSchema={ this.state.form.uiSchema } 
          widgets={ this.state.widgets }
          formData={ this.state.form.formData }
          // onChange={ this._onChange('changed') }
          // onSubmit={ this._onClickSubmit.bind(this) }
          onError={ this._onError.bind(this) }>
          { this._onAlertActions() }
        </FormBS4> */}
        { this._onAlertPageActions() }
        { this._getTitle() }
        { <CForm isUser={ this.state.isUser } form={ this.state.form } /> }
      </div>
    )
  };
};

export default connect()(withRouter(Customize));