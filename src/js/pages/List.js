import React, { Component as C } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
// import { FaPlus } from 'react-icons/fa';

import TableBox from '../utils/Compoment/TableBox';

import Fetch from '../utils/Fetch';
import { TYPE, OPTIONS_KEY } from '../utils/HtmlTypes';
import { ACTION, VARIANT_TYPES, SYSTEM, MSG_TYPE } from '../utils/Types';
import Utils from '../utils/Utils';
import { THEME } from '../utils/Theme';

import Msg from '../../msg/Msg';

class List extends C {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
            ,isUser: this.props.isUser
            ,options: this.props.options
        }
    };

    _onClickAction(action) {
        if(action === ACTION.VIEW || action === ACTION.EDIT) {
            this.state.isUser.path = ACTION.SLASH + action;
        } else {
            this.state.isUser.path = ACTION.SLASH + ACTION.CREATE;
            sessionStorage.removeItem(SYSTEM.IS_ACTION_ROW_ID);
        }
        const auth = { info: this.state.isUser, options: this.state.options };
        this.props.onUpdateIsUserCallBack(auth);
    }

    // _onClickEdit() {
    //     this.state.isUser.path = ACTION.SLASH + ACTION.EDIT;
    //     const auth = { info: this.state.isUser, options: this.state.options };
    //     this.props.onUpdateIsUserCallBack(auth);
    // }

    _onPageChange(e) {
        console.log(e);
    }

    _onPerChange(e) {
        console.log(e);
        this.state.per = e.target.value;
    }

    _onUpdateAtPage(page) {
        if(Utils.isEmpty(page)) return;
        this.state.atPage = page;
        this.forceUpdate();
    }

    _onUpdateListHeaders(columns) {
        this.props.onUpdateListHeaders(columns);
    }

    _onGetPageInfo(action) {
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
                                // this.forceUpdate()
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            this.state.isUser['page'] = data;
                            this._onSetPageColums();
                            // this.forceUpdate()
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.state.isUser['page'] = data;
                    this._onSetPageColums();
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
        this.state.loading = false;
        this.forceUpdate();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log('LIST componentWillReceiveProps');
        if(this.state.isUser != nextProps.isUser) {
            console.log(nextProps.isUser);
            this.state.loading = true;
            this.state.isUser = nextProps.isUser;
            this.state.options = nextProps.options;
            this._onGetPageInfo(this.state.isUser['action']);
        }
    }

    UNSAFE_componentWillMount() {
        console.log(this.state.isUser);
        if(Utils.inJson(this.state.isUser, 'action')
            && Utils.isNumber(this.state.isUser['action'])) {
            this._onGetPageInfo(this.state.isUser['action']);
        }
    }

    UNSAFE_componentWillUnmount() {
        this.props.cancel();
    }

    render() {
        return(
            <div>
                <LoadingOverlay active={ this.state.loading } spinner text={ Msg.getMsg(MSG_TYPE.INFO, this.state.isUser.language, 'loading') } />

                {(() => {
                    if(Utils.inJson(this.state.isUser, 'page') && !Utils.isEmpty(this.state.isUser['page'])) {
                        const pageName = (Utils.inJson(this.state.isUser, 'page'))?this.state.isUser['page']['page_name']:'';
                        return(
                            <div id={ 'div_list_box' } className="div-list-box">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h5>{ pageName + '/' + Msg.getMsg(null, this.state.isUser.language, 'bt_list') }</h5>
                                            </td>
                                            <td style={{ textAlign: 'right'}}>
                                                <Button
                                                    variant={ VARIANT_TYPES.PRIMARY }
                                                    onClick={ this._onClickAction.bind(this) }>
                                                    {/* <FaPlus /> */}
                                                    { Msg.getMsg(null, this.props.isUser.language, 'bt_create') }
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* <div className="div-title-box">
                                    <h5>{ pageName + '/' + Msg.getMsg(null, this.state.isUser.language, 'bt_list') }</h5>
                                    <Button
                                        variant={ VARIANT_TYPES.PRIMARY }
                                        onClick={ this._onClickAction.bind(this) }>
                                        { Msg.getMsg(null, this.props.isUser.language, 'bt_create') }
                                    </Button>
                                </div> */}

                                <TableBox
                                    id={ this.state.isUser.action }
                                    // value={ this.state.isUser.action }
                                    // isUser={ this.state.isUser }
                                    page={ this.state.isUser.page }
                                    language={ this.state.isUser.language }
                                    cId={ this.state.isUser.cId }
                                    uId={ this.state.isUser.uId }
                                    viewPaging= { true }
                                    onClickAction={ this._onClickAction.bind(this) }
                                    onUpdateListHeaders={ this._onUpdateListHeaders.bind(this) }/>
                            </div>
                        );
                    }
                })()}
            </div>
        );
        // if(!Utils.inJson(this.state.isUser, 'page') || Utils.isEmpty(this.state.isUser['page'])) return('');
        // const pageName = (Utils.inJson(this.state.isUser, 'page'))?this.state.isUser['page']['page_name']:'';
        // return (
        //     <div id={ 'div_list_box' } className="div-list-box">
        //         <div className="div-title-box">
        //             <h5>{ pageName + '/' + Msg.getMsg(null, this.state.isUser.language, 'bt_list') }</h5>
        //             <Button
        //                 variant={ VARIANT_TYPES.PRIMARY }
        //                 onClick={ this._onClickCreateOrEdit.bind(this) }>
        //                 {/* <FaPlus /> */}
        //                 { Msg.getMsg(null, this.props.isUser.language, 'bt_create') }
        //             </Button>
        //         </div>

        //         <TableBox
        //             id={ this.state.isUser.action }
        //             // value={ this.state.isUser.action }
        //             // isUser={ this.state.isUser }
        //             page={ this.state.isUser.page }
        //             language={ this.state.isUser.language }
        //             cId={ this.state.isUser.cId }
        //             uId={ this.state.isUser.uId }
        //             viewPaging= { true }
        //             onClickEdit={ this._onClickCreateOrEdit.bind(this) }
        //             onUpdateListHeaders={ this._onUpdateListHeaders.bind(this) }/>
        //     </div>
        // )
    };
};

export default connect()(withRouter(List));