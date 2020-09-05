import React, { Component as C } from 'react';
import onClickOutside from 'react-onclickoutside';
import { Nav, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaRegEye, FaCloudDownloadAlt } from 'react-icons/fa';

import { ACTION, SYSTEM } from './Types';
import Html from './HtmlUtils';
import Utils from './Utils';
import '../../css/CMenu.css';

class ContextMenu extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this.state = { objs: this.props.objs, newWindow: this.props.newWindow };
    };

    _onClick(e) {
        if(Utils.isEmpty(this.state.objs.ids) || this.state.objs.ids.length <= 0) return;
        const obj = Html.getLinkObj(e);
        const action = obj.getAttribute("action");
        if(action === ACTION.VIEW || action === ACTION.EDIT) {
            if(this.state.objs.ids.length > 1) return;
            console.log(action);
            if(Utils.isNumber(this.state.newWindow) && this.state.newWindow === 1) {
                this._newWindow(action);
            } else {
                console.log(action);
                this.props.onClick(action);
            }
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
            } else if(o.type === ACTION.VIEW) {
                icon = <FaRegEye />;
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.state.objs = nextProps.objs;
        this.state.newWindow = nextProps.newWindow;
    }

    render() {
        var styles = { top: this.state.objs.top, left: this.state.objs.left, zIndex: 2 };
        return (
            <div id={ SYSTEM.IS_DIV_CONTEXT_MENU_BOX } className="div-context-menu" style={ styles }>
                <Alert show={this.state.objs.show}>
                    { this.getLinkByType() }
                </Alert>
            </div>
        )
    };
};

export default onClickOutside(ContextMenu);
