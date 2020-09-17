
import React, { Component as C } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaUpload, FaDownload, FaTrash, FaReply, FaCopy, FaCheck, FaBars, FaEye } from 'react-icons/fa';
import StringUtil from 'util';

import CForm from '../utils/CForm';
import CustomizeBox from '../utils/Compoment/CustomizeBox';
import ImageBox from '../utils/Compoment/ImageBox';
import TimeBox from '../utils/Compoment/TimeBox';
import RadioBox from '../utils/Compoment/RadioBox';
import CheckBox from '../utils/Compoment/CheckBox';
import SelectBox from '../utils/Compoment/SelectBox';
import TableBox from '../utils/Compoment/TableBox';
import QRCodeBox from '../utils/Compoment/QRCodeBox';
import FileBox from '../utils/Compoment/FileBox';
import InputCalendarBox from '../utils/Compoment/CalendarBox';
import Calendar from '../utils/Calendar';
import EditorBox from '../utils/Compoment/EditorBox';

import { VARIANT_TYPES, SYSTEM, PAGE, ACTION, PAGE_ACTION, MSG_TYPE } from '../utils/Types';
import { DRAG, MOUSE, TYPE, HTML_TAG, CUSTOMIZE, ATTR, OPTIONS_KEY, OPTION_AUTH, PAGE_LAYOUT } from '../utils/HtmlTypes';
import { JSON_OBJ } from '../utils/JsonUtils';
import { THEME } from '../utils/Theme';
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
      ,page: { page_id: '', page_name: '', page_key: '', page_layout: 0, page_open: 0, page_auth: { }, form: [] }
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
      // ,patitions: []
    }
  };

  _onClickCopy() {
    this.state.pageMode = ACTION.CREATE;
    const page = this.state.page;
    page.page_id = '';
    page.page_name = '';
    page.page_key = 'customize.table_' + Utils.getUUID();
    delete page['page_id_seq'];
    if(Array.isArray(page.form) && page.form.length > 0) {
      page.form.map((f) => {
        const objs = f['object'];
        f.object_key = 'form_'+ Utils.getUUID();
        delete f['form_id']
        if(Array.isArray(objs)) {
          objs.map((o) => {
            o.schema_key = 'schema_' + Utils.getUUID();
            delete o['schema']['schema_id'];
            const ps = o['schema']['properties'];
            Object.keys(ps).map((p) => {
              delete ps[p]['properties_id'];
              if(p.indexOf('_seq_id_') !== -1 ||
                [
                  'number_company_info_company_id', 
                  'number_group_info_group_id', 
                  'number_users_info_user_id', 
                  'number_server_info_server_id', 
                  'number_api_info_api_id', 
                  'number_page_info_page_id', 
                ].includes(p)) {
                delete ps[p];
                if(Utils.inJson(o['ui'], p)) delete o['ui'][p];
                if(Utils.inJson(o['data'], p)) delete o['data'][p];
              }  
            });
          });
        } else {
          objs.schema_key = 'schema_' + Utils.getUUID();
          delete objs['schema']['schema_id'];
          const ps = objs['schema']['properties'];
          Object.keys(ps).map((p) => {
            delete ps[p]['properties_id'];
            if(p.indexOf('_seq_id_') !== -1 ||
              [
                'number_company_info_company_id', 
                'number_group_info_group_id', 
                'number_users_info_user_id', 
                'number_server_info_server_id', 
                'number_api_info_api_id', 
                'number_page_info_page_id', 
              ].includes(p)) {
              delete ps[p];
              if(Utils.inJson(objs['ui'], p)) delete objs['ui'][p];
              if(Utils.inJson(objs['data'], p)) delete objs['data'][p];
            }
          });
        }
      });
    }
    console.log(page);
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
    let obj = null;
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
        this.state.page.page_key = 'customize.table_' + Utils.getUUID();
      }
      const options = { page: this.state.page, cId: this.state.isUser.cId, uId: this.state.isUser.uId };
      const host = Msg.getSystemMsg('sys', 'app_api_host');
      const f = Fetch.postLogin(host + 'setPage', options);
      f.then(data => {
        if(!Utils.isEmpty(data) && Utils.inJson(data, 'page_id')) {
          this.state.menus.push(data);
          this._onClickBack();
        } else if(!Utils.isEmpty(data) && Utils.inJson(data, 'error')) {
          console.log(data['error']);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }

  _addTopDivSelected(obj) {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    if(Utils.isEmpty(div) || div.childNodes.length <= 0) return;
    let add = (obj.className.indexOf(' ' + ACTION.SELECTED) === -1);
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
      let div = null;
      let pDiv = null;
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
      let dragId = Array.from(tPDiv.childNodes).indexOf(div);
      let dropId = Array.from(tPDiv.childNodes).indexOf(this.state.dragobject);
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
      let div = null;
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
      let div = nav.parentElement;
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
    this.state.alertActions['customize'] = true;
    const pos = obj.getBoundingClientRect();
    this.state.alertActions.style = { top: (obj.tagName === HTML_TAG.NAV)?(pos.y + 3):pos.y, left: (obj.offsetLeft + obj.offsetWidth) - 110 };
    if(obj.tagName === HTML_TAG.NAV) {
      let selected = obj.childNodes[obj.childNodes.length - 1];
      this.state.alertActions.add_tab_style = { top: (selected.offsetTop + 3), left : (selected.offsetLeft + selected.offsetWidth) + 5 };
      this.state.alertActions.add_tab_show = true;
    } else {
      this.state.alertActions.add_tab_show = false;
    }
    let className = 'div-customize-actions';
    if(obj.tagName === HTML_TAG.LABEL && Utils.isEmpty(obj.className)) {
      const pos = obj.getBoundingClientRect();
      className += ' div-customize-actions-child';
      this.state.alertActions.style = { top: pos.y, left : (pos.x + pos.width) - 55, zIndex: 2 };
      const key = obj.getAttribute(ATTR.FOR);
      if(!Utils.isEmpty(key) && !Utils.isEmpty(key.match(/\d+/g))) {
        const cus = key.match(/\d+/g).map(Number);
        this.state.alertActions['customize'] = (Array.isArray(cus) && cus.length > 0);
      } else {
        this.state.alertActions['customize'] = false;
      }
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
      if(!Utils.isEmpty(this.state.dragobject) && this.state.dragobject.tagName === HTML_TAG.NAV)
        this.state.alertActions.add_tab_show = true;
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
    let objs = Array.from(obj.childNodes);
    let forms = this.state.page.form;
    objs.map((o, idx) => {
      const divIdx = o.getAttribute('idx');
      if(!Utils.isEmpty(divIdx)) {
        forms[divIdx].idx = idx;
        o.setAttribute('idx', idx);
        let childs = o.childNodes[0];
        if(childs.tagName === HTML_TAG.FORM) {
          childs = o.childNodes[0].childNodes[0].childNodes[0].childNodes;
          forms[divIdx].object.schema.form_idx = idx;
          let properties = forms[divIdx].object.schema.properties;
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
            const field = label.getAttribute('for').replace(forms[divIdx].object_key + '_', '');
            // console.log(field);
            properties[field].idx = i;
            if(Utils.inJson(properties[field].obj, OPTIONS_KEY.OPTIONS_FILE)) delete properties[field].obj[OPTIONS_KEY.OPTIONS_FILE];
          }
        } else {
          const tabChilds = o.childNodes[0].childNodes;
          const divChilds = o.childNodes[1].childNodes;
          if(tabChilds.length !== divChilds.length) return;
          for(let i=0; i<tabChilds.length; i++) {
            const tabIdx = tabChilds[i].getAttribute('data-rb-event-key');
            let object = forms[divIdx].object[tabIdx];
            object.schema.form_idx = idx;
            object.schema.idx = i;
            let properties = object.schema.properties;
            if(Utils.inJson(properties, 'hidden_form_reload')) {
              delete properties['hidden_form_reload'];
              if(Utils.inJson(object.data, 'hidden_form_reload')) delete object.data['hidden_form_reload'];
              if(Utils.inJson(object.ui, 'hidden_form_reload')) delete object.ui['hidden_form_reload'];
            }
            childs = divChilds[tabIdx].childNodes[0].childNodes[0].childNodes[0].childNodes;
            // console.log(childs);
            // console.log(properties);
            for(let o=0; o<childs.length; o++) {
              if(childs[o].tagName !== HTML_TAG.DIV) continue;
              const label = childs[o].childNodes[0];
              if(Utils.isEmpty(label) || Utils.isEmpty(label.getAttribute('for'))) continue;
              const fKey = forms[divIdx].object_key + '_' + tabIdx;
              const field = label.getAttribute('for').replace(fKey + '_', '');
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
    let form = this.state.page.form[form_idx];
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
                onMouseOver={ this._onMouseOut.bind(this) }
                onClick={ this._onOpenOverlayCreate.bind(this) }
                variant={ VARIANT_TYPES.SECONDARY }>
                <FaPlus />
              </Button>
            );
          }
        })()}

        <Button
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onOpenOverlayEdit.bind(this) }
          variant={ VARIANT_TYPES.SECONDARY }>
          <FaEdit />
        </Button>

        {(() => {
          if (this.state.alertActions['customize']) {
            return(
              <Button
                onMouseOver={ this._onMouseOut.bind(this) }
                onClick={ this._onOpenOverlayDelete.bind(this) }
                variant={ VARIANT_TYPES.DANGER }>
                <FaTrash />
              </Button>    
            );
          }
        })()}
      </Alert>
    );
  }

  _onOpenOverlayEdit() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL && obj.tagName !== HTML_TAG.NAV)) return;
    this.state.mode = ACTION.EDIT;
    let idx = Html.getIdxParent(obj);
    let form = this.state.page.form[idx];
    let key = obj.getAttribute('for');
    let properties = null;
    let editObj = this.state.overlayCreateEditBox.obj;
    if(!Utils.isEmpty(key)) {
      key = key.replace(form.object_key + '_', '');
      if(Array.isArray(form.object)) {
        const div = document.getElementById('div_customize_' + idx);
        const tabIdx = Html.getIdxTabSelected(div.childNodes[0]);
        key = key.replace(tabIdx+ '_', '');
        properties = form.object[tabIdx].schema.properties[key];
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
    console.log(properties);
    if(!Utils.isEmpty(properties)) editObj = properties.obj;
    if(editObj[CUSTOMIZE.TYPE] === TYPE.FILE) {
      const itemName = editObj['item_name'];
      const value = form.object.data[itemName];
      editObj[OPTIONS_KEY.OPTIONS_FILE] = value;
    }
    if(!Utils.inJson(editObj, CUSTOMIZE.REQUIRED) && editObj[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
      editObj[CUSTOMIZE.REQUIRED] = properties['changed'];
    }
    if(editObj[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
      || editObj[CUSTOMIZE.TYPE] === TYPE.RADIO
      || editObj[CUSTOMIZE.TYPE] === TYPE.SELECT) {
      if(!Utils.inJson(editObj, OPTIONS_KEY.OPTION_TARGET)) {
        editObj[OPTIONS_KEY.OPTION_TARGET] = properties[OPTIONS_KEY.OPTION_TARGET];
      }
      if(!Utils.inJson(editObj, OPTIONS_KEY.OPTIONS)) {
        editObj[OPTIONS_KEY.OPTIONS] = properties[OPTIONS_KEY.OPTIONS];
      }
    }
    console.log(editObj);
    if(!Utils.inJson(editObj, CUSTOMIZE.LANGUAGE)) {
      editObj[CUSTOMIZE.LANGUAGE] = this.state.isUser.language;      
    }
    if(!Utils.inJson(editObj, CUSTOMIZE.PLACEHOLDER)) {
      editObj[CUSTOMIZE.PLACEHOLDER] = {};
    }
    const label = editObj[CUSTOMIZE.LABEL][this.state.isUser.language];

    this.state.overlayCreateEditBox.obj = editObj;
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
    editObj[CUSTOMIZE.TYPE] = TYPE.TEXT;
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
    if(obj.tagName === HTML_TAG.SELECT.toUpperCase()) {
      console.log(obj);
      // obj.value Fecth To API
      if(Utils.isNumber(obj.value)) {
        this.state.pageMode = ACTION.EDIT;
        // this._onLoadingStateSmaple(obj.value);
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
          <div id={ SYSTEM.IS_DIV_CUSTOMIZE_EDIT_BOX + '_button' }>
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
            // options={ this.state.patitions }
            updateEditBox={ this._onUpdateEditBox.bind(this) }/>
        </div>
      </Alert>
    );
  }

  _onOpenOverlayDelete() {
    const obj = this.state.dragobject;
    if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL && obj.tagName !== HTML_TAG.NAV)) return;
    this.state.overlayDeleteBox.msg = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'delete'), '「' + obj.innerText + '」')
    // this.state.overlayDeleteBox.msg = '「' + obj.innerText + '」' + 'を削除してよろしくですか？';
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
      let tabIdx = null;
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
      let isDiv = true;
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
    let obj = this.state.dragobject.cloneNode(true);
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
    let error = null;
    let label = obj[CUSTOMIZE.LABEL][this.state.isUser.language];
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
      let labelPlaceholder = obj[CUSTOMIZE.PLACEHOLDER][this.state.isUser.language];
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
    if(Utils.isEmpty(error)
      && obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS
      && !Utils.isNumber(obj[TYPE.CHILDENS])) {
      error = Msg.getMsg(null, this.state.isUser.language, 'page_list');
      error += Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'selected');
    }

    // return "<font class='required'>" + error + '</font>';
    return error;
  }

  _onClickSaveOrEditItems() {
    let div = this.state.dragobject.parentElement;
    let editBox = this.state.overlayCreateEditBox;
    let obj = editBox.obj;
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

      let idx = div.id.split('_')[2];
      if(!Utils.isNumber(idx)
        && (this.state.dragobject.tagName === HTML_TAG.LEGEND || this.state.dragobject.tagName === HTML_TAG.NAV)) {
          idx = Html.getIdxParent(this.state.dragobject);
      }

      let form = this.state.page.form[idx];
      if(Utils.isEmpty(form)) return;
      let fObj = form.object;
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
        let itemName = '';
        if(this.state.mode === ACTION.EDIT && Utils.inJson(obj, 'item_name')) {
          itemName = obj['item_name'];
        } else {
          itemName = obj[CUSTOMIZE.TYPE] + '_' + Utils.getUUID();
          if(Utils.isNumber(this.state.page['page_id'])) itemName = itemName + '_customize';
        }
  
        const idx = Object.keys(fObj.schema.properties).length;
        obj['language'] = this.state.isUser.language;
        fObj.schema.properties[itemName] = JSON_OBJ.getJsonSchema(obj, itemName, idx);
  
        fObj.ui[itemName] = JSON_OBJ.getJsonUi(obj, this.state.page[OPTIONS_KEY.OPTIONS_PAGE_LAYOUT]);
        fObj.data[itemName] = JSON_OBJ.getDefaultDatas(obj, itemName);
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

  _onPageLayoutChange(e) {
    const obj = e.target;
    if(Utils.isEmpty(obj) || !Utils.isNumber(obj.value) || !Array.isArray(this.state.page.form)) return;
    this.state.page[OPTIONS_KEY.OPTIONS_PAGE_LAYOUT] = parseInt(obj.value);
    const fs = this.state.page.form;
    fs.map((f, idx) => {
      const objs = f['object'];
      if(Array.isArray(objs)) {
        objs.map((ui, idx) => {
          const keys = Object.keys(ui['ui']);
          keys.map((k) => {
            if(!k.startsWith(TYPE.CHILDENS)) {
              let hObj = document.getElementById(f.object_key + '_' + idx + '_' + k);
              console.log(hObj);
              if(!Utils.isEmpty(hObj)
                && hObj.tagName === HTML_TAG.INPUT
                && hObj.getAttribute('type') === TYPE.FILE) {
                hObj = hObj.parentElement.parentElement;
              }
              if(k.startsWith('image_')) {
                hObj = document.getElementById('div_' + f.object_key + '_' + idx + '_' + k);
              }
              if(!Utils.isEmpty(hObj)
                && Utils.inJson(ui['ui'][k], 'classNames')
                || (Utils.inJson(ui['ui'][k], 'ui:widget')
                && String(ui['ui'][k]['ui:widget']) !== TYPE.HIDDEN)) {
                let classNames = ui['ui'][k]['classNames'];
                let hObjCls = hObj.parentElement.className;
                if(parseInt(obj.value) === 0) {
                  classNames = classNames.replace('-hori', '');
                  hObjCls = hObjCls.replace('-hori', '');
                } else {
                  if(classNames.indexOf('-hori') === -1) {
                    classNames = classNames.replace('div-box-height', 'div-box-height-hori');
                    hObjCls = hObjCls.replace('div-box-height', 'div-box-height-hori');  
                  }
                }
                ui['ui'][k]['classNames'] = classNames;
                hObj.parentElement.className = hObjCls;
              }
            }
          });
          // JSON_OBJ.addHiddenFieldFormReload(ui);
        });
      } else {
        const keys = Object.keys(objs['ui']);
        keys.map((k) => {
          if(!k.startsWith(TYPE.CHILDENS)) {
            let hObj = document.getElementById(f.object_key + '_' + k);
            console.log(hObj);
            if(!Utils.isEmpty(hObj)
              && hObj.tagName === HTML_TAG.INPUT
              && hObj.getAttribute('type') === TYPE.FILE) {
              hObj = hObj.parentElement.parentElement;
            }
            if(k.startsWith('image_')) {
              hObj = document.getElementById('div_' + f.object_key + '_' + k);
            }
            if(!Utils.isEmpty(hObj)
              && Utils.inJson(objs['ui'][k], 'classNames')
              || (Utils.inJson(objs['ui'][k], 'ui:widget')
              && String(objs['ui'][k]['ui:widget']) !== TYPE.HIDDEN)) {
              let classNames = objs['ui'][k]['classNames'];
              let hObjCls = hObj.parentElement.className;
              if(parseInt(obj.value) === 0) {
                classNames = classNames.replace('-hori', '');
                hObjCls = hObjCls.replace('-hori', '');
              } else {
                classNames = classNames.replace('div-box-height', 'div-box-height-hori');
                hObjCls = hObjCls.replace('div-box-height', 'div-box-height-hori');
              }
              objs['ui'][k]['classNames'] = classNames;
              hObj.parentElement.className = hObjCls;
            }
          }
        });
        // JSON_OBJ.addHiddenFieldFormReload(objs);
      }
      // this.state.page.form[idx] = f;
    });
    console.log(obj.value);
    console.log(this.state.page);
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
      <table>
        <tbody>
            <tr>
                <td>
                {(() => {
          if (this.state.pageMode === ACTION.CREATE && Utils.isEmpty(this.state.page.page_id)) {
            return (
              //className='div-customize-title-box'
              <div>
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
                  <FaBars />
                </Button>
              </div>
            );
          } else {
            //className='div-customize-title-box'
            return (
              <div>
                <select
                  disabled={ this.state.selectDisabled }
                  className={ 'form-control' }
                  value={ this.state.page.page_id }
                  onChange={ this._onChange.bind(this) }>
                  <option key={ 'frist_option' } value={ '' }>{ '---' }</option>
                  { options }
                </select>
                {(() => {
                  if(Utils.isNumber(this.state.page.page_id) &&
                    ![
                      'company.company_info', 
                      'company.group_info', 
                      'company.users_info', 
                      'system.server_info', 
                      'system.api_info', 
                      'mente.page_info', 
                    ].includes(this.state.page.page_key)) {
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
                </td>
                <td style={{ textAlign: 'right'}}>
                {(() => {
          if (Utils.inJson(this.state.page, 'page_auth')) {
            const auths = Object.keys(this.state.page.page_auth).map((o, idx) => {
              const auth = o.substr(3);
              // let icon = null;
              // if(auth === OPTION_AUTH.SEARCH) icon = (<FaSearch />);
              // if(auth === OPTION_AUTH.VIEW) icon = (<FaEye />);
              // if(auth === OPTION_AUTH.CREATE) icon = (<FaPlus />);
              // if(auth === OPTION_AUTH.EDIT) icon = (<FaEdit />);
              // if(auth === OPTION_AUTH.UPLOAD) icon = (<FaUpload />);
              // if(auth === OPTION_AUTH.DOWNLOAD) icon = (<FaDownload />);
              // const selected = (!this.state.page.page_auth[o])?VARIANT_TYPES.OUTLINE + VARIANT_TYPES.SECONDARY:VARIANT_TYPES.SECONDARY;
              return(
                // <Button
                //   key={ idx }
                //   variant={ selected }
                //   onClick={ this._onChange.bind(this) }
                //   title={ Msg.getMsg(null, this.state.isUser.language, 'bt_' + auth ) }>
                //   { icon }
                // </Button>
                <div key={ idx } className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
                  <span onClick={ this._onChange.bind(this) }>
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_' + auth ) }
                  </span>
                  <input
                    type={ TYPE.CHECKBOX }
                    checked={ this.state.page.page_auth[o] }
                    name={ o }
                    onChange={ this._onChange.bind(this) }></input>
                </div>
              );
            });

            const layouts = PAGE_LAYOUT.map((o, idx) => {
              const label = (Utils.inJson(o['label'],this.state.isUser.language))
                ?o['label'][this.state.isUser.language]:o['label']['ja'];
              return(<option key={ idx } value={ o['value'] }>{ label }</option>);
            })
            // className={ 'div-customize-auth-box' }
            //className={ 'div-actions-box' }
            return(
              <div>
                <FormControl
                  as={ HTML_TAG.SELECT }
                  style={{ width: 'auto' }}
                  defaultValue={ this.state.page[OPTIONS_KEY.OPTIONS_PAGE_LAYOUT] }
                  onChange={ this._onPageLayoutChange.bind(this) }>
                    { layouts }
                </FormControl>
                { auths }
                
                <div>
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
                </td>
            </tr>
        </tbody>
      </table>
      // <div className={ 'div-body-customize-header-box' }>
      //   {(() => {
      //     if (this.state.pageMode === ACTION.CREATE && Utils.isEmpty(this.state.page.page_id)) {
      //       return (
      //         <div className='div-customize-title-box'>
      //           <FormControl
      //             type={ HTML_TAG.TEXT }
      //             defaultValue={ this.state.page.page_name }
      //             onChange={ this._onChange.bind(this) }
      //             placeholder={ Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'required') }
      //             className="mr-sm-2" />
      //           <Button
      //             type={ TYPE.BUTTON }
      //             onClick={ this._onClickChangeMode.bind(this) }
      //             variant={ VARIANT_TYPES.SECONDARY }
      //             title={ Msg.getMsg(null, this.props.isUser.language, 'bt_edit') }>
      //             <FaBars />
      //           </Button>
      //         </div>
      //       );
      //     } else {
      //       return (
      //         <div className='div-customize-title-box'>
      //           <select
      //             disabled={ this.state.selectDisabled }
      //             className={ 'form-control' }
      //             value={ this.state.page.page_id }
      //             onChange={ this._onChange.bind(this) }>
      //             <option key={ 'frist_option' } value={ '' }>{ '---' }</option>
      //             { options }
      //           </select>
      //           {(() => {
      //             if(Utils.isNumber(this.state.page.page_id) &&
      //               ![
      //                 'company.company_info', 
      //                 'company.group_info', 
      //                 'company.users_info', 
      //                 'system.server_info', 
      //                 'system.api_info', 
      //                 'mente.page_info', 
      //               ].includes(this.state.page.page_key)) {
      //               return(
      //                 <Button
      //                   type={ HTML_TAG.BUTTON }
      //                   onClick={ this._onClickCopy.bind(this) }
      //                   variant={ VARIANT_TYPES.SECONDARY }
      //                   title={ Msg.getMsg(null, this.props.isUser.language, 'bt_copy') }>
      //                   <FaCopy />
      //                 </Button>
      //               );
      //             }
      //           })()}
      //         </div>
      //       );
      //     }
      //   })()}

      //   {(() => {
      //     if (Utils.inJson(this.state.page, 'page_auth')) {
      //       const auths = Object.keys(this.state.page.page_auth).map((o, idx) => {
      //         const auth = o.substr(3);
      //         return(
      //           <div key={ idx } className={ 'btn btn-outline-info' } onClick={ this._onChange.bind(this) }>
      //             <span onClick={ this._onChange.bind(this) }>
      //               { Msg.getMsg(null, this.state.isUser.language, 'bt_' + auth ) }
      //             </span>
      //             <input
      //               type={ TYPE.CHECKBOX }
      //               checked={ this.state.page.page_auth[o] }
      //               name={ o }
      //               onChange={ this._onChange.bind(this) }></input>
      //           </div>
      //         );
      //       });

      //       const layouts = PAGE_LAYOUT.map((o, idx) => {
      //         const label = (Utils.inJson(o['label'],this.state.isUser.language))
      //           ?o['label'][this.state.isUser.language]:o['label']['ja'];
      //         return(<option key={ idx } value={ o['value'] }>{ label }</option>);
      //       })
      //       return(
      //         <div className={ 'div-customize-auth-box' }>
      //           { auths }
      //           <FormControl
      //             as={ HTML_TAG.SELECT }
      //             style={ { width: 'auto', marginTop: '.3em' } }
      //             defaultValue={ this.state.page[OPTIONS_KEY.OPTIONS_PAGE_LAYOUT] }
      //             onChange={ this._onPageLayoutChange.bind(this) }>
      //               { layouts }
      //           </FormControl>

      //           <div className={ 'div-actions-box' }>
      //             <Button
      //               type={ TYPE.BUTTON }
      //               id={ 'add_div' }
      //               onClick={ this._onCreateDivOrTab.bind(this) }
      //               variant={ VARIANT_TYPES.SECONDARY }>
      //               { Msg.getMsg(null, this.props.isUser.language, 'bt_div') }
      //             </Button>
      //             <Button
      //               type={ TYPE.BUTTON }
      //               id={ 'add_tab' }
      //               onClick={ this._onCreateDivOrTab.bind(this) }
      //               variant={ VARIANT_TYPES.SECONDARY }>
      //               { Msg.getMsg(null, this.props.isUser.language, 'bt_tab') }
      //             </Button>
      //             <Button onClick={ this._onClickBack.bind(this) } variant={ VARIANT_TYPES.PRIMARY }>
      //               { Msg.getMsg(null, this.state.isUser.language, 'bt_return') }
      //             </Button>
      //             <Button type="submit" onClick={ this._onClickSubmit.bind(this) } variant={ VARIANT_TYPES.WARNING }>
      //               { Msg.getMsg(null, this.state.isUser.language, 'bt_insert') }
      //             </Button>
      //           </div>
      //         </div>
      //       );
      //     }
      //   })()}
      // </div>
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
    let form = this.state.page.form;
    if(e.schema.schema_type === HTML_TAG.DIV) {
      form[fidx].object.data = e.formData;
    }
    if(e.schema.schema_type === HTML_TAG.TAB) {
      form[fidx].object[idx].data = e.formData;
    }
    this.setState({ form });

    // if(e.schema.schema_type === HTML_TAG.DIV) {
    //   this.state.page.form[form_idx].object.data = e.formData;
    // }
    // if(e.schema.schema_type === HTML_TAG.TAB) {
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

  _onAddAttribute(object, fKey) {
    let objs = Object.keys(object.ui);
    if(!Array.isArray(objs) || Utils.isEmpty(fKey) ||  objs.length <= 0) return;
    objs.map((o) => {
      const field = o;
      const obj = object.ui[o];
      const root = document.getElementById(fKey + '_' + field);
      if(!Utils.isEmpty(root)) {
        let div = root.parentElement;
        if(field.split('_')[0] === TYPE.FILE) {
          div = root.parentElement.parentElement.parentElement;
          // this._onSetLabeFile(root);
        }

        if(!Utils.isEmpty(div)) {
          if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
            || (Utils.inJson(obj, CUSTOMIZE.LABEL_CSS) && !Utils.isEmpty(obj[CUSTOMIZE.LABEL_CSS]))
            || (Utils.inJson(obj, CUSTOMIZE.TEXT_CSS) && !Utils.isEmpty(obj[CUSTOMIZE.TEXT_CSS]))) {

            let l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
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
              const l_style = l.style;
              if(Utils.inJson(obj, CUSTOMIZE.LABEL_CSS)
                && !Utils.isEmpty(obj[CUSTOMIZE.LABEL_CSS])
                && l_style !== obj[CUSTOMIZE.LABEL_CSS]) {
                l.setAttribute('style', obj[CUSTOMIZE.LABEL_CSS]);
              }
            }

            if(Utils.inJson(obj, CUSTOMIZE.TEXT_CSS) && !Utils.isEmpty(obj[CUSTOMIZE.TEXT_CSS])) {
              const t = div.lastChild;
              if(!Utils.isEmpty(t)) {
                const t_style = t.style;
                if(t_style !== obj[CUSTOMIZE.TEXT_CSS]) t.setAttribute('style', obj[CUSTOMIZE.TEXT_CSS]);
              }
            }
          }
        }

        // let input = document.getElementById('root_' + field);
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

  _onFormAddAttribute() {
    if(!Array.isArray(this.state.page.form)) return;
    this.state.page.form.map((f) => {
      let objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.map((obj) => {
          this._onAddAttribute(obj, f.object_key);
        });
      } else {
        this._onAddAttribute(objs, f.object_key);
      }
    });
  }

  _onGetPageDefault() {
    this.state.page.page_id = '';
    this.state.page.page_name = '';
    this.state.page.page_layout = 0;
    this.state.page.page_open = 0;
    const jObj = JSON_OBJ.getEditJSONObject(true, Object.keys(this.state.page.form).length, this.state.isUser.language);
    this.state.page.form.push(JSON_OBJ.getDafaultDivOrTab(true, Object.keys(this.state.page.form).length, jObj));
    // this.state.page.form = [JSON_OBJ.getDafaultDivOrTab(true, Object.keys(this.state.page.form).length, {})];
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
    console.log(this.state.isUser.page)

    // Resquest API
    if(!Utils.isEmpty(this.state.isUser.page)) {
      this.state.selectDisabled = true;
      this.state.page = this.state.isUser.page;
      if(!Utils.isNumber(this.state.page['page_id'])) {
        if(!Utils.inJson(this.state.page, OPTIONS_KEY.OPTIONS_PAGE_LAYOUT)) {
          this.state.page.page_layout = 0;
          this.state.page.page_open = 0;
        }
        const jObj = JSON_OBJ.getEditJSONObject(true, Object.keys(this.state.page.form).length, this.state.isUser.language);
        this.state.page['form'] = [JSON_OBJ.getDafaultDivOrTab(true, Object.keys(this.state.page.form).length, jObj)];
      } else {
        this._onSortForms();
      }
    }
  }

  _onSortForms() {
    if(!Utils.inJson(this.state.isUser.page, 'form')) return;
    let forms = this.state.isUser.page.form;
    console.log(forms)
    if(Utils.isEmpty(forms)) return;
    console.log(forms);
    forms.map((f) => {
      let objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.sort((a, b) => ((a.schema.idx > b.schema.idx)?1:-1));
        return objs.map((obj) => {
          // this._formatUiWidget(obj.ui, obj.schema.definitions);  
          this._formatUiWidget(obj.ui);  
          let lists = Object.keys(obj.schema.properties).map((o) => { 
            return { key: o, obj: obj.schema.properties[o] };
          });
          lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
          let properties = {};
          for(let i=0; i<lists.length; i++) {
            properties[lists[i].key] = lists[i].obj;
          }
          obj.schema.properties = properties;
          return obj;
        });
      } else {
        this._formatUiWidget(objs.ui);
        let lists = Object.keys(objs.schema.properties).map((o) => { 
          return { key: o, obj: objs.schema.properties[o] };
        });
        lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
        let properties = {};
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
        // if(field === TYPE.TIME && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TimeBox;
        if(field === TYPE.RADIO && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = RadioBox;
        if(field === TYPE.CHECKBOX && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = CheckBox;
        if(field === TYPE.SELECT && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = SelectBox;
        if(field === TYPE.CHILDENS && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TableBox;
        if(field === TYPE.QRCODE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = QRCodeBox;
        if(field === TYPE.FILE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = FileBox;  
        if((field === TYPE.DATETIME || field === TYPE.DATE || field === TYPE.MONTH || field === TYPE.TIME) && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = Calendar;
        if(field === TYPE.EDITOR && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = EditorBox;  
      }
    });
  }

  componentDidUpdate() {
    // console.log('componentDidUpdate')
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

  UNSAFE_componentWillUnmount() {
    this.props.cancel();
  }

  render() {
    this.state.isUser.actions = PAGE_ACTION.CREATE;

    return (
      <div className={ 'div-body-customize-box div-list-box' }>
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