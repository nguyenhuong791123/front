import React, { Component as C } from 'react';
import { Alert } from 'react-bootstrap';
import onClickOutside from 'react-onclickoutside';

import { isEmpty } from './Utils';
import '../../css/Alert.css';

class AlertBox extends C {
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show
            ,variant: this.props.variant
            ,errors: this.props.errors
        };
    };

    handleClickOutside() {
        this.state.show = false;
        this.forceUpdate();
    }

    _getMsg() {
        const style = { marginBottom: '0' }
        return( this.state.errors.map((error, index) => (<p key={ index } style={ style }>{ error }</p>)) );
    }

    render() {
        if(isEmpty(this.state.errors) || this.state.errors.length <= 0) return "";
        var styles = { right: '1em', top: '3em', position: 'absolute', zIndex: '20' };
        return (
            <div className="div-context-menu" style={ styles }>
                <Alert show={ this.state.show } variant={ this.state.variant }>
                    { this._getMsg() }
                </Alert>
            </div>
        )
    };
};

export default onClickOutside(AlertBox);
