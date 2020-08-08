import React, { Component as C } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

import TableBox from '../utils/Compoment/TableBox';

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
            ,pageId: 1
        }
    };

    _onClickCreate() {
        this.state.isUser.path = ACTION.SLASH + ACTION.CREATE;
        const auth = { info: this.state.isUser, options: this.state.options };
        this.props.onUpdateIsUserCallBack(auth);
        // this.props.history.push(ACTION.SLASH + ACTION.CREATE);
        // this.forceUpdate();
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
                    id={ this.state.pageId }
                    value={ this.state.pageId }
                    isUser={ this.state.isUser }
                    viewPaging= { true }
                    onUpdateListHeaders={ this._onUpdateListHeaders.bind(this) }/>
            </div>
        )
    };
};

export default connect()(withRouter(List));