
import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { FaRegEye, FaSort, FaTimes } from 'react-icons/fa';

import Calendar from '../Calendar';
import View from '../../pages/View';
import CMenu from '../CMenu';
import Pagination from '../body/Pagin';

import Html from '../HtmlUtils';
import Utils from '../Utils';
import { ACTION, VARIANT_TYPES, OBJECT, PAGIN_PER, PAGIN_PER_LIST, SYSTEM } from '../Types';
import { HTML_TAG, ATTR, TYPE, MOUSE } from '../HtmlTypes';
import Msg from '../../../msg/Msg';
import "../../../css/Table.css";

export default class TableBox extends C {
    constructor(props) {
        super(props);

        this.divContextMenuRef = React.createRef();
        this._onSort = this._onSort.bind(this);
        this._onThKeyDown = this._onThKeyDown.bind(this);
        this._onTrClick = this._onTrClick.bind(this);
        this._onDblClick = this._onDblClick.bind(this);
        this._onContextMenu = this._onContextMenu.bind(this);
        this._onCheckBoxClick = this._onCheckBoxClick.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onFocus = this._onFocus.bind(this);

        const language = (!Utils.isEmpty(this.props.schema) && Utils.inJson(this.props.schema, 'language'))
                            ?this.props.schema.language
                            :this.props.isUser.language;
        // delete this.props.value;
        this.state = {
            pageId: this.props.value
            ,isUser: this.props.isUser
            ,language: language
            ,sort: { show: false, sort: true, obj: null, style: {} }
            ,viewPaging: this.props.viewPaging
            ,total: 0
            ,atPage: 1
            ,per: PAGIN_PER
            ,columns: []
            ,datas: []
            ,isCols: []
            ,actions: {
                show: false
                ,ids: []
                ,items: [
                  { type: ACTION.EDIT, label: Msg.getMsg(null, language, 'bt_edit') }
                  ,{ type: ACTION.DELETE, label: Msg.getMsg(null, language, 'bt_delete') }
                  ,{ type: ACTION.DOWNLOAD, label: Msg.getMsg(null, language, 'bt_download') }
                ]
            }
        };
    };

    _onSort(e) {
        console.log(e);
        console.log(e.target);
    }

    _onFocus(e) {
        console.log('_onFocus');
        console.log(e.target);
        this._onViewCalendar(e);
    }

    _onThKeyDown(e) {
        console.log(e);
        console.log(e.target);
        console.log(e.key);
        console.log(e.keyCode);
    }

    _onTrClick(e) {
        let obj = this._getObjTr(e);
        if(Utils.isEmpty(obj)) return;
        const checked = document.getElementById(OBJECT.INPUT_CHECK_ALL_ID + this.state.id);
        if(!Utils.isEmpty(checked)) checked.checked = false;
        let body =  this._getTBody();
        this._removeTrView(body);
        if(this.state.view) {
            this.state.view = false;
            this._removeTrClass(body);
            obj.setAttribute(ATTR.CLASS, ACTION.SELECTED);

            const idx =  obj.getAttribute('idx');
            // console.log(idx);
            if(Utils.isEmpty(idx) || !Utils.isNumber(idx)) return;
            const rowId = ACTION.VIEW +'_'+ idx;
            const isExists = document.getElementById(rowId);
            if(!Utils.isEmpty(isExists)) isExists.remove();
            let row = body.insertRow((parseInt(idx)+1));
            row.id = rowId;
            const cell = document.createElement(HTML_TAG.TD);
            cell.colSpan = (this.state.columns.length+1);
            cell.id = rowId + '_' + HTML_TAG.TD;
            row.appendChild(cell);
            ReactDOM.render(<View id={ obj.id } />, document.getElementById(rowId + '_' + HTML_TAG.TD));
        } else {
            if(Utils.isEmpty(obj.className)
                || obj.className.indexOf(ACTION.SELECTED) === -1) {
                obj.setAttribute(ATTR.CLASS, ACTION.SELECTED);
            } else {
                obj.removeAttribute(ATTR.CLASS);
            }
        }
    }

    _onDblClick(e) {
        // console.log(e);
        let obj = this._getObjTr(e);
        if(Utils.isEmpty(obj)) return;
        const body = this._getTBody();
        this._removeTrClass(body);
        obj.setAttribute(ATTR.CLASS, ACTION.SELECTED);
    }

