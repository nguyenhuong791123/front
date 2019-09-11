import React, { Component as C } from "react";
import { Pagination } from 'react-bootstrap';

import { HTML_TAG, PAGIN } from '../Types';
import Utils from '../Utils';

import "../../../css/Pagin.css";

class Pagin extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,total: this.props.total
            ,per: this.props.per
            ,active: this.props.atPage
        }
    }

    _onClick(e) {
        var obj = e.target;
        if(obj.tagName === HTML_TAG.SPAN) obj = e.target.parentElement;
        if(Utils.isEmpty(obj) || Utils.isEmpty(obj.id)) return;
        const id = obj.id;
        if(id === PAGIN.PRE) this.state.active -= 1;
        if(id === PAGIN.PREALL) this.state.active = 1;
        if(id === PAGIN.NEXT) this.state.active += 1;
        if(id === PAGIN.NEXTALL) this.state.active = (Math.ceil(this.state.total / this.state.per) - 1);
        if(Utils.isNumber(obj.id)) this.state.active = parseInt(obj.id);
        this.props.onUpdateAtPage(this.state.active);
        // this.forceUpdate();
    }

    _getPaginations() {
        if(Utils.isEmpty(this.state.total)) return "";
        const pC = Math.ceil(this.state.total / this.state.per);
        var items = [];
        var active = this.state.active;
        console.log(active);
        var start = (active >= (pC - 5))?((pC > 5)?(pC - 4):pC):active;
        console.log(start);
        console.log(pC);
        for (let i=start; i<=pC; i++) {
            if(i >= (start + 5)) break;
            items.push(
                <Pagination.Item key={ i } id={ i } active={ i === active } onClick={ this._onClick.bind(this) }>
                    { i }
                </Pagination.Item>
            );
        }
        return(
            <Pagination>
                {(() => {
                    if(active > 2) { return ( <Pagination.First id={ PAGIN.PREALL } onClick={ this._onClick.bind(this) } /> ); }
                })()}
                {(() => {
                    if(active > 1) { return ( <Pagination.Prev id={ PAGIN.PRE } onClick={ this._onClick.bind(this) } /> ); }
                })()}
                { items }
                {(() => {
                    if(active < (pC - 1)) { return ( <Pagination.Next id={ PAGIN.NEXT } onClick={ this._onClick.bind(this) } /> ); }
                })()}
                {(() => {
                    if(active < (pC - 2)) { return ( <Pagination.Last id={ PAGIN.NEXTALL } onClick={ this._onClick.bind(this) } /> ); }
                })()}
            </Pagination>
        );
    }

    render() {
        return ( this._getPaginations() );
    }
}

export default Pagin;