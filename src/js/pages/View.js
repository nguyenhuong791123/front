
import React, { Component as C } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Alert, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import Fetch from '../utils/Fetch';
import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';
import StringUtil from 'util';
import Msg from '../../msg/Msg';
import { THEME } from '../utils/Theme';
import { HTML_TAG, CUSTOMIZE, TYPE, MOUSE, OPTIONS_KEY } from '../utils/HtmlTypes';
import { PAGE_ACTION, ACTION, SYSTEM, VARIANT_TYPES, MSG_TYPE } from '../utils/Types';

class View extends C {
    constructor(props) {
        super(props);

        this.state = {
            isUser: props.isUser
            ,options: props.options
            ,loading: true
        }
    };

    _onClickBack() {
        this.state.isUser.path = ACTION.SLASH + ACTION.LIST;
        this.state.isUser.page.form = [];
        this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    }    

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
                    // this._formatUiWidget(obj.ui);  
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
                // this._formatUiWidget(objs.ui);
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
        this._onLoadDatas();
        this.state.loading = false;
        this.forceUpdate();
    }

    _onUpdateStateIsUser(isUser) {
        this.state.isUser = isUser['info'];
        this.state.options = isUser['options'];
        this.state.isUser.path = ACTION.SLASH + ACTION.EDIT;
        this.state.loading = false;
        console.log(this.state.isUser);
        this._onGetPageInfo(this.state.isUser['action']);
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
                                this._onSortForms();
                                // this.forceUpdate()
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            this.state.isUser['page'] = data;
                            this._onSetPageColums();
                            this._onSortForms();
                            // this.forceUpdate()
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.state.isUser['page'] = data;
                    this._onSetPageColums();
                    this._onSortForms();
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
            if(!Utils.isNumber(rId)) return;
            const where = this.state.isUser['page']['page_id_seq'] + '=' + rId;
            console.log(where);
            const columns = [];
            this.state.isUser['page']['form'].map((f) => {
                const objs = f['object'];
                if(Array.isArray(objs)) {
                    objs.map((o) => {
                        const ps = o['schema']['properties'];
                        Object.keys(ps).map((key) => {
                            columns.push(key);
                        });        
                    })
                } else {
                    const ps = objs['schema']['properties'];
                    Object.keys(ps).map((key) => {
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
                        const k1 = Object.keys(k)[0];
                        d[k1] = k[k1];
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
                this.forceUpdate();
                } else {
                console.log(data);
                }
            }).catch(err => {
                console.log(err);
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

    _onLoadBody() {
        if(!Utils.inJson(this.props.isUser, 'page')
            || !Utils.inJson(this.props.isUser['page'], 'form')) return;
        const form = this.state.isUser.page.form;
        if(!Array.isArray(form)) return;
        return this.state.isUser.page.form.map((f) => {
            let objs = f.object;
            if(Array.isArray(objs) && objs.length > 0) {
                return this._onBuildTabs(objs, f.object_key);
            } else {
                return this._onBuildDiv(objs, f.object_key);
            }
        });
    }

    _onBuildTabs(objs, key) {
        return(
            <div id="div_customize_0" fromid="form_1746dd85b6c" idx="0" class="div-box-100" draggable="true">
                <nav class="nav nav-tabs" role="tablist">
                    <a href="#" role="tab" data-rb-event-key="0" aria-selected="true" class="nav-item nav-link active" draggable="true">TAB_00</a>
                </nav>
                <div class="tab-content">
                    <div role="tabpanel" aria-hidden="false" class="fade tab-pane active show">
                        <form class="rjsf">
                            <div class="form-group field field-object">
                                <fieldset id="form_1746dd85b6c_0">
                                    <div class="form-group field field-string  div-box div-box-25 div-box-height-80" draggable="true">
                                        <label for="form_1746dd85b6c_0_text_1746dd86ff7">AAA</label>
                                        <input class="form-control" id="form_1746dd85b6c_0_text_1746dd86ff7" label="AAA" placeholder="" type="text" value=""/>
                                    </div>
                                    <div class="hidden" draggable="true">
                                        <input type="hidden" id="form_1746dd85b6c_0_hidden_form_reload" value="true"/>
                                    </div>
                                </fieldset>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    _onBuildDiv(obj, key) {
        return(
            <div class="div-box-100">
                <form class="rjsf">
                    <div class="form-group field field-object">
                        <fieldset id="form_1746d4e1348">
                            <legend id="form_1746d4e1348__title">DIV_00</legend>
                            <div class="hidden">
                                <input type="hidden" id="form_1746d4e1348_number_seq_id_1746d4e2d98_0001944" value="" />
                            </div>
                            <div class="form-group field field-string  div-box div-box-25 div-box-height-80">
                                <label for="form_1746d4e1348_text_1746d4e27fa">ccc</label>
                                <input class="form-control" id="form_1746d4e1348_text_1746d4e27fa" label="ccc" placeholder="" type="text" value="" />
                            </div>
                        </fieldset>
                    </div>
                </form>
            </div>
        );
    }
    
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
    }
    
    UNSAFE_componentWillUnmount() {
        this.props.cancel();
    }

    render() {
        const rId = sessionStorage.getItem(SYSTEM.IS_ACTION_ROW_ID);
        return (
            <div>
                <LoadingOverlay active={ this.state.loading } spinner text={ Msg.getMsg(MSG_TYPE.INFO, this.state.isUser.language, 'loading') } />
        
                {(() => {
                    if(Utils.inJson(this.props.isUser, 'action')
                        && Utils.isNumber(this.state.isUser['action'])
                        && Utils.inJson(this.props.isUser, 'page')) {
                        return(
                            <div className={ 'div-list-box' }>
                                <div className={ 'div-actions-box' }>
                                    <Button onClick={ this._onClickBack.bind(this) } variant={ VARIANT_TYPES.PRIMARY }>
                                        { Msg.getMsg(null, this.state.isUser.language, 'bt_list') }
                                    </Button>
                                    <Button type="submit" variant={ VARIANT_TYPES.WARNING }>
                                        { Msg.getMsg(null, this.state.isUser.language, 'bt_edit') }
                                    </Button>
                                </div>
                                <div className="div-title-box">
                                    <h5>{ this.state.isUser.page.page_name + '/' + Msg.getMsg(null, this.state.isUser.language, 'bt_view')}</h5>
                                    <span>{ '[' + rId + ']' }</span>
                                </div>
                                { this._onLoadBody() }
                            </div>
                        );
                    }
                })()}
            </div>
        );
    };
};

export default connect()(withRouter(View));