
import React, { Component as C } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import { ACTION, MSG_TYPE } from '../utils/Types';
import { inJson } from '../utils/Utils';

import Msg from '../../msg/Msg';
import '../../css/Alert.css';

export default class List extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this.state = { show: true, isUser: this.props.isUser };
    };

    _onClick() {
        this.props.onLogout();
    }

    UNSAFE_componentWillMount() {
        this.state.isUser.viewHeader = false;
        this.state.isUser.path = window.location.pathname;
        this.props.viewHeader(this.state.isUser);
    }

    render() {
        const language = (inJson(this.state.isUser, 'language'))?this.state.isUser.language:'ja';
        return (
            <div>
                <Alert show={this.state.show} variant="danger" className="div-alert">
                    <div className="d-flex justify-content-end">
                        <Link to={ ACTION.SLASH } onClick={ this._onClick.bind(this) }>
                            { Msg.getMsg(MSG_TYPE.ERROR, language, 'send_to_login_page') }
                        </Link>
                    </div>
                    <Alert.Heading>{ Msg.getMsg(MSG_TYPE.ERROR, language, 'page_not_found') }</Alert.Heading>
                    <p>{ Msg.getMsg(MSG_TYPE.ERROR, language, 'administrator_notify') }</p>
                </Alert>
            </div>
        )
    };
};