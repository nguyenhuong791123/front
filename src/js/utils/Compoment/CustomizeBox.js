import React, { Component as C } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Button, Form, FormControl } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { VARIANT_TYPES, ACTION, MSG_TYPE, SYSTEM } from '../Types';
import { TYPE, ALIGN, HTML_TAG, CUSTOMIZE, BOX_WIDTH, BOX_HEIGHT, OPTIONS, OPTIONS_KEY, OPTION_AUTH, REGEXS, DOUBLES, FORMAT_TYPE } from '../HtmlTypes';
import Html from '../HtmlUtils'
import Utils from '../Utils';
import Fetch from '../Fetch';
import { fileToBase64 } from '../FileUtils';

import Msg from '../../../msg/Msg';

export default class CustomizeBox extends C {
    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this._onAddItem = this._onAddItem.bind(this);
        this._onRemoveItem = this._onRemoveItem.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,menus: this.props.menus
            ,mode: this.props.mode
            ,editBox: this.props.editBox
            ,dragobject: this.props.dragobject
            ,loading: false
            ,buttonDisabled: false
            ,items: []
            ,aligns: []
            ,widths: []
            ,heights: []
            ,languages: []
            ,options: []
            ,optionTargets: {}
            ,defaultType: TYPE.TEXT
            ,pageItems: []
            ,forms: []
        }
    }

    _onAddItem() {
        this.state.editBox.obj[OPTIONS_KEY.OPTIONS].push({'value': '', 'label': ''});
        this.props.updateEditBox(this.state.editBox);
      }

    _onRemoveItem(e) {
        let obj = Html.getButton(e);
        if(Utils.isEmpty(obj)) return;
        let idx = obj.id.split('_')[1];
        if(Number.isNaN(Number(idx))) return;
        this.state.editBox.obj[OPTIONS_KEY.OPTIONS].splice(idx, 1);
        this.props.updateEditBox(this.state.editBox);
    }

    _onloadOptions() {
        let objs = Object.keys(TYPE);
        for (let i=0; i<objs.length; i++) {
            this.state.items.push( <option key={ i } value={ TYPE[objs[i]] }>{ TYPE[objs[i]] }</option> );
        }
        // objs = Object.keys(ALIGN);
        // for (let i=0; i<objs.length; i++) {
        //     this.state.aligns.push( <option key={ i } value={ ALIGN[objs[i]] }>{ ALIGN[objs[i]] }</option> );
        // }
        objs = Object.keys(BOX_WIDTH);
        for (let i=0; i<objs.length; i++) {
            this.state.widths.push( <option key={ i } value={ objs[i] }>{ BOX_WIDTH[objs[i]] }</option> );
        }
        objs = Object.keys(BOX_HEIGHT);
        for (let i=0; i<objs.length; i++) {
            this.state.heights.push( <option key={ i } value={ objs[i] }>{ BOX_HEIGHT[objs[i]] }</option> );
        }
        objs = Html.getLanguages(); 
        for(let i=0; i<objs.length; i++) {
            this.state.languages.push( <option key={ i } value={ objs[i] }>{ Msg.getMsg(null, this.state.isUser.language, objs[i]) }</option> );
        }

        const options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId, language: this.state.isUser.language };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'patitions', options);
        f.then(data => {
            if(!Utils.isEmpty(data)) {
                console.log(data);
                this.state.options.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                for(let i=0; i<data.length; i++) {
                    this.state.options.push( <option key={ i } value={ data[i]['option_name'] }>{ data[i]['object_label'] }</option> );
                }
                const disabled = (Utils.inJson(this.state.editBox.obj, OPTIONS_KEY.OPTION_DISABLED))?this.state.editBox.obj[OPTIONS_KEY.OPTION_DISABLED]:false;
                if(disabled) {
                    this.state.options.push( <option
                        key={ 'last' }
                        value={ this.state.editBox.obj[OPTIONS_KEY.OPTION_TARGET] }>
                            { this.state.editBox.obj[CUSTOMIZE.LABEL][this.state.isUser.language] }
                        </option> );
                }
                this.forceUpdate();
            }
        }).catch(err => {
          console.log(err);
        });
    
        if(this.state.mode !== ACTION.EDIT) {
            this.state.dragobject = null;
        }
    }

    _onChange(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj)) return;
        const name = obj.name;
        const editBox = this.state.editBox;
        const type = editBox.obj[CUSTOMIZE.TYPE];

        if(name === CUSTOMIZE.DEFAULT && (type === TYPE.FILE || type === TYPE.IMAGE)) {
            let files = obj.files;
            console.log(files);
            if(Utils.isEmpty(files) || files.length <= 0) {
                if(Utils.inJson(editBox.obj, OPTIONS_KEY.OPTIONS_FILE)) delete editBox.obj[OPTIONS_KEY.OPTIONS_FILE];
            } else {
                fileToBase64(files, editBox);
                console.log(editBox.obj[OPTIONS_KEY.OPTIONS_FILE]);
            }
            delete editBox.obj[OPTIONS_KEY.OPTION_CHECKED];
            delete editBox.obj[OPTIONS_KEY.OPTION_TARGET];
            delete editBox.obj[OPTIONS_KEY.OPTIONS];
        } else {
            let val = (!Utils.isEmpty(obj.value)
                        && !Number.isNaN(Number(obj.value))
                        && type !== TYPE.NUMBER)?parseInt(obj.value):obj.value;
            if(name === 'obj_lists'
                && (type === TYPE.CHECKBOX || type === TYPE.RADIO || type === TYPE.SELECT)
                && name !== CUSTOMIZE.LANGUAGE ) {
                let idx = obj.id.split('_')[1];
                if(Number.isNaN(Number(idx))) return;
                let lObj = editBox.obj[OPTIONS_KEY.OPTIONS][idx];
                if(obj.id.startsWith('values_')) {
                    lObj['value'] = val;
                    // lObj['value'] = (!Number.isNaN(Number(obj.value)))?parseInt(obj.value):obj.value;
                } 
                if(obj.id.startsWith('labels_')) {
                    lObj['label'] = obj.value;
                }
                editBox.obj[OPTIONS_KEY.OPTIONS][idx] = lObj;
            } else if([ OPTION_AUTH.SEARCH , OPTION_AUTH.VIEW, OPTION_AUTH.CREATE, OPTION_AUTH.EDIT ].includes(name)) {
                editBox.obj[OPTION_AUTH.AUTH][name] = obj.checked;
            } else if(name === OPTIONS_KEY.OPTION_TARGET && (type === TYPE.CHECKBOX || type === TYPE.RADIO || type === TYPE.SELECT)) {
                editBox.obj[OPTIONS_KEY.OPTION_TARGET] = val;
                editBox.obj[CUSTOMIZE.DEFAULT] = '';
                if(Utils.isEmpty(val)) {
                    editBox.obj[OPTIONS_KEY.OPTIONS] = [{ 'value': '', 'label': '' }];
                } else {
                    this.state.loading = true;
                    editBox.obj[OPTIONS_KEY.OPTIONS] = [];
                    const options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId, patition: val };
                    const host = Msg.getSystemMsg('sys', 'app_api_host');
                    const f = Fetch.postLogin(host + 'optionPatition', options);
                    f.then(data => {
                      if(!Utils.isEmpty(data)) {
                        console.log(data);
                        if(val === 'group_info' || val === 'users_info') {
                            editBox.obj[OPTIONS_KEY.OPTIONS] = data;
                        } else {
                            data.map((o) => {
                                editBox.obj[OPTIONS_KEY.OPTIONS].push({ 'value': o['option_id'], 'label': o['option_value'] });
                            });    
                        }
                        this.forceUpdate();
                    }
                    }).catch(err => {
                      console.log(err);
                    });
                }
            } else if(name.indexOf(OPTIONS_KEY.OPTIONS_ITEM) !== -1
                    && (type === TYPE.HIDDEN || type === TYPE.DISABLE || type === TYPE.CHILDENS || type === TYPE.QRCODE)) {
                const value = !Number.isNaN(Number(val))?parseInt(val):val;
                if(type === TYPE.QRCODE) {
                    if(!Array.isArray(editBox.obj[OPTIONS_KEY.OPTIONS_ITEM])) {
                        editBox.obj[OPTIONS_KEY.OPTIONS_ITEM] = [];
                    }
                    if(obj.checked) {
                        editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].push(value);
                    }
                    if(!obj.checked && editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].includes(value)) {
                        let idx = editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].indexOf(value);
                        editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].splice(idx, 1);
                    }
                } else {
                    editBox.obj[OPTIONS_KEY.OPTIONS_ITEM] = value;
                }
            } else if(type === TYPE.CHILDENS && name === TYPE.CHILDENS) {
                if(Utils.isNumber(val)) {
                    this.state.loading = true;
                    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_EDIT_BOX + '_button');
                    if(!Utils.isEmpty(div)) div.style.display = 'none';
                    editBox.obj[TYPE.CHILDENS] = val;
                    this._onGetPageInfo(editBox.obj, val);
                } else {
                    if(Utils.inJson(editBox.obj, 'page')) delete editBox.obj['page'];
                }
            } else {
                if(obj.type === TYPE.CHECKBOX) {
                    val = obj.checked;
                }
                if (name === CUSTOMIZE.LABEL || name === CUSTOMIZE.PLACEHOLDER) {
                    editBox.obj[name][editBox.obj[CUSTOMIZE.LANGUAGE]] = val;
                } else if(name.startsWith(CUSTOMIZE.LABEL_CSS) || name.startsWith(CUSTOMIZE.TEXT_CSS)) {
                    const names = name.split('.');
                    if(!Array.isArray(names) || names.length !== 2 || Utils.isEmpty(editBox.obj[names[0]])) return;
                    editBox.obj[names[0]][names[1]] = val;
                } else {
                    editBox.obj[name] = val;
                    const options = [ TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT ];
                    if(!options.includes(type) && !options.includes(name) && name !== CUSTOMIZE.LANGUAGE) {
                        delete editBox.obj[OPTIONS_KEY.OPTION_CHECKED];
                        delete editBox.obj[OPTIONS_KEY.OPTION_TARGET];
                        delete editBox.obj[OPTIONS_KEY.OPTIONS];
                        if (name === TYPE.CHILDENS && !Utils.isEmpty(editBox.obj[OPTIONS_KEY.OPTIONS_ITEM]))
                            delete editBox.obj[OPTIONS_KEY.OPTIONS_ITEM];
                    }                        
                }

                if(Utils.isNumber(val) && (type === TYPE.HIDDEN || type === TYPE.DISABLE || type === TYPE.QRCODE)) {
                    const options = { cId: this.state.isUser.cId, pId: parseInt(val), language: this.state.isUser.language };
                    const host = Msg.getSystemMsg('sys', 'app_api_host');
                    const f = Fetch.postLogin(host + 'getPage', options);
                    f.then(data => {
                        if(!Utils.isEmpty(data)) {
                            this.state.forms = data['form'];
                            this.forceUpdate();
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
    
            if(Utils.inJson(editBox, OPTIONS_KEY.OPTIONS_FILE)) delete editBox[OPTIONS_KEY.OPTIONS_FILE];
        }

        if(Utils.isEmpty(editBox.obj[CUSTOMIZE.BOX_WIDTH])) {
          if(editBox.obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS) {
            editBox.obj[CUSTOMIZE.BOX_WIDTH] = 100;
            editBox.obj[CUSTOMIZE.BOX_HEIGHT] = 160;
          } else {
            editBox.obj[CUSTOMIZE.BOX_WIDTH] = 25;
          }
        }
        if(Utils.isEmpty(editBox.obj[CUSTOMIZE.BOX_HEIGHT])) {
          editBox.obj[CUSTOMIZE.BOX_HEIGHT] = 80;
        }
        console.log(editBox);
        this.props.updateEditBox(editBox);
    }

    _onDivAuthClick(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj) || (obj.tagName !== HTML_TAG.DIV && obj.tagName !== HTML_TAG.SPAN)) return;
        e.preventDefault();
        let div = obj;
        if(div.tagName === HTML_TAG.SPAN) div = obj.parentElement;
        const input = div.getElementsByTagName(HTML_TAG.INPUT)[0];
        if(!Utils.isEmpty(input)) input.click();
    }

    _onGetPageInfo(properties, action) {
        if(!Utils.isNumber(action)) return;
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
                        patitions.filter(function (x, i, self) { return self.indexOf(x) === i; });
            
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
                                if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
                                    pdata.map((d) => {
                                    if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
                                        ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
                                    }
                                    });
                                }
                                // if(key.endsWith('_theme') && ps[key]['option_target'] === 'themes') {
                                //   ps[key][OPTIONS_KEY.OPTIONS] = THEME.getOptionsThemes();
                                // } else if(ps[key]['option_target'] === 'pages') {
                                //   const menus = this.props.menus;
                                //   let listmenus = menus.map((m) => {
                                //     if(Utils.inJson(m, 'items') && Array.isArray(m['items']) && !Utils.isEmpty(m['items'][0])) {
                                //       const items = m['items'];
                                //       return items.map((i) => {
                                //         return { value: i['page_id'], label: i['page_name']}
                                //       });
                                //     } else {
                                //       return { value: m['page_id'], label: m['page_name']}
                                //     }
                                //   });
                                //   ps[key][OPTIONS_KEY.OPTIONS] = listmenus;
                                // } else if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
                                //   pdata.map((d) => {
                                //     if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
                                //       ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
                                //     }
                                //   });
                                // }
                                });
                            })
                            } else {
                            const ps = objs['schema']['properties'];
                            Object.keys(ps).map((key) => {
                                if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
                                pdata.map((d) => {
                                    if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
                                    ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
                                    }
                                });
                                }
                                // if(key.endsWith('_theme') && ps[key]['option_target'] === 'themes') {
                                //   ps[key][OPTIONS_KEY.OPTIONS] = THEME.getOptionsThemes();
                                // } else if(ps[key]['option_target'] === 'pages') {
                                //   const menus = this.props.menus;
                                //   let listmenus = menus.map((m) => {
                                //     if(Utils.inJson(m, 'items') && Array.isArray(m['items']) && !Utils.isEmpty(m['items'][0])) {
                                //       const items = m['items'];
                                //       return items.map((i) => {
                                //         return { value: i['page_id'], label: i['page_name']}
                                //       });
                                //     } else {
                                //       return { value: m['page_id'], label: m['page_name']}
                                //     }
                                //   });
                                //   ps[key][OPTIONS_KEY.OPTIONS] = listmenus;
                                // } else if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
                                //   pdata.map((d) => {
                                //     if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
                                //       ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
                                //     }
                                //   });
                                // }
                            });
                            }
                        });
                        }
                        delete data['patitions'];
                        properties['page'] = data;
                        properties['cId'] = this.state.isUser.cId;
                        properties['uId'] = this.state.isUser.uId;
                        this._onSetPageColums(properties);
                        // this.forceUpdate()
                        }).catch(err => {
                        console.log(err);
                        });
                    } else {
                        properties['page'] = data;
                        properties['cId'] = this.state.isUser.cId;
                        properties['uId'] = this.state.isUser.uId;
                        this._onSetPageColums(properties);
                        // this.forceUpdate()
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                properties['page'] = data;
                properties['cId'] = this.state.isUser.cId;
                properties['uId'] = this.state.isUser.uId;
                this._onSetPageColums(properties);
                // this.forceUpdate()
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }
    
    _onSetPageColums(properties) {
        if(!Utils.inJson(properties, 'page') || !Utils.inJson(properties['page'], 'form') || !Array.isArray(properties['page']['form'])) return;
        const fs = properties['page']['form'];
        properties['page']['columns'] = [];
        fs.map((f) => {
            const objs = f['object'];
            if(Array.isArray(objs)) {
                objs.map((o) => {
                const ps = o['schema']['properties'];
                    Object.keys(ps).map((key) => {
                        properties['page']['columns'].push(
                            { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), search: ps[key]['auth']['search'] }
                        );
                    });
                })
            } else {
                const ps = objs['schema']['properties'];
                Object.keys(ps).map((key) => {
                    properties['page']['columns'].push(
                        { field: key, label: ps[key]['title'], type: key.substring(0, key.indexOf('_')), search: ps[key]['auth']['search'] }
                    );
                });
            }
        });
        this.state.loading = false;
        const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_EDIT_BOX + '_button');
        if(!Utils.isEmpty(div)) div.style.display = 'grid';
        this.forceUpdate();
    }

    // _fileToBase64(files, editObj) {
    //     editObj.obj[OPTIONS_KEY.OPTIONS_FILE] = [];
    //     Object.keys(files).map(i => {
    //         let f = {};
    //         let reader = new FileReader();
    //         reader.onload = function () {
    //             f['name'] = files[i].name;
    //             f['data'] = reader.result;
    //             editObj.obj[OPTIONS_KEY.OPTIONS_FILE].push(f);
    //         };
    //         reader.readAsDataURL(files[i]);
    //     });
    // }    

    UNSAFE_componentWillMount() {
        this._onloadOptions();
    }

    render() {
        const obj = this.state.dragobject;
        const editBox = this.state.editBox.obj;
        const dateType = [ TYPE.DATE, TYPE.DATETIME, TYPE.MONTH, TYPE.TIME ];
        if(dateType.includes(editBox[CUSTOMIZE.TYPE])) {
            this.state.defaultType = (editBox[CUSTOMIZE.TYPE] === TYPE.DATETIME)?'datetime-local':editBox[CUSTOMIZE.TYPE];
        } else if(editBox[CUSTOMIZE.TYPE] === TYPE.INTERGER || editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER) {
            this.state.defaultType = TYPE.NUMBER;
        } else {
            this.state.defaultType = TYPE.TEXT;
        }

        let label = editBox[CUSTOMIZE.LABEL];
        if(Utils.isEmpty(label)) {
            label = {};
            let placeholder = {};
            const objs = Html.getLanguages();
            for(let i=0; i<objs.length; i++) {
                label[objs[i]] = '';
                placeholder[objs[i]] = '';
            }
            editBox[CUSTOMIZE.LABEL] = label;
            editBox[CUSTOMIZE.PLACEHOLDER] = placeholder;
        }
        let auth = editBox[OPTION_AUTH.AUTH];
        if(Utils.isEmpty(auth)) {
            auth = {};
            auth[OPTION_AUTH.SEARCH] = true;
            auth[OPTION_AUTH.VIEW] = true;
            auth[OPTION_AUTH.CREATE] = true;
            auth[OPTION_AUTH.EDIT] = true;
            editBox[OPTION_AUTH.AUTH] = auth;
        }

        if(Utils.isEmpty(editBox[CUSTOMIZE.DEFAULT]) && editBox[CUSTOMIZE.COLOR] === TYPE.COLOR) editBox[CUSTOMIZE.DEFAULT] = '#ffffff';
        if(Utils.isEmpty(editBox[CUSTOMIZE.LABEL_CSS])
            || !Utils.inJson(editBox[CUSTOMIZE.LABEL_CSS], CUSTOMIZE.COLOR)
            || !Utils.inJson(editBox[CUSTOMIZE.LABEL_CSS], CUSTOMIZE.LAYOUT_COLOR)) {
            editBox[CUSTOMIZE.LABEL_CSS] = {};
            if(!Utils.inJson(editBox[CUSTOMIZE.LABEL_CSS], CUSTOMIZE.COLOR))
                editBox[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.COLOR] = '#';
            if(!Utils.inJson(editBox[CUSTOMIZE.LABEL_CSS], CUSTOMIZE.LAYOUT_COLOR))
                editBox[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.LAYOUT_COLOR] = '#';
        }
        if(Utils.isEmpty(editBox[CUSTOMIZE.TEXT_CSS])
            || !Utils.inJson(editBox[CUSTOMIZE.TEXT_CSS], CUSTOMIZE.COLOR)
            || !Utils.inJson(editBox[CUSTOMIZE.TEXT_CSS], CUSTOMIZE.LAYOUT_COLOR)) {
            editBox[CUSTOMIZE.TEXT_CSS] = {};
            if(!Utils.inJson(editBox[CUSTOMIZE.TEXT_CSS], CUSTOMIZE.COLOR))
                editBox[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.COLOR] = '#';
            if(!Utils.inJson(editBox[CUSTOMIZE.TEXT_CSS], CUSTOMIZE.LAYOUT_COLOR))
                editBox[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.LAYOUT_COLOR] = '#';
        }
        console.log(editBox)

        return (
            <div>
                <LoadingOverlay active={ this.state.loading } spinner text={ Msg.getMsg(MSG_TYPE.INFO, this.state.isUser.language, 'loading') } />
                <table className='table-overlay-box'>
                    <tbody>
                        <tr>
                            <td colSpan='4'><h4>{ this.state.editBox.msg }</h4></td>
                        </tr>
                        {(() => {
                            if ((obj === null || obj !== null)
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB) {
                                return(
                                    <tr>
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'bt_auth') }</td>
                                    <td colSpan='3' className='td-auth-block'>
                                        <div className={ 'btn btn-outline-info' } onClick={ this._onDivAuthClick.bind(this) }>
                                            <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_search') }</span>
                                            <input
                                                type={ TYPE.CHECKBOX }
                                                checked={ auth[OPTION_AUTH.SEARCH] }
                                                name={ OPTION_AUTH.SEARCH }
                                                // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                                onChange={ this._onChange.bind(this) }></input>
                                        </div>
                                        <div className={ 'btn btn-outline-info' } onClick={ this._onDivAuthClick.bind(this) }>
                                            <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_view') }</span>
                                            <input
                                                type={ TYPE.CHECKBOX }
                                                checked={ auth[OPTION_AUTH.VIEW] }
                                                name={ OPTION_AUTH.VIEW }
                                                // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                                onChange={ this._onChange.bind(this) }></input>
                                        </div>
                                        <div className={ 'btn btn-outline-info' } onClick={ this._onDivAuthClick.bind(this) }>
                                            <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_create') }</span>
                                            <input
                                                type={ TYPE.CHECKBOX }
                                                checked={ auth[OPTION_AUTH.CREATE] }
                                                name={ OPTION_AUTH.CREATE }
                                                // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                                onChange={ this._onChange.bind(this) }></input>
                                        </div>
                                        <div className={ 'btn btn-outline-info' } onClick={ this._onDivAuthClick.bind(this) }>
                                            <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_edit') }</span>
                                            <input
                                                type={ TYPE.CHECKBOX }
                                                checked={ auth[OPTION_AUTH.EDIT] }
                                                name={ OPTION_AUTH.EDIT }
                                                // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                                onChange={ this._onChange.bind(this) }></input>
                                        </div>
                                    </td>
                                </tr>
                                );
                            }
                        })()}

                        <tr>
                            <td className='td-not-break'>
                                { Msg.getMsg(null, this.state.isUser.language, 'obj_item') }
                                { Msg.getMsg(null, this.state.isUser.language, 'obj_type') }
                            </td>
                            <td>
                            {(() => {
                                if (this.state.mode === ACTION.EDIT) {
                                    return(
                                        <FormControl
                                            disabled
                                            as={ HTML_TAG.SELECT }
                                            name={ CUSTOMIZE.TYPE }
                                            value={ editBox[CUSTOMIZE.TYPE] }
                                            onChange={ this._onChange.bind(this) }> { this.state.items }</FormControl>
                                );
                                } else {
                                    return(
                                        <FormControl
                                            as={ HTML_TAG.SELECT }
                                            name={ CUSTOMIZE.TYPE }
                                            value={ editBox[CUSTOMIZE.TYPE] }
                                            onChange={ this._onChange.bind(this) }> { this.state.items }</FormControl>
                                    );
                                }
                            })()}
                            </td>
                            <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_language') }</td>
                            <td>
                                <FormControl
                                    as={ HTML_TAG.SELECT }
                                    name={ CUSTOMIZE.LANGUAGE }
                                    value={ editBox[CUSTOMIZE.LANGUAGE] }
                                    onChange={ this._onChange.bind(this) }>
                                    { this.state.languages }
                                </FormControl>
                            </td>
                        </tr>
            
                        <tr>
                            <td className='td-not-break'>
                                { Msg.getMsg(null, this.state.isUser.language, 'obj_label') }
                                <span className={ 'required' }>*</span>
                            </td>
                            <td>
                                <FormControl
                                    type={ TYPE.TEXT }
                                    name={ CUSTOMIZE.LABEL }
                                    // name={ CUSTOMIZE.LABEL + '_' + editBox[CUSTOMIZE.LANGUAGE]}
                                    // defaultValue={ editBox[CUSTOMIZE.LABEL + '_' + editBox[CUSTOMIZE.LANGUAGE]] }
                                    value={ editBox[CUSTOMIZE.LABEL][editBox[CUSTOMIZE.LANGUAGE]] }
                                    onChange={ this._onChange.bind(this) }/>
                            </td>
                            <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_width') }</td>
                            <td>
                            <table style={ { width: '100%' } }>
                                <tbody>
                                <tr>
                                    <td>
                                        <FormControl
                                            as={ HTML_TAG.SELECT }
                                            name={ CUSTOMIZE.BOX_WIDTH }
                                            value={ editBox[CUSTOMIZE.BOX_WIDTH] }
                                            onChange={ this._onChange.bind(this) }> { this.state.widths }</FormControl>
                                    </td>
                                    <td style={ { width: '50px', textAlign: 'right'} }>{ Msg.getMsg(null, this.state.isUser.language, 'obj_height') }</td>
                                    <td style={ { width: '40%' } }>
                                        <FormControl
                                            as={ HTML_TAG.SELECT }
                                            name={ CUSTOMIZE.BOX_HEIGHT }
                                            value={ editBox[CUSTOMIZE.BOX_HEIGHT] }
                                            onChange={ this._onChange.bind(this) }> { this.state.heights }</FormControl>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </td>
                        </tr>
        
                    {(() => {
                        if (obj === null 
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.BUTTON
                            || (obj !== null
                                && obj.tagName !== HTML_TAG.LEGEND
                                && obj.tagName !== HTML_TAG.NAV
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.BUTTON)) {
                            return(
                                <tr>
                                {(() => {
                                    if (editBox[CUSTOMIZE.TYPE] !== TYPE.PASSWORD) {
                                        return(
                                            <td className='td-not-break'>
                                                { Msg.getMsg(null, this.state.isUser.language, 'obj_default') }
                                                {(() => {
                                                    if (editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE
                                                        || (Utils.isEmpty(editBox[TYPE.CHILDENS]) 
                                                            && (editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE
                                                            || editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN
                                                            || editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE))) {
                                                        return(<span className={ 'required' }>*</span>);
                                                    }
                                                })()}
                                            </td>
                                        );
                                    } else {
                                        return(<td className='td-not-break'> </td>);
                                    }
                                })()}
                                {(() => {
                                    if (editBox[CUSTOMIZE.TYPE] !== TYPE.PASSWORD
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.FILE
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.COLOR) {
                                        if(editBox[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                                            || editBox[CUSTOMIZE.TYPE] === TYPE.RADIO
                                            || editBox[CUSTOMIZE.TYPE] === TYPE.SELECT) {
                                            let defaultOptions = [];
                                            defaultOptions.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                                            if(Utils.inJson(editBox, OPTIONS_KEY.OPTIONS)) {
                                                editBox[OPTIONS_KEY.OPTIONS].map((o, idx) => {
                                                if(!Utils.isEmpty(o['value']) && !Utils.isEmpty(o['label']))
                                                    defaultOptions.push( <option key={ idx } value={ o['value'] }>{ o['label'] }</option> );
                                                });
                                            }
                                            return(
                                                <td>
                                                    <FormControl
                                                        as={ HTML_TAG.SELECT }
                                                        name={ CUSTOMIZE.DEFAULT }
                                                        defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                        onChange={ this._onChange.bind(this) }> { defaultOptions }</FormControl>
                                                </td>
                                            );
                                        } else {
                                            if(editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER) {
                                                const step = (Utils.inJson(editBox, OPTIONS_KEY.OPTIONS_NUMBER)
                                                                && !Utils.isEmpty(editBox[OPTIONS_KEY.OPTIONS_NUMBER]))
                                                                ?editBox[OPTIONS_KEY.OPTIONS_NUMBER]:'0';
                                                return(
                                                    <td>
                                                        <FormControl
                                                            type={ this.state.defaultType }
                                                            name={ CUSTOMIZE.DEFAULT }
                                                            step={ step }
                                                            defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                            onChange={ this._onChange.bind(this) }/>
                                                    </td>
                                                );
                                            } else {
                                                return(
                                                    <td>
                                                        <FormControl
                                                            type={ this.state.defaultType }
                                                            name={ CUSTOMIZE.DEFAULT }
                                                            defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                            onChange={ this._onChange.bind(this) }/>
                                                    </td>
                                                );
                                            }
                                        }
                                    } else if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE || editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
                                        // let defaultValue = editBox[CUSTOMIZE.DEFAULT];
                                        // if(Utils.inJson(editBox, OPTIONS_KEY.OPTIONS_FILE)) {
                                        //     if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE && editBox[OPTIONS_KEY.OPTIONS_FILE].length > 0) {
                                        //         defaultValue = fileFormatBase64(editBox);
                                                // if(editBox[CUSTOMIZE.MULTIPLE_FILE]) {
                                                //     defaultValue = editBox[OPTIONS_KEY.OPTIONS_FILE].map((o) => {
                                                //         const data = o['data'].split(';base64');
                                                //         return (data[0] + ';name=' + o['name'] + ';base64' + data[1]);
                                                //     });
                                                // } else {
                                                //     const data = editBox[OPTIONS_KEY.OPTIONS_FILE][0]['data'].split(';base64');
                                                //     defaultValue = (data[0] + ';name=' + editBox[OPTIONS_KEY.OPTIONS_FILE][0]['name'] + ';base64' + data[1]);
                                                // }
                                            // }
                                        // }

                                        return(
                                            <td style={ { height: '40px' } }>
                                                {(() => {
                                                    if(editBox[CUSTOMIZE.MULTIPLE_FILE]) {
                                                        return(
                                                            <Form.File
                                                                multiple
                                                                type={ TYPE.FILE }
                                                                name={ CUSTOMIZE.DEFAULT }
                                                                defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                                onChange={ this._onChange.bind(this) }/>
                                                        );
                                                    } else {
                                                        return(
                                                            <Form.File
                                                                type={ TYPE.FILE }
                                                                name={ CUSTOMIZE.DEFAULT }
                                                                defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                                onChange={ this._onChange.bind(this) }/>
                                                        );
                                                    }
                                                })()}
                                            </td>
                                        );
                                    } else if(editBox[CUSTOMIZE.TYPE] === TYPE.COLOR) {
                                        return(
                                            <td>
                                                <input
                                                    type={ TYPE.COLOR }
                                                    name={ CUSTOMIZE.DEFAULT }
                                                    value={ editBox[CUSTOMIZE.DEFAULT] }
                                                    onChange={ this._onChange.bind(this) } />
                                            </td>
                                        );
                                    } else if(editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                                        return(<td> </td>);
                                    }
                                })()}
                                {(() => {
                                    if(editBox[CUSTOMIZE.TYPE] !== TYPE.DISABLE
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.HIDDEN
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.QRCODE
                                        // && editBox[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                                        ) {
                                            if(editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
                                                return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_change') }</td>);
                                            } else {
                                                return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_required') }</td>);
                                            }
                                    } else if(editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
                                        return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_qr_app_link') }</td>);
                                    }
                                })()}
                                {(() => {
                                    if(editBox[CUSTOMIZE.TYPE] !== TYPE.DISABLE
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.HIDDEN
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.QRCODE
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.NUMBER
                                        && editBox[CUSTOMIZE.TYPE] !== TYPE.TEXT) {
                                        return(
                                            <td style={ { height: '40px' } }>
                                                <input
                                                    type={ HTML_TAG.CHECKBOX }
                                                    name={ CUSTOMIZE.REQUIRED }
                                                    defaultChecked={ editBox[CUSTOMIZE.REQUIRED] }
                                                    onChange={ this._onChange.bind(this) }></input>
                                            </td>
                                        );
                                    } else if(editBox[CUSTOMIZE.TYPE] === TYPE.TEXT) {
                                        let formats = [];
                                        formats.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                                        FORMAT_TYPE.map((o, i) => {
                                            formats.push(< option key={ i } value={ o.value }>{ o.label }</option> );
                                        });
                                        return(
                                            <td style={ { height: '40px' } }>
                                                <table style={ { width: '100%' } }>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    type={ HTML_TAG.CHECKBOX }
                                                                    name={ CUSTOMIZE.REQUIRED }
                                                                    defaultChecked={ editBox[CUSTOMIZE.REQUIRED] }
                                                                    onChange={ this._onChange.bind(this) }></input>
                                                            </td>
                                                            <td style={ { width: '50px',textAlign: 'right' } }>{ Msg.getMsg(null, this.state.isUser.language, 'obj_type') }</td>
                                                            <td style={ { width: '40%' } }>
                                                                <FormControl
                                                                    as={ HTML_TAG.SELECT }
                                                                    name={ OPTIONS_KEY.OPTIONS_FORMAT_TYPE }
                                                                    defaultValue={ editBox[OPTIONS_KEY.OPTIONS_FORMAT_TYPE] }
                                                                    onChange={ this._onChange.bind(this) }>
                                                                    { formats }
                                                                </FormControl>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        );
                                    } else if(editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER) {
                                        let decimals = [];
                                        // decimals.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                                        DOUBLES.map((o, i) => {
                                            decimals.push(< option key={ i } value={ o.value }>{ o.label }</option> );
                                        });
                                        return(
                                            <td style={ { height: '40px' } }>
                                                <table style={ { width: '100%' } }>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    type={ HTML_TAG.CHECKBOX }
                                                                    name={ CUSTOMIZE.REQUIRED }
                                                                    defaultChecked={ editBox[CUSTOMIZE.REQUIRED] }
                                                                    onChange={ this._onChange.bind(this) }></input>
                                                                <input
                                                                    style={{ float: 'right', marginTop: '.2em' }}
                                                                    type={ HTML_TAG.CHECKBOX }
                                                                    name={ OPTIONS_KEY.OPTIONS_ROUND }
                                                                    defaultChecked={ editBox[OPTIONS_KEY.OPTIONS_ROUND] }
                                                                    // title={ Msg.getMsg(null, this.state.isUser.language, 'obj_round') }
                                                                    onChange={ this._onChange.bind(this) }></input>                                                                
                                                                <span style={{ fontSize: '40%', float: 'right', marginTop: '.5em', color: 'blue' }}>{ Msg.getMsg(null, this.state.isUser.language, 'obj_round') }</span>
                                                            </td>
                                                            <td style={ { width: '50px',textAlign: 'right' } }>{ Msg.getMsg(null, this.state.isUser.language, 'obj_number') }</td>
                                                            <td style={ { width: '40%' } }>
                                                                <FormControl
                                                                    as={ HTML_TAG.SELECT }
                                                                    name={ OPTIONS_KEY.OPTIONS_NUMBER }
                                                                    defaultValue={ editBox[OPTIONS_KEY.OPTIONS_NUMBER] }
                                                                    onChange={ this._onChange.bind(this) }>
                                                                    { decimals }
                                                                </FormControl>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        );
                                    } else if(editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
                                        let regexs = [];
                                        regexs.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                                        REGEXS.map((o, i) => {
                                            regexs.push(< option key={ i } value={ o }>{ o }</option> );
                                        });
                                        return(
                                            <td style={ { height: '40px' } }>
                                                <table style={ { width: '100%' } }>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    type={ HTML_TAG.CHECKBOX }
                                                                    name={ CUSTOMIZE.QRAPPLINK }
                                                                    defaultChecked={ editBox[CUSTOMIZE.QRAPPLINK] }
                                                                    onChange={ this._onChange.bind(this) }></input>
                                                            </td>
                                                            <td style={ { width: '50px',textAlign: 'right' } }>{ Msg.getMsg(null, this.state.isUser.language, 'obj_regex') }</td>
                                                            <td style={ { width: '40%' } }>
                                                                <FormControl
                                                                    as={ HTML_TAG.SELECT }
                                                                    name={ OPTIONS_KEY.OPTION_REGEX }
                                                                    defaultValue={ editBox[OPTIONS_KEY.OPTION_REGEX] }
                                                                    onChange={ this._onChange.bind(this) }>
                                                                    { regexs }
                                                                </FormControl>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        );
                                    }
                                })()}
                                </tr>
                            );
                        }
                    })()}
        
                    {(() => {
                        if ((obj === null
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB)
                            || (obj !== null
                                && obj.tagName !== HTML_TAG.LEGEND
                                && obj.tagName !== HTML_TAG.NAV
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                                && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB)) {
                        return(
                            <tr>
                            {(() => {
                                if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                                || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                                || editBox[CUSTOMIZE.TYPE] === TYPE.INTERGER
                                || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                                return(
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_placeholder') }</td>
                                );
                                } else if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE) {
                                return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_multiple') }</td>)
                                }
                            })()}
                            {(() => {
                                if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                                || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                                || editBox[CUSTOMIZE.TYPE] === TYPE.INTERGER
                                || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                                return(
                                    <td>
                                        <FormControl
                                            type={ TYPE.TEXT }
                                            name={ CUSTOMIZE.PLACEHOLDER }
                                            value={ editBox[CUSTOMIZE.PLACEHOLDER][editBox[CUSTOMIZE.LANGUAGE]] }
                                            onChange={ this._onChange.bind(this) }/>
                                    </td>
                                );
                                } else if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE) {
                                return(
                                    <td>
                                    <input
                                        type={ HTML_TAG.CHECKBOX }
                                        name={ CUSTOMIZE.MULTIPLE_FILE }
                                        defaultChecked={ editBox[CUSTOMIZE.MULTIPLE_FILE] }
                                        onChange={ this._onChange.bind(this) }></input>
                                    </td>
                                );
                                }
                            })()}
        
                            {(() => {
                                if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                                || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                                || editBox[CUSTOMIZE.TYPE] === TYPE.FILE
                                // || editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE
                                || editBox[CUSTOMIZE.TYPE] === TYPE.INTERGER
                                || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                                return(
                                    <td className='td-not-break'>
                                    {(() => {
                                        if (editBox[CUSTOMIZE.TYPE] === TYPE.FILE) {
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
                                if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                                || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                                || editBox[CUSTOMIZE.TYPE] === TYPE.FILE
                                // || editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE
                                || editBox[CUSTOMIZE.TYPE] === TYPE.INTERGER
                                || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                                return(
                                    <td>
                                        <FormControl
                                            type={ TYPE.INTERGER }
                                            name={ CUSTOMIZE.MAX_LENGTH }
                                            defaultValue={ editBox[CUSTOMIZE.MAX_LENGTH] }
                                            onChange={ this._onChange.bind(this) }/>
                                    </td>
                                );
                                }
                            })()}
                            </tr>
                        );
                        }
                    })()}
        
                    <tr>
                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_label') }</td>
                        <td>
                            <input
                                type={ TYPE.COLOR }
                                name={ CUSTOMIZE.LABEL_CSS + '.' + CUSTOMIZE.COLOR }
                                defaultValue={ editBox[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.COLOR] }
                                onChange={ this._onChange.bind(this) }></input>
                            <span style={{ marginLeft: '3em' }}>{ Msg.getMsg(null, this.state.isUser.language, 'obj_background') }</span>
                            <input
                                type={ TYPE.COLOR }
                                name={ CUSTOMIZE.LABEL_CSS + '.' + CUSTOMIZE.LAYOUT_COLOR }
                                defaultValue={ editBox[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.LAYOUT_COLOR] }
                                onChange={ this._onChange.bind(this) }></input>
                        </td>
                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_css_style') }</td>
                        <td>
                            <FormControl
                                type={ TYPE.TEXT }
                                name={ CUSTOMIZE.LABEL_CSS + '.' + CUSTOMIZE.STYLE }
                                defaultValue={ editBox[CUSTOMIZE.LABEL_CSS][CUSTOMIZE.STYLE] }
                                onChange={ this._onChange.bind(this) }/>
                        </td>
                    </tr>

                    {(() => {
                        if((obj === null || obj !== null)
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.EDITOR
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.QRCODE
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB) {
                            return(
                                <tr>
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_text') }</td>
                                    <td>
                                        <input
                                            type={ TYPE.COLOR }
                                            name={ CUSTOMIZE.TEXT_CSS + '.' + CUSTOMIZE.COLOR }
                                            defaultValue={ editBox[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.COLOR] }
                                            onChange={ this._onChange.bind(this) }></input>
                                        <span style={{ marginLeft: '3em' }}>{ Msg.getMsg(null, this.state.isUser.language, 'obj_background') }</span>
                                        <input
                                            type={ TYPE.COLOR }
                                            name={ CUSTOMIZE.TEXT_CSS + '.' + CUSTOMIZE.LAYOUT_COLOR }
                                            defaultValue={ editBox[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.LAYOUT_COLOR] }
                                            onChange={ this._onChange.bind(this) }></input>
                                    </td>
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_css_style') }</td>
                                    <td>
                                        <FormControl
                                            type={ TYPE.TEXT }
                                            name={ CUSTOMIZE.TEXT_CSS + '.' + CUSTOMIZE.STYLE }
                                            defaultValue={ editBox[CUSTOMIZE.TEXT_CSS][CUSTOMIZE.STYLE] }
                                            onChange={ this._onChange.bind(this) }/>
                                    </td>
                                </tr>
                            );
                        }
                    })()}

                    {(() => {
                        if(editBox[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                        || editBox[CUSTOMIZE.TYPE] === TYPE.RADIO
                        || editBox[CUSTOMIZE.TYPE] === TYPE.SELECT) {
                        const disabled = (Utils.inJson(editBox, OPTIONS_KEY.OPTION_DISABLED))?editBox[OPTIONS_KEY.OPTION_DISABLED]:false;
                        return(
                            <tr>
                                <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_list_type') }</td>
                                <td>
                                    <input
                                        type={ HTML_TAG.CHECKBOX }
                                        name={ OPTIONS_KEY.OPTION_CHECKED }
                                        checked={ editBox[OPTIONS_KEY.OPTION_CHECKED] }
                                        onChange={ this._onChange.bind(this) }></input>
                                </td>
                                <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_list_option') }</td>
                                <td>
                                    <FormControl
                                        as={ HTML_TAG.SELECT }
                                        disabled={ disabled }
                                        name={ OPTIONS_KEY.OPTION_TARGET }
                                        value={ editBox[OPTIONS_KEY.OPTION_TARGET] }
                                        onChange={ this._onChange.bind(this) }>
                                        { this.state.options }
                                    </FormControl>
                                </td>
                            </tr>
                        );
                        }
                    })()}
        
                    {(() => {
                        if (editBox[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB
                        && Utils.isEmpty(editBox[OPTIONS_KEY.OPTION_TARGET])) {
                        return(
                            <tr>
                                <td colSpan='4'>
                                    <div className={ 'div-overlay-box-add-items' }>
                                    <table className='table-overlay-box'>
                                        <tbody>
                                        {(() => {
                                            if (editBox[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                                            || editBox[CUSTOMIZE.TYPE] === TYPE.RADIO
                                            || editBox[CUSTOMIZE.TYPE] === TYPE.SELECT) {
                                            if(editBox[OPTIONS_KEY.OPTIONS] === undefined) {
                                                if(editBox[CUSTOMIZE.TYPE] === TYPE.RADIO) {
                                                    editBox[OPTIONS_KEY.OPTIONS] = [{ 'value': '', 'label': '' }, { 'value': '', 'label': '' }];
                                                } else {
                                                    editBox[OPTIONS_KEY.OPTIONS] = [{ 'value': '', 'label': '' }];
                                                }
                                            }
                                            const objs = Array.from(editBox[OPTIONS_KEY.OPTIONS]);
                                            return objs.map((o, idx) => {
                                                return(
                                                    <tr key={ idx }>
                                                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_id') }</td>
                                                        <td>
                                                        <FormControl
                                                            type={ TYPE.TEXT }
                                                            id={ 'values_' + idx }
                                                            name={ 'obj_lists' }
                                                            value={ o['value'] }
                                                            onChange={ this._onChange.bind(this) }/>
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
                                                                                value={ o['label'] }
                                                                                onChange={ this._onChange.bind(this) }/>
                                                                        </td>
                                                                        <td style={ {'width': 0} }>
                                                                        {(() => {
                                                                            if(idx === 0) {
                                                                            return (
                                                                                <Button
                                                                                    type={ TYPE.BUTTON }
                                                                                    id={ 'btnitems_' + idx }
                                                                                    className={ 'button-overlay-box-add-items' }
                                                                                    onClick={ this._onAddItem.bind(this) }
                                                                                    variant={ VARIANT_TYPES.PRIMARY }>
                                                                                    <FaPlus />
                                                                                </Button>
                                                                            );
                                                                            } else {
                                                                            if(editBox[CUSTOMIZE.TYPE] === TYPE.RADIO && idx === 1) {
                                                                                return('');
                                                                            } else {
                                                                                return (
                                                                                <Button
                                                                                    type={ TYPE.BUTTON }
                                                                                    id={ 'btnitems_' + idx }
                                                                                    className={ 'button-overlay-box-add-items' }
                                                                                    onClick={ this._onRemoveItem.bind(this) }
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

                    {(() => {
                        if (editBox[CUSTOMIZE.TYPE] === TYPE.CHILDENS
                            || editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE
                            || editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN
                            || editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
                            const menus = this.state.menus;
                            let listmenus = [];
                            listmenus.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                            if(Array.isArray(menus) && menus.length > 0) {
                                for (let i=0; i<menus.length; i++) {
                                    const items = menus[i]['items'];
                                    if(Array.isArray(items) && !Utils.isEmpty(items[0])) {
                                        const opts = items.map((o, idx) => {
                                            return ( <option key={ idx } value={ o['page_id'] }>{ o['page_name'] }</option> );
                                        });
                                        listmenus.push( <optgroup key={ i } label={ menus[i]['page_name'] }>{ opts }</optgroup> );                              
                                    } else {
                                        listmenus.push( <option key={ i } value={ menus[i]['page_id'] }>{ menus[i]['page_name'] }</option> );
                                    }
                                }
                            }
                            return(
                                <tr>
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'page_list') }</td>
                                    <td colSpan='3'>
                                        <FormControl
                                            as={ HTML_TAG.SELECT }
                                            name={ TYPE.CHILDENS }
                                            value={ editBox[TYPE.CHILDENS] }
                                            onChange={ this._onChange.bind(this) }> { listmenus }</FormControl>
                                    </td>
                                </tr>
                            );
                        }
                    })()}
                    {(() => {
                        if (editBox[TYPE.CHILDENS]
                            && (editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN
                                || editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE
                                || editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE)
                            && (Array.isArray(this.state.forms) && this.state.forms.length > 0)) {
                            const checkboxName = (editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE)?OPTIONS_KEY.OPTIONS_ITEM + '[]':OPTIONS_KEY.OPTIONS_ITEM;
                            const inputType = (editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE)?HTML_TAG.CHECKBOX:HTML_TAG.RADIO;
                            const values = editBox[OPTIONS_KEY.OPTIONS_ITEM];
                            const items = this.state.forms.map((f, fIdx) => {
                                const ps = f['object']['schema']['properties'];
                                const list = Object.keys(ps).map((key, idx) => {
                                    let checked = false;
                                    if(inputType === HTML_TAG.CHECKBOX) checked = (Array.isArray(values) && values.includes(key))?true:false;
                                    if(inputType === HTML_TAG.RADIO) checked = (!Utils.isEmpty(values) && (values === key))?true:false;
                                    return (
                                        <div key={ idx } className={ 'form-check' } style={{ width: '50%', float: 'left', padding: '.2em', paddingLeft: '1.5em' }}>
                                            <input
                                                type={ inputType }
                                                id={ HTML_TAG.CHECKBOX + '_' + idx }
                                                name={ checkboxName }
                                                checked={ checked }
                                                value={ key }
                                                onChange={ this._onChange.bind(this) }
                                                className={ 'form-check-input' } />
                                            <label className="form-check-label" htmlFor={ HTML_TAG.CHECKBOX + '_' + idx }>{ ps[key]['title'] }</label>
                                        </div>
                                    );
                                });
                                return (
                                    <div key={ fIdx }>
                                        <h5>{ f['object']['schema']['title'] }</h5>
                                        { list }
                                    </div>
                                );
                            });
                            console.log(items);
                            console.log(this.state.forms);
                            // const items = this.state.pageItems.map((obj, idx) => {
                            //     let checked = false;
                            //     if(inputType === HTML_TAG.CHECKBOX) checked = (Array.isArray(values) && values.includes(obj['value']))?true:false;
                            //     if(inputType === HTML_TAG.RADIO) checked = (!Utils.isEmpty(values) && (values === obj['value']))?true:false;
                            //     return (
                            //         <div key={ idx } className={ 'form-check' } style={{ width: '50%', float: 'left', padding: '.2em', paddingLeft: '1.5em' }}>
                            //             <input
                            //                 type={ inputType }
                            //                 id={ HTML_TAG.CHECKBOX + '_' + idx }
                            //                 name={ checkboxName }
                            //                 checked={ checked }
                            //                 value={ obj['value'] }
                            //                 onChange={ this._onChange.bind(this) }
                            //                 className={ 'form-check-input' } />
                            //             <label className="form-check-label" htmlFor={ HTML_TAG.CHECKBOX + '_' + idx }>{ obj['label'] }</label>
                            //         </div>
                            //     );
                            // });
                            return(
                                <tr>
                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'item_list') }</td>
                                    <td colSpan='3'>
                                        <div className={ 'div-overlay-box-add-items' }>
                                            { items }
                                        </div>
                                    </td>
                                </tr>
                            );
                        }
                    })()}
                    </tbody>
            </table>
            </div>
        );  
    }
}