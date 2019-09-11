import React, { Component as C } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

import Pagination from '../utils/body/Pagin';
import Table from '../utils/body/Table';

import { ACTION, HTML_TAG, PAGIN_PER, PAGIN_PER_LIST, INPUT_TYPE } from '../utils/Types';
import Utils from '../utils/Utils';
import GetMsg from '../../msg/Msg';
// import View from './View';

import "../../css/List.css";

class List extends C {
    constructor(props) {
        super(props);

        this.divTableListRef = React.createRef();
        this.divContextMenuRef = React.createRef();
        this._onClickCreate = this._onClickCreate.bind(this);
        this._onUpdateAtPage = this._onUpdateAtPage.bind(this);
        this._onPerChange = this._onPerChange.bind(this);
        // console.log(this.Auth.getProfile());

        this.state = {
            loading: true
            ,isUser: this.props.isUser
            ,objs: {
                show: false
                ,items: [
                    { type: ACTION.EDIT, label: GetMsg(null, this.props.isUser.language, 'bt_edit') }
                    ,{ type: ACTION.DELETE, label: GetMsg(null, this.props.isUser.language, 'bt_delete') }
                    ,{ type: ACTION.DOWNLOAD, label: GetMsg(null, this.props.isUser.language, 'bt_download') }
                ]
            }
            ,total: 230
            ,atPage: 1
            ,per: PAGIN_PER
            ,list: [ ]
        }
    };

    _onClickCreate() {
        this.props.history.push(ACTION.SLASH + ACTION.CREATE);
        this.forceUpdate();
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

    _getDatas() {
        console.log(this.props.isUser);
        this.state.list = {
            columns: [
                { field: 'id', text: '', sort: false, filter: false }
                ,{ field: 'name', text: '', sort: true, filter: true, style: { width: 500 } }
                ,{ field: 'price3', text: '', type: INPUT_TYPE.DATE, sort: true, filter: true, style: { width: 500 } }
                ,{ field: 'price4', text: '', type: INPUT_TYPE.DATETIME, sort: true, filter: true }
                ,{ field: 'price5', text: '', sort: true, type: INPUT_TYPE.DATETIME, filter: true }
            ]
            ,datas:[
                { id: 1, name: "Item name 1", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 2, name: "Item name 2", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 3, name: "Item name 3", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 4, name: "Item name 4", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 5, name: "Item name 5", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 6, name: "Item name 6", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 7, name: "Item name 7", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 8, name: "Item name 8", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 9, name: "Item name 9", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 10, name: "Item name 10", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 11, name: "Item name 11", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 2, name: "Item name 2", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 3, name: "Item name 3", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 4, name: "Item name 4", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 5, name: "Item name 5", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 6, name: "Item name 6", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 7, name: "Item name 7", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 8, name: "Item name 8", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 9, name: "Item name 9", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 10, name: "Item name 10", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 11, name: "Item name 11", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 2, name: "Item name 2", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 3, name: "Item name 3", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 4, name: "Item name 4", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 5, name: "Item name 5", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 6, name: "Item name 6", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 7, name: "Item name 7", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 8, name: "Item name 8", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 9, name: "Item name 9", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 10, name: "Item name 10", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 11, name: "Item name 11", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 2, name: "Item name 2", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 3, name: "Item name 3", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 4, name: "Item name 4", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 5, name: "Item name 5", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 6, name: "Item name 6", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 7, name: "Item name 7", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 8, name: "Item name 8", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 9, name: "Item name 9", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 10, name: "Item name 10", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
                ,{ id: 11, name: "Item name 11", price3: 1001, price4: 1001, price5: 1001, price6: 1001 }
            ]
        };
    }

    _getPageCountPer() {
        var items = [];
        for (let i=1; i<=PAGIN_PER_LIST; i++) {
            items.push( <option key={ (i * PAGIN_PER) } value={ i }>{ (i * PAGIN_PER) }</option> );
        }
        return(
            <div className="div-count-per">
                <Form.Control as={ HTML_TAG.SELECT } onChange={ this._onPerChange.bind(this) }> { items }</Form.Control>
                <span>{ this.state.atPage }</span>
                <span>/</span>
                <span>{ Math.ceil(this.state.list.datas.length / this.state.per) }</span>
            </div>
        );
    }

    UNSAFE_componentWillReceiveProps(props) {
        console.log('LIST componentWillReceiveProps');
        this.state.isUser = props.isUser;
        // this.forceUpdate();
    }

    render() {
        this._getDatas();
      // if(Utils.isEmpty(this.props.isUser) || Utils.isEmpty(this.props.list)) return("");
        // const styles = { 'height': (window.innerHeight - 100 ) + 'px' };
        return (
            <div>
                <div className="div-pagin">
                    <h5>{ this.state.isUser.path + '/' + this.state.isUser.action }</h5>
                    <Button onClick={ this._onClickCreate.bind(this) } variant="primary">
                        <FaPlus />
                        { GetMsg(null, this.props.isUser.language, 'bt_create') }
                    </Button>
                    <Pagination
                        total={ this.state.total }
                        atPage={ this.state.atPage }
                        per={ this.state.per }
                        onUpdateAtPage={ this._onUpdateAtPage.bind(this) } />
                    {/* リスト件数PER件数より小さい場合表示されない */}
                    {(() => {
                      if(this.state.total > PAGIN_PER) {
                        return ( this._getPageCountPer() );
                      }
                    })()}
                </div>

                {/* リスト内容 */}
                <Table
                    isUser={ this.state.isUser }
                    columns={ this.state.list.columns }
                    datas={ this.state.list.datas } />
            </div>
        )
    };
};

export default connect()(withRouter(List));