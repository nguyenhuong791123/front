import React, { Component as C } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Alert, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

// import Actions from '../utils/Actions';
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
import Calendar from '../utils/Calendar';
import EditorBox from '../utils/Compoment/EditorBox';

import AuthSession from '../auth/AuthSession';
import Fetch from '../utils/Fetch';
import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';
import StringUtil from 'util';
import Msg from '../../msg/Msg';
import { THEME } from '../utils/Theme';
import { HTML_TAG, CUSTOMIZE, TYPE, MOUSE, OPTIONS_KEY } from '../utils/HtmlTypes';
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
        isUser: props.isUser
        ,options: props.options
        ,alertActions: { show: false, style: {} }
        ,overObject: null
        ,isValidate: false
        ,loading: true
        // ,page: props.page
        }
    };

    _onFormatJson(obj) {
        if(Utils.isEmpty(obj) || !Array.isArray(obj)) return;
        let objs = {};
        obj.map((o) => {
            Object.keys(o).map((k) => { objs[k] = o[k] });
        });
        return objs;
    }

    _onSortForms() {
        if(!Utils.inJson(this.state.isUser, 'page')
            || !Utils.inJson(this.state.isUser.page, 'form')
            || !Array.isArray(this.state.isUser.page['form'])) return;
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
        this.state.loading = false;
        this.forceUpdate();
    }

    _formatUiWidget(ui) {
        if(Utils.isEmpty(ui)) return;
        const uiKeys = Object.keys(ui);
        const targets = [ TYPE.IMAGE, TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT, TYPE.CHILDENS, TYPE.DATETIME, TYPE.DATE, TYPE.MONTH, TYPE.TIME, TYPE.QRCODE, TYPE.FILE, TYPE.EDITOR ];
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
                console.log(field);
                console.log('ui[o]');
                console.log(ui[o]);
            }
        });
    }

    _onClickBack() {
        this.state.isUser.path = ACTION.SLASH + ACTION.LIST;
        this.state.isUser.page.form = [];
        this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    }

    _onClickSubmit() {
        this._onFormValidate();
        if(this.state.isValidate) return
        // this.state.isUser.page.form = this.state.form;
        console.log("Data submitted: ", this.state.isUser.page);
        let options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId, page: this.state.isUser.page };
        let action = 'saveData';
        const rId = sessionStorage.getItem(SYSTEM.IS_ACTION_ROW_ID);
        if (Utils.isNumber(this.state.isUser.page['page_id']) && Utils.isNumber(rId)) {
            action = 'updateData';
            options['rId'] = parseInt(rId);
        }
        const seqId = this.state.isUser.page['page_id_seq'];
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + action, options);
        f.then(data => {
            if(!Utils.isEmpty(data)) {
                if(Utils.inJson(data, seqId) && Utils.isNumber(data[seqId])) {
                    console.log(data);
                    this._onClickBack();
                }
                if(Utils.inJson(data, 'error')) {
                    console.log(data);
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    _onUpdateFormData(e) {
        if(!Utils.inJson(e, 'schema') || !Utils.inJson(e, 'formData')) return;
        console.log(e);
        const fidx = e.schema.form_idx;
        const idx = e.schema.idx;
        let form = this.state.isUser.page.form;
        if(e.schema.schema_type === HTML_TAG.DIV) {
            form[fidx].object.data = e.formData;
        }
        if(e.schema.schema_type === HTML_TAG.TAB) {
            form[fidx].object[idx].data = e.formData;
        }
        this.setState({ form });
        this.forceUpdate();
    }

    _onError(errors) {
        console.log("I have", errors.length, "errors to fix");
    }

    _onCheckValidate(object, fKey) {
        let objs = Object.keys(object.ui);
        if(!Array.isArray(objs) || Utils.isEmpty(fKey) || objs.length <= 0) return;
        const targets = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.INTERGER ];
        objs.map((o) => {
            const field = o;
            const type = field.split('_')[0];
            const obj = object.ui[o];
            if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
                || (type === TYPE.TEXT && Utils.inJson(obj, OPTIONS_KEY.OPTIONS_FORMAT_TYPE) && !Utils.isEmpty(obj[OPTIONS_KEY.OPTIONS_FORMAT_TYPE]))
                || (Utils.inJson(obj, CUSTOMIZE.MAX_LENGTH) && !Utils.isEmpty(obj[CUSTOMIZE.MAX_LENGTH]))) {

                const root = document.getElementById(fKey + '_' + field);
                if(!Utils.isEmpty(root)) {
                    const div = root.parentElement;
                    let l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
                    if(!Utils.isEmpty(root) && !Utils.isEmpty(root.parentElement)) {
                        if(!Utils.isEmpty(l) && l.tagName === HTML_TAG.LABEL) {
                            const label = l.innerHTML;
                            const value = object.data[field];
                            let error = null;
                            const rIdx = label.indexOf('<font');
                            error = (rIdx > 0)?label.substr(0, rIdx):label;
                            let viewError = false;
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
                            if(!viewError 
                                && type === TYPE.TEXT
                                && Utils.inJson(obj, OPTIONS_KEY.OPTIONS_FORMAT_TYPE)
                                && !Utils.isEmpty(obj[OPTIONS_KEY.OPTIONS_FORMAT_TYPE])
                                && !Utils.isEmpty(value)) {
                                if(obj[OPTIONS_KEY.OPTIONS_FORMAT_TYPE] === 'uri' && !Utils.isUrl(value)) {
                                    error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'error_uri'), error);
                                    viewError = true;
                                } else if(obj[OPTIONS_KEY.OPTIONS_FORMAT_TYPE] === 'email' && !Utils.isMail(value)) {
                                    error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'error_email'), error);
                                    viewError = true;
                                } else if(obj[OPTIONS_KEY.OPTIONS_FORMAT_TYPE] === 'tel' && !Utils.isTel(value)) {
                                    error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'error_tel'), error);
                                    viewError = true;
                                }
                            }
                            if(!Utils.isEmpty(error) && viewError) {
                                this.state.isValidate = true;
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

    _onAddAttribute(object, fKey) {
        let objs = Object.keys(object.ui);
        if(Utils.isEmpty(objs) || Utils.isEmpty(fKey) || !Array.isArray(objs) || objs.length <= 0) return;
        objs.map((o) => {
            const field = o;
            const obj = object.ui[o];
            const root = document.getElementById(fKey + '_' + field);
            if(!Utils.isEmpty(root)) {
                let div = root.parentElement;
                if (field.endsWith('created_id') || field.endsWith('created_time')
                    || field.endsWith('updated_id') || field.endsWith('updated_time')) {
                    div.style.display = 'none';
                } else {
                    if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
                        || (Utils.inJson(obj, CUSTOMIZE.LABEL_CSS) && !Utils.isEmpty(obj[CUSTOMIZE.LABEL_CSS]))
                        || (Utils.inJson(obj, CUSTOMIZE.TEXT_CSS) && !Utils.isEmpty(obj[CUSTOMIZE.TEXT_CSS]))) {
                        let l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
                        if(field.split('_')[0] === TYPE.FILE) {
                            div = root.parentElement.parentElement.parentElement;
                            l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
                        }
                        if(!Utils.isEmpty(l) && !Utils.isEmpty(div)) {
                            if(Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED]) {
                                const label = l.innerHTML;
                                l.innerHTML = label + "<font class='required'>*</font>";
                            }
                            if(Utils.inJson(obj, CUSTOMIZE.LABEL_CSS) && !Utils.isEmpty(obj[CUSTOMIZE.LABEL_CSS])) {
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
            }
        });
    }

  // _addRequiredOrErrorMsgToDom(requireds, required) {
  //   if(!Array.isArray(requireds) || requireds.length <= 0) return;
  //   const targets = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.INTERGER ];
  //   requireds.map((o) => {
  //     const field = o['item_name'];
  //     const type = field.split('_')[0];
  //     if((Utils.inJson(o, CUSTOMIZE.REQUIRED) && o[CUSTOMIZE.REQUIRED])
  //       || (Utils.inJson(o, CUSTOMIZE.STYLE) && !Utils.isEmpty(o[CUSTOMIZE.STYLE]))) {

  //       const root = document.getElementById('root_' + field);
  //       const div = root.parentElement;
  //       let l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
  //       if(!Utils.isEmpty(root) && !Utils.isEmpty(root.parentElement)) {
  //         if(Utils.inJson(o, CUSTOMIZE.REQUIRED) && o[CUSTOMIZE.REQUIRED]) {
  //           const label = l.innerHTML;
  //           if(!required) {
  //             let msg = '';
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
        if(!Utils.inJson(this.props.isUser, 'page')
            || !Utils.inJson(this.props.isUser['page'], 'form')) return;
            const form = this.state.isUser.page.form;
            if(Utils.isEmpty(form)) return;
            this.state.isValidate = false;
            this.state.isUser.page.form.map((f) => {
            let objs = f.object;
            if(Array.isArray(objs) && objs.length > 0) {
                objs.map((obj) => {
                    this._onCheckValidate(obj, f.object_key);
                });
            } else {
                this._onCheckValidate(objs, f.object_key);
            }
        });
    }

    _onFormAddAttribute() {
        if(!Utils.inJson(this.props.isUser, 'page')
        || !Utils.inJson(this.props.isUser['page'], 'form')) return;
        const form = this.state.isUser.page.form;
        if(Utils.isEmpty(form)) return;
        this.state.isUser.page.form.map((f) => {
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
        let object = null;
        if(nav.tagName === HTML_TAG.NAV) {
            object = this.state.isUser.page.form[form_idx].object[Html.getIdxTabSelected(nav)];
        } else {
            object = this.state.isUser.page.form[form_idx].object;
        }
        if(Utils.isEmpty(object)) return;
        let objs = Array.from(obj.parentElement.childNodes);
        if(Utils.isEmpty(objs) || obj.length < 2) return;
        const target = objs[0];
        if(Utils.isEmpty(target) && Utils.isEmpty(target.getAttribute('for'))) return;
        const fKey = this.state.isUser.page.form[form_idx].object_key;
        const field = target.getAttribute('for').replace(fKey + '_', '');
        if(Utils.isEmpty(field)) return;
        const type = field.split('_')[0];
        if(type === TYPE.CHECKBOX || type === TYPE.FILE) {
        let p = objs[1].childNodes[0];
        let isArray = false;
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
        this.state.alertActions.style = { top: pos.y, left : (pos.x + pos.width) - 30, zIndex: 1 };
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
        if(Utils.isEmpty(div)) return;
        const childs = Array.from(div.childNodes);
        childs.map((o) => {
            let obj = o.childNodes[0];
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
                if(!Utils.isEmpty(l) && !Utils.isEmpty(l.getAttribute('for'))) {
                let type = l.getAttribute('for').replace(obj.id + '_', '');
                type = type.split('_')[0];
                if(!Utils.isEmpty(l) && type !== TYPE.IMAGE && type !== TYPE.DISABLE && type !== TYPE.QRCODE)
                    l.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);    
                }
            }
        });
    }

    _onGetPageInfo(action) {
        if(!Utils.isNumber(action)) return;
        console.log(action)
        let options = { cId: this.state.isUser.cId, pId: parseInt(action), language: this.state.isUser.language };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'getPage', options);
        f.then(data => {
            console.log(data)
            data['patitions'] = [];
            if(!Utils.isEmpty(data)) {
                data.form.map((f) => {
                    const objs = f['object'];
                    if(Array.isArray(objs)) {
                        objs.map((o) => {
                            const ps = o['schema']['properties'];
                            Object.keys(ps).filter(function(key) {
                                if (key.startsWith(TYPE.CHECKBOX)
                                    || key.startsWith(TYPE.RADIO)
                                    || key.startsWith(TYPE.SELECT)
                                    && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET])) {
                                    data['patitions'].push(key);
                                }
                            });
                        })
                    } else {
                        const ps = objs['schema']['properties'];
                        Object.keys(ps).filter(function(key) {
                            if (key.startsWith(TYPE.CHECKBOX)
                                || key.startsWith(TYPE.RADIO)
                                || key.startsWith(TYPE.SELECT)
                                && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET])) {
                                data['patitions'].push(key);
                            }
                        });    
                    }
                });

                if(Array.isArray(data['patitions']) && data['patitions'].length > 0) {
                    options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId };
                    const ff = Fetch.postLogin(host + 'distinctPatitions', options);
                    ff.then(disdata => {
                        if(!Utils.isEmpty(disdata)) {
                            // console.log(disdata);
                            const opts = [ 'company_info', 'group_info', 'users_info', 'city_info', 'menus', 'pages' ];
                            const forms = data.form;
                            let patitions = [];
                            forms.map((f) => {
                                const objs = f['object'];
                                if(Array.isArray(objs)) {
                                    objs.map((o) => {
                                        const ps = o['schema']['properties'];
                                        data['patitions'].map((p) => {
                                            if(Utils.inJson(ps, p)) {
                                                if(Utils.inJson(ps[p], 'option_target')
                                                    && (disdata.includes(ps[p]['option_target']) || opts.includes(ps[p]['option_target']))) {
                                                    patitions.push(ps[p]['option_target']);
                                                } else {
                                                    patitions.push(p);
                                                }
                                            }
                                        });
                                    })
                                } else {
                                    const ps = objs['schema']['properties'];
                                    data['patitions'].map((p) => {
                                        if(Utils.inJson(ps, p)) {
                                            if(Utils.inJson(ps[p], 'option_target')
                                                && (disdata.includes(ps[p]['option_target']) || opts.includes(ps[p]['option_target']))) {
                                                patitions.push(ps[p]['option_target']);
                                            } else {
                                                patitions.push(p);
                                            }
                                        }
                                    });
                                }
                            });
                            patitions.filter(function (x, i, self) {
                                return self.indexOf(x) === i;
                            });

                            // console.log(patitions);
                            options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId, patitions: patitions };
                            const ff = Fetch.postLogin(host + 'options', options);
                            ff.then(pdata => {
                                if(!Utils.isEmpty(pdata)) {
                                    const pforms = data.form;
                                    pforms.map((f) => {
                                        const objs = f['object'];
                                        if(Array.isArray(objs)) {
                                            objs.map((o) => {
                                                const ps = o['schema']['properties'];
                                                Object.keys(ps).map((key) => {
                                                    if(key.endsWith('_theme') && ps[key]['option_target'] === 'themes') {
                                                        ps[key][OPTIONS_KEY.OPTIONS] = THEME.getOptionsThemes();
                                                    } else if(ps[key]['option_target'] === 'pages') {
                                                        const menus = this.props.menus;
                                                        let listmenus = menus.map((m) => {
                                                            if(Utils.inJson(m, 'items') && Array.isArray(m['items']) && !Utils.isEmpty(m['items'][0])) {
                                                                const items = m['items'];
                                                                return items.map((i) => {
                                                                    return { value: i['page_id'], label: i['page_name']}
                                                                });
                                                            } else {
                                                                return { value: m['page_id'], label: m['page_name']}
                                                            }
                                                        });
                                                        ps[key][OPTIONS_KEY.OPTIONS] = listmenus;
                                                    } else if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
                                                        pdata.map((d) => {
                                                            if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
                                                                ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
                                                            }
                                                        });
                                                    }
                                                });
                                            })
                                        } else {
                                            const ps = objs['schema']['properties'];
                                            Object.keys(ps).map((key) => {
                                                if(key.endsWith('_theme') && ps[key]['option_target'] === 'themes') {
                                                    ps[key][OPTIONS_KEY.OPTIONS] = THEME.getOptionsThemes();
                                                } else if(ps[key]['option_target'] === 'pages') {
                                                    const menus = this.props.menus;
                                                    let listmenus = menus.map((m) => {
                                                        if(Utils.inJson(m, 'items') && Array.isArray(m['items']) && !Utils.isEmpty(m['items'][0])) {
                                                            const items = m['items'];
                                                            return items.map((i) => {
                                                                return { value: i['page_id'], label: i['page_name']}
                                                            });
                                                        } else {
                                                            return { value: m['page_id'], label: m['page_name']}
                                                        }
                                                    });
                                                    ps[key][OPTIONS_KEY.OPTIONS] = listmenus;
                                                } else if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
                                                    pdata.map((d) => {
                                                        if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
                                                            ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                delete data['patitions'];
                                this.state.isUser['page'] = data;
                                this._onSetPageColums();
                                // this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
                                // this._onSortForms();
                                this._onLoadDatas();
                                // this.forceUpdate()
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            this.state.isUser['page'] = data;
                            this._onSetPageColums();
                            this._onLoadDatas();
                            // this._onSortForms();
                            // this.forceUpdate()
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.state.isUser['page'] = data;
                    this._onSetPageColums();
                    this._onLoadDatas();
                    // this._onSortForms();
                    // this.forceUpdate()
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    _onSetPageColums() {
        if(!Utils.inJson(this.state.isUser, 'page')
            || !Utils.inJson(this.state.isUser['page'], 'form')
            || !Array.isArray(this.state.isUser['page']['form'])) return;
        const fs = this.state.isUser['page']['form'];
        this.state.isUser['page']['columns'] = [];
        fs.map((f) => {
            const objs = f['object'];
            if(Array.isArray(objs)) {
                objs.map((o) => {
                    const ps = o['schema']['properties'];
                    Object.keys(ps).map((key) => {
                        this.state.isUser['page']['columns'].push(
                            { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), search: ps[key]['auth']['search'] }
                        );
                    });
                })
            } else {
                const ps = objs['schema']['properties'];
                Object.keys(ps).map((key) => {
                    this.state.isUser['page']['columns'].push(
                        { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), search: ps[key]['auth']['search'] }
                    );
                });
            }
        });
    }

    _onLoadDatas() {
        if(this.state.isUser['path'] === (ACTION.SLASH + ACTION.EDIT)
        && (!Utils.inJson(this.state.isUser, 'page')
        || !Utils.isNumber(this.state.isUser['page']['page_id'])
        || !Utils.inJson(this.state.isUser['page'], 'form')
        || !Array.isArray(this.state.isUser['page']['form'])
        || Utils.isEmpty(this.state.isUser['page']['page_id_seq']))) return;
        const rId = sessionStorage.getItem(SYSTEM.IS_ACTION_ROW_ID);
        if(!Utils.isNumber(rId)) {
            this._onSortForms();
        } else {
            const where = this.state.isUser['page']['page_id_seq'] + '=' + rId;
            console.log(where);
            const columns = [];
            this.state.isUser['page']['form'].map((f) => {
                const objs = f['object'];
                if(Array.isArray(objs)) {
                    objs.map((o) => {
                        const ps = o['schema']['properties'];
                        Object.keys(ps).map((key) => {
                        // if(key.startsWith(TYPE.DATE + '_') || key.startsWith(TYPE.DATETIME + '_')) {
                        //   ps[key]['language'] = this.state.isUser.language;
                        // }
                        columns.push(key);
                        });        
                    })
                } else {
                    const ps = objs['schema']['properties'];
                    Object.keys(ps).map((key) => {
                    // if(key.startsWith(TYPE.DATE + '_') || key.startsWith(TYPE.DATETIME + '_')) {
                    //   ps[key]['language'] = this.state.isUser.language;
                    // }
                    columns.push(key);
                    });    
                }
            });
            const page = {
                page_id: this.state.isUser['page']['page_id'],
                page_key: this.state.isUser['page']['page_key'],
                page_id_seq: this.state.isUser['page']['page_id_seq'],
                columns: columns
            };
            const options = { cId: this.state.isUser['cId'], uId: this.state.isUser['uId'], page: page, where: where };
            const host = Msg.getSystemMsg('sys', 'app_api_host');
            const f = Fetch.postLogin(host + 'datas', options);
            f.then(data => {
                if(!Utils.isEmpty(data) && Array.isArray(data) && data.length > 0 && !Utils.inJson(data, 'error')) {
                    console.log(data);
                    const d = data[0];
                    if(Utils.inJson(d, 'items')) {
                        const items = d['items'].filter(function(x) { return !Utils.isEmpty(Object.keys(x)[0]) });
                        console.log(items);
                        items.map((k) => {
                            const k1 = Object.keys(k).filter(function(x) { return x !== 'field_id' })[0];
                            if (!Utils.isEmpty(k1)) {
                                d[k1] = k[k1];
                                this.state.isUser['page']['form'].map((f) => {
                                    const objs = f['object'];
                                    if(Array.isArray(objs)) {
                                        objs.map((sc) => {
                                            const ps = sc['schema']['properties'];
                                            if(Utils.inJson(ps, k1)) {
                                                ps[k1]['field_id'] = k['field_id'];
                                            }      
                                        })
                                    } else {
                                        const ps = objs['schema']['properties'];
                                        if(Utils.inJson(ps, k1)) {
                                            ps[k1]['field_id'] = k['field_id'];
                                        }      
                                    }
                                });
                            }
                        });
                        delete d['items'];
                    }
                    this.state.isUser['page']['form'].map((f) => {
                        const objs = f['object'];
                        if(Array.isArray(objs)) {
                            objs.map((o) => {
                                const ps = o['schema']['properties'];
                                Object.keys(ps).map((key) => {
                                if(Object.keys(d).includes(key)) {
                                    if(key.startsWith(TYPE.TEXTAREA) && Utils.isEmpty(d[key])) {
                                        o['data'][key] = '';
                                    } else {
                                        if(key.startsWith(TYPE.DATE + '_') || key.startsWith(TYPE.DATETIME + '_')) {
                                            ps[key]['language'] = this.state.isUser.language;
                                        }
                                            o['data'][key] = d[key];
                                        }
                                    }
                                });        
                            })
                        } else {
                            const ps = objs['schema']['properties'];
                            Object.keys(ps).map((key) => {
                                if(Object.keys(d).includes(key)) {
                                    if(key.startsWith(TYPE.TEXTAREA) && Utils.isEmpty(d[key])) {
                                        objs['data'][key] = '';
                                    } else {
                                        if(key.startsWith(TYPE.DATE + '_') || key.startsWith(TYPE.DATETIME + '_')) {
                                            ps[key]['language'] = this.state.isUser.language;
                                        }
                                        objs['data'][key] = d[key];
                                    }
                                }
                            });    
                        }
                    });
                    console.log(this.state.isUser['page']);
                    this._onSortForms();
                    // this.forceUpdate();
                } else {
                    console.log(data);
                }
            }).catch(err => {
                console.log(err);
            });   
        }
    }

    _onUpdateStateIsUser(isUser) {
        this.state.isUser = isUser['info'];
        this.state.options = isUser['options'];
        this.state.isUser.path = ACTION.SLASH + ACTION.EDIT;
        this.state.loading = false;
        console.log(this.state.isUser);
        this._onGetPageInfo(this.state.isUser['action']);
    }

  // componentDidUpdate() {
  //   if(!Utils.inJson(this.props.isUser, 'page')
  //     || !Utils.inJson(this.props.isUser['page'], 'form')) return;
  //   this._onFormAddAttribute();
  //   this._onFindFields();
  // }

    componentDidMount() {
        if(!Utils.inJson(this.props.isUser, 'page')
            || !Utils.inJson(this.props.isUser['page'], 'form')) return;
        this._onFormAddAttribute();
        this._onFindFields();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps.isUser);
        if(Utils.inJson(nextProps.isUser, 'action')
        && Utils.isNumber(nextProps.isUser['action'])
        && this.state.isUser['action'] !== nextProps.isUser['action']) {
            this.state.isUser = nextProps.isUser;
            this._onGetPageInfo(nextProps.isUser['action']);
        }
    }

    UNSAFE_componentWillMount() {
        console.log(this.props.isUser);
        if(Utils.inJson(this.props.isUser, 'action')
            && Utils.isNumber(this.props.isUser['action'])) {
            this._onGetPageInfo(this.props.isUser['action']);
        }
        // if(Utils.isEmpty(this.props.isUser)
        //   || !Utils.inJson(this.props.isUser, 'action')
        //   || !Utils.isNumber(this.props.isUser['action'])) {
        //   AuthSession.loadAuthCookies(this.props.sessionService, this._onUpdateStateIsUser.bind(this))
        // } else {
        //   this._onSortForms();
        // }
        // console.log(this.state.isUser);
    }

    UNSAFE_componentWillUnmount() {
        this.props.cancel();
    }

    render() {
        let labelPage = 'bt_create';
        let labelButton = 'bt_insert';
        const pageMode = (Utils.inJson(this.state.isUser, 'page')
                        && Utils.isNumber(this.state.isUser.page['page_id'])
                        && (this.state.isUser.path === ACTION.SLASH + ACTION.EDIT));
        if(!pageMode) {
            this.state.isUser.actions = PAGE_ACTION.CREATE;
        } else {
            labelPage = 'bt_edit';
            labelButton = 'bt_update';
            this.state.isUser.actions = PAGE_ACTION.CREATE;
            this.state.isUser.actions.create = false;
        }

        return (
            <div>
                <LoadingOverlay active={ this.state.loading } spinner text={ Msg.getMsg(MSG_TYPE.INFO, this.state.isUser.language, 'loading') } />

                {(() => {
                    if(Utils.inJson(this.props.isUser, 'action')
                        && Utils.isNumber(this.state.isUser['action'])
                        && Utils.inJson(this.props.isUser, 'page')) {
                        const rId = sessionStorage.getItem(SYSTEM.IS_ACTION_ROW_ID);
                        return(
                            <div className={ 'div-list-box' }>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h5>
                                                    { this.state.isUser.page.page_name + '/' + Msg.getMsg(null, this.state.isUser.language, labelPage)}
                                                    {(() => {
                                                        if(Utils.isNumber(rId)) {
                                                            return(<span>{ '[' + rId + ']' }</span>);
                                                        }
                                                    })()}
                                                </h5>
                                            </td>
                                            <td style={{ textAlign: 'right'}}>
                                                <Button onClick={ this._onClickBack.bind(this) } variant={ VARIANT_TYPES.PRIMARY }>
                                                    { Msg.getMsg(null, this.state.isUser.language, 'bt_list') }
                                                </Button>
                                                <Button type="submit" onClick={ this._onClickSubmit.bind(this) } variant={ VARIANT_TYPES.WARNING }>
                                                    { Msg.getMsg(null, this.state.isUser.language, labelButton) }
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                { this._onResetButtons() }
                                <CForm
                                    isUser={ this.state.isUser }
                                    form={ this.state.isUser.page.form }
                                    updateFormData={ this._onUpdateFormData.bind(this) } />
                            </div>
                        );
                    }
                })()}
            </div>
        );
    }
};

export default connect()(withRouter(Create));