    _onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        const ids = this._getTrSelected();
        if(Utils.isEmpty(ids) || ids.length <= 0) return;
        this.state.actions.show = true;
        this.state.actions.ids = ids;
        let top = (e.pageY - 50);
        let left = e.pageX;
        let div = document.getElementById(SYSTEM.IS_DIV_LIST_BOX);
        if(Utils.isEmpty(div)) top -= 70;
        if((top + 150) >= window.innerHeight) top = (top - 150);
        if((left + 150) >= window.innerWidth) left = (left - 150);
        this.state.actions.top = top;
        this.state.actions.left = left;
        this.forceUpdate();
    }

    _onCheckBoxClick(e) {
        if(Utils.isEmpty(e.target) || e.target.type !== TYPE.CHECKBOX) return;
        const isChecked = e.target.checked;
        let thead = e.target.parentElement.parentElement;
        if(thead.tagName !== HTML_TAG.TR) return;
        this.state.view = false;
        const body = this._getTBody();
        this._removeTrView(body);
        let node = body.childNodes;
        for(let i=0; i<node.length; i++) {
            if(isChecked) {
                node[i].setAttribute(ATTR.CLASS, ACTION.SELECTED);
            } else {
                node[i].removeAttribute(ATTR.CLASS);
            }
        };
    }

    _onScroll(e) {
        let obj = e.target;
        if(Utils.isEmpty(obj) || Utils.isEmpty(obj.id)) return;
        const id = (obj.id.indexOf(OBJECT.DIV_BODY_ID) !== -1)?obj.id.replace('body', 'header'):obj.id.replace('header', 'body');
        const div = document.getElementById(id);
        let scroll = obj.scrollLeft;
        if(Utils.isEmpty(scroll)) return;
        div.style.marginLeft = -scroll + 'px';
    }

    // _onHeaderScroll(e) {
    //     console.log(e.target);
    //     const divHeader = document.getElementById(OBJECT.DIV_BODY_ID + this.props.id);
    //     let scroll = e.target.scrollLeft;
    //     if(Utils.isEmpty(scroll)) return;
    //     divHeader.style.marginLeft = -scroll + 'px';
    // }

    // _onBodyScroll(e) {
    //     console.log(e.target);
    //     const divHeader = document.getElementById(OBJECT.DIV_HEADER_ID + this.props.id);
    //     let scroll = e.target.scrollLeft;
    //     if(Utils.isEmpty(scroll)) return;
    //     divHeader.style.marginLeft = -scroll + 'px';
    // }

    _getHeader() {
        // [ { field: 'name', text: '', sort: true, filter: true, style: { width: '100px', minWidth: '100px', maxWidth: '100px' } } ]
        if(Utils.isEmpty(this.state.columns)) return "";
        this.state.isCols = [];
        let ths = this.state.columns.map((o, index) => {
            this.state.isCols.push(o.field);
            // const key = 'label_' + o.field;
            let style = ('style' in o)?o.style:'';
            let type = ('type' in o)?o.type:'';
            if(Utils.isEmpty(style)) {
                style = { width: 100 };
            } else {
                delete style['height'];
            }
            // const label = Msg.getMsg(this.state.isUser.action, this.state.isUser.language, key);
            let isLabel = <label>{ o.label }</label>;
            // if(('filter' in o) && o.filter) {
                if(type === TYPE.DATE || type === TYPE.DATETIME) {
                    isLabel = (<FormControl
                                    readOnly
                                    type={ HTML_TAG.INPUT }
                                    style={ { backgroundColor: 'white' } }
                                    placeholder={ o.label }
                                    onFocus={ this._onFocus.bind(this) }
                                    onKeyDown={ this._onThKeyDown.bind(this) } />);
                } else {
                    isLabel = (<FormControl
                                    type={ HTML_TAG.INPUT }
                                    style={ { backgroundColor: 'white' } }
                                    placeholder={ o.label }
                                    onFocus={ this._onFocus.bind(this) }
                                    onKeyDown={ this._onThKeyDown.bind(this) } />);
                }
            // }
            // if(o.sort) {
                if(!Utils.isEmpty(style)) {
                    return(<th key={ index } id={ o.field } type={ type } style={ style } onMouseOver={ this._onThMouseOver.bind(this) }>{ isLabel }</th>);
                } else {
                    return(<th key={ index } id={ o.field } type={ type } style={ style } onMouseOver={ this._onThMouseOver.bind(this) }>{ isLabel }</th>);
                }
            // } else {
            //     if(!Utils.isEmpty(style)) {
            //         return(<th key={ index } id={ o.field } type={ type } style={ style } onMouseOver={ this._onThMouseOver.bind(this) }>{ isLabel }</th>);
            //     } else {
            //         return(<th key={ index } id={ o.field } type={ type } style={ style } onMouseOver={ this._onThMouseOver.bind(this) }>{ isLabel }</th>);
            //     }
            // }
        });

        return(
            <div id={ OBJECT.DIV_HEADER_ID + this.props.id } className={ 'div-table-header' } onScroll={ this._onScroll.bind(this) }>
               <table className='table table-sm table-bordered'>
                <thead>
                    <tr>
                        <th>
                            <input id={ OBJECT.INPUT_CHECK_ALL_ID + this.props.id } type={ TYPE.CHECKBOX } onClick={ this._onCheckBoxClick.bind(this) } />
                        </th>
                        { ths }
                    </tr>
                </thead>
                </table>
            </div>
        );
    }

    _getBody() {
        // [ { id: 1, name: "Item name 1", price3: 1001, price4: 1001, price5: 1001, price6: 1001 } ]
        if(Utils.isEmpty(this.state.datas)) return "";
        // console.log(this.state.isCols);
        let trs = this.state.datas.map((o, index) => {
            let keys = Object.keys(o);
            let tds = [];
            for(let i=0; i<keys.length; i++) {
                if(!Utils.inArray(this.state.isCols, keys[i])) continue;
                if(index === 0) {
                    let style = ('style' in this.state.columns[i])?this.state.columns[i].style:'';
                    if(Utils.isEmpty(style)) style = { width: 100 };
                    if(!Utils.isEmpty(style)) {
                        tds.push(<td key={ i } idx={ i } style={ style }>{ o[keys[i]] }</td>);
                    } else {
                        tds.push(<td key={ i } idx={ i }>{ o[keys[i]] }</td>);
                    }   
                } else {
                    tds.push(<td key={ i } idx={ i }>{ o[keys[i]] }</td>);
                }
            }
            return(
                <tr
                    key={ index }
                    idx={ index }
                    id={ o.id }
                    onClick={ this._onTrClick.bind(this) }
                    onDoubleClick={ this._onDblClick.bind(this) }
                    onContextMenu={ this._onContextMenu.bind(this) } >
                    <td><FaRegEye /></td>
                    { tds }
                </tr>
            );
        });

        return(
            <div id={ OBJECT.DIV_BODY_ID + this.props.id } className={ 'div-table-body' } onScroll={ this._onScroll.bind(this) }>
                <table className='table table-sm table-striped table-bordered table-hover'><tbody>{ trs }</tbody></table>
            </div>
        );
    }

    _getObjTr(e) {
        let obj = e.target;
        if(obj.tagName === HTML_TAG.PATH || obj.tagName === HTML_TAG.SVG) {
            if(obj.tagName === HTML_TAG.PATH) obj = e.target.parentElement.parentElement.parentElement;
            if(obj.tagName === HTML_TAG.SVG) obj = e.target.parentElement.parentElement;
            this.state.view = true;
            return obj;
        }
        if(obj.tagName === HTML_TAG.TD) {
            const idx = obj.getAttribute('idx');
            if(Utils.isEmpty(idx)) this.state.view = true;
            obj = e.target.parentElement;
        }
        return obj;
    }

    _getTBody() {
        let tBody = document.getElementById(OBJECT.DIV_BODY_ID + this.props.id).childNodes[0];
        if(Utils.isEmpty(tBody) || Utils.isEmpty(tBody.childNodes[0])) return;
        if(tBody.childNodes[0].tagName === HTML_TAG.TBODY) tBody = tBody.childNodes[0];
        return tBody;
    }

    _getTrSelected() {
        let ids = [];
        const tBody = this._getTBody();
        for(let i=0; i<tBody.childNodes.length; i++) {
            let trId =  tBody.childNodes[i].getAttribute('id');
            let className = tBody.childNodes[i].className;
            if(className !== ACTION.SELECTED
                || Utils.isEmpty(trId)
                || !Utils.isNumber(trId)) continue;
                ids.push(trId);
        }
        return ids;
    }

    _removeTrView(body) {
        const nodes = body.childNodes;
        for(let i=0; i<nodes.length; i++) {
            if(nodes[i].id.indexOf(ACTION.VIEW +'_') === -1) continue;
            nodes[i].remove();
        }
    }

    _removeTrClass(body) {
        const nodes = body.childNodes;
        for(let i=0; i<nodes.length; i++) {
            nodes[i].removeAttribute(ATTR.CLASS);
        }
    }

    _onViewCalendar(e) {
        this._removeCalendar();
        const obj = e.target.parentElement;
        const type = obj.getAttribute('type');
        if(Utils.isEmpty(obj)
            || obj.tagName !== HTML_TAG.TH
            || (type !== TYPE.DATETIME && type !== TYPE.DATE)) return;
        const datetime = (type === TYPE.DATETIME)?true:false;
        const cBox = document.createElement(HTML_TAG.DIV);
        cBox.id = OBJECT.DIV_CALENDAR_BOX_VIEW_ID;
        obj.appendChild(cBox);
        ReactDOM.render(<Calendar
            objId={ obj.id }
            fromTo={ true }
            range={ true }
            datetime={ datetime }
            language={ this.state.language }
            onChangeCalendar={ this._onChangeCalendar.bind(this) } />
            ,document.getElementById(cBox.id));
        const cal = document.getElementById(OBJECT.DIV_CALENDAR_BOX_ID + obj.id);
        const pos = obj.getBoundingClientRect();
        if(Utils.isEmpty(pos)) return;
        const boxX = pos.x + cal.offsetWidth;
        if(boxX > window.innerWidth) {
            cal.style.left = (window.innerWidth - (cal.offsetWidth + 5)) + 'px';
        } else if(pos.x < 0) {
            cal.style.left = '0px';
        } else {
            cal.style.left = pos.x + 'px';
        }
    }

    _onChangeCalendar(start, end) {
        console.log(start);
        console.log(end);
        this._removeCalendar();
    }

    _removeCalendar() {
        const cal = document.getElementById(OBJECT.DIV_CALENDAR_BOX_VIEW_ID);
        if(Utils.isEmpty(cal)) return;
        cal.remove();
    }

    _onThMouseOver(e) {
        let obj = e.target;
        if(Utils.isEmpty(obj)) return;
        if(obj.tagName !== HTML_TAG.TH) {
            obj = obj.parentElement;
        }
        if(obj.tagName !== HTML_TAG.TH || Utils.isEmpty(obj.id)) return;
        obj.addEventListener(MOUSE.MOUSEOUT, this._onThMouseOut.bind(this), false);
        const pos = obj.getBoundingClientRect();
        if(Utils.isEmpty(pos)) return;
        const tbl = obj.parentElement.parentElement.parentElement.parentElement;
        const tblPos = tbl.getBoundingClientRect();
        let left = (pos.x + pos.width) - 33;
        const input = obj.getElementsByTagName(HTML_TAG.INPUT)[0];
        if(!Utils.isEmpty(input)) left = left - 30; 
        if((tblPos.x + tblPos.width) <= left) return;
        this.state.sort.obj = obj;
        this.state.sort.style = { top: '3.2em', left : left };
        this.state.sort.show = true;
        this.forceUpdate();
    }

    _onThMouseOut(e) {
        const obj = Html.getButton(e);
        if(Utils.isEmpty(obj)) return;
        if(obj.tagName === HTML_TAG.BUTTON && obj.className.indexOf('btn-hidden') !== -1) {
            this.state.sort.show = true;
        } else {
            this.state.sort.show = false;
        }
        if(!Utils.isEmpty(this.state.sort.obj)) {
            this.state.sort.obj.removeEventListener(MOUSE.MOUSEOUT, this._onThMouseOut.bind(this), false);
        }
        this.forceUpdate();
    }

    _onResetButtonClick() {
        const key = this.state.sort.obj.id;
        const tr = document.getElementById(key);
        if(Utils.isEmpty(tr)) return;
        const obj = tr.getElementsByTagName(HTML_TAG.INPUT)[0];
        if(Utils.isEmpty(obj)) return;
        obj.value = '';
    }

    _onSortButtonClick() {
        if(Utils.isEmpty(this.state.sort) || Utils.isEmpty(this.state.sort.obj)) return;
        // console.log(this.state.sort);
        const key = this.state.sort.obj.id;
        if(this.state.sort.sort) {
            this.state.datas.sort((a, b) => ((a[key] > b[key])?1:-1));
            this.state.sort.sort = false;
        } else {
            this.state.datas.sort((a, b) => ((b[key] > a[key])?1:-1));
            this.state.sort.sort = true;
        }
        this.forceUpdate();
    }

    _onSortButtons() {
        let obj = null;
        if(!Utils.isEmpty(this.state.sort.obj) && Utils.inJson(this.state.sort.obj, 'id')) {
            const key = this.state.sort.obj.id;
            const tr = document.getElementById(key);
            if(!Utils.isEmpty(tr)) {
                obj = tr.getElementsByTagName(HTML_TAG.INPUT)[0];
            }
        }

        return(
            <Alert
                show={ this.state.sort.show }
                variant={ VARIANT_TYPES.LIGHT }
                style={ this.state.sort.style }
                className={ 'div-customize-actions div-customize-actions-child' }>

                <Button
                    type={ HTML_TAG.BUTTON }
                    className={ 'btn-hidden' }
                    onMouseOver={ this._onThMouseOut.bind(this) }
                    onClick={ this._onSortButtonClick.bind(this) }
                    variant={ VARIANT_TYPES.SECONDARY }>
                    <FaSort />
                </Button>

                {(() => {
                    if(!Utils.isEmpty(obj) && obj.getAttribute('type') !== TYPE.CHECKBOX) {
                        return (
                            <Button
                                type={ HTML_TAG.BUTTON }
                                className={ 'btn-hidden' }
                                onMouseOver={ this._onThMouseOut.bind(this) }
                                onClick={ this._onResetButtonClick.bind(this) }
                                variant={ VARIANT_TYPES.WARNING }>
                                <FaTimes />
                            </Button>
                        );
                    }
                })()}
            </Alert>
        );
    }

    _onUpdateAtPage(page) {
        if(Utils.isEmpty(page)) return;
        this.state.atPage = page;
        this.forceUpdate();
    }

    _onPerChange(e) {
        console.log(e);
        this.state.per = e.target.value;
        this.forceUpdate();
    }

    _getPageCountPer() {
        let items = [];
        for (let i=1; i<=PAGIN_PER_LIST; i++) {
            items.push( <option key={ i } value={ i * PAGIN_PER }>{ (i * PAGIN_PER) }</option> );
        }
        return(
            <div className="div-count-per">
                <FormControl
                    as={ HTML_TAG.SELECT }
                    value={ this.state.per }
                    onChange={ this._onPerChange.bind(this) }> { items }</FormControl>
                <span>{ this.state.atPage }</span>
                <span>/</span>
                <span>{ Math.ceil(this.state.total / this.state.per) }</span>
            </div>
        );
    }

    UNSAFE_componentWillMount() {
        let list = {
            columns: [
                { field: 'id', label: 'AAAA', view: true }
                ,{ field: 'name', label: 'BBBB', view: true, style: { width: '500px', height: '100px' } }
                ,{ field: 'price3', label: 'CCCC', view: true, style: { width: '500px', height: '100px' } }
                ,{ field: 'price4', label: 'DDDD', view: true, type: TYPE.DATETIME }
                ,{ field: 'price5', label: 'EEEE', view: true, type: TYPE.DATETIME }
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

        this.state.columns = list.columns;
        this.state.datas = list.datas;
        this.state.total = 500;

        // if(Utils.isFunc(this.props, 'onUpdateListHeaders')) {
        if(Utils.inJson(this.props, 'onUpdateListHeaders') && (typeof this.props.onUpdateListHeaders === 'function')) {
            this.props.onUpdateListHeaders(this.state.columns);
        }
    }

    render() {
        return (
            <div className='div-table' id={ this.props.id }>
                {(() => {
                    if(this.state.viewPaging) {
                        return (
                            <div className="div-paging-box">
                                {/* リスト件数PER件数より小さい場合表示されない */}
                                {(() => {
                                    if(this.state.total > PAGIN_PER) {
                                        return ( this._getPageCountPer() );
                                    }
                                })()}
                                <Pagination
                                    total={ this.state.total }
                                    atPage={ this.state.atPage }
                                    per={ this.state.per }
                                    onUpdateAtPage={ this._onUpdateAtPage.bind(this) } />
                            </div>
                        );
                    }
                })()}
                { this._onSortButtons() }
                { <CMenu ref={ this.divContextMenuRef } objs={ this.state.actions }/> }
                { this._getHeader() }
                { this._getBody() }
            </div>
        )
    };
};