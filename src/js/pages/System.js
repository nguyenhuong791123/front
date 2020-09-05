import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, ButtonGroup, Button, FormControl } from 'react-bootstrap';
import { FaTrash, FaWindowRestore } from 'react-icons/fa';
import StringUtil from 'util';

import Actions from '../utils/Actions';
import AlertDelete from '../utils/Delete';
import { SYSTEM, ACTION, PAGE_ACTION, VARIANT_TYPES, PAGE, MSG_TYPE } from '../utils/Types';
import { HTML_TAG, ATTR, TYPE, DRAG, OPTIONS_KEY } from '../utils/HtmlTypes';
import { THEME } from '../utils/Theme';
import Fetch from '../utils/Fetch';
import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';

import Msg from '../../msg/Msg';
import '../../css/TreeList.css';

class System extends C {
    constructor(props) {
        super(props);

        // this._onClick = this._onClick.bind(this);
        this._onClickAdd = this._onClickAdd.bind(this);
        this._onButtonClick = this._onButtonClick.bind(this);
        this._onCheckBoxClick = this._onCheckBoxClick.bind(this);
        // this._onClickSubmit = this._onClickSubmit.bind(this);
        this._onGroupSettingMenuCreate = this._onGroupSettingMenuCreate.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,options: this.props.options
            ,pagedelete: null
            ,settingbox: {
                setting: false,
                page: {
                    page_name: '',
                    page_flag: 1,
                    page_order: 0,
                },
                pages: [] }
            ,msg: ''
            ,draggable: false
            ,dragobject: null
            ,pages: { page: [] }
            ,checked: []
            ,expanded: []
            ,menus: []
            ,auths: []
            ,btns: []
        };
    };

    _onClickAdd() {
        this.state.isUser.action = PAGE.CUSTOMIZE;
        this.state.isUser.path = ACTION.SLASH + PAGE.CUSTOMIZE;
        this.state.isUser.actions = undefined;
        let auths = {};
        this.state.auths[0].map((o) => {
            auths[o] = true;
        });
        this.state.isUser.page = { page_id: '', page_name: '', page_auth: auths, form: [] };
        this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    }

    _onClickEdit(e) {
        var obj = e.target;
        if(obj.tagName !== HTML_TAG.A || !Html.hasAttribute(obj, ATTR.PIDX) || !Html.hasAttribute(obj, ATTR.IDX)) return;
        this.state.isUser.action = PAGE.CUSTOMIZE;
        this.state.isUser.path = ACTION.SLASH + PAGE.CUSTOMIZE;
        this.state.isUser.actions = undefined;

        const iIdx = Html.hasAttribute(obj, ATTR.IDX)?obj.getAttribute(ATTR.IDX):null;
        const liP = obj.parentElement.parentElement.parentElement.parentElement;
        const pIdx = Html.hasAttribute(liP, ATTR.IDX)?liP.getAttribute(ATTR.IDX):null;
        let page = null;
        if(!Utils.isNumber(iIdx)) return;
        if(!Utils.isNumber(pIdx)) {
            page = this.state.menus[iIdx];
        } else {
            page = this.state.menus[pIdx]['items'][iIdx];
        }
        if(Array.isArray(this.state.auths[0]) && !Utils.isEmpty(page['page_auth'])) {
            if(this.state.auths[0].length > Object.keys(page.page_auth).length) {
                const auths = {}
                this.state.auths[0].map((o) => {
                    auths[o] = (Utils.isEmpty(page.page_auth[o]))?false:page.page_auth[o];
                });
                page.page_auth = auths;
            }
        }
        this.state.isUser.page = page;
        console.log(page)
        this._onGetPageInfo(this.state.isUser.page['page_id']);
    }

    _onGetPageInfo(action) {
        if(!Utils.isNumber(action)) return;
        let options = { cId: this.state.isUser.cId, pId: parseInt(action), language: this.state.isUser.language };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'getEditCustomizePage', options);
        f.then(data => {
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
                            console.log(disdata);
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
                                                    && (disdata.includes(ps[p]['option_target']) || opts.includes(ps[p]['option_target']))
                                                    ) {
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
                                                && (disdata.includes(ps[p]['option_target']) || opts.includes(ps[p]['option_target']))
                                                ) {
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

                            console.log(patitions);
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
                                this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            this.state.isUser['page'] = data;
                            this._onSetPageColums();
                            this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.state.isUser['page'] = data;
                    this._onSetPageColums();
                    this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
                }
            }
        }).catch(err => {
            console.log(err);
        });
      }

    // _onGetPageInfo(action) {
    //     if(!Utils.isNumber(action)) return;
    //     let options = { cId: this.state.isUser.cId, pId: parseInt(action), language: this.state.isUser.language };
    //     const host = Msg.getSystemMsg('sys', 'app_api_host');
    //     const f = Fetch.postLogin(host + 'getEditCustomizePage', options);
    //     f.then(data => {
    //         if(!Utils.isEmpty(data)) {
    //             data.form.map((f) => {
    //                 const ps = f['object']['schema']['properties'];
    //                 data['patitions'] = Object.keys(ps).filter(function(key) {
    //                     return (key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))
    //                 });
    //             });
    
    //             if(Array.isArray(data['patitions']) && data['patitions'].length > 0) {
    //                 options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId };
    //                 const ff = Fetch.postLogin(host + 'distinctPatitions', options);
    //                 ff.then(disdata => {
    //                     if(!Utils.isEmpty(disdata)) {
    //                         console.log(disdata);
    //                         const forms = data.form;
    //                         let patitions = [];
    //                         forms.map((f) => {
    //                             const ps = f['object']['schema']['properties'];
    //                             patitions = data['patitions'].map((p) => {
    //                                 if(Utils.inJson(ps[p], 'option_target') && disdata.includes(ps[p]['option_target'])
    //                                     || p.endsWith('_city')
    //                                     || p.endsWith('group_parent_id')
    //                                     || p.endsWith('group_info_company_id')
    //                                     || p.endsWith('api_info_company_id')
    //                                     || p.endsWith('server_info_company_id')
    //                                     || p.endsWith('server_info_server_type')
    //                                     || p.endsWith('users_info_group_id')) {
    //                                     return ps[p]['option_target'];
    //                                 } else {
    //                                     return p;
    //                                 }
    //                             });
    //                             console.log(patitions);
    //                             patitions.filter(function (x, i, self) {
    //                                 return self.indexOf(x) === i;
    //                             });
    //                         });
    
    //                         console.log(patitions);
    //                         options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId, patitions: patitions };
    //                         const ff = Fetch.postLogin(host + 'options', options);
    //                         ff.then(pdata => {
    //                             if(!Utils.isEmpty(pdata)) {
    //                                 const pforms = data.form;
    //                                 pforms.map((f) => {
    //                                     const ps = f['object']['schema']['properties'];
    //                                     Object.keys(ps).map((key) => {
    //                                         if(key.endsWith('_theme') && ps[key]['option_target'] === 'themes') {
    //                                             ps[key][OPTIONS_KEY.OPTIONS] = THEME.getOptionsThemes();
    //                                         } else if(ps[key]['option_target'] === 'pages') {
    //                                           const menus = this.state.menus;
    //                                           let listmenus = menus.map((m) => {
    //                                             if(Utils.inJson(m, 'items') && Array.isArray(m['items']) && !Utils.isEmpty(m['items'][0])) {
    //                                               const items = m['items'];
    //                                               return items.map((i) => {
    //                                                 return { value: i['page_id'], label: i['page_name']}
    //                                               });
    //                                             } else {
    //                                               return { value: m['page_id'], label: m['page_name']}
    //                                             }
    //                                           });
    //                                           // listmenus.splice(0, 0, { value: '', label: '---' });
    //                                           ps[key][OPTIONS_KEY.OPTIONS] = listmenus;
    //                                         } else if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
    //                                           pdata.map((d) => {
    //                                                 if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
    //                                                     ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
    //                                                 }
    //                                             });
    //                                         }
    //                                     });
    //                                 });
    //                             }
    //                             delete data['patitions'];
    //                             this.state.isUser['page'] = data;
    //                             this._onSetPageColums();
    //                             this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    //                             // this.forceUpdate()
    //                         }).catch(err => {
    //                             console.log(err);
    //                         });
    //                     } else {
    //                         this.state.isUser['page'] = data;
    //                         this._onSetPageColums();
    //                         this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    //                         // this.forceUpdate()
    //                     }
    //                 }).catch(err => {
    //                     console.log(err);
    //                 });
    //             } else {
    //                 this.state.isUser['page'] = data;
    //                 this._onSetPageColums();
    //                 this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    //                 // this.forceUpdate()
    //             }
    //         }
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // }
    
    _onSetPageColums() {
        if(!Utils.inJson(this.state.isUser, 'page') || !Array.isArray(this.state.isUser['page']['form'])) return;
        const fs = this.state.isUser['page']['form'];
        this.state.isUser['page']['columns'] = [];
        fs.map((f) => {
            const objs = f['object'];
            if(Array.isArray(objs)) {
                objs.map((o) => {
                    const ps = o['schema']['properties'];
                    Object.keys(ps).map((key) => {
                        if(!key.startsWith('hidden_')) {
                        this.state.isUser['page']['columns'].push(
                                // { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), view: ps[key]['auth']['view'] }
                                { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), search: ps[key]['auth']['search'] }
                            );
                        }
                    });
                })
            } else {
                const ps = objs['schema']['properties'];
                Object.keys(ps).map((key) => {
                    if(!key.startsWith('hidden_')) {
                    this.state.isUser['page']['columns'].push(
                            { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), search: ps[key]['auth']['search'] }
                            // { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), view: ps[key]['auth']['view'] }
                        );
                    }
                });
            }
        });
    }

    _onButtonClick(e) {
        var obj = e.target;
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.BUTTON) return;
        const className = obj.className;
        const selected = (className.indexOf(ACTION.SELECTED) === -1);
        this._addButtonSelected(obj, selected);
        const code = Html.hasAttribute(obj, ATTR.CODE)?obj.getAttribute(ATTR.CODE):null;
        if(Utils.isEmpty(code)) return;

        const div = obj.parentElement;
        if(Utils.isEmpty(div) || div.tagName !== HTML_TAG.DIV) return;
        let input = div.getElementsByTagName(HTML_TAG.INPUT)[0];
        if(Utils.isEmpty(input) || input.getAttribute('type') !== TYPE.CHECKBOX) return;
        if(!Html.hasAttribute(div, ATTR.ID) || div.id.indexOf('div_btn_') === -1) {
            const btns = Array.from(div.childNodes).filter(function(x){ return x.tagName === HTML_TAG.BUTTON });
            const count = this._onCountButtonSelected(btns);
            if(count === btns.length && !input.checked) {
                // input.click();
                input.checked = true;
            } else if(count < btns.length && input.checked) {
                input.checked = false;
            }
            const li = div.parentElement;
            const ul = li.getElementsByTagName(HTML_TAG.UL)[0];
            if(!Utils.isEmpty(ul)) {
                const ulis = Array.from(ul.childNodes);
                const pIdx = li.getAttribute(ATTR.IDX);
                ulis.map((li) => {
                    // const bts = Array.from(li.childNodes[1].childNodes);
                    const bts = Array.from(li.childNodes[1].childNodes).filter(function(x){ return x.tagName === HTML_TAG.BUTTON });;
                    bts.map((b) => {
                        if(Html.hasAttribute(b, ATTR.CODE) && b.getAttribute(ATTR.CODE) === code) {
                            const idx = b.getAttribute(ATTR.IDX);
                            if(selected) {
                                b.className = 'selected btn btn-' + VARIANT_TYPES.DARK;
                            } else {
                                b.className = 'btn btn-outline-' + VARIANT_TYPES.DARK;
                            }
                            this.state.menus[pIdx]['items'][idx]['page_auth'][code] = selected;
                        }
                    });
                    const checked = this._onCountButtonSelected(bts);
                    input = li.childNodes[1].getElementsByTagName(HTML_TAG.INPUT)[0];
                    input.checked = (checked === bts.length);
                });
            }    
        } else {
            // const btns = Array.from(div.childNodes);
            const btns = Array.from(div.childNodes).filter(function(x){ return x.tagName === HTML_TAG.BUTTON });
            const count = this._onCountButtonSelected(btns);
            if(count === btns.length && !input.checked) {
                input.click();
            } else if(count <= btns.length) {
                if(count === 0) {
                    input.checked = true;
                    input.click();
                } else {
                    input.checked = false;
                    const ul = div.parentElement.childNodes[div.parentElement.childNodes.length-1];
                    if(Utils.isEmpty(ul) | ul.tagName !== HTML_TAG.UL) return;
                    const ulis = Array.from(ul.childNodes);
                    ulis.map((li) => {
                        this._addButtonAutoSelected(li, code, selected);
                    });
                }
            }
        }

        if(Utils.isEmpty(div.parentElement.parentElement.parentElement)) return;
        const liP = div.parentElement.parentElement.parentElement;
        let idx = div.parentElement.getAttribute(ATTR.IDX);
        let pIdx = liP.getAttribute(ATTR.IDX);
        if(!Utils.isNumber(pIdx)) {
            const pages = this.state.menus[idx];
            if(Utils.inJson(pages, 'items') && Array.isArray(pages['items']) && !Utils.isEmpty(pages['items'][0])) {
                pages['items'].map((page) => {
                    this._onUpdatePages(page);
                });    
            }
        } else {
            this._onUpdatePages(this.state.menus[pIdx]['items'][idx]);
        }
    }

    _onCountButtonSelected(btns) {
        if(!Array.isArray(btns)) return 0;
        let count = 0;
        btns.map((o) => {
            if(!Utils.isEmpty(o.className) && o.className.indexOf('selected') !== -1)
                count += 1;
        });
        return count;
    }

    _addButtonAutoSelected(obj, code, selected) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const div = obj.childNodes[obj.childNodes.length-1];
        if(div.tagName === HTML_TAG.UL) {
            const ulis = Array.from(div.childNodes);
            ulis.map((li) => {
                this._addButtonAutoSelected(li, code, selected);
            });
        }
        if(div.tagName === HTML_TAG.DIV && div.className.indexOf('div-btn-group') !== -1) {
            const input = div.getElementsByTagName(HTML_TAG.INPUT)[0];
            if(Utils.isEmpty(input) || input.getAttribute('type') !== TYPE.CHECKBOX) return;
            // const btns = Array.from(div.childNodes);
            const btns = Array.from(div.childNodes).filter(function(x){ return x.tagName === HTML_TAG.BUTTON });
            btns.map((btn) => {
                if(Html.hasAttribute(btn, ATTR.CODE) && btn.getAttribute(ATTR.CODE) === code) {
                    this._addButtonSelected(btn, selected);
                }
            });
            const count = this._onCountButtonSelected(btns);
            if(count < btns.length && input.checked) input.checked = false;
        }
    }

    _addButtonSelected(obj, selected) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.BUTTON) return;
        const className = obj.className;
        let liP = obj.parentElement.parentElement;
        let pIdx = liP.getAttribute(ATTR.IDX);
        if(className.indexOf('selected ') === -1 && selected)
            obj.className = 'selected ' + className.replace('btn-outline-', 'btn-');
        if(!Utils.isEmpty(className) && className.indexOf('selected ') !== -1 && !selected)
            obj.className = className.replace('selected ', '').replace('btn-', 'btn-outline-');

        liP = liP.parentElement.parentElement;
        pIdx = liP.getAttribute(ATTR.IDX);
        const iIdx = Html.hasAttribute(obj, ATTR.IDX)?obj.getAttribute(ATTR.IDX):null;
        const code = Html.hasAttribute(obj, ATTR.CODE)?obj.getAttribute(ATTR.CODE):null;
        if(!Utils.isNumber(iIdx) || Utils.isEmpty(code)) return;
        if(!Utils.isNumber(pIdx)) {
            const auths = this.state.menus[iIdx]['page_auth'];
            auths[code] = selected;
        } else {
            const auths = this.state.menus[pIdx]['items'][iIdx]['page_auth'];
            auths[code] = selected;
            const div = liP.childNodes[1];
            if(!Utils.isEmpty(div)) {
                const input = div.getElementsByTagName(HTML_TAG.INPUT)[0];
                let btP = null;
                Array.from(div.childNodes).map((b) => {
                    if(Html.hasAttribute(b, ATTR.CODE) && b.getAttribute(ATTR.CODE) === code) {
                        btP = b;
                    }
                });
                if(!Utils.isEmpty(input) && !Utils.isEmpty(btP)) {
                    const vChecked = this._onVerticalChecked(pIdx, code);
                    const pChecked = this._onCountButtonSelected(Array.from(div.childNodes));
                    if(vChecked) {
                        if(pChecked === (div.childNodes.length - 2)) input.checked = vChecked;
                        btP.className = 'selected btn btn-' + VARIANT_TYPES.DARK;
                    } else {
                        input.checked = vChecked;
                        btP.className = 'btn btn-outline-' + VARIANT_TYPES.DARK;
                    }
                }
            }
        }
    }

    _onCheckBoxClick(e) {
        var obj = e.target;
        if(Utils.isEmpty(obj)
            || !Html.hasAttribute(obj, ATTR.TYPE)
            || obj.type !== TYPE.CHECKBOX) return;
        const div = obj.parentElement;
        if(Utils.isEmpty(div) || div.childNodes.length <=1) return;
        const btns =  Array.from(div.childNodes);
        if(!Utils.isEmpty(this.state[ACTION.SELECTED])) obj.checked = this.state[ACTION.SELECTED];
        const selected = obj.checked;
        btns.map((bt) => {
            if(bt.tagName === HTML_TAG.BUTTON) {
                this._addButtonSelected(bt, selected);
            }
        });

        const ul = div.parentElement.childNodes[div.parentElement.childNodes.length-1];
        if(Utils.isEmpty(ul) || ul.tagName !== HTML_TAG.UL) {
            if(!Utils.isEmpty(div.parentElement.parentElement.parentElement)) {
                const liP = div.parentElement.parentElement.parentElement;
                let idx = div.parentElement.getAttribute(ATTR.IDX);
                let pIdx = liP.getAttribute(ATTR.IDX);
                let page = null;
                if(Utils.isNumber(pIdx) && Utils.isNumber(idx)) {
                    page = this.state.menus[pIdx]['items'][idx];
                } else {
                    page = this.state.menus[idx];
                }
                this._onUpdatePages(page);
            }
            return;
        }
        this.state[ACTION.SELECTED] = selected;
        const ulis = Array.from(ul.childNodes);
        ulis.map((li) => {
            this._onCheckBoxAutoClick(li);
        });
        this.state[ACTION.SELECTED] = null;
    }

    _onCheckBoxAutoClick(obj) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const div = obj.childNodes[obj.childNodes.length-1];
        if(div.tagName === HTML_TAG.UL) {
            const ulis = Array.from(div.childNodes);
            ulis.map((li) => {
                this._onCheckBoxAutoClick(li);
            });
        }
        if(div.tagName === HTML_TAG.DIV && div.className.indexOf('div-btn-group') !== -1) {
            div.childNodes[0].click();
        }
    }

    _onUpdatePages(page) {
        if(Utils.isEmpty(page)) return;
        const options = { page: page, cId: this.state.isUser.cId, uId: this.state.isUser.uId };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'updatePage', options);
        f.then(data => {
            if(!Utils.isEmpty(data)) {
                console.log(data)
                // this.setState({ menus: data });
                // this.forceUpdate();
                // this.props.onUpdateMenus(data);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // _onClickSubmit() {
    //     console.log(this.state.menus);
    //     // window.location.reload(false);
    //     const options = { pages: this.state.menus, cId: this.state.isUser.cId, uId: this.state.isUser.uId };
    //     const host = Msg.getSystemMsg('sys', 'app_api_host');
    //     const f = Fetch.postLogin(host + 'updatePages', options);
    //     f.then(data => {
    //         if(!Utils.isEmpty(data)) {
    //             this.props.onUpdateMenus(data);
    //         }
    //     }).catch(err => {
    //         console.log(err);
    //     });
    //     // console.log(menus);
    //     // this.props.onUpdateMenus(this.state.menus);
    // }

    _getSelected(obj) {
        if(Utils.isEmpty(obj)
            || obj.tagName !== HTML_TAG.LI
            || Utils.isEmpty(obj.childNodes[0])) return;
        const div = obj.childNodes[obj.childNodes.length-1];
        if(div.tagName === HTML_TAG.DIV && div.className.indexOf('div-btn-group') !== -1) {
            var add = false;
            var page = { action: obj.id, methods: [] };
            // const btns = Array.from(div.childNodes);
            const btns = Array.from(div.childNodes).filter(function(x){ return x.tagName === HTML_TAG.BUTTON });
            btns.map((btn) => {
                if(btn.type === TYPE.BUTTON
                    && Html.hasAttribute(btn, ATTR.CODE)
                    && btn.className.indexOf(' selected') !== -1) {
                    add = true;
                    page.methods.push(btn.getAttribute(ATTR.CODE));
                }
            });
            if(add) this.state.pages.page.push(page);
        } else {
            const ulis = Array.from(div.childNodes);
            ulis.map((li) => {
                this._getSelected(li);
            });    
        }
    }

    _getAllList() {
        if(Utils.isEmpty(this.state.menus) || this.state.menus.length <= 0) return "";
        this.state.menus.map((o) => {
            if(Utils.inJson(o, 'items') && Array.isArray(o['items']) && !Utils.isEmpty(o['items'][0])) {
                o['items'].sort((a, b) => ((a.page_order > b.page_order)?1:-1));
            }
        });
        this.state.menus.sort((a, b) => ((a.page_order > b.page_order)?1:-1));
  
        var childs = [];
        this.state.menus.map((obj, index) => {
            childs.push(this._geList(obj, index, index));
        });
        return(<ul>{ childs }</ul>);
    }

    _geList(obj, idx, mIdx) {
        this._onGetAllAuths();
        const allAuth = this.state.auths[mIdx];
        if(!Utils.inJson(obj, 'items') || obj.items.length <= 0 || Utils.isEmpty(obj.items[0])) {
            const className = (obj.page_flag === 1)?'btn-'+ VARIANT_TYPES.INFO:'';
            const vDelete = Msg.getSystemMsg('sys', 'system_pages').includes(obj.page_key);
            const style = (idx === mIdx)?{ marginRight: '.5em' }:{};
            const variant = (obj.page_open === 1)?VARIANT_TYPES.PRIMARY:VARIANT_TYPES.OUTLINE + VARIANT_TYPES.PRIMARY;
            let div = (<div
                        key={ 'div_' + idx }
                        className={ className }
                        onMouseOver={ this._onMouseOver.bind(this) }>
                        <a
                            href={ '#' }
                            idx={ idx }
                            pidx={ mIdx }
                            onClick={ this._onClickEdit.bind(this) }>
                            { obj.page_name }
                        </a>
                        <Button
                            style={ style }
                            variant={ variant }
                            title={ 'New Windown' }>
                            <FaWindowRestore />
                        </Button>
                        {(() => {
                            if(!vDelete) {
                                return (
                                    <Button
                                        type={ HTML_TAG.BUTTON }
                                        style={ style }
                                        onClick={ this._onClickViewDelete.bind(this) }
                                        variant={ VARIANT_TYPES.WARNING }>
                                        <FaTrash />
                                    </Button>
                                );
                            }
                        })()}
                    </div>);
            // var div = (<div key={ 'div_' + idx } className={ className }>
            //             <a href={ '#' } id={ obj.page_id } onClick={ this._onClickEdit.bind(this) }>{ obj.page_name }</a>
            //         </div>);
            // if(this.state.isUser.uLid === SYSTEM.IS_ADMIN)
                // div = (<div key={ 'div_' + idx } className={ className } onClick={ this._onClick.bind(this) }>{ obj.page_name }</div>);
            const auths = [this.state.auths.length];
            if(Utils.inJson(obj, 'page_auth') && !Utils.isEmpty(obj['page_auth'])) {
                const objs = Object.keys(obj.page_auth);
                console.log(obj);
                objs.map((key, index) => {
                    const btSelected = (obj.page_auth[key])?'selected':'';
                    const variant = (obj.page_auth[key])?VARIANT_TYPES.SECONDARY:VARIANT_TYPES.OUTLINE + VARIANT_TYPES.SECONDARY;
                    const aIdx = allAuth.indexOf(key);
                    auths[aIdx] = (<Button
                        key={ index }
                        idx={ idx }
                        pidx={ mIdx }
                        code={ key }
                        className={ btSelected }
                        variant={ variant }
                        onClick={ this._onButtonClick.bind(this) }
                        title={ Msg.getMsg(null, this.state.isUser.language, 'bt_' + key.substr(3)) }>
                        { Msg.getMsg(null, this.state.isUser.language, 'bt_' + key.substr(3)) }
                    </Button>);
                });
            }
            for(let i=0; i<auths.length; i++) {
                if(!Utils.isEmpty(auths[i])) continue;
                auths[i] = (<span key={ 'span_' + i } className='span-display-none'> </span>);
            }

            let checked = this._onAllChecked([obj]);
            checked = (checked.length > 0)?checked[0].checked:true;
            return (
                <li
                    key={ 'li_' + idx }
                    idx={ idx }
                    onDragStart={ this._onDragStart.bind(this) }
                    draggable={ true }>
                    { div }
                    {(() => {
                        if(!Utils.isEmpty(auths) && auths.length > 0) {
                            return (
                                <ButtonGroup className='div-btn-group'>
                                    <input
                                        type={ TYPE.CHECKBOX }
                                        idx={ idx }
                                        pidx={ mIdx }
                                        defaultChecked={ checked }
                                        onClick={ this._onCheckBoxClick.bind(this) } />
                                    { auths }
                                </ButtonGroup>
                            );
                        }
                    })()}
                </li>);
        } else {
            let childs = [];
            obj.items.map((o, index) => {
                childs.push(this._geList(o, index, mIdx));
            });
            const className = (obj.page_flag === 1)?'btn-info':'';
            const vDelete = Msg.getSystemMsg('sys', 'system_pages').includes(obj.page_key);
            let div = (<div
                        key={ 'div_' + idx }
                        className={ className }
                        onMouseOver={ this._onMouseOver.bind(this) }>
                            { obj.page_name }
                            {(() => {
                                if(!vDelete) {
                                    return (
                                        <Button
                                            type={ HTML_TAG.BUTTON }
                                            onClick={ this._onClickViewDelete.bind(this) }
                                            variant={ VARIANT_TYPES.WARNING }>
                                            <FaTrash />
                                        </Button>
                                    );
                                }
                            })()}
                    </div>);
            // if(this.state.isUser.uLid === SYSTEM.IS_ADMIN)
            //     div = (<div key={ 'div_' + idx } className={ className } onClick={ this._onClick.bind(this) }>{ obj.page_name }</div>);
            return(
                <li
                    key={ 'li_' + idx }
                    idx={ idx }
                    onDragStart={ this._onDragStart.bind(this) }
                    draggable={ true }
                    className='parent'>
                    { div }
                    <ul key={ 'ul_' + idx }>{ childs }</ul>
                </li>
            );
        }
    }

    _getChildButtons(obj, idx) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const ul = obj.childNodes[obj.childNodes.length-1];
        if(Utils.isEmpty(ul) || (ul.tagName !== HTML_TAG.DIV && ul.tagName !== HTML_TAG.UL)) return;
        if(ul.tagName === HTML_TAG.DIV
            && !Utils.isEmpty(ul.className)
            && ul.className.indexOf('div-btn-group') !== -1) {
            if(!Array.isArray(this.state.btns[idx])) this.state.btns[idx] = [];
            const btns = Array.from(ul.childNodes);
            btns.map((b) => {
                if(!(this.state.btns[idx].map((o) => { return o.getAttribute(ATTR.CODE) })).includes(b.getAttribute(ATTR.CODE))) {
                    this.state.btns[idx].push(b.cloneNode(true));
                }
            });

            const count = this._onCountButtonSelected(btns);
            const input = ul.getElementsByTagName(HTML_TAG.INPUT)[0];
            if(count === btns.length && !input.checked) input.checked = true;
        } else {
            const ulis = Array.from(ul.childNodes);
            ulis.map((li) => {
                this._getChildButtons(li, idx);
            });
        }
    }

    _onDragStart(e) {
        // e.preventDefault();
        const obj = e.target;
        if(obj.tagName !== HTML_TAG.LI && obj.tagName !== HTML_TAG.DIV) return;
        this.state.dragobject = (obj.tagName === HTML_TAG.DIV)?obj.parentElement:obj;
    }

    _onDragOver(e) {
        e.preventDefault();
        // e.stopPropagation();
        // this.state.draggable = true;
    }
    
    _onDragDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        let obj = e.target;
        if(obj.tagName !== HTML_TAG.DIV
            && obj.className !== 'div-list-box'
            || Utils.isEmpty(this.state.dragobject.parentElement)
            || Utils.isEmpty(this.state.dragobject.parentElement.parentElement)) return;
        obj = obj.parentElement;
        if(Utils.isEmpty(obj.className) && this.state.dragobject.className === 'parent') return;

        const dragId = Array.from(obj.parentElement.childNodes).indexOf(this.state.dragobject);
        const dropId = Array.from(obj.parentElement.childNodes).indexOf(obj);
        if(dragId == dropId || dropId == -1) return;
        const dragIdx = parseInt(this.state.dragobject.getAttribute(ATTR.IDX));
        const dragpIdx = parseInt(this.state.dragobject.parentElement.parentElement.getAttribute(ATTR.IDX));
        const dropIdx = parseInt(obj.getAttribute(ATTR.IDX));
        const droppIdx = parseInt(obj.parentElement.parentElement.getAttribute(ATTR.IDX));

        const menus = this.state.menus;
        if(!Utils.isEmpty(obj.className) && obj.className === 'parent'
            && obj.className !== this.state.dragobject.className) {
                let menu = menus[dragIdx];
                if(Utils.isNumber(dragpIdx)) menu = menus[dragpIdx]['items'][dragIdx];
                if(!menus.includes(menu))
                    menu['page_level'] = 0;
                    menu['page_group_id'] = 0;
                    if(Utils.inJson(menu, 'items')) delete menu['items']
                    menus[dropIdx]['items'].push(menu);
                    if(Utils.isNumber(dragpIdx)) {
                        menus[dragpIdx]['items'].splice(dragIdx, 1);
                    } else {
                        menus.splice(dragIdx, 1);
                    }
        } else {
            let aIdx = 0;
            if(dragId > dropIdx) {
                aIdx = (dropIdx===0)?0:(dropIdx - 1);
            } else {
                aIdx = dropIdx + 1;
            }
            // if(Number.isNaN(Number(aIdx))) return;
            if(!Utils.isNumber(dragpIdx) && !Utils.isNumber(droppIdx)) {
                const dragMenu = menus[dragIdx];
                const dropMenu = menus[dropIdx];
                if(Utils.isEmpty(dropMenu)) return;
                menus[dragIdx] = dropMenu;
                menus[dropIdx] = dragMenu;
            } else if(!Utils.isNumber(dragpIdx)) {
                const menu = menus[dragIdx];
                if(!menus[droppIdx]['items'].includes(menu))
                    menu['page_level'] = 1;
                    menu['page_group_id'] = menus[droppIdx]['items'][0]['page_group_id'];
                    if(Utils.inJson(menu, 'items')) delete menu['items']
                    menus[droppIdx]['items'].splice(aIdx, 0, menu);
                    menus.splice(dragIdx, 1);
            } else if(!Utils.isNumber(droppIdx)) {
                const menu = menus[dragpIdx]['items'][dragIdx];
                if(!menus.includes(menu))
                    menu['page_level'] = 0;
                    menu['page_group_id'] = 0;
                    if(Utils.inJson(menu, 'items')) delete menu['items']
                    if(!Utils.isEmpty(obj.className) && obj.className === 'div-list-box') {
                        menus.push(menu);
                    } else {
                        menus.splice(aIdx, 0, menu);
                    }
                    menus[dragpIdx]['items'].splice(dragIdx, 1);
            } else if(dragpIdx === droppIdx) {
                const dragmenu = menus[dragpIdx]['items'][dragIdx];
                const dropmenu = menus[droppIdx]['items'][dropIdx];
                menus[droppIdx]['items'][dragIdx] = dropmenu;
                menus[dragpIdx]['items'][dropIdx] = dragmenu;
            } else if(dragpIdx !== droppIdx) {
                const menu = menus[dragpIdx]['items'][dragIdx];
                if(!menus[droppIdx]['items'].includes(menu))
                    menu['page_level'] = 1;
                    menu['page_group_id'] = menus[droppIdx]['items'][0]['page_group_id'];
                    if(Utils.inJson(menu, 'items')) delete menu['items']
                    menus[droppIdx]['items'].splice(aIdx, 0, menu);
                    menus[dragpIdx]['items'].splice(dragIdx, 1);
            }
        }

        // this._onWindownReload();
        // window.location.reload(false);
        console.log(menus);
        menus.map((o, idx) => {
            o['page_order'] = idx;
            if(Utils.inJson(o, 'items') && Array.isArray(o['items']) && !Utils.isEmpty(o['items'][0])) {
                o['items'].map((i, cIdx) => {
                    i['page_order'] = cIdx;
                });
            }
        });

        const options = { pages: menus, cId: this.state.isUser.cId, uId: this.state.isUser.uId };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'updatePages', options);
        f.then(data => {
            if(!Utils.isEmpty(data)) {
                // console.log(data)
                // this.setState({ menus: data });
                // this.forceUpdate();
                this.props.onUpdateMenus(data);
            }
        }).catch(err => {
            console.log(err);
        });
        // console.log(menus);
        // this.forceUpdate();
    }

    _onUpdateAuthParents() {
        const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
        if(Utils.isEmpty(div)) return;
        this.state.auths.map((o, index) => {
            const objs = this.state.menus[index]['items'];
            console.log(objs);
            let obj = null;
            if(Array.isArray(objs) && !Utils.isEmpty(objs) && !Utils.isEmpty(objs[0])) {
                const divOld = document.getElementById('div_btn_' + index);
                if(!Utils.isEmpty(divOld)) divOld.remove();
                obj = document.createElement(HTML_TAG.DIV);
                obj.id = 'div_btn_' + index;
                obj.className = 'div-btn-group btn-group';
                o.map((auth, idx) => {
                    const selected = this._onVerticalChecked(index, auth);
                    const bt = document.createElement(HTML_TAG.BUTTON);
                    bt.setAttribute(ATTR.CODE, auth);
                    bt.title = Msg.getMsg(null, this.state.isUser.language, 'bt_' + auth.substr(3));
                    bt.innerHTML = Msg.getMsg(null, this.state.isUser.language, 'bt_' + auth.substr(3));
                    if(selected) {
                        bt.className = 'selected btn btn-' + VARIANT_TYPES.DARK;
                    } else {
                        bt.className = 'btn btn-outline-' + VARIANT_TYPES.DARK;
                    }
                    bt.onclick = this._onButtonClick.bind(this);
                    obj.appendChild(bt);
    
                    if(idx === 0) {
                        const checked = this._onAllChecked(objs);    
                        const input = document.createElement(HTML_TAG.INPUT);
                        input.type = TYPE.CHECKBOX;
                        input.onclick = this._onCheckBoxClick.bind(this);
                        if(Array.isArray(checked) && checked.length > 0) {
                            input.checked = checked[0].checked;
                        } else {
                            input.checked = true;
                        }
                        obj.prepend(input);
                    }
                });
            }
            // console.log(div.childNodes[0]);
            if(!Utils.isEmpty(obj) && !Utils.isEmpty(div.childNodes[0]))
                div.childNodes[0].childNodes[index].childNodes[0].after(obj);
        });
    }

    _onAllChecked(objs) {
        // console.log(objs);
        if(!Array.isArray(objs) || Utils.isEmpty(objs[0])) return;
        let obj = [];
        objs.map((o, idx) => {
            if(!Utils.isEmpty(o['page_auth'])) {
                Object.keys(o['page_auth']).map((a) => {
                    if(o['page_auth'][a] === false)
                        obj.push({ checked: false, auth: a, idx: idx })
                });
            }
        });
        return obj;
    }

    _onVerticalChecked(idx, code) {
        if(!Utils.isNumber(idx) || Utils.isEmpty(code) || Utils.isEmpty(this.state.menus[idx])) return;
        const objs = this.state.menus[idx]['items'];
        if(!Array.isArray(objs) || Utils.isEmpty(objs[0])) return;
        let length = 0;
        let count = 0;
        objs.map((o) => {
            if(!Utils.isEmpty(o['page_auth'])) {
                Object.keys(o['page_auth']).map((a) => {
                    if(a === code) length += 1;
                    if(o['page_auth'][a] && a === code)
                        count += 1;
                });
            }
        });
        return (length === count);
    }

    _onGetAllAuths() {
        if(!Array.isArray(this.state.menus)) return;
        const auths = [this.state.menus.length];
        this.state.menus.map((o, idx) => {
            const items = o['items'];
            auths[idx] = [];
            if(Array.isArray(items) && !Utils.isEmpty(items[0])) {
                items.map((i) => {
                    if(!Utils.isEmpty(i['page_auth'])) {
                        Object.keys(i['page_auth']).map((a) => {
                            if(!auths[idx].includes(a)) auths[idx].push(a);
                        });
                    }    
                });
                auths[idx].sort();
            } else {
                if(!Utils.isEmpty(o['page_auth'])) {
                    Object.keys(o['page_auth']).map((a) => {
                        if(!auths[idx].includes(a)) auths[idx].push(a);
                    });
                }
                auths[idx].sort();
            }
        });
        this.state.auths = auths;
    }

    _onChange(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj)) return;
        this.state.settingbox.page.page_name = obj.value;
    }

    _onGroupSettingMenuCreate() {
        this.state.settingbox.setting = true;
        this.state.msg = Msg.getMsg(null, this.props.isUser.language, 'bt_create')
        this.forceUpdate();
    }

    _onClickSaveGroupSettingMenu() {
        const max = 30;
        const value = this.state.settingbox.page.page_name;
        this.state.msg = null;
        if(Utils.isEmpty(value)) {
            this.state.msg = Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'required');
        } else if(!Utils.isEmpty(value)
                    && value.length > max) {
            let msg = Msg.getMsg(null, this.props.isUser.language, 'title_page');
            msg = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'max_length'), msg, max, value.length - max);
            this.state.msg = msg;
        } else if(!Array.isArray(this.state.settingbox.pages) || this.state.settingbox.pages.length <= 0) {
            this.state.msg = Msg.getMsg(null, this.props.isUser.language, 'page_list') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'selected');
        }

        if(!Utils.isEmpty(this.state.msg)) {
            this.forceUpdate();
        } else {
            const items = this.state.settingbox.pages.map((pId, idx) => {
                const o = this.state.menus.filter(function(x){ return x.page_id === pId })[0];
                if(!Utils.isEmpty(o)) {
                    o.page_level = 1;
                    o.page_order = idx;
                    return o;    
                }
            });

            // const page = this.state.settingbox.page;
            // page['page_key'] = 'group_' + Utils.getUUID()
            // page['page_order'] = this.state.menus.length;
            // page['items'] = items;

            // this.state.menus.push(page);
            // this.forceUpdate();

            // this._onWindownReload();
            const page = this.state.settingbox.page;
            page['page_key'] = 'group_' + Utils.getUUID()
            page['page_order'] = this.state.menus.length;
            page['items'] = items;
            const options = { page: page, cId: this.state.isUser.cId, uId: this.state.isUser.uId };
            const host = Msg.getSystemMsg('sys', 'app_api_host');
            const f = Fetch.postLogin(host + 'setGroupPage', options);
            f.then(data => {
                if(!Utils.isEmpty(data)) {
                    this.state.settingbox.setting = false;
                    this.state.settingbox.page = { page_name: '', page_flag: 1, page_order: 0 };
                    this.state.settingbox.pages = [];

                    // console.log(data)
                    this.props.onUpdateMenus(data);
                    // this.setState({ menus: data });
                    // this.forceUpdate();
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    _onCheckBoxClickGroupSettingMenu(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj)) return;
        const value = (Utils.isNumber(obj.value))?parseInt(obj.value):obj.value;
        const arr = this.state.settingbox.pages;
        if(obj.checked) {
            if(!arr.includes(value))
                arr.push(value);
        } else {
            if(arr.includes(value))
                arr.splice(arr.indexOf(value), 1);
        }
    }

    _onClickClose() {
        this.state.settingbox.page.page_name = '';
        this.state.settingbox.pages = [];
        this.state.settingbox.setting = false;
        this.forceUpdate();
    }

    _onGetGroupSettingMenu() {
        if(!this.state.settingbox.setting) return '';
        return(
            <Alert
                show={ this.state.settingbox.setting }
                variant={ VARIANT_TYPES.LIGHT }
                className={ 'div-overlay-box' }>
                    <div className='alert-light'>
                        <div>
                            <Button
                                type={ HTML_TAG.BUTTON }
                                onClick={ this._onClickSaveGroupSettingMenu.bind(this) }
                                variant={ VARIANT_TYPES.WARNING }>
                                {/* <FaCheck /> */}
                                { Msg.getMsg(null, this.props.isUser.language, 'bt_insert') }
                            </Button>
                            <Button
                                type={ HTML_TAG.BUTTON }
                                onClick={ this._onClickClose.bind(this) }
                                variant={ VARIANT_TYPES.PRIMARY }>
                                {/* <FaReply /> */}
                                { Msg.getMsg(null, this.props.isUser.language, 'bt_return') }
                            </Button>
                        </div>

                        <table className='table-overlay-box'>
                            <tbody>
                                <tr>
                                    <td colSpan='2'><h4>{ this.state.msg }</h4></td>
                                </tr>
                                <tr>
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.props.isUser.language, 'title_page') }</td>
                                    <td>
                                        <FormControl
                                            type={ HTML_TAG.TEXT }
                                            defaultValue={ this.state.settingbox.page.page_name }
                                            onChange={ this._onChange.bind(this) }
                                            placeholder={ Msg.getMsg(null, this.props.isUser.language, 'title_page') + Msg.getMsg(MSG_TYPE.ERROR, this.props.isUser.language, 'required') }
                                            className="mr-sm-2" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.props.isUser.language, 'page_list') }</td>
                                    <td>
                                        {(() => {
                                            if(Array.isArray(this.state.menus)) {
                                                return this.state.menus.map((o, idx) => {
                                                    if(Utils.isEmpty(o['items'])
                                                        || (!Utils.isEmpty(o['items']) && Utils.isEmpty(o['items'][0]))) {
                                                        const checked = this.state.settingbox.pages.includes(o.page_id);
                                                        return(
                                                            <div key={ idx } className={ 'form-check' } style={ { marginTop: '.3em', marginBottom: '.2em' } }>
                                                                <input
                                                                    key={ idx }
                                                                    id={ 'page_id_' + o.page_id }
                                                                    type={ TYPE.CHECKBOX }
                                                                    defaultChecked={ checked }
                                                                    value={ o.page_id }
                                                                    className={ 'form-check-input' }
                                                                    onClick={ this._onCheckBoxClickGroupSettingMenu.bind(this) } />
                                                                <label className="form-check-label" htmlFor={ 'page_id_' + o.page_id }>{ o.page_name }</label>
                                                            </div>
                                                        );    
                                                    }
                                                });
                                            }
                                        })()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

            {/* <Button
              type={ HTML_TAG.BUTTON }
              onMouseOver={ this._onMouseOut.bind(this) }
              onClick={ this._onAddTabSchema.bind(this) }
              variant={ VARIANT_TYPES.SECONDARY }>
              <FaPlus />
            </Button> */}
          </Alert>
        );
    }

    _onMouseOver(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.DIV) return;
        const idx = obj.parentElement.getAttribute(ATTR.IDX);
        const pIdx = obj.parentElement.parentElement.parentElement.getAttribute(ATTR.IDX);
        if(!Utils.isNumber(pIdx) || pIdx < 0) {
            this.state.pagedelete = this.state.menus[idx];
        } else {
            this.state.pagedelete = this.state.menus[pIdx]['items'][idx];
        }
    }

    _onClickViewDelete() {
        if(Utils.isEmpty(this.state.pagedelete)) return;
        const obj = {
            id: 'page_delete_' + this.state.pagedelete['page_id']
            ,show: true
            ,msg: StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'delete'), this.state.pagedelete['page_name'])
            ,style: { textAlign: 'center' }
        }
        const div = document.createElement(HTML_TAG.DIV);
        div.id = obj.id;
        document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX).appendChild(div);
        ReactDOM.render(<AlertDelete
            obj={ obj }
            language={ this.state.isUser.language }
            onClickDelete={ this._onClickPageDelete.bind(this) }
            onClickBack={ this._onClickReturnDelete.bind(this) }/>
            , document.getElementById(obj.id));
    }

    _onClickReturnDelete() {
        if(Utils.isEmpty(this.state.pagedelete)) return;
        const div = document.getElementById('page_delete_' + this.state.pagedelete['page_id']);
        if(Utils.isEmpty(div)) return;
        div.remove();
    }

    _onClickPageDelete() {
        if(Utils.isEmpty(this.state.pagedelete)) return;
        // this._onWindownReload();
        this._onClickReturnDelete();
        // const menus = this.state.menus;
        // const pd = this.state.pagedelete;
        // const items = pd['items'];
        // const idx = menus.findIndex(function(x){ return x.page_id === pd.page_id });
        // if(Utils.inJson(pd, 'items') && Array.isArray(pd['items']) && !Utils.isEmpty(pd['items'][0])) {
        //     // const idx = menus.findIndex(function(x){ return x.page_id === pd.page_id });
        //     menus.splice(idx, 1);
        //     items.map((o, index) => {
        //         o['page_order'] = (menus.length + index);
        //         menus.push(o);
        //     });
        // } else {
        //     if(Utils.isNumber(idx)) {
        //         menus.splice(idx, 1);
        //     } else {
        //         menus.map((o) => {
        //             if(Utils.inJson(o, 'items') && Array.isArray(o['items']) && !Utils.isEmpty(o['items'][0])) {
        //                 const idx = o['items'].findIndex(function(x){ return x.page_id === pd.page_id });
        //                 if(Utils.isNumber(idx)) o['items'].splice(idx, 1);
        //             }
        //         });    
        //     }
        // }
        // console.log(menus);
        // console.log(items);
        // this.forceUpdate();
        const options = { page: this.state.pagedelete, cId: this.state.isUser.cId, uId: this.state.isUser.uId };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'deletePage', options);
        f.then(data => {
            if(!Utils.isEmpty(data) && !Utils.inJson(data, 'error')) {
                this.props.onUpdateMenus(data);
                // this.setState({ menus: data });
                // this.forceUpdate();
            } else if(Utils.inJson(data, 'error')) {
                console.log(data['error']);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    _onWindownReload() {
        window.location.reload(false);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.state.isUser = nextProps.isUser;
        this.state.options = nextProps.options;
        // this.state.menus = nextProps.menus;
        const menus = this.state.menus;
        if(menus !== nextProps.menus) {
            this.setState({ menus: nextProps.menus });
        }
    }

    componentDidMount() {
        const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
        if(Utils.isEmpty(div)) return;
        div.addEventListener(DRAG.OVER, this._onDragOver.bind(this), false);
        div.addEventListener(DRAG.DROP, this._onDragDrop.bind(this), false);
    }

    componentDidUpdate() {
        this._onUpdateAuthParents();
    }

    UNSAFE_componentWillUnmount() {
        this.props.cancel();
    }

    render() {
        this.state.isUser.actions = PAGE_ACTION.SYSTEM;
        const btDisable = this.state.menus.filter(function(x){
            return (!Utils.inJson(x, 'items') || Utils.isEmpty(x['items']) || Utils.isEmpty(x['items'][0]))
        });
        // console.log(btDisable)
        return (
            <div className={ 'div-list-box' }>
                {/* { this._onOverlayPageDeleteBox() } */}
                { this._onGetGroupSettingMenu() }
                <div className={ 'div-actions-box' }>
                    <Button disabled={ (btDisable.length <= 0) } onClick={ this._onGroupSettingMenuCreate.bind(this) } variant={ VARIANT_TYPES.SECONDARY }>
                        { Msg.getMsg(null, this.state.isUser.language, 'bt_group_menu') }
                        { Msg.getMsg(null, this.state.isUser.language, 'bt_create') }
                    </Button>
                    <Button onClick={ this._onClickAdd.bind(this) } variant={ VARIANT_TYPES.PRIMARY }>
                        { Msg.getMsg(null, this.state.isUser.language, 'bt_create') }
                    </Button>
                    {/* <Button type="submit" onClick={ this._onClickSubmit.bind(this) } variant={ VARIANT_TYPES.WARNING }>
                        { Msg.getMsg(null, this.state.isUser.language, 'bt_insert') }
                    </Button> */}
                </div>
                {/* <Actions
                    isUser={ this.state.isUser }
                    onClickAdd={ this._onClickAdd.bind(this) }
                    onClickSubmit={ this._onClickSubmit.bind(this) } /> */}

                <div className="div-title-box">
                    <h5>{ this.state.isUser.path + '/' + this.state.isUser.action }</h5>
                </div>

                <div id={ SYSTEM.IS_DIV_CUSTOMIZE_BOX } className='div-tree-view-box'>
                    { this._getAllList() }
                </div>
            </div>
        )
    };
};

export default connect()(withRouter(System));
// export default System;