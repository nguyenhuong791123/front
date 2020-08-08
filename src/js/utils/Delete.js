import React, { Component as C } from 'react';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { VARIANT_TYPES } from './Types';
import Msg from '../../msg/Msg';

export default class AlertDelete extends C {
    constructor(props) {
        super(props);

        this._onClickBack = this._onClickBack.bind(this);
        this.onClickDelete = this._onClickDelete.bind(this);

        this.state = {
            language: props.language
            ,obj: props.obj
        }
    }

    _onClickBack() {
        this.props.onClickBack();
    }

    _onClickDelete() {
        this.props.onClickDelete();
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if(this.state.language != nextProps.language)
    //         this.state.language = nextProps.isUlanguageser
    //     if(this.state.obj != nextProps.obj)
    //         this.state.obj = nextProps.obj
    // }

    render() {
        return (
            <Alert
                id={ this.state.obj.id }
                show={ this.state.obj.show }
                variant={ VARIANT_TYPES.LIGHT }
                className={ 'div-overlay-box' }>
                <div className='alert-light' style={ this.state.obj.style }>
                <h4>{ this.state.obj.msg }</h4>
                <Button
                    onClick={ this._onClickDelete.bind(this) }
                    variant={ VARIANT_TYPES.DANGER }>
                    {/* <FaTrash /> */}
                    { Msg.getMsg(null, this.state.language, 'bt_delete') }
                </Button>
                <Button
                    onClick={ this._onClickBack.bind(this) }
                    variant={ VARIANT_TYPES.PRIMARY }>
                    {/* <FaReply /> */}
                    { Msg.getMsg(null, this.state.language, 'bt_return') }
                </Button>
                </div>
            </Alert>
        );
    };
};