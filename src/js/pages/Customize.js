
import React, { Component as C } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, Button, Form, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrash, FaReply, FaPlus, FaCheck, FaBars, FaMinus } from 'react-icons/fa';

import Actions from '../utils/Actions';
import CForm from '../utils/CForm';

import { VARIANT_TYPES, SYSTEM, PAGE, ACTION, PAGE_ACTION } from '../utils/Types';
import { DRAG, MOUSE, TYPE, ALIGN, HTML_TAG, CUSTOMIZE, ATTR, BOX_WIDTH } from '../utils/HtmlTypes';
import { JSON_OBJ } from '../utils/JsonUtils';
import Html from '../utils/HtmlUtils'
import Utils from '../utils/Utils';

import '../../css/Customize.css';
import Msg from '../../msg/Msg';

class Customize extends C {
  constructor(props) {
    super(props);

    this._onClickBack = this._onClickBack.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDragDrop = this._onDragDrop.bind(this);
    this._onClickDelete = this._onClickDelete.bind(this);
    this._onAlerEdit = this._onAlerEdit.bind(this);
    this._onCreateEditChange = this._onCreateEditChange.bind(this);
    this._onClickSaveOrEditItems = this._onClickSaveOrEditItems.bind(this);
    this._onCreateDivOrTab = this._onCreateDivOrTab.bind(this);
    this._onAddItemToDivTab = this._onAddItemToDivTab.bind(this);
    this._onRemoveItemToLists = this._onRemoveItemToLists.bind(this);
    this._updateFormData = this._updateFormData.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,options: this.props.options
      ,pageName: ''
      ,form: []
      ,error_msgs: []
      ,alertActions: { show: false, class: '', style: {} }
      ,overlayDeleteBox: { show: false, msg: '', class: 'div-overlay-box', style: { textAlign: 'center' } }
      ,overlayCreateEditBox: { show: false, msg: '', class: 'div-overlay-box', style: {}, obj: {} }
      ,draggable: 0
      ,dragobject: null
      ,dragparent: null
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

  _onClickBack() {
    this.state.isUser.action = PAGE.SYSTEM;
    this.state.isUser.path = ACTION.SLASH + PAGE.SYSTEM;
    this.state.isUser.actions = PAGE_ACTION.SYSTEM;
    this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
  }

  _onClickSubmit() {
    var obj = this.state.form[0].object;
    if(!Utils.isEmpty(obj)) {
      if(Array.isArray(obj)) {
        obj = obj[0].schema.properties;
      } else {
        obj = obj.schema.properties;
      }  
    }

    if(Utils.isEmpty(this.state.pageName) || Utils.isEmpty(obj) || Object.keys(obj).length <= 0) {
      if(Utils.isEmpty(this.state.pageName)) {
        this.state.error_msgs.push(Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(null, this.props.isUser.language, 'required'));
      }
      if(Utils.isEmpty(obj) || Object.keys(obj).length <= 0) {
        this.state.error_msgs.push(Msg.getMsg(null, this.props.isUser.language, 'title_fileld') + Msg.getMsg(null, this.props.isUser.language, 'setting'));
      }
      this.forceUpdate();
    } else {
      this._resetIdxJson();
      console.log(JSON.stringify(this.state.form));
      // this._onClickBack();
    }
  }

  _addTopDivSelected(obj) {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    if(Utils.isEmpty(div) || div.childNodes.length <= 0) return;
    var add = (obj.className.indexOf(' ' + ACTION.SELECTED) === -1);
    const objs = Array.from(div.childNodes);
    objs.map((o) => {
      if(Html.hasAttribute(o, ATTR.CLASS)) o.className = o.className.replace(' ' + ACTION.SELECTED, '');
    });
    if(add) obj.className = obj.className + ' ' + ACTION.SELECTED;
  }

  _addDragable(divs) {
    if(Utils.isEmpty(divs) || divs.length <= 0) return;
    for(let y=0; y<divs.length; y++) {
      const drags = divs[y];
      if(drags.tagName === HTML_TAG.BUTTON) continue;
      if(drags.getAttribute(DRAG.ABLE) !== 'true') {
        drags.setAttribute(DRAG.ABLE, 'true');
        drags.addEventListener(DRAG.START, this._onDragStart.bind(this), false);
      }
      const dragChilds = drags.childNodes[0].childNodes;
      for(let c=0; c<dragChilds.length; c++) {
        const dDrag = dragChilds[c];
        if(c === 0 && dDrag.tagName === HTML_TAG.LEGEND) continue;
        if(drags.getAttribute(DRAG.ABLE) !== 'true') {
          dDrag.setAttribute(DRAG.ABLE, 'true');
          dDrag.ondragstart = this._onDragStart.bind(this);
        }
      }
    }
  }

  _onMouseDown(e) {
    //console.log(e.target.tagName);
    const obj = e.target;
    if(obj.tagName === HTML_TAG.LEGEND) {
      this.state.draggable = 1;
      this.state.dragobject = obj.parentElement.parentElement;
      this.state.dragparent = this.state.dragobject.parentElement.parentElement.parentElement.parentElement;
      if(this.state.dragparent.id !== undefined && !this.state.dragparent.id.startsWith('div_customize_')) {
        this.state.dragparent = this.state.dragobject.parentElement.parentElement;
      }
      this._addTopDivSelected(this.state.dragparent);
    } else if(obj.tagName === HTML_TAG.LABEL && Utils.isEmpty(obj.className)) {
      this.state.draggable = 2;
      this.state.dragobject = obj.parentElement;
      this.state.dragparent = this.state.dragobject;
    } else if(obj.tagName === HTML_TAG.NAV) {
      this.state.draggable = 3;
      this.state.dragobject = obj.parentElement;
      this.state.dragparent = this.state.dragobject;
      this._addTopDivSelected(this.state.dragparent);
    } else if(obj.tagName === HTML_TAG.A) {
      this.state.draggable = 4;
      this.state.dragobject = obj;
      this.state.dragparent = this.state.dragobject.parentElement.parentElement;
    } else {
      this.state.draggable = 0;
      this.state.dragobject = null;
      this.state.dragparent = null;
    }
  }

  _onDragStart(e) {
    if(this.state.draggable <= 0) {
      e.preventDefault();
      e.stopPropagation();
    }
    //console.log('_onDragStart');
  }

  _onDragOver(e) {
    e.preventDefault();
    // //console.log('_onDragOver');
    // //console.log(e);
  }

  _onDragDrop(e) {
    e.preventDefault();
    if(Utils.isEmpty(this.state.dragobject)) {
      e.stopPropagation();
      return;
    }

    const obj = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    if(Utils.isEmpty(obj)) return;
    if(this.state.draggable === 1
      && (e.target.tagName === HTML_TAG.LEGEND || e.target.tagName === HTML_TAG.NAV)) {
      var div = null;
      var pDiv = null;
      if(e.target.tagName === HTML_TAG.NAV) {
        div = e.target.parentElement;
        pDiv = div;
      } else {
        div = e.target.parentElement.parentElement.parentElement;
        pDiv = div.parentElement.parentElement.parentElement.parentElement;
        // console.log(pDiv);
        if(div.id !== undefined && !div.id.startsWith('div_customize_')) {
          pDiv = e.target.parentElement.parentElement.parentElement.parentElement;
        }  
      }
      // console.log(div);
      // console.log(pDiv);

      if(Utils.isEmpty(pDiv) || Utils.isEmpty(this.state.dragparent)) return;
      const dpIdx = Array.from(obj.childNodes).indexOf(this.state.dragparent);
      const tpIdx = Array.from(obj.childNodes).indexOf(pDiv);
      if(dpIdx === tpIdx) {
        if(Utils.isEmpty(div.parentElement.childNodes) || div.parentElement.childNodes.length <= 0) return;
        const cPdivs = this.state.dragparent.childNodes[0].childNodes[0].childNodes[0].childNodes;
        if(Utils.isEmpty(cPdivs) || cPdivs.length <= 0) return;
        const dragId = Array.from(cPdivs).indexOf(div);
        const dropId = Array.from(cPdivs).indexOf(this.state.dragobject);
        if(dragId === dropId || dragId < 0) return;
        if(dragId < dropId) {
          div.before(this.state.dragobject);
        } else {
          div.after(this.state.dragobject);
        }
      } else {
        if(dpIdx > tpIdx) {
          pDiv.before(this.state.dragparent);
        } else {
          pDiv.after(this.state.dragparent);
        }
      }
    }

    if(this.state.draggable === 2) {
      const div = e.target.parentElement;
      const tPDiv = div.parentElement;
      const dPObj = this.state.dragobject.parentElement;
      if(tPDiv.id !== dPObj.id) return;
      var dragId = Array.from(tPDiv.childNodes).indexOf(div);
      var dropId = Array.from(tPDiv.childNodes).indexOf(this.state.dragobject);
      if(dragId < 0 || dropId < 0) return;
      if(!Utils.isEmpty(tPDiv.childNodes[0]) && tPDiv.childNodes[0].tagName === HTML_TAG.LEGEND) {
        if(dragId > 0) dragId -= 1;
        if(dropId > 0) dropId -= 1;
      }
      if(dragId < dropId) {
        div.before(this.state.dragobject);
      } else {
        div.after(this.state.dragobject);
      }
    }

    if(this.state.draggable === 3
      && (e.target.tagName === HTML_TAG.LEGEND || e.target.tagName === HTML_TAG.NAV)) {
      var div = null;
      if(e.target.tagName === HTML_TAG.NAV) {
        div = e.target.parentElement;
      } else {
        div = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        if(div.id !== undefined && !div.id.startsWith('div_customize_')) {
          div = e.target.parentElement.parentElement.parentElement.parentElement;
        }  
      }
      if(Utils.isEmpty(div) || Utils.isEmpty(this.state.dragparent)) return;
      const dpIdx = Array.from(obj.childNodes).indexOf(this.state.dragparent);
      const tpIdx = Array.from(obj.childNodes).indexOf(div);
      if(dpIdx > tpIdx) {
        div.before(this.state.dragparent);
      } else {
        div.after(this.state.dragparent);
      }
    }

    if(this.state.draggable === 4 && e.target.tagName === HTML_TAG.A) {
      const a = e.target;
      const nav = e.target.parentElement;
      if(a.tagName !== HTML_TAG.A || nav.tagName !== HTML_TAG.NAV) return;
      var div = nav.parentElement;
      const pdIdx = Array.from(div.parentElement.childNodes).indexOf(div);
      const ptIdx = Array.from(div.parentElement.childNodes).indexOf(this.state.dragparent);
      if(pdIdx === -1 || ptIdx === -1 || pdIdx !== ptIdx) return;
      const dpIdx = Array.from(nav.childNodes).indexOf(this.state.dragobject);
      const tpIdx = Array.from(nav.childNodes).indexOf(e.target);
      if(dpIdx > tpIdx) {
        a.before(this.state.dragobject);
      } else {
        a.after(this.state.dragobject);
      }
    }
  }

  _onMouseOver(e) {
    const obj = e.target;
    //console.log(obj);
    if((obj.tagName !== HTML_TAG.LEGEND
      && obj.tagName !== HTML_TAG.LABEL
      && obj.tagName !== HTML_TAG.NAV)
      || (!Utils.isEmpty(obj.className)) && obj.className.startsWith('form-')) return;
    obj.addEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    this.state.alertActions.show = true;
    this.state.alertActions.style = { top: obj.offsetTop, left: (obj.offsetLeft + obj.offsetWidth) - 110 };
    var className = 'div-customize-actions';
    if(obj.tagName === HTML_TAG.LABEL && Utils.isEmpty(obj.className)) {
      className += ' div-customize-actions-child';
      this.state.alertActions.style.left = (this.state.alertActions.style.left + 55);
    }
    this.state.alertActions.class = className;
    this.state.dragobject = obj;
    // console.log(this.state.form);
    this.forceUpdate();
  }

  _onMouseOut(e) {
    const obj = Html.getButton(e);
    if(!Utils.isEmpty(obj.className) && obj.className.startsWith('form-')) return;
    //console.log(obj.tagName);
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

  _resetIdxJson() {
    const obj = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    if(Utils.isEmpty(obj)) return;
    var objs = Array.from(obj.childNodes);
    var forms = this.state.form;
    objs.map((o, idx) => {
      const divIdx = o.getAttribute('idx');
      if(!Utils.isEmpty(divIdx)) {
        forms[divIdx].idx = idx;
        o.setAttribute('idx', idx);
        var childs = o.childNodes[0];
        if(childs.tagName === HTML_TAG.FORM) {
          childs = o.childNodes[0].childNodes[0].childNodes[0].childNodes;
          forms[divIdx].object.schema.fIdx = idx;
          var properties = forms[divIdx].object.schema.properties;
          console.log(properties);
          for(let i=0; i<childs.length; i++) {
            if(childs[i].tagName !== HTML_TAG.DIV) continue;
            const label = childs[i].childNodes[0];
            const field = label.getAttribute('for').replace('root_', '');
            console.log(field);
            properties[field].idx = i;
          }
        } else {
          const tabChilds = o.childNodes[0].childNodes;
          const divChilds = o.childNodes[1].childNodes;
          if(tabChilds.length !== divChilds.length) return;
          for(let i=0; i<divChilds.length; i++) {
            const tabIdx = tabChilds[i].getAttribute('data-rb-event-key');
            var object = forms[divIdx].object[tabIdx];
            object.schema.fIdx = idx;
            object.schema.idx = i;
            var properties = object.schema.properties;
            childs = divChilds[i].childNodes[0].childNodes[0].childNodes[0].childNodes;
            console.log(childs);
            console.log(properties);
            for(let o=0; o<childs.length; o++) {
              if(childs[o].tagName !== HTML_TAG.DIV) continue;
              const label = childs[o].childNodes[0];
              console.log(label);
              const field = label.getAttribute('for').replace('root_', '');
              console.log(field);
              properties[field].idx = o;
              }  
          }
        }
      }
    });
    // console.log(this.state.form);
    // console.log(forms);
  }

  _onAlertDivTabButtons() {
    //console.log("_onAlertDivTabButtons");
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj)) return;

    return(
      <Alert
        show={ this.state.alertActions.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.alertActions.class }
        style={ this.state.alertActions.style }>

        {(() => {
          if (obj.tagName === HTML_TAG.LEGEND || obj.tagName === HTML_TAG.NAV) {
            return(
              <Button
                type={ HTML_TAG.BUTTON }
                onMouseOver={ this._onMouseOut.bind(this) }
                onClick={ this._onOpenOverlayCreate.bind(this) }
                variant={ VARIANT_TYPES.SECONDARY }>
                <FaPlus />
              </Button>
            );
          }
        })()}

        <Button
          type={ HTML_TAG.BUTTON }
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onOpenOverlayEdit.bind(this) }
          variant={ VARIANT_TYPES.SECONDARY }>
          <FaEdit />
        </Button>
        <Button
          type={ HTML_TAG.BUTTON }
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onOpenOverlayDelete.bind(this) }
          variant={ VARIANT_TYPES.DANGER }>
          <FaTrash />
        </Button>
      </Alert>
    );
  }

  _onOpenOverlayEdit() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL && obj.tagName !== HTML_TAG.NAV)) return;
    this.state.mode = ACTION.EDIT;
    var idx = Html.getIdxParent(obj);
    var form = this.state.form[idx];
    var key = obj.getAttribute('for');
    var properties = null;
    if(!Utils.isEmpty(key)) {
      key = key.replace('root_', '');
      if(Array.isArray(form.object)) {
        const div = document.getElementById('div_customize_' + idx);
        properties = form.object[Html.getIdxTabSelected(div.childNodes[0])].schema.properties[key];
      } else {
        properties = form.object.schema.properties[key];
      }
    } else {
      if(Array.isArray(form.object)) {
        const div = document.getElementById('div_customize_' + idx);
        properties = form.object[Html.getIdxTabSelected(div.childNodes[0])].schema;
      } else {
        properties = form.object.schema;
      }
    }
    if(!Utils.isEmpty(properties)) this.state.overlayCreateEditBox.obj = properties.obj;  

    const labelKey = CUSTOMIZE.LABEL + '_' + this.state.isUser.language;
    this.state.overlayCreateEditBox.msg = '「' + this.state.overlayCreateEditBox.obj[labelKey] + '」' + Msg.getMsg(null, this.state.isUser.language, 'bt_edit');
    this.state.overlayCreateEditBox.show = true;
    this.state.overlayDeleteBox.show = false;
    this.forceUpdate();
  }

  _onOpenOverlayCreate() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL && obj.tagName !== HTML_TAG.NAV)) return;
    this.state.mode = ACTION.CREATE;
    const editObj = this.state.overlayCreateEditBox.obj;
    const label_language = CUSTOMIZE.LABEL + '_' + this.state.isUser.language;
    editObj[label_language] = '';

    const placehoders = [ HTML_TAG.LEGEND, HTML_TAG.NAV ];
    if(placehoders.includes(obj.tagName)) {
      const placeholder_language = CUSTOMIZE.PLACEHOLDER + '_' + this.state.isUser.language;
      editObj[placeholder_language] = '';  
    }

    editObj[CUSTOMIZE.TYPE] = TYPE.TEXT;
    // editObj[CUSTOMIZE.LABEL_ALIGN] = ALIGN.LEFT;
    // editObj[CUSTOMIZE.TEXT_ALIGN] = ALIGN.LEFT;
    editObj[CUSTOMIZE.LANGUAGE] = this.state.isUser.language;

    this.state.overlayCreateEditBox.msg = Msg.getMsg(null, this.state.isUser.language, 'bt_create');
    this.state.overlayCreateEditBox.show = true;
    this.state.overlayDeleteBox.show = false;
    this.forceUpdate();
  }

  _onChange(e) {
    const obj = e.target;
    if(Utils.isEmpty(obj)) return;
    if(obj.tagName === HTML_TAG.INPUT) {
      this.state.pageName = obj.value;
    }
    if(obj.tagName === HTML_TAG.SELECT) {
      console.log(obj);
      this.state.pageName = obj.value;
    }
    console.log(this.state.pageName);
  }

  _fileToBase64(files, editObj) {
    editObj.obj['file_data'] = [];
    Object.keys(files).map(i => {
      var reader = new FileReader();
      reader.onload = function () {
        editObj.obj['file_data'].push(reader.result);
      };
      reader.readAsDataURL(files[i]);
    });
  }

  _onAddItemToDivTab() {
    this.state.overlayCreateEditBox.obj['lists'].push({'valuel': '', 'label': ''});
    this.forceUpdate();
  }

  _onRemoveItemToLists(e) {
    var obj = Html.getButton(e);
    if(Utils.isEmpty(obj)) return;
    var idx = obj.id.split('_')[1];
    if(Number.isNaN(Number(idx))) return;
    this.state.overlayCreateEditBox.obj['lists'].splice(idx, 1);
    this.forceUpdate();
  }

  _onCreateDivOrTab(e) {
    const obj = e.target;
    if(Utils.isEmpty(obj)) return;
    if(obj.id === 'add_div') {
      const jObj = JSON_OBJ.getEditJSONObject(true, Object.keys(this.state.form).length, this.state.isUser.language);
      this.state.form.push(JSON_OBJ.getDafaultDivOrTab(true, Object.keys(this.state.form).length, jObj));
    }
    if(obj.id === 'add_tab') {
      const jObj = JSON_OBJ.getEditJSONObject(false, Object.keys(this.state.form).length, this.state.isUser.language);
      this.state.form.push(JSON_OBJ.getDafaultDivOrTab(false, Object.keys(this.state.form).length, jObj));
    }
    this.forceUpdate();
  }

  _onAlerEdit() {
    if(!this.state.overlayCreateEditBox.show) return '';
    var items = [];
    var aligns = [];
    var widths = [];
    var languages = [];
    var objs = Object.keys(TYPE);
    for (let i=0; i<objs.length; i++) {
      items.push( <option key={ i } value={ TYPE[objs[i]] }>{ TYPE[objs[i]] }</option> );
    }
    objs = Object.keys(ALIGN);
    for (let i=0; i<objs.length; i++) {
      aligns.push( <option key={ i } value={ ALIGN[objs[i]] }>{ ALIGN[objs[i]] }</option> );
    }
    objs = Object.keys(BOX_WIDTH);
    for (let i=0; i<objs.length; i++) {
      widths.push( <option key={ i } value={ objs[i] }>{ BOX_WIDTH[objs[i]] }</option> );
    }
    objs = Html.getLanguages();    
    for(let i=0; i<objs.length; i++) {
      languages.push( <option key={ i } value={ objs[i] }>{ Msg.getMsg(null, this.state.isUser.language, objs[i]) }</option> );
    }

    var obj = null;
    var editObj = this.state.overlayCreateEditBox.obj;
    if(this.state.mode === ACTION.EDIT) {
      obj = this.state.dragobject;
      items.push( <option key={ items.length } value={ HTML_TAG.TAB }>{ 'tab' }</option> );
    }

    var defaultType = TYPE.TEXT;
    const dateType = [ TYPE.DATE, TYPE.DATETIME, TYPE.TIME ];
    if(dateType.includes(editObj[CUSTOMIZE.TYPE])) {
        defaultType = (editObj[CUSTOMIZE.TYPE] === TYPE.DATETIME)?'datetime-local':editObj[CUSTOMIZE.TYPE];
    }

    return(
      <Alert
        id={ SYSTEM.IS_DIV_EDITOR_BOX }
        show={ this.state.overlayCreateEditBox.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.overlayCreateEditBox.class }>
        <div className='alert-light' style={ this.state.overlayCreateEditBox.style }>
          <div>
            <Button
              type={ HTML_TAG.BUTTON }
              onClick={ this._onClickSaveOrEditItems.bind(this) }
              variant={ VARIANT_TYPES.WARNING }>
              <FaCheck />
            </Button>
            <Button
              type={ HTML_TAG.BUTTON }
              onClick={ this._onClickClose.bind(this) }
              variant={ VARIANT_TYPES.INFO }>
              <FaReply />
            </Button>
          </div>

          <table className='table-overlay-box'>
            <tbody>
              <tr>
                <td colSpan='4'><h4>{ this.state.overlayCreateEditBox.msg }</h4></td>
              </tr>
              {/* {(() => {
                if (obj === null || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.NAV)) {
                  return( */}
                    <tr>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_type') }</td>
                      <td>
                        {(() => {
                          if (this.state.mode === ACTION.EDIT) {
                            return(
                              <FormControl
                                disabled
                                as={ HTML_TAG.SELECT }
                                name={ CUSTOMIZE.TYPE }
                                value={ editObj[CUSTOMIZE.TYPE] }
                                onChange={ this._onCreateEditChange.bind(this) }> { items }</FormControl>
                            );
                          } else {
                            return(
                              <FormControl
                                as={ HTML_TAG.SELECT }
                                name={ CUSTOMIZE.TYPE }
                                value={ editObj[CUSTOMIZE.TYPE] }
                                onChange={ this._onCreateEditChange.bind(this) }> { items }</FormControl>
                            );
                          }
                        })()}
                      </td>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_language') }</td>
                      <td>
                        <FormControl
                          as={ HTML_TAG.SELECT }
                          name={ CUSTOMIZE.LANGUAGE }
                          value={ editObj[CUSTOMIZE.LANGUAGE] }
                          onChange={ this._onCreateEditChange.bind(this) }>
                          { languages }
                        </FormControl>
                      </td>
                    </tr>
                  {/* );
                }
              })()} */}

              {/* {(() => {
                if (obj === null || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.NAV)) {
                  return( */}
                    <tr>
                      <td className='td-not-break'>
                        { Msg.getMsg(null, this.state.isUser.language, 'obj_label') }
                        <span className={ 'required' }>*</span>
                      </td>
                      <td>
                        <FormControl
                          type={ TYPE.TEXT }
                          name={ CUSTOMIZE.LABEL + '_' + editObj[CUSTOMIZE.LANGUAGE]}
                          // defaultValue={ editObj[CUSTOMIZE.LABEL + '_' + editObj[CUSTOMIZE.LANGUAGE]] }
                          value={ editObj[CUSTOMIZE.LABEL + '_' + editObj[CUSTOMIZE.LANGUAGE]] }
                          onChange={ this._onCreateEditChange.bind(this) }/>
                      </td>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_width') }</td>
                      <td>
                        <FormControl
                          as={ HTML_TAG.SELECT }
                          name={ CUSTOMIZE.BOX_WIDTH }
                          defaultValue={ editObj[CUSTOMIZE.BOX_WIDTH] }
                          onChange={ this._onCreateEditChange.bind(this) }> { widths }</FormControl>
                      </td>
                    </tr>    
                  {/* );
                }
              })()} */}

              {(() => {
                if (editObj[CUSTOMIZE.TYPE] !== TYPE.DISABLE
                    && obj === null 
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.DIV
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.TAB
                    || (obj !== null
                        && obj.tagName !== HTML_TAG.LEGEND
                        && obj.tagName !== HTML_TAG.NAV
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.DIV
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.TAB)) {
                  return(
                    <tr>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_placeholder') }</td>
                      <td>
                        <FormControl
                          type={ TYPE.TEXT }
                          name={ CUSTOMIZE.PLACEHOLDER + '_' + editObj[CUSTOMIZE.LANGUAGE] }
                          defaultValue={ editObj[CUSTOMIZE.PLACEHOLDER + '_' + editObj[CUSTOMIZE.LANGUAGE]] }
                          onChange={ this._onCreateEditChange.bind(this) }/>
                      </td>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_required') }</td>
                          <td>
                            <input
                              type={ HTML_TAG.CHECKBOX }
                              name={ CUSTOMIZE.REQUIRED }
                              defaultChecked={ editObj[CUSTOMIZE.REQUIRED] }
                              onChange={ this._onCreateEditChange.bind(this) }></input>
                            {(() => {
                              if (editObj[CUSTOMIZE.TYPE] === TYPE.FILE) {
                                return(<span style={{ marginLeft: '3em' }}>{ Msg.getMsg(null, this.state.isUser.language, 'obj_multiple_files') }</span>);
                              }
                            })()}
                            {(() => {
                              if (editObj[CUSTOMIZE.TYPE] === TYPE.FILE) {
                                return(
                                  <input
                                    type={ HTML_TAG.CHECKBOX }
                                    name={ CUSTOMIZE.MULTIPLE_FILE }
                                    defaultChecked={ editObj[CUSTOMIZE.MULTIPLE_FILE] }
                                    onChange={ this._onCreateEditChange.bind(this) }></input>
                                );
                              }
                            })()}
                        </td>
                    </tr>  
                  );
                }
              })()}

              {(() => {
                if ((obj === null
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.DIV
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.TAB)
                    || (obj !== null
                        && obj.tagName !== HTML_TAG.LEGEND
                        && obj.tagName !== HTML_TAG.NAV
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.DIV
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.TAB)) {
                  return(
                    <tr>
                      {(() => {
                        if (editObj[CUSTOMIZE.TYPE] !== TYPE.PASSWORD) {
                          return(
                            <td className='td-not-break'>
                              { Msg.getMsg(null, this.state.isUser.language, 'obj_default') }
                              {(() => {
                                if (editObj[CUSTOMIZE.TYPE] === TYPE.IMAGE || editObj[CUSTOMIZE.TYPE] === TYPE.DISABLE) {
                                  return(
                                    <span className={ 'required' }>*</span>
                                  );
                                }
                              })()}
                            </td>
                          );
                        }
                      })()}
                      {(() => {
                        if (editObj[CUSTOMIZE.TYPE] !== TYPE.PASSWORD
                            && editObj[CUSTOMIZE.TYPE] !== TYPE.FILE
                            && editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                            && editObj[CUSTOMIZE.TYPE] !== TYPE.COLOR) {
                          return(
                            <td>
                              <FormControl
                                type={ defaultType }
                                name={ CUSTOMIZE.DEFAULT }
                                defaultValue={ editObj[CUSTOMIZE.DEFAULT] }
                                onChange={ this._onCreateEditChange.bind(this) }/>
                            </td>
                          );
                        } else if(editObj[CUSTOMIZE.TYPE] === TYPE.FILE || editObj[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
                          return(
                            <td>
                              {(() => {
                                if(editObj[CUSTOMIZE.MULTIPLE_FILE]) {
                                  return(
                                    <Form.File
                                      multiple
                                      type={ TYPE.FILE }
                                      name={ CUSTOMIZE.DEFAULT }
                                      defaultValue={ editObj[CUSTOMIZE.DEFAULT] }
                                      onChange={ this._onCreateEditChange.bind(this) }/>
                                  );
                                } else {
                                  return(
                                    <Form.File
                                      type={ TYPE.FILE }
                                      name={ CUSTOMIZE.DEFAULT }
                                      defaultValue={ editObj[CUSTOMIZE.DEFAULT] }
                                      onChange={ this._onCreateEditChange.bind(this) }/>
                                  );
                                }
                              })()}
                            </td>
                          );
                        } else if(editObj[CUSTOMIZE.TYPE] === TYPE.COLOR) {
                          return(
                            <td>
                              {/* <FormControl
                                type={ TYPE.COLOR }
                                name={ CUSTOMIZE.DEFAULT }
                                defaultValue={ editObj[CUSTOMIZE.DEFAULT] }
                                onChange={ this._onCreateEditChange.bind(this) }/> */}

                              <input
                                type={ TYPE.COLOR }
                                name={ CUSTOMIZE.DEFAULT }
                                defaultValue={ editObj[CUSTOMIZE.DEFAULT] }
                                onChange={ this._onCreateEditChange.bind(this) } />
                            </td>
                          );
                        }
                      })()}

                      {(() => {
                        if (editObj[CUSTOMIZE.TYPE] !== TYPE.DISABLE && editObj[CUSTOMIZE.TYPE] !== TYPE.COLOR) {
                          return(
                            <td className='td-not-break'>
                              {(() => {
                                if (editObj[CUSTOMIZE.TYPE] === TYPE.FILE || editObj[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
                                  return('MaxSize(MB)');
                                } else {
                                  return('MaxLength');
                                }
                              })()}
                            </td>
                          );
                        }
                      })()}
                      {(() => {
                        if (editObj[CUSTOMIZE.TYPE] !== TYPE.DISABLE && editObj[CUSTOMIZE.TYPE] !== TYPE.COLOR) {
                          return(
                            <td>
                              <FormControl
                                type={ TYPE.NUMBER }
                                name={ CUSTOMIZE.MAX_LENGTH }
                                defaultValue={ editObj[CUSTOMIZE.MAX_LENGTH] }
                                onChange={ this._onCreateEditChange.bind(this) }/>
                            </td>
                          );
                        }
                      })()}
                    </tr>
                  );
                }
              })()}

              {/* {(() => {
                if ((editObj[CUSTOMIZE.TYPE] !== TYPE.PASSWORD
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.FILE
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE)
                    || (obj !== null
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                        && (obj.tagName === HTML_TAG.LEGEND || obj.tagName === HTML_TAG.NAV))) {
                  return(
                    <tr>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_title') }</td>
                      <td>
                        <input
                          type={ TYPE.COLOR }
                          name={ CUSTOMIZE.LABEL_COLOR }
                          defaultValue={ editObj[CUSTOMIZE.LABEL_COLOR] }
                          onChange={ this._onCreateEditChange.bind(this) }></input>
                        <span style={{ marginLeft: '3em' }}>{ Msg.getMsg(null, this.state.isUser.language, 'obj_background') }</span>
                        <input
                          type={ TYPE.COLOR }
                          name={ CUSTOMIZE.LABEL_LAYOUT_COLOR }
                          defaultValue={ editObj[CUSTOMIZE.LABEL_LAYOUT_COLOR] }
                          onChange={ this._onCreateEditChange.bind(this) }></input>
                      </td>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_align') }</td>
                      <td>
                        <FormControl
                          as={ HTML_TAG.SELECT }
                          name={ CUSTOMIZE.LABEL_ALIGN }
                          defaultValue={ editObj[CUSTOMIZE.LABEL_ALIGN] }
                          onChange={ this._onCreateEditChange.bind(this) }>
                          { aligns }
                        </FormControl>
                      </td>
                    </tr>
                  );
                }
              })()}

              {(() => {
                if ((obj === null
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.PASSWORD
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.FILE
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.DIV
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.TAB)
                    || (obj !== null 
                        && obj.tagName !== HTML_TAG.LEGEND 
                        && obj.tagName !== HTML_TAG.NAV 
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.PASSWORD
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.FILE
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.DIV
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.TAB)) {
                  return(
                    <tr>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_text') }</td>
                      <td>
                        <input
                          type={ TYPE.COLOR }
                          name={ CUSTOMIZE.TEXT_COLOR }
                          defaultValue={ editObj[CUSTOMIZE.TEXT_COLOR] }
                          onChange={ this._onCreateEditChange.bind(this) }></input>
                        <span style={{ marginLeft: '3em' }}>{ Msg.getMsg(null, this.state.isUser.language, 'obj_background') }</span>
                        <input
                          type={ TYPE.COLOR }
                          name={ CUSTOMIZE.TEXT_LAYOUT_COLOR }
                          defaultValue={ editObj[CUSTOMIZE.TEXT_LAYOUT_COLOR] }
                          onChange={ this._onCreateEditChange.bind(this) }></input>
                      </td>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_align') }</td>
                      <td>
                        <FormControl
                          as={ HTML_TAG.SELECT }
                          name={ CUSTOMIZE.TEXT_ALIGN }
                          defaultValue={ editObj[CUSTOMIZE.TEXT_ALIGN] }
                          onChange={ this._onCreateEditChange.bind(this) }>
                          { aligns }
                        </FormControl>
                      </td>
                    </tr>
                  );
                }
              })()} */}

              {(() => {
                if ((editObj[CUSTOMIZE.TYPE] !== TYPE.PASSWORD
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.FILE
                    && editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE)
                    || (obj !== null
                        && editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                        && (obj.tagName === HTML_TAG.LEGEND || obj.tagName === HTML_TAG.NAV))) {
                  return(
                    <tr>
                      <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_css_style') }</td>
                      <td>
                        <FormControl
                          type={ TYPE.TEXT }
                          name={ CUSTOMIZE.STYLE }
                          defaultValue={ editObj[CUSTOMIZE.STYLE] }
                          onChange={ this._onCreateEditChange.bind(this) }/>
                      </td>
                      {(() => {
                        if (editObj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                            || editObj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
                          return(
                            <td className='td-not-break'>
                              { Msg.getMsg(null, this.state.isUser.language, 'obj_list_type') }
                            </td>
                          );
                        }
                      })()}
                      {(() => {
                        if (editObj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                            || editObj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
                          return(
                            <td>
                              {/* <Form.Check
                                type={ TYPE.CHECKBOX }
                                name={ 'list_checked' }
                                defaultChecked={ editObj['list_checked'] }
                                onChange={ this._onCreateEditChange.bind(this) }/> */}
                              <input
                                type={ HTML_TAG.CHECKBOX }
                                name={ 'list_checked' }
                                checked={ editObj['list_checked'] }
                                onChange={ this._onCreateEditChange.bind(this) }></input>
                              {/* <span style={{ marginLeft: '3em' }}>Inline</span>
                              <input
                                type={ HTML_TAG.CHECKBOX }
                                name={ 'list_inline' }
                                checked={ editObj['list_inline'] }
                                onChange={ this._onCreateEditChange.bind(this) }></input> */}
                            </td>
                          );
                        }
                      })()}
                    </tr>
                  );
                }
              })()}

              {(() => {
                if (editObj[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                  && editObj[CUSTOMIZE.TYPE] !== TYPE.DIV
                  && editObj[CUSTOMIZE.TYPE] !== TYPE.TAB) {
                  return(
                    <tr>
                      <td colSpan='4'>
                        <div className={ 'div-overlay-box-add-items' }>
                          <table className='table-overlay-box'>
                            <tbody>
                              {(() => {
                                // if (this.state.overlayCreateEditBox.obj['list_checked'] && (editObj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || editObj[CUSTOMIZE.TYPE] === TYPE.RADIO)) {
                                if (editObj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                                  || editObj[CUSTOMIZE.TYPE] === TYPE.RADIO
                                  || editObj[CUSTOMIZE.TYPE] === TYPE.LIST) {
                                  if(editObj['lists'] === undefined) {
                                    if(editObj[CUSTOMIZE.TYPE] === TYPE.RADIO) {
                                      editObj['lists'] = [{ 'value': '', 'label': '' }, { 'value': '', 'label': '' }];
                                    } else {
                                      editObj['lists'] = [{ 'value': '', 'label': '' }];
                                    }
                                  }
                                  const objs = Array.from(editObj['lists']);
                                  return objs.map((o, idx) => {
                                    return(
                                      <tr key={ idx }>
                                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_id') }</td>
                                        <td>
                                          <FormControl
                                            type={ TYPE.TEXT }
                                            id={ 'values_' + idx }
                                            name={ 'obj_lists' }
                                            defaultValue={ o['value'] }
                                            onChange={ this._onCreateEditChange.bind(this) }/>
                                        </td>
                                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_value') }</td>
                                        <td>
                                          <table>
                                            <tbody>
                                              <tr>
                                                <td>
                                                  <FormControl
                                                    type={ TYPE.TEXT }
                                                    id={ 'labels_' + idx }
                                                    name={ 'obj_lists' }
                                                    defaultValue={ o['label'] }
                                                    onChange={ this._onCreateEditChange.bind(this) }/>
                                                </td>
                                                <td style={ {'width': 0} }>
                                                  {(() => {
                                                    if(idx === 0) {
                                                      return (
                                                        <Button
                                                          type={ TYPE.BUTTON }
                                                          id={ 'btnitems_' + idx }
                                                          className={ 'button-overlay-box-add-items' }
                                                          onClick={ this._onAddItemToDivTab.bind(this) }
                                                          variant={ VARIANT_TYPES.PRIMARY }>
                                                          <FaPlus />
                                                        </Button>
                                                      );
                                                    } else {
                                                      if(editObj[CUSTOMIZE.TYPE] === TYPE.RADIO && idx === 1) {
                                                        return('');
                                                      } else {
                                                        return (
                                                          <Button
                                                            type={ TYPE.BUTTON }
                                                            id={ 'btnitems_' + idx }
                                                            className={ 'button-overlay-box-add-items' }
                                                            onClick={ this._onRemoveItemToLists.bind(this) }
                                                            variant={ VARIANT_TYPES.SECONDARY }>
                                                            <FaMinus />
                                                          </Button>
                                                        );  
                                                      }
                                                    }
                                                  })()}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    );  
                                  })
                                }
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  );
                }
              })()}
            </tbody>
          </table>
        </div>
      </Alert>
    );
  }

  _onOpenOverlayDelete() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL && obj.tagName !== HTML_TAG.NAV)) return;
    this.state.overlayDeleteBox.msg = '「' + obj.innerText + '」' + 'を削除してよろしくですか？';
    this.state.overlayDeleteBox.show = true;
    this.state.overlayCreateEditBox.show = false;
    this.forceUpdate();
  }

  _onClickDelete() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.NAV && obj.tagName !== HTML_TAG.LABEL)) return;
    if(obj.tagName === HTML_TAG.LEGEND) {
      if(!Html.hasAttribute(obj.parentElement, ATTR.ID)) return;
      const idx = Html.getIdxParent(obj);
      if(!Number.isNaN(Number(idx))) this.state.form.splice(idx, 1);
    }
    if(obj.tagName === HTML_TAG.NAV) {
      const idx = Html.getIdxParent(obj);
      if(Number.isNaN(Number(idx))) return;
      var tabIdx = null;
      const arr = Array.from(obj.childNodes);
      for(let i=0; i<arr.length; i++) {
        if(obj.childNodes[i] === undefined
          || obj.childNodes[i].getAttribute('aria-selected') !== 'true') continue;
          tabIdx = i;
          break;
      }
      if(arr.length <= 1) {
        this.state.form.splice(idx, 1);
      } else {
        if(!Number.isNaN(Number(tabIdx))) this.state.form[idx].object.splice(tabIdx, 1);
      }
    }
    if(obj.tagName === HTML_TAG.LABEL) {
      if(!Html.hasAttribute(obj, ATTR.FOR)) return;
      const divParent = Html.getDivParent(obj);
      var isDiv = true;
      if(!Utils.isEmpty(divParent.childNodes[0]) && divParent.childNodes[0].tagName === HTML_TAG.NAV) {
        isDiv = false;
      }
      const key = obj.getAttribute(ATTR.FOR).replace('root_', '');
      // const idxs = key.split('_');
      const idx = Html.getIdxParent(obj);
      if(isDiv) {
        if(Utils.inJson(this.state.form[idx].object.schema.properties, key))
          delete this.state.form[idx].object.schema.properties[key];
        if(Utils.inJson(this.state.form[idx].object.ui, key))
          delete this.state.form[idx].object.ui[key];
        if(Utils.inJson(this.state.form[idx].object.data, key))
          delete this.state.form[idx].object.data[key];
      } else {
        const selTabIdx = Html.getIdxTabSelected(divParent.childNodes[0]);
        if(Utils.inJson(this.state.form[idx].object[selTabIdx].schema.properties, key))
          delete this.state.form[idx].object[selTabIdx].schema.properties[key];
        if(Utils.inJson(this.state.form[idx].object[selTabIdx].ui, key))
          delete this.state.form[idx].object[selTabIdx].ui[key];
        if(Utils.inJson(this.state.form[idx].object[selTabIdx].data, key))
          delete this.state.form[idx].object[selTabIdx].data[key];
      }
    }

    this.state.alertActions.show = false;
    this.state.overlayDeleteBox.show = false;
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
    this.state.overlayCreateEditBox.obj = {};
    this.state.overlayDeleteBox.show = false;
    this.state.overlayCreateEditBox.show = false;
    this.forceUpdate();
  }

  _onClickSaveOrEditItems() {
    var div = this.state.dragobject.parentElement;
    var obj = this.state.overlayCreateEditBox.obj;
    if(Utils.isEmpty(div) || Utils.isEmpty(obj)) return;
    const labelKey = CUSTOMIZE.LABEL + '_' + this.state.isUser.language;
    if(Utils.isEmpty(obj[labelKey])) {
      this.state.overlayCreateEditBox.msg = Msg.getMsg(null, this.state.isUser.language, 'obj_label') + Msg.getMsg(null, this.state.isUser.language, 'required');
    } else if(obj[CUSTOMIZE.TYPE] === TYPE.DISABLE && Utils.isEmpty(obj[CUSTOMIZE.DEFAULT])) {
      this.state.overlayCreateEditBox.msg = Msg.getMsg(null, this.state.isUser.language, 'obj_default') + Msg.getMsg(null, this.state.isUser.language, 'required');
    } else if((obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO || obj[CUSTOMIZE.TYPE] === TYPE.LIST)
      && (Utils.isEmpty(obj['lists']) || Utils.isEmpty(obj['lists'][0]['value']) || Utils.isEmpty(obj['lists'][0]['label']))) {
      this.state.overlayCreateEditBox.msg = Msg.getMsg(null, this.state.isUser.language, 'bt_list') + Msg.getMsg(null, this.state.isUser.language, 'required');
    } else {
      if(this.state.mode === ACTION.EDIT
        && !div.id.startsWith('div_customize_')
        && this.state.dragobject.tagName === HTML_TAG.LABEL) {
        div = Html.getDivParent(this.state.dragobject);
      }
      if(this.state.mode === ACTION.CREATE
        && !div.id.startsWith('div_customize_')) {
        div = this.state.dragobject.parentElement.parentElement.parentElement.parentElement;
      }

      var idx = div.id.split('_')[2];
      if(Number.isNaN(Number(idx))
        && (this.state.dragobject.tagName === HTML_TAG.LEGEND || this.state.dragobject.tagName === HTML_TAG.NAV)) {
          idx = Html.getIdxParent(this.state.dragobject);
      }

      var form = this.state.form[idx];
      if(Utils.isEmpty(form)) return;
      var fObj = form.object;
      if(this.state.dragobject.tagName === HTML_TAG.NAV || Array.isArray(form.object)) {
        fObj = form.object[Html.getIdxTabSelected(this.state.dragobject)];
      } else {
        fObj = form.object;
      }

      if(this.state.mode === ACTION.EDIT
        && (this.state.dragobject.tagName === HTML_TAG.LEGEND || this.state.dragobject.tagName === HTML_TAG.NAV)) {
        if(this.state.dragobject.tagName === HTML_TAG.NAV) {
          form.object[Html.getIdxTabSelected(this.state.dragobject)].schema['tab_name'] = obj[labelKey];
        } else {
          form.object.schema['title'] = obj[labelKey];
        }
        if(!Utils.isEmpty(obj[CUSTOMIZE.BOX_WIDTH])) {
          form['class_name'] = 'div-box div-box-' + obj[CUSTOMIZE.BOX_WIDTH];
        }

        // Add temp field because Form update only change dataForm
        JSON_OBJ.addTempData(fObj);
      } else {
        var itemName = '';
        if(this.state.mode === ACTION.EDIT && Utils.inJson(obj, 'item_name')) {
          itemName = obj['item_name'];
        } else {
          itemName = obj[CUSTOMIZE.TYPE] + '_' + Math.random().toString(36).slice(-8);
        }
  
        if(Utils.inJson(fObj.schema.properties, itemName)) {
          delete fObj.schema.properties[itemName];
        }    
        const idx = Object.keys(fObj.schema.properties).length;
        const def = JSON_OBJ.getDefinitions(obj);
        if(!Utils.isEmpty(def)) {
          fObj.schema.definitions[itemName] = def;
          fObj.schema.properties[itemName] = JSON_OBJ.getJsonSchema(obj, itemName, labelKey, idx);
        } else {
          fObj.schema.properties[itemName] = JSON_OBJ.getJsonSchema(obj, itemName, labelKey, idx);
        }
  
        const placeholderKey = CUSTOMIZE.PLACEHOLDER + '_' + this.state.isUser.language;
        fObj.ui[itemName] = JSON_OBJ.getJsonUi(obj, placeholderKey);
        fObj.data[itemName] = JSON_OBJ.getDatas(obj, itemName);
        // Add temp field because Form update only change dataForm
        JSON_OBJ.addTempData(fObj);
      }

      this.state.form[idx] = form;
      this.state.dragobject = null;
      this.state.overlayCreateEditBox.obj = {};
      this.state.overlayDeleteBox.show = false;
      this.state.overlayCreateEditBox.show = false;
      // console.log(this.state.form);
    }
    this.forceUpdate();
  }

  _onCreateEditChange(e) {
    const obj = e.target;
    if(Utils.isEmpty(obj)) return;
    const name = obj.name;
    const editObj = this.state.overlayCreateEditBox;
    const type = editObj.obj[CUSTOMIZE.TYPE];

    if(name === CUSTOMIZE.DEFAULT && (type === TYPE.FILE || type === TYPE.IMAGE)) {
      var files = obj.files;
      console.log(files);
      if(Utils.isEmpty(files) || files.length <= 0) {
        if(Utils.inJson(editObj.obj, 'file_data')) delete editObj.obj['file_data'];
      } else {
        this._fileToBase64(files, editObj);
      }
    } else {
      var val = obj.value;
      if(name === 'obj_lists'
        && (type === TYPE.CHECKBOX || type === TYPE.RADIO || type === TYPE.LIST)
        && name !== CUSTOMIZE.LANGUAGE ) {
        var idx = obj.id.split('_')[1];
        if(Number.isNaN(Number(idx))) return;
        var lObj = editObj.obj['lists'][idx];
        if(obj.id.startsWith('values_')) {
          lObj['value'] = obj.value;
        } 
        if(obj.id.startsWith('labels_')) {
          lObj['label'] = obj.value;
        }
        editObj.obj['lists'][idx] = lObj;
      } else {
        if(obj.type === TYPE.CHECKBOX) {
          val = obj.checked;
        }
        editObj.obj[name] = val;
        if(type !== TYPE.CHECKBOX && type !== TYPE.RADIO && type !== TYPE.LIST && name !== CUSTOMIZE.LANGUAGE) {
          delete editObj.obj['list_checked'];
          delete editObj.obj['lists'];
        } else if (name === CUSTOMIZE.LANGUAGE) {
          const label_language = CUSTOMIZE.LABEL + '_' + val;
          if (editObj.obj[label_language] === undefined) {
            editObj.obj[label_language] = '';
          }
  
          const placehoders = [ HTML_TAG.LEGEND, HTML_TAG.NAV ];
          const placeholder_language = CUSTOMIZE.PLACEHOLDER + '_' + val;
          if(!placehoders.includes(obj.tagName)) {
            if (editObj.obj[placeholder_language] === undefined) {
              editObj.obj[placeholder_language] = '';
            }
          }
        }
      }

      if(Utils.inJson(editObj, 'file_data')) delete editObj['file_data'];
    }

    if(Utils.isEmpty(editObj.obj[CUSTOMIZE.BOX_WIDTH])) {
      if(editObj.obj[CUSTOMIZE.TYPE] === TYPE.DIV) {
        editObj.obj[CUSTOMIZE.BOX_WIDTH] = 100;
      } else {
        editObj.obj[CUSTOMIZE.BOX_WIDTH] = 25;
      }
    }

    this.setState({ overlayCreateEditBox: editObj });
    this.forceUpdate();
  }

  _onoverlayDeleteBox() {
    if(!this.state.overlayDeleteBox.show) return '';
    return(
      <Alert
        show={ this.state.overlayDeleteBox.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.overlayDeleteBox.class }>
        <div className='alert-light' style={ this.state.overlayDeleteBox.style }>
          <h4>{ this.state.overlayDeleteBox.msg }</h4>
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
    items.push( <option key={ 'frist_option' } value={ '0' }>{ '---' }</option> );
    for (let i=0; i<menus.length; i++) {
      items.push( <option key={ i } value={ menus[i].id }>{ menus[i].label }</option> );
    }
    return(
      <div>
        <Button
          type={ TYPE.BUTTON }
          className="btn-create-div"
          id={ 'add_div' }
          onClick={ this._onCreateDivOrTab.bind(this) }
          variant={ VARIANT_TYPES.PRIMARY }>
          {/* <FaPlus /> */}
          { Msg.getMsg(null, this.props.isUser.language, 'bt_div') }
        </Button>
        <Button
          type={ TYPE.BUTTON }
          className="btn-create-tab"
          id={ 'add_tab' }
          onClick={ this._onCreateDivOrTab.bind(this) }
          variant={ VARIANT_TYPES.PRIMARY }>
          {/* <FaPlus /> */}
          { Msg.getMsg(null, this.props.isUser.language, 'bt_tab') }
        </Button>

        {(() => {
          if (this.state.mode === ACTION.CREATE) {
            return (
              <div className='div-customize-title-box'>
                <FormControl
                  type={ HTML_TAG.TEXT }
                  defaultValue={ this.state.pageName }
                  onChange={ this._onChange.bind(this) }
                  placeholder={ Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(null, this.props.isUser.language, 'required') }
                  className="mr-sm-2" />
                <Button
                  type={ TYPE.BUTTON }
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
                <FormControl
                  as={ HTML_TAG.SELECT }
                  onChange={ this._onChange.bind(this) }
                  defaultValue={ TYPE.TEXT }> { items }</FormControl>
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

  _onAddDragDrop(div) {
    if(Utils.isEmpty(div) || div.childNodes.length <= 0) return;
    const objs = div.childNodes;
    for(let i=0; i<objs.length; i++) {
      const cDiv = objs[i];
      if(Utils.isEmpty(cDiv.childNodes) || Utils.isEmpty(cDiv.childNodes[0])) continue;
      if(cDiv.getAttribute(DRAG.ABLE) !== 'true') {
        cDiv.setAttribute(DRAG.ABLE, 'true');
        cDiv.addEventListener(DRAG.START, this._onDragStart.bind(this), false);  
      }
      const tag =  cDiv.childNodes[0].tagName;
      if(tag === HTML_TAG.FORM) {
        this._addDragable(cDiv.childNodes[0].childNodes[0].childNodes[0].childNodes);
      }
      if(tag === HTML_TAG.NAV && cDiv.childNodes.length > 1) {
        const nAs = cDiv.childNodes[0].childNodes;
        for(let a=0; a<nAs.length; a++) {
          if(nAs[a].getAttribute(DRAG.ABLE) !== 'true') {
            nAs[a].setAttribute(DRAG.ABLE, 'true');
            nAs[a].addEventListener(DRAG.START, this._onDragStart.bind(this), false);  
          }
        }
        const divDrags = cDiv.childNodes[1].childNodes;
        for(let y=0; y<divDrags.length; y++) {
          this._addDragable(divDrags[y].childNodes[0].childNodes[0].childNodes[0].childNodes);
        }
      }
    }
  }

  _updateFormData(e) {
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

  _getErrorMsg() {
    if(Utils.isEmpty(this.state.error_msgs) || this.state.error_msgs.length <= 0) return '';
    // setTimeout(function(){ this.state.error_msgs = [] }, 3000);
    return this.state.error_msgs.map((o, idx) => {
      return(
        <div key={ idx } className={ 'invalid-feedback' } style={ {display: 'block'} }>{ o }</div>
      );  
    });
  }

  UNSAFE_componentWillUpdate() {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    this._onAddDragDrop(div);
  }

  componentDidMount() {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    if(Utils.isEmpty(div) || div.childNodes.length <= 0) return;
    div.addEventListener(MOUSE.MOUSEDOWN, this._onMouseDown.bind(this), true);
    div.addEventListener(DRAG.OVER, this._onDragOver.bind(this), false);
    div.addEventListener(DRAG.DROP, this._onDragDrop.bind(this), false);
    div.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);
    this._onAddDragDrop(div);
  }

  UNSAFE_componentWillMount(){
    const jObj = JSON_OBJ.getEditJSONObject(true, Object.keys(this.state.form).length, this.state.isUser.language);
    this.state.form.push(JSON_OBJ.getDafaultDivOrTab(true, Object.keys(this.state.form).length, jObj));
  }

  render() {
    this.state.isUser.actions = PAGE_ACTION.CREATE;

    return (
      <div>
        { this._getErrorMsg() }
        { this._getTitle() }
        { this._onAlerEdit() }
        { this._onAlertDivTabButtons() }
        { this._onoverlayDeleteBox() }
        <CForm
          isUser={ this.state.isUser }
          form={ this.state.form }
          updateFormData={ this._updateFormData.bind(this) } />
        <Actions
          isUser={ this.state.isUser }
          onClickBack={ this._onClickBack.bind(this) }
          onClickSubmit={ this._onClickSubmit.bind(this) } />
      </div>
    )
  };
};

export default connect()(withRouter(Customize));