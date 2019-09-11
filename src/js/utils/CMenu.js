import React, { Component as C } from 'react';
import onClickOutside from 'react-onclickoutside';
import { Nav, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCloudDownloadAlt } from 'react-icons/fa';

import { ACTION } from './Types';
import Utils from './Utils';
import '../../css/CMenu.css';

class ContextMenu extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this.state = { objs: this.props.objs };
    };

    _onClick(e) {
        if(Utils.isEmpty(this.state.objs.ids) || this.state.objs.ids.length <= 0) return;
        const obj = e.target;
        const action = obj.getAttribute("action");
        this.forceUpdate();
        if(action === ACTION.EDIT) {
            if(this.state.objs.ids.length > 1) return;
            console.log(action);
            this._newWindow(action);
        }
        if(action === ACTION.DELETE || action === ACTION.DOWNLOAD) {
            console.log(action);
            console.log(this.state.objs.ids);
        }
        this._onCloseAlert();
    }

    _onCloseAlert() {
        this.state.objs.show = false;
        this.forceUpdate();
    }

    _newWindow(href) {
        if(Utils.isEmpty(href)) return;
        var w = window.open();
        w.opener = null;
        w.location = href;
    }

    getLinkByType() {
        if(this.state.objs === undefined || this.state.objs.items === undefined || this.state.objs.items.length === 0) return "";
        return this.state.objs.items.map( o => {
            var icon = '';
            if(o.type === ACTION.EDIT && this.state.objs.ids.length < 2) {
                icon = <FaEdit />;
            } else if(o.type === ACTION.DELETE) {
                icon = <FaTrash />;
            } else if(o.type === ACTION.DOWNLOAD) {
                icon = <FaCloudDownloadAlt />;
            }
            if(Utils.isEmpty(icon)) return "";
            return (<Nav.Link key={ o.type } href="#" action={ o.type } onClick={ this._onClick.bind(this) }>{ icon }{ o.label }</Nav.Link>);
          });
    }

    handleClickOutside() {
        this._onCloseAlert();
    }

    render() {
        var styles = { top: this.state.objs.top, left: this.state.objs.left };
        return (
            <div className="div-context-menu" style={ styles }>
                <Alert show={this.state.objs.show}>
                    { this.getLinkByType() }
                </Alert>
            </div>
        )
    };
};

export default onClickOutside(ContextMenu);
