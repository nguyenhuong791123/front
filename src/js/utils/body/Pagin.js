import React, { Component as C } from "react";
import { Pagination } from 'react-bootstrap';

import { PAGIN, PAGIN_PER_LIST } from '../Types';
import { HTML_TAG } from '../HtmlTypes';
import Utils from '../Utils';

// import "../../../css/Pagin.css";

class Pagin extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,total: this.props.total
            ,per: this.props.per
            ,active: this.props.atPage
            ,PAGIN_PER_LIST: PAGIN_PER_LIST
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
        // console.log(active);
        var start = 1;
        if(pC > PAGIN_PER_LIST) start = (active >= (pC - PAGIN_PER_LIST))?((pC > PAGIN_PER_LIST)?(pC - (PAGIN_PER_LIST - 1)):pC):active;
        // console.log(start);
        // console.log(pC);
        for (let i=start; i<=pC; i++) {
            if(i >= (start + PAGIN_PER_LIST)) break;
            items.push(
                <Pagination.Item key={ i } id={ i } active={ i === active } onClick={ this._onClick.bind(this) }>
                    { i }
                </Pagination.Item>
            );
        }
        return(
            <Pagination>
                {(() => {
                    if(active > 2 && pC > PAGIN_PER_LIST) { return ( <Pagination.First id={ PAGIN.PREALL } onClick={ this._onClick.bind(this) } /> ); }
                })()}
                {(() => {
                    if(active > 1 && pC > PAGIN_PER_LIST) { return ( <Pagination.Prev id={ PAGIN.PRE } onClick={ this._onClick.bind(this) } /> ); }
                })()}
                { items }
                {(() => {
                    if(active < (pC - 1) && pC > PAGIN_PER_LIST) { return ( <Pagination.Next id={ PAGIN.NEXT } onClick={ this._onClick.bind(this) } /> ); }
                })()}
                {(() => {
                    if(active < (pC - 2) && pC > PAGIN_PER_LIST) { return ( <Pagination.Last id={ PAGIN.NEXTALL } onClick={ this._onClick.bind(this) } /> ); }
                })()}
            </Pagination>
        );
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.state.total = props.total;
        this.state.per = props.per;
        this.state.active = props.atPage;
    }

    render() {
        return ( this._getPaginations() );
    }
}

export default Pagin;