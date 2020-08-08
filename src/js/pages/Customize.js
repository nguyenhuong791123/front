
import React, { Component as C } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrash, FaReply, FaPlus, FaCopy, FaCheck, FaBars } from 'react-icons/fa';
import StringUtil from 'util';

import Actions from '../utils/Actions';
import CForm from '../utils/CForm';
import CustomizeBox from '../utils/Compoment/CustomizeBox';

import { VARIANT_TYPES, SYSTEM, PAGE, ACTION, PAGE_ACTION, MSG_TYPE } from '../utils/Types';
import { DRAG, MOUSE, TYPE, HTML_TAG, CUSTOMIZE, ATTR, OPTIONS_KEY, OPTION_AUTH } from '../utils/HtmlTypes';
import { JSON_OBJ } from '../utils/JsonUtils';
import Html from '../utils/HtmlUtils'
import Utils from '../utils/Utils';
import Fetch from '../utils/Fetch';

import '../../css/Customize.scss';
import Msg from '../../msg/Msg';

class Customize extends C {
  constructor(props) {
    super(props);

    this._onClickBack = this._onClickBack.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDragDrop = this._onDragDrop.bind(this);
    this._onClickDelete = this._onClickDelete.bind(this);
    this._onAlerEdit = this._onAlerEdit.bind(this);
    // this._onCreateEditChange = this._onCreateEditChange.bind(this);
    this._onClickSaveOrEditItems = this._onClickSaveOrEditItems.bind(this);
    this._onCreateDivOrTab = this._onCreateDivOrTab.bind(this);
    // this._onAddItemToDivTab = this._onAddItemToDivTab.bind(this);
    // this._onRemoveItemToLists = this._onRemoveItemToLists.bind(this);
    this._onUpdateFormData = this._onUpdateFormData.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,options: this.props.options
      ,page: { page_id: '', page_name: '', page_key: '', page_auth: { }, form: [] }
      ,pageMode: ACTION.CREATE
      ,error_msgs: []
      ,selectDisabled: false
      ,alertActions: { show: false, class: '', style: {} }
      ,overlayDeleteBox: { show: false, msg: '', class: 'div-overlay-box', style: { textAlign: 'center' } }
      ,overlayCreateEditBox: { show: false, msg: '', class: 'div-overlay-box', style: {}, obj: {} }
      ,draggable: 0
      ,dragobject: null
      ,dragparent: null
      ,mode: ACTION.CREATE
      ,menus: this.props.menus
    }
  };

  _onClickCopy() {
    this.state.pageMode = ACTION.CREATE;
    const page = this.state.page;
    page.page_id = '';
    page.page_name = '';
    this.state.selectDisabled = false;
    this.forceUpdate();
  }

  _onClickBack() {
    this.state.isUser.action = PAGE.SYSTEM;
    this.state.isUser.path = ACTION.SLASH + PAGE.SYSTEM;
    this.state.isUser.actions = PAGE_ACTION.SYSTEM;
    this.props.onUpdateUser(this.state.isUser, this.state.options, this.state.menus, this.props.onUpdateIsUserCallBack);
  }

  _onClickSubmit() {
    var obj = null;
    if(Utils.inJson(this.state.page.form[0], 'object')) {
      obj = this.state.page.form[0].object;
      if(Array.isArray(obj)) {
        obj = obj[0].schema.properties;
      } else {
        obj = obj.schema.properties;
      }  
    }

    if(Utils.isEmpty(this.state.page.page_name) || Utils.isEmpty(obj) || Object.keys(obj).length <= 0) {
      if(Utils.isEmpty(this.state.page.page_name)) {
        this.state.error_msgs.push(Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'required'));
      }
      if(Utils.isEmpty(obj) || Object.keys(obj).length <= 0) {
        this.state.error_msgs.push(Msg.getMsg(null, this.props.isUser.language, 'title_field') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'setting'));
      }
      this.forceUpdate();
    } else {
      this._resetIdxJson();
      // console.log(JSON.stringify(this.state.page));
      // this._onClickBack();
      if(Utils.isEmpty(this.state.page['page_key'])) {
        this.state.page.page_key = 'table_' + Utils.getUUID();
      }
      const options = { page: this.state.page, cId: this.state.isUser.cId, uId: this.state.isUser.uId };
      const host = Msg.getSystemMsg('sys', 'app_api_host');
      const f = Fetch.postLogin(host + 'setPage', options);
      f.then(data => {
        if(!Utils.isEmpty(data) && Utils.inJson(data, 'page_id')) {
          this.state.menus.push(data);
          this._onClickBack();
        }
      }).catch(err => {
        console.log(err);
      });
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
      || (!Utils.isEmpty(obj.className) && (obj.className.startsWith('form-') || obj.className.startsWith('rdw-')))
      || obj.tagName === HTML_TAG.LABEL && Utils.isEmpty(obj.getAttribute('for'))) return;
    obj.addEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    this.state.alertActions.show = true;
    const pos = obj.getBoundingClientRect();
    this.state.alertActions.style = { top: (obj.tagName === HTML_TAG.NAV)?(pos.y + 3):pos.y, left: (obj.offsetLeft + obj.offsetWidth) - 110 };
    if(obj.tagName === HTML_TAG.NAV) {
      var selected = obj.childNodes[obj.childNodes.length - 1];
      this.state.alertActions.add_tab_style = { top: (selected.offsetTop + 3), left : (selected.offsetLeft + selected.offsetWidth) + 5 };
      this.state.alertActions.add_tab_show = true;
    } else {
      this.state.alertActions.add_tab_show = false;
    }
    var className = 'div-customize-actions';
    if(obj.tagName === HTML_TAG.LABEL && Utils.isEmpty(obj.className)) {
      const pos = obj.getBoundingClientRect();
      className += ' div-customize-actions-child';
      this.state.alertActions.style = { top: pos.y, left : (pos.x + pos.width) - 55, zIndex: 2 };
    }
    this.state.alertActions.class = className;
    this.state.dragobject = obj;
    // console.log(this.state.page.form);
    this.forceUpdate();
  }

  _onMouseOut(e) {
    const obj = Html.getButton(e);
    if(!Utils.isEmpty(obj.className) && obj.className.startsWith('form-')) return;
    // console.log(this.state.dragobject);
    if(obj.tagName === HTML_TAG.BUTTON) {
      this.state.alertActions.show = true;
      if(this.state.dragobject.tagName === HTML_TAG.NAV) this.state.alertActions.add_tab_show = true;
    } else {
      this.state.alertActions.show = false;
      this.state.alertActions.add_tab_show = false;
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
    var forms = this.state.page.form;
    objs.map((o, idx) => {
      const divIdx = o.getAttribute('idx');
      if(!Utils.isEmpty(divIdx)) {
        forms[divIdx].idx = idx;
        o.setAttribute('idx', idx);
        var childs = o.childNodes[0];
        if(childs.tagName === HTML_TAG.FORM) {
          childs = o.childNodes[0].childNodes[0].childNodes[0].childNodes;
          forms[divIdx].object.schema.form_idx = idx;
          var properties = forms[divIdx].object.schema.properties;
          if(Utils.inJson(properties, 'hidden_form_reload')) {
            delete properties['hidden_form_reload'];
            if(Utils.inJson(forms[divIdx].object.data, 'hidden_form_reload')) delete forms[divIdx].object.data['hidden_form_reload'];
            if(Utils.inJson(forms[divIdx].object.ui, 'hidden_form_reload')) delete forms[divIdx].object.ui['hidden_form_reload'];
          }
          // console.log(properties);
          for(let i=0; i<childs.length; i++) {
            if(childs[i].tagName !== HTML_TAG.DIV) continue;
            const label = childs[i].childNodes[0];
            if(Utils.isEmpty(label) || Utils.isEmpty(label.getAttribute('for'))) continue;
            const field = label.getAttribute('for').replace('root_', '');
            // console.log(field);
            properties[field].idx = i;
            if(Utils.inJson(properties[field].obj, OPTIONS_KEY.OPTIONS_FILE)) delete properties[field].obj[OPTIONS_KEY.OPTIONS_FILE];
          }
        } else {
          const tabChilds = o.childNodes[0].childNodes;
          const divChilds = o.childNodes[1].childNodes;
          if(tabChilds.length !== divChilds.length) return;
          for(let i=0; i<divChilds.length; i++) {
            const tabIdx = tabChilds[i].getAttribute('data-rb-event-key');
            var object = forms[divIdx].object[tabIdx];
            object.schema.form_idx = idx;
            object.schema.idx = i;
            var properties = object.schema.properties;
            if(Utils.inJson(properties, 'hidden_form_reload')) {
              delete properties['hidden_form_reload'];
              if(Utils.inJson(object.data, 'hidden_form_reload')) delete object.data['hidden_form_reload'];
              if(Utils.inJson(object.ui, 'hidden_form_reload')) delete object.ui['hidden_form_reload'];
            }
            childs = divChilds[i].childNodes[0].childNodes[0].childNodes[0].childNodes;
            // console.log(childs);
            // console.log(properties);
            for(let o=0; o<childs.length; o++) {
              if(childs[o].tagName !== HTML_TAG.DIV) continue;
              const label = childs[o].childNodes[0];
              console.log(label);
              if(Utils.isEmpty(label) || Utils.isEmpty(label.getAttribute('for'))) continue;
              const field = label.getAttribute('for').replace('root_', '');
              console.log(field);
              properties[field].idx = o;
              if(Utils.inJson(properties[field].obj, OPTIONS_KEY.OPTIONS_FILE)) delete properties[field].obj[OPTIONS_KEY.OPTIONS_FILE];
            }
          }
        }
      }
    });
    // console.log(this.state.page.form);
    // console.log(forms);
  }

  _onAddTabSchema() {
    const obj = this.state.dragobject;
    if(obj.tagName !== HTML_TAG.NAV) return;
    const form_idx = Html.getIdxParent(obj);
    var form = this.state.page.form[form_idx];
    if(Utils.isEmpty(form)) return;
    const idx = obj.childNodes.length;
    const jObj = JSON_OBJ.getEditJSONObject(false, idx, this.state.isUser.language);
    form.object.push(JSON_OBJ.getTabJson(form_idx, idx, jObj));
    form.active = idx;
    this.state.alertActions.add_tab_show = false;
    this.forceUpdate();
  }

  _onAlertAddTabButtons() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj)) return;

    if (obj.tagName === HTML_TAG.LEGEND || obj.tagName === HTML_TAG.NAV) {
      return(
        <Alert
          show={ this.state.alertActions.add_tab_show }
          variant={ VARIANT_TYPES.LIGHT }
          className={ this.state.alertActions.class }
          style={ this.state.alertActions.add_tab_style }>

        <Button
          type={ HTML_TAG.BUTTON }
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onAddTabSchema.bind(this) }
          variant={ VARIANT_TYPES.SECONDARY }>
          <FaPlus />
        </Button>
      </Alert>
      );
    } else {
      return('');
    }
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
    var form = this.state.page.form[idx];
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
    if(this.state.overlayCreateEditBox.obj[CUSTOMIZE.TYPE] === TYPE.FILE) {
      const itemName = this.state.overlayCreateEditBox.obj['item_name'];
      const value = form.object.data[itemName];
      this.state.overlayCreateEditBox.obj[OPTIONS_KEY.OPTIONS_FILE] = value;
    }
    console.log(this.state.overlayCreateEditBox.obj);
    const label = this.state.overlayCreateEditBox.obj[CUSTOMIZE.LABEL][this.state.isUser.language];
    this.state.overlayCreateEditBox.msg = '「' + label + '」' + Msg.getMsg(null, this.state.isUser.language, 'bt_edit');
    this.state.overlayCreateEditBox.show = true;
    this.state.overlayDeleteBox.show = false;
    this.forceUpdate();
  }

  _onOpenOverlayCreate() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL && obj.tagName !== HTML_TAG.NAV)) return;
    this.state.mode = ACTION.CREATE;
    const editObj = this.state.overlayCreateEditBox.obj;
    // const label_language = CUSTOMIZE.LABEL + '_' + this.state.isUser.language;
    // editObj[label_language] = '';

    // const placehoders = [ HTML_TAG.LEGEND, HTML_TAG.NAV ];
    // if(placehoders.includes(obj.tagName)) {
    //   const placeholder_language = CUSTOMIZE.PLACEHOLDER + '_' + this.state.isUser.language;
    //   editObj[placeholder_language] = '';  
    // }

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
    let obj = e.target;
    if(Utils.isEmpty(obj)) return;
    const auths = [
      OPTION_AUTH.SEARCH,
      OPTION_AUTH.VIEW,
      OPTION_AUTH.CREATE,
      OPTION_AUTH.EDIT,
      OPTION_AUTH.UPLOAD,
      OPTION_AUTH.DOWNLOAD ]
    if(auths.includes(obj.name) || obj.tagName === HTML_TAG.DIV || obj.tagName === HTML_TAG.SPAN) {
      e.preventDefault();
      let div = obj;
      if(div.tagName === HTML_TAG.SPAN) div = obj.parentElement;
      if(div.tagName === HTML_TAG.DIV) {
        obj = div.getElementsByTagName(HTML_TAG.INPUT)[0];
      }
      if(Utils.isEmpty(obj) || obj.getAttribute('type') !== TYPE.CHECKBOX) return;
      this.state.page.page_auth[obj.name] = (auths.includes(div.name))?obj.checked:!obj.checked;;
    } else if(obj.tagName === HTML_TAG.INPUT) {
      this.state.page.page_name = obj.value;
    }
    if(obj.tagName === 'SELECT') {
      console.log(obj);
      // obj.value Fecth To API
      if(Utils.isNumber(obj.value)) {
        this.state.pageMode = ACTION.EDIT;
        this._onLoadingStateSmaple(obj.value);
      } else {
        this.state.pageMode = ACTION.CREATE;
        this._onGetPageDefault();
      }
    }
    console.log(this.state.page);
    this.forceUpdate();
  }

  _onCreateDivOrTab(e) {
    const obj = e.target;
    if(Utils.isEmpty(obj)) return;
    if(obj.id === 'add_div') {
      const jObj = JSON_OBJ.getEditJSONObject(true, Object.keys(this.state.page.form).length, this.state.isUser.language);
      this.state.page.form.push(JSON_OBJ.getDafaultDivOrTab(true, Object.keys(this.state.page.form).length, jObj));
    }
    if(obj.id === 'add_tab') {
      const jObj = JSON_OBJ.getEditJSONObject(false, Object.keys(this.state.page.form).length, this.state.isUser.language);
      this.state.page.form.push(JSON_OBJ.getDafaultDivOrTab(false, Object.keys(this.state.page.form).length, jObj));
    }
    this.forceUpdate();
  }

  _onUpdateEditBox(editBox) {
    this.setState({ overlayCreateEditBox: editBox });
    this.forceUpdate();
  }

  _onAlerEdit() {
    if(!this.state.overlayCreateEditBox.show) return '';
    return(
      <Alert
        id={ SYSTEM.IS_DIV_CUSTOMIZE_EDIT_BOX }
        show={ this.state.overlayCreateEditBox.show }
        variant={ VARIANT_TYPES.LIGHT }
        className={ this.state.overlayCreateEditBox.class }>
        <div className='alert-light' style={ this.state.overlayCreateEditBox.style }>
          <div>
            <Button
              type={ HTML_TAG.BUTTON }
              onClick={ this._onClickSaveOrEditItems.bind(this) }
              variant={ VARIANT_TYPES.WARNING }>
                { Msg.getMsg(null, this.props.isUser.language, 'bt_insert') }
              {/* <FaCheck /> */}
            </Button>
            <Button
              type={ HTML_TAG.BUTTON }
              onClick={ this._onClickClose.bind(this) }
              variant={ VARIANT_TYPES.PRIMARY }>
                { Msg.getMsg(null, this.props.isUser.language, 'bt_return') }
              {/* <FaReply /> */}
            </Button>
          </div>

          <CustomizeBox
            isUser={ this.props.isUser }
            mode={ this.state.mode }
            dragobject={ this.state.dragobject }
            editBox={ this.state.overlayCreateEditBox }
            menus={ this.state.menus }
            updateEditBox={ this._onUpdateEditBox.bind(this) }/>
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
      if(Utils.isNumber(idx)) this.state.page.form.splice(idx, 1);
    }
    if(obj.tagName === HTML_TAG.NAV) {
      const idx = Html.getIdxParent(obj);
      if(!Utils.isNumber(idx)) return;
      var tabIdx = null;
      const arr = Array.from(obj.childNodes);
      for(let i=0; i<arr.length; i++) {
        if(obj.childNodes[i] === undefined
          || obj.childNodes[i].getAttribute('aria-selected') !== 'true') continue;
          tabIdx = i;
          break;
      }
      if(arr.length <= 1) {
        this.state.page.form.splice(idx, 1);
      } else {
        if(Utils.isNumber(tabIdx)) this.state.page.form[idx].object.splice(tabIdx, 1);
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
        if(Utils.inJson(this.state.page.form[idx].object.schema.properties, key))
          delete this.state.page.form[idx].object.schema.properties[key];
        if(Utils.inJson(this.state.page.form[idx].object.ui, key))
          delete this.state.page.form[idx].object.ui[key];
        if(Utils.inJson(this.state.page.form[idx].object.data, key))
          delete this.state.page.form[idx].object.data[key];
      } else {
        const selTabIdx = Html.getIdxTabSelected(divParent.childNodes[0]);
        if(Utils.inJson(this.state.page.form[idx].object[selTabIdx].schema.properties, key))
          delete this.state.page.form[idx].object[selTabIdx].schema.properties[key];
        if(Utils.inJson(this.state.page.form[idx].object[selTabIdx].ui, key))
          delete this.state.page.form[idx].object[selTabIdx].ui[key];
        if(Utils.inJson(this.state.page.form[idx].object[selTabIdx].data, key))
          delete this.state.page.form[idx].object[selTabIdx].data[key];
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

  _onValidateSaveOrEditItems(obj) {
    var error = null;
    var label = obj[CUSTOMIZE.LABEL][this.state.isUser.language];
    const languages = Html.getLanguages();
    if(Utils.isEmpty(label)) {
      const msg = Msg.getMsg(null, this.state.isUser.language, 'obj_label');
      error = msg + Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'required');
    }
    if(Utils.isEmpty(error) && !Utils.isEmpty(label)) {
      const msg = Msg.getMsg(null, this.state.isUser.language, 'obj_label');
      for(let i=0; i<languages.length; i++) {
        label = obj[CUSTOMIZE.LABEL][languages[i]];
        if(Utils.isEmpty(label) || label.length <= 30) continue;
        error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'max_length'), msg, 30, (label.length - 30));
        break;
      }
    }
    if(!Utils.isEmpty(obj[CUSTOMIZE.PLACEHOLDER])) {
      var labelPlaceholder = obj[CUSTOMIZE.PLACEHOLDER][this.state.isUser.language];
      if(Utils.isEmpty(error) && !Utils.isEmpty(labelPlaceholder)) {
        const msg = Msg.getMsg(null, this.state.isUser.language, 'obj_placeholder');
        for(let i=0; i<languages.length; i++) {
          labelPlaceholder = obj[CUSTOMIZE.PLACEHOLDER][languages[i]];
          if(Utils.isEmpty(labelPlaceholder) || labelPlaceholder.length <= 30) continue;
          error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'max_length'), msg, 30, (labelPlaceholder.length - 30));
          break;
        }
      }  
    }
    if(Utils.isEmpty(error)
      && obj[CUSTOMIZE.TYPE] === TYPE.IMAGE && Utils.isEmpty(obj[OPTIONS_KEY.OPTIONS_FILE])) {
      error = Msg.getMsg(null, this.state.isUser.language, 'obj_default') + Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'selected');
    }
    if(Utils.isEmpty(error)
      && (obj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX || obj[CUSTOMIZE.TYPE] === TYPE.RADIO || obj[CUSTOMIZE.TYPE] === TYPE.SELECT)
      && (!Array.isArray(obj[OPTIONS_KEY.OPTIONS]) || Utils.isEmpty(obj[OPTIONS_KEY.OPTIONS][0]['value']) || Utils.isEmpty(obj[OPTIONS_KEY.OPTIONS][0]['label']))) {
        error = Msg.getMsg(null, this.state.isUser.language, 'bt_list') + Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'required');
    }
    if(Utils.isEmpty(error)
      && ((obj[CUSTOMIZE.TYPE] === TYPE.QRCODE || obj[CUSTOMIZE.TYPE] === TYPE.HIDDEN || obj[CUSTOMIZE.TYPE] === TYPE.DISABLE)
      && Utils.isEmpty(obj[CUSTOMIZE.DEFAULT])
      && Utils.isEmpty(obj[TYPE.CHILDENS]))) {
      error = Msg.getMsg(null, this.state.isUser.language, 'obj_default');
      error += Msg.getMsg(null, this.state.isUser.language, 'or');
      error += Msg.getMsg(null, this.state.isUser.language, 'page_list') + Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'selected');
    }
    // return "<font class='required'>" + error + '</font>';
    return error;
  }

  _onClickSaveOrEditItems() {
    var div = this.state.dragobject.parentElement;
    var editBox = this.state.overlayCreateEditBox;
    var obj = editBox.obj;
    if(Utils.isEmpty(div) || Utils.isEmpty(obj)) return;
    editBox.msg = this._onValidateSaveOrEditItems(obj);
    if(Utils.isEmpty(editBox.msg)) {
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
      if(!Utils.isNumber(idx)
        && (this.state.dragobject.tagName === HTML_TAG.LEGEND || this.state.dragobject.tagName === HTML_TAG.NAV)) {
          idx = Html.getIdxParent(this.state.dragobject);
      }

      var form = this.state.page.form[idx];
      if(Utils.isEmpty(form)) return;
      var fObj = form.object;
      if(this.state.dragobject.tagName === HTML_TAG.NAV || Array.isArray(form.object)) {
        fObj = form.object[Html.getIdxTabSelected(this.state.dragobject)];
      } else {
        fObj = form.object;
      }

      const label = obj[CUSTOMIZE.LABEL][this.state.isUser.language];
      if(this.state.mode === ACTION.EDIT
        && (this.state.dragobject.tagName === HTML_TAG.LEGEND || this.state.dragobject.tagName === HTML_TAG.NAV)) {
        if(this.state.dragobject.tagName === HTML_TAG.NAV) {
          form.object[Html.getIdxTabSelected(this.state.dragobject)].schema['tab_name'] = label;
        } else {
          form.object.schema['title'] = label;
        }
        if(!Utils.isEmpty(obj[CUSTOMIZE.BOX_WIDTH])) {
          form['className'] = 'div-box div-box-' + obj[CUSTOMIZE.BOX_WIDTH];
        }

        // JSON_OBJ.addHiddenFieldFormReload(fObj);
      } else {
        var itemName = '';
        if(this.state.mode === ACTION.EDIT && Utils.inJson(obj, 'item_name')) {
          itemName = obj['item_name'];
        } else {
          itemName = obj[CUSTOMIZE.TYPE] + '_' + Utils.getUUID();
        }
  
        const idx = Object.keys(fObj.schema.properties).length;
        obj['language'] = this.state.isUser.language;
        fObj.schema.properties[itemName] = JSON_OBJ.getJsonSchema(obj, itemName, idx);
        // fObj.schema['requireds'] = JSON_OBJ.getRequiredItem(obj, itemName, fObj.schema['requireds']);
  
        fObj.ui[itemName] = JSON_OBJ.getJsonUi(obj);
        fObj.data[itemName] = JSON_OBJ.getDefaultDatas(obj, itemName);

        // JSON_OBJ.addHiddenFieldFormReload(fObj);
      }
      JSON_OBJ.addHiddenFieldFormReload(fObj);

      this.state.page.form[idx] = form;
      this.state.dragobject = null;
      this.state.overlayCreateEditBox.obj = {};
      this.state.overlayDeleteBox.show = false;
      this.state.overlayCreateEditBox.show = false;
      console.log(this.state.page.form);
    }
    this.forceUpdate();
  }

  _onOverlayDeleteBox() {
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
            variant={ VARIANT_TYPES.DANGER }>
            {/* <FaTrash /> */}
            { Msg.getMsg(null, this.props.isUser.language, 'bt_delete') }
          </Button>
          <Button
            type={ HTML_TAG.BUTTON }
            onClick={ this._onClickClose.bind(this) }
            variant={ VARIANT_TYPES.PRIMARY }>
            {/* <FaReply /> */}
            { Msg.getMsg(null, this.props.isUser.language, 'bt_return') }
          </Button>
        </div>
      </Alert>
    );
  }

  _onClickChangeMode() {
    // if(this.state.pageMode === ACTION.CREATE) {
    //   this.state.pageMode = ACTION.EDIT;
    // } else {
    //   this.state.pageMode = ACTION.CREATE;
    // }
    this.state.pageMode = (this.state.pageMode === ACTION.CREATE)?ACTION.EDIT:ACTION.CREATE;
    if(this.state.pageMode === ACTION.CREATE) this._onGetPageDefault();
    this.state.selectDisabled = false;
    this.forceUpdate();
  }

  _getTitle() {
    const options = this.state.menus.map((o, index) => {
      if(Array.isArray(o['items']) && !Utils.isEmpty(o['items'][0])) {
        const opts = o['items'].map((i, idx) => {
          return(<option key={ idx } value={ i.page_id }>{ i.page_name }</option>);
        });
        return(
          <optgroup key={ index } label={ o.page_name }>
            { opts }
          </optgroup>
        );
      } else {
        return(<option key={ index } value={ o.page_id }>{ o.page_name }</option>);
      }
    });

    return(
      <div className={ 'div-body-customize-header-box' }>
        {(() => {
          // console.log(this.state);
          if (this.state.pageMode === ACTION.CREATE && Utils.isEmpty(this.state.page.page_id)) {
            return (
              <div className='div-customize-title-box'>
                <FormControl
                  type={ HTML_TAG.TEXT }
                  defaultValue={ this.state.page.page_name }
                  onChange={ this._onChange.bind(this) }
                  placeholder={ Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'required') }
                  className="mr-sm-2" />
                <Button
                  type={ TYPE.BUTTON }
                  onClick={ this._onClickChangeMode.bind(this) }
                  variant={ VARIANT_TYPES.SECONDARY }
                  title={ Msg.getMsg(null, this.props.isUser.language, 'bt_edit') }>
                    {/* { Msg.getMsg(null, this.props.isUser.language, 'bt_edit') } */}
                  <FaBars />
                </Button>
              </div>
            );
          } else {
            return (
              <div className='div-customize-title-box'>
                <select
                  disabled={ this.state.selectDisabled }
                  className={ 'form-control' }
                  value={ this.state.page.page_id }
                  onChange={ this._onChange.bind(this) }>
                  <option key={ 'frist_option' } value={ '' }>{ '---' }</option>
                  { options }
                </select>
                {(() => {
                  if(Utils.isNumber(this.state.page.page_id)) {
                    return(
                      <Button
                        type={ HTML_TAG.BUTTON }
                        onClick={ this._onClickCopy.bind(this) }
                        variant={ VARIANT_TYPES.SECONDARY }
                        title={ Msg.getMsg(null, this.props.isUser.language, 'bt_copy') }>
                        <FaCopy />
                        {/* { Msg.getMsg(null, this.props.isUser.language, 'bt_copy') } */}
                      </Button>
                    );
                  }
                })()}
              </div>
            );
          }
        })()}

        {(() => {
          if (Utils.inJson(this.state.page, 'page_auth')) {
            const auths = Object.keys(this.state.page.page_auth).map((o, idx) => {
              return(
                <div key={ idx } className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_' + o.substr(3) ) }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[o] }
                    name={ o }
                    onChange={ this._onChange.bind(this) }></input>
                </div>
              );
            });

            return(
              <div className={ 'div-customize-auth-box' }>
                { auths }
                {/* <div className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_search') }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[OPTION_AUTH.SEARCH] }
                    name={ OPTION_AUTH.SEARCH }
                    onChange={ this._onChange.bind(this) }></input>
                </div>
                <div className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_view') }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[OPTION_AUTH.VIEW] }
                    name={ OPTION_AUTH.VIEW }
                    onChange={ this._onChange.bind(this) }></input>
                </div>
                <div className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_create') }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[OPTION_AUTH.CREATE] }
                    name={ OPTION_AUTH.CREATE }
                    onChange={ this._onChange.bind(this) }></input>
                </div>
                <div className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_edit') }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[OPTION_AUTH.EDIT] }
                    name={ OPTION_AUTH.EDIT }
                    onChange={ this._onChange.bind(this) }></input>
                </div>
                <div className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_upload') }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[OPTION_AUTH.UPLOAD] }
                    name={ OPTION_AUTH.UPLOAD }
                    onChange={ this._onChange.bind(this) }></input>
                </div>
                <div className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_download') }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[OPTION_AUTH.DOWNLOAD] }
                    name={ OPTION_AUTH.DOWNLOAD }
                    onChange={ this._onChange.bind(this) }></input> */}
                {/* </div> */}
                <div className={ 'div-actions-box' }>
                  <Button
                    type={ TYPE.BUTTON }
                    id={ 'add_div' }
                    onClick={ this._onCreateDivOrTab.bind(this) }
                    variant={ VARIANT_TYPES.SECONDARY }>
                    { Msg.getMsg(null, this.props.isUser.language, 'bt_div') }
                  </Button>
                  <Button
                    type={ TYPE.BUTTON }
                    id={ 'add_tab' }
                    onClick={ this._onCreateDivOrTab.bind(this) }
                    variant={ VARIANT_TYPES.SECONDARY }>
                    { Msg.getMsg(null, this.props.isUser.language, 'bt_tab') }
                  </Button>
                  <Button onClick={ this._onClickBack.bind(this) } variant={ VARIANT_TYPES.PRIMARY }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_return') }
                  </Button>
                  <Button type="submit" onClick={ this._onClickSubmit.bind(this) } variant={ VARIANT_TYPES.WARNING }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_insert') }
                  </Button>
                </div>
              </div>
            );
          }
        })()}

        {/* {(() => {
          if (this.state.mode === ACTION.CREATE) {
            return (
              <div className='div-customize-title-box'>
                <FormControl
                  type={ HTML_TAG.TEXT }
                  defaultValue={ this.state.page.page_id }
                  onChange={ this._onChange.bind(this) }
                  placeholder={ Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'required') }
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
        })()} */}
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

    // if(e.schema.box_type === HTML_TAG.DIV) {
    //   this.state.page.form[form_idx].object.data = e.formData;
    // }
    // if(e.schema.box_type === HTML_TAG.TAB) {
    //   this.state.page.form[form_idx].object[idx].data = e.formData;
    // }
    // console.log(this.state.page.form[form_idx]);
    // this.forceUpdate();
  }

  _getErrorMsg() {
    if(Utils.isEmpty(this.state.error_msgs) || this.state.error_msgs.length <= 0) return '';
    return this.state.error_msgs.map((o, idx) => {
      return(
        <div key={ idx } className={ 'invalid-feedback' } style={ {display: 'block'} }>{ o }</div>
      );  
    });
  }

  _onAddAttribute(object) {
    var objs = Object.keys(object.ui);
    if(!Array.isArray(objs) || objs.length <= 0) return;
    objs.map((o) => {
      const field = o;
      const obj = object.ui[o];
      const root = document.getElementById('root_' + field);
      if(!Utils.isEmpty(root)) {
        var div = root.parentElement;
        if(field.split('_')[0] === TYPE.FILE) {
          div = root.parentElement.parentElement.parentElement;
          // this._onSetLabeFile(root);
        }

        if(!Utils.isEmpty(div)) {
          if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
            || (Utils.inJson(obj, CUSTOMIZE.STYLE) && !Utils.isEmpty(obj[CUSTOMIZE.STYLE]))) {
  
            var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
            if(field.split('_')[0] === TYPE.FILE) {
              l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
            }
            if(!Utils.isEmpty(l)) {
              const label = l.innerHTML;
              if(label.indexOf('<font') === -1
                && Utils.inJson(obj, CUSTOMIZE.REQUIRED)
                && obj[CUSTOMIZE.REQUIRED]) {
                l.innerHTML = label + "<font class='required'>*</font>";
              }
              const style = l.style;
              if(Utils.inJson(obj, CUSTOMIZE.STYLE)
                && !Utils.isEmpty(obj[CUSTOMIZE.STYLE])
                && style !== obj[CUSTOMIZE.STYLE]) {
                l.setAttribute('style', obj[CUSTOMIZE.STYLE]);
              }
            }
          }
        }

        // var input = document.getElementById('root_' + field);
        // if(!Utils.isEmpty(input)) {
        //   if(input.tagName === HTML_TAG.DIV && (input.id === 'root_' + field)) {
        //     const divs = Array.from(input.childNodes);
        //     divs.map((o) => {
        //       input = o.getElementsByTagName(HTML_TAG.INPUT)[0];
        //       if(!Utils.isEmpty(input)) input.setAttribute("disabled", true);
        //     });
        //   } else {
        //     input.setAttribute("disabled", true);
        //     if(!Utils.isEmpty(input.id) && (input.id.indexOf(TYPE.DATE) !== -1 || input.id.indexOf(TYPE.DATETIME) !== -1)) {
        //       input.removeAttribute('readonly');
        //       input.style.removeProperty("background-color");
        //     }
        //   }
        // }
      }
    });
  }

  // _onSetLabeFile(obj) {
  //   var label = document.getElementById('front_' + obj.id);
  //   if(Utils.isEmpty(label)) {
  //     label = document.createElement('front');
  //     label.id = 'front_' + obj.id;
  //     obj.parentElement.appendChild(label);
  //   }

  //   const ui = obj.parentElement.parentElement.getElementsByTagName(HTML_TAG.UL)[0];
  //   if(!Utils.isEmpty(ui)) {
  //     const list = Array.from(ui.childNodes);
  //     if(list.length > 1) {
  //       label.innerHTML = '(' + list.length + ')Files' ;
  //     } else {
  //       label.innerHTML = list[0].childNodes[0].innerHTML;
  //     }
  //   } else {
  //     label.innerHTML = "Choise File!!!";
  //   }
  // }

  _onFormAddAttribute() {
    if(!Array.isArray(this.state.page.form)) return;
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

  _onLoadingStateSmaple(value) {
    this.state.page = {
      "page_id": value,
      "page_name": "AAA",
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
  }

  _onGetPageDefault() {
    this.state.page.page_id = '';
    this.state.page.page_name = '';
    this.state.page.form = [JSON_OBJ.getDafaultDivOrTab(true, Object.keys(this.state.page.form).length, {})];
    if(!Utils.inJson(this.state.page, 'page_auth') || !Utils.inJson(this.state.page['page_auth'], OPTION_AUTH.SEARCH)) {
      this.state.page['page_auth'] = {};
      this.state.page['page_auth'][ '00_' + OPTION_AUTH.SEARCH] = true;
      this.state.page['page_auth'][ '01_' + OPTION_AUTH.VIEW] = true;
      this.state.page['page_auth'][ '02_' + OPTION_AUTH.CREATE] = true;
      this.state.page['page_auth'][ '03_' + OPTION_AUTH.EDIT] = true;
      this.state.page['page_auth'][ '04_' + OPTION_AUTH.UPLOAD] = true;
      this.state.page['page_auth'][ '05_' + OPTION_AUTH.DOWNLOAD] = true;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.state.isUser = nextProps.isUser;
    this.state.options = nextProps.options;
    this.state.menus = nextProps.menus;
    // Resquest API
    if(!Utils.isEmpty(this.state.isUser.page)) {
      this.state.selectDisabled = true;
      this.state.page = this.state.isUser.page;
      this.state.page['form'] = [];
    }
  }

  componentDidUpdate() {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    this._onAddDragDrop(div);
    this._onFormAddAttribute();
    div.style.display = 'block';
  }

  componentDidMount() {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    if(Utils.isEmpty(div) || div.childNodes.length <= 0) return;
    div.addEventListener(MOUSE.MOUSEDOWN, this._onMouseDown.bind(this), true);
    div.addEventListener(DRAG.OVER, this._onDragOver.bind(this), false);
    div.addEventListener(DRAG.DROP, this._onDragDrop.bind(this), false);
    div.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);
    // this.state.page['form'] = [];
    this._onAddDragDrop(div);
  }

  UNSAFE_componentWillMount(){
    this._onGetPageDefault();
  }

  render() {
    this.state.isUser.actions = PAGE_ACTION.CREATE;

    return (
      <div className={ 'div-body-customize-box' }>
        {/* <Actions
          isUser={ this.state.isUser }
          onClickBack={ this._onClickBack.bind(this) }
          onClickSubmit={ this._onClickSubmit.bind(this) } /> */}

        { this._getErrorMsg() }
        { this._getTitle() }
        { this._onAlerEdit() }
        { this._onAlertDivTabButtons() }
        { this._onOverlayDeleteBox() }
        { this._onAlertAddTabButtons() }
        <CForm
          isUser={ this.state.isUser }
          form={ this.state.page.form }
          updateFormData={ this._onUpdateFormData.bind(this) } />
      </div>
    )
  };
};

export default connect()(withRouter(Customize));