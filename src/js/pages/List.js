import React, { Component as C } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
// import { FaPlus } from 'react-icons/fa';

import TableBox from '../utils/Compoment/TableBox';

import { THEME } from '../utils/Theme';
import Fetch from '../utils/Fetch';
import { TYPE, OPTIONS_KEY } from '../utils/HtmlTypes';
import { ACTION, VARIANT_TYPES } from '../utils/Types';
import Utils from '../utils/Utils';
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

    _onClickCreate() {
        let options = { cId: this.state.isUser.cId, pId: parseInt(this.props.isUser.action), language: this.state.isUser.language };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'getPage', options);
        f.then(data => {
            if(!Utils.isEmpty(data)) {
                data.form.map((f) => {
                    const ps = f['object']['schema']['properties'];
                    // const keys = Object.keys(ps);
                    // for(let i=0; i< keys.length; i++) {
                    //     if(!key.startsWith(TYPE.CHECKBOX) && !key.startsWith(TYPE.RADIO) && !key.startsWith(TYPE.SELECT)) continue;
                    //     if(keys[i].endsWith('company_use_api')) {
                    //         patitions.push('sys_api');
                    //     } else {
                    //         patitions.push(keys[i]);
                    //     }
                    // }
                    data['patitions'] = Object.keys(ps).filter(function(key) {
                        return (key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))
                    });
                });

                if(Array.isArray(data['patitions']) && data['patitions'].length > 0) {
                    options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId };
                    const ff = Fetch.postLogin(host + 'distinctPatitions', options);
                    ff.then(disdata => {
                        if(!Utils.isEmpty(disdata)) {
                            console.log(disdata);
                            const forms = data.form;
                            let patitions = [];
                            forms.map((f) => {
                                const ps = f['object']['schema']['properties'];
                                patitions = data['patitions'].map((p) => {
                                    if(Utils.inJson(ps[p], 'option_target') && disdata.includes(ps[p]['option_target'])
                                        || p.endsWith('_city')
                                        || p.endsWith('group_parent_id')
                                        || p.endsWith('group_info_company_id')
                                        || p.endsWith('api_info_company_id')
                                        || p.endsWith('server_info_company_id')
                                        || p.endsWith('server_info_server_type')
                                        || p.endsWith('users_info_group_id')) {
                                        return ps[p]['option_target'];
                                    } else {
                                        return p;
                                    }
                                });
                                console.log(patitions);
                                patitions.filter(function (x, i, self) {
                                    return self.indexOf(x) === i;
                                });
                            });

                            console.log(patitions);
                            options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId, patitions: patitions };
                            const ff = Fetch.postLogin(host + 'options', options);
                            ff.then(pdata => {
                                if(!Utils.isEmpty(pdata)) {
                                    const pforms = data.form;
                                    pforms.map((f) => {
                                        const ps = f['object']['schema']['properties'];
                                        Object.keys(ps).map((key) => {
                                            if(key.endsWith('_theme') && ps[key]['option_target'] === 'themes') {
                                                ps[key][OPTIONS_KEY.OPTIONS] = THEME.getOptionsThemes();
                                            } else if((key.startsWith(TYPE.CHECKBOX) || key.startsWith(TYPE.RADIO) || key.startsWith(TYPE.SELECT) && !Utils.isEmpty(ps[key][OPTIONS_KEY.OPTION_TARGET]))) {
                                                pdata.map((d, idx) => {
                                                    if (d['option_name'] === ps[key]['option_target'] && patitions.includes(d['option_name'])) {
                                                        ps[key][OPTIONS_KEY.OPTIONS] = d['options'];
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                                delete data['patitions'];
                                this._onUpdateCreateCallBack(data);
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            this._onUpdateCreateCallBack(data);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this._onUpdateCreateCallBack(data);
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    _onUpdateCreateCallBack(data) {
        this.state.isUser.path = ACTION.SLASH + ACTION.CREATE;
        this.state.isUser.page = data;
        const auth = { info: this.state.isUser, options: this.state.options };
        this.props.onUpdateIsUserCallBack(auth);
    }

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

    UNSAFE_componentWillReceiveProps(props) {
        console.log('LIST componentWillReceiveProps');
        console.log(this.state.isUser);
        this.state.isUser = props.isUser;
        this.state.options = props.options;
    }

    render() {
        // this._getDatas();
      // if(Utils.isEmpty(this.props.isUser) || Utils.isEmpty(this.props.list)) return("");
        // const styles = { 'height': (window.innerHeight - 100 ) + 'px' };
        return (
            <div id={ 'div_list_box' } className="div-list-box">
                <div className="div-title-box">
                    <h5>{ this.state.isUser.path + '/' + this.state.isUser.action }</h5>
                    <Button
                        variant={ VARIANT_TYPES.PRIMARY }
                        onClick={ this._onClickCreate.bind(this) }>
                        {/* <FaPlus /> */}
                        { Msg.getMsg(null, this.props.isUser.language, 'bt_create') }
                    </Button>
                </div>

                <TableBox
                    id={ this.state.isUser.action }
                    value={ this.state.isUser.action }
                    isUser={ this.state.isUser }
                    viewPaging= { true }
                    onUpdateListHeaders={ this._onUpdateListHeaders.bind(this) }/>
            </div>
        )
    };
};

export default connect()(withRouter(List));