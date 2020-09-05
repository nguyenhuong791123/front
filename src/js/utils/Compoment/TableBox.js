
import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { FaRegEye, FaSort, FaTimes } from 'react-icons/fa';
import StringUtil from 'util';

import Calendar from '../Calendar';
import View from '../../pages/View';
import CMenu from '../CMenu';
import Pagination from '../body/Pagin';

import Fetch from '../Fetch';
import Html from '../HtmlUtils';
import Utils from '../Utils';
import DateUtils from '../DateUtils';
import { ACTION, VARIANT_TYPES, OBJECT, PAGIN_PER, PAGIN_PER_LIST, SYSTEM } from '../Types';
import { HTML_TAG, ATTR, TYPE, MOUSE, SEARCH_OPTIONS, OPTIONS_SEARCH, OPTIONS_KEY } from '../HtmlTypes';
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
        // this._onFocus = this._onFocus.bind(this);

        const language = (!Utils.isEmpty(this.props.schema) && Utils.inJson(this.props.schema, 'language'))
                            ?this.props.schema.language
                            :this.props.language;
        const cId = (!Utils.isEmpty(this.props.schema) && Utils.inJson(this.props.schema, 'cId'))
                            ?this.props.schema.cId
                            :this.props.cId;
        const uId = (!Utils.isEmpty(this.props.schema) && Utils.inJson(this.props.schema, 'uId'))
                            ?this.props.schema.uId
                            :this.props.uId;
        // delete this.props.value;
        this.state = {
            pageId: this.props.value
            ,isUser: this.props.isUser
            ,page: this.props.page
            ,language: language
            ,cId: cId
            ,uId: uId
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
                  ,{ type: ACTION.VIEW, label: Msg.getMsg(null, language, 'bt_view') }
                  ,{ type: ACTION.DELETE, label: Msg.getMsg(null, language, 'bt_delete') }
                  ,{ type: ACTION.DOWNLOAD, label: Msg.getMsg(null, language, 'bt_download') }
                ]
            }
        };
    };

    _onChange(e) {
        console.log('_onChange');
        console.log(e);
        console.log(e.target);
    }

    _onSort(e) {
        console.log(e);
        console.log(e.target);
    }

    // _onFocus(e) {
    //     console.log('_onFocus');
    //     console.log(e.target);
    //     this._onViewCalendar(e);
    // }

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
        if(Utils.isEmpty(body)) return;
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
                sessionStorage.setItem(SYSTEM.IS_ACTION_ROW_ID, Utils.isNumber(obj.id)?parseInt(obj.id):obj.id);
            } else {
                obj.removeAttribute(ATTR.CLASS);
                sessionStorage.removeItem(SYSTEM.IS_ACTION_ROW_ID);
            }
        }
    }

    _onDblClick(e) {
        // console.log(e);
        let obj = this._getObjTr(e);
        if(Utils.isEmpty(obj)) return;
        const body = this._getTBody();
        if(Utils.isEmpty(body)) return;
        this._removeTrClass(body);
        obj.setAttribute(ATTR.CLASS, ACTION.SELECTED);
    }

    _onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        const ids = this._getTrSelected();
        if(Utils.isEmpty(ids) || ids.length <= 0) return;
        if(ids.length > 1) sessionStorage.removeItem(SYSTEM.IS_ACTION_ROW_ID);
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
        if(Utils.isEmpty(body)) return;
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
        if(Utils.isEmpty(div)) return;
        let scroll = obj.scrollLeft;
        if(Utils.isEmpty(scroll)) return;
        // console.log(div);
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
        // const length = this.state.columns.length;
        let th_1st = [] 
        let th_2nd = this.state.columns.map((o, index) => {
            if(!o.search) {// || o.field === this.state.page['page_id_seq']
                th_1st.push(null);
                return null;
            } else {
                this.state.isCols.push(o.field);
                let style = ('style' in o)?o.style:'';
                let type = ('type' in o)?o.type:'';
                if(Utils.isEmpty(style)) {
                    o.style = { width: 150, maxWidth: 150 };
                    // style = { width: o.style };
                } else {
                    if(Utils.inJson(o.style, 'height')) delete o.style['height'];
                    // delete style['height'];
                }
                let isLabel = (<label>{ o.label }</label>);
                if(type === TYPE.DATETIME  || type === TYPE.DATE || type === TYPE.TIME) {
                    isLabel = (<Calendar
                                id={ o.field }
                                range={ true }
                                datetype={ type }
                                language={ this.state.language }
                                onChangeCalendar={ this._onChangeCalendar.bind(this) }/>);
                    // isLabel = (<FormControl
                    //                 readOnly
                    //                 type={ HTML_TAG.INPUT }
                    //                 style={ { backgroundColor: 'white' } }
                    //                 placeholder={ o.label }
                    //                 // onBlur={ this._onChange.bind(this) }
                    //                 onFocus={ this._onFocus.bind(this) }
                    //                 onKeyDown={ this._onThKeyDown.bind(this) } />);
                } else if(type === TYPE.CHECKBOX || type === TYPE.RADIO || type === TYPE.SELECT) {
                    const items = [];
                    this.state.page.form.map((f) => {
                        const objs = f['object'];
                        if(Array.isArray(objs)) {
                            objs.map((sc) => {
                                const ps = sc['schema']['properties'];
                                if(!Utils.isEmpty(ps[o.field]) && Array.isArray(ps[o.field]['options'])) {
                                    items.push(ps[o.field]['options'].map((opt, i) => {
                                        return(<option key={ i } value={ opt.label } />);
                                    }));
                                }      
                            })
                        } else {
                            const ps = objs['schema']['properties'];
                            if(!Utils.isEmpty(ps[o.field]) && Array.isArray(ps[o.field]['options'])) {
                                items.push(ps[o.field]['options'].map((opt, i) => {
                                    return(<option key={ i } value={ opt.label } />);
                                }));
                            }
                        }
                    });
                    isLabel = (<div>
                                    <FormControl
                                        type={ 'text' }
                                        autoComplete='on'
                                        list={ 'datalist_' + o.field }
                                        style={ { backgroundColor: 'white' } }
                                        // placeholder={ o.label }
                                        onChange={ this._onChange.bind(this) }
                                        // onFocus={ this._onFocus.bind(this) }
                                        onKeyDown={ this._onThKeyDown.bind(this) } />

                                    <datalist id={ 'datalist_' + o.field }>
                                        { items }
                                    </datalist>
                                </div>);
                } else if(type === TYPE.NUMBER) {
                    isLabel = (<FormControl
                                    type={ TYPE.NUMBER }
                                    style={ { backgroundColor: 'white' } }
                                    // placeholder={ o.label }
                                    onChange={ this._onChange.bind(this) }
                                    // onFocus={ this._onFocus.bind(this) }
                                    onKeyDown={ this._onThKeyDown.bind(this) } />);
                } else if(!o.field.endsWith('_image') && !o.field.endsWith('_logo')) {
                    isLabel = (<FormControl
                                    type={ HTML_TAG.INPUT }
                                    style={ { backgroundColor: 'white' } }
                                    // placeholder={ o.label }
                                    onChange={ this._onChange.bind(this) }
                                    // onFocus={ this._onFocus.bind(this) }
                                    onKeyDown={ this._onThKeyDown.bind(this) } />);
                }
                th_1st.push(<th key={ index } title={ o.label } style={ o.style } className={ 'btn-primary' }>{ o.label }</th>);
                if(Utils.inJson(o, 'style') && !Utils.isEmpty(o.style)) {
                    return(<th key={ index } id={ o.field } type={ type } style={ o.style } onMouseOver={ this._onThMouseOver.bind(this) }>{ isLabel }</th>);
                } else {
                    return(<th key={ index } id={ o.field } type={ type } onMouseOver={ this._onThMouseOver.bind(this) }>{ isLabel }</th>);
                }
                // return(<th key={ index } id={ o.field } type={ type } onMouseOver={ this._onThMouseOver.bind(this) }>{ isLabel }</th>);
            }
        });
        th_1st.filter(v => !!v)
        th_2nd.filter(v => !!v)

        if(Array.isArray(th_1st) && th_1st.length > 0) {
            return(
                <div id={ OBJECT.DIV_HEADER_ID + this.props.id } className={ 'div-table-header' } onScroll={ this._onScroll.bind(this) }>
                   <table className='table table-sm table-bordered'>
                        <thead>
                            <tr>
                                <th className={ 'btn-primary' }></th>
                                { th_1st }
                            </tr>
                            {(() => {
                                if (Array.isArray(this.state.datas) && this.state.datas.length > 0) {
                                    return(
                                        <tr>
                                            <th>
                                                <input id={ OBJECT.INPUT_CHECK_ALL_ID + this.props.id } type={ TYPE.CHECKBOX } onClick={ this._onCheckBoxClick.bind(this) } />
                                            </th>
                                            { th_2nd }
                                        </tr>        
                                    );
                                } else {
                                    return(<tr><th colSpan={ (th_1st.length + 1) }>Data is not exists!!!</th></tr> );
                                }
                            })()}
                        </thead>
                    </table>
                </div>
            );
        } else {
            return ('');
        }
    }

    _getBody() {
        // [ { id: 1, name: "Item name 1", price3: 1001, price4: 1001, price5: 1001, price6: 1001 } ]
        if(Utils.isEmpty(this.state.datas) || !Array.isArray(this.state.datas) || Utils.isEmpty(this.state.datas[0])) return "";
        // console.log(this.state.isCols);
        // const length = this.state.columns.length;
        let trs = this.state.datas.map((o, index) => {
            if(Utils.inJson(o, 'items')) {
                const items = o['items'];
                items.map((k) => {
                    const k1 = Object.keys(k)[0];
                    o[k1] = k[k1];
                });
                delete o['items'];
            }
            // let keys = Object.keys(o);
            let keys = this.state.isCols;
            let tds = [];
            for(let i=0; i<keys.length; i++) {
                const columns = this.state.columns.filter(function(x) { return (x.field === keys[i] && x.search === true) })[0];
                const style = ('style' in columns)?columns.style:'';
                if(!Utils.isEmpty(columns) && Utils.inJson(o, keys[i])) {
                    let data = o[keys[i]];
                    if(keys[i].endsWith('_image') || keys[i].endsWith('_logo')) {
                        data = (<img src={ o[keys[i]] } />);
                    } else if(keys[i].startsWith('password_') || keys[i].endsWith('_password')) {
                        data = '******';
                    }
                    if(Utils.inJson(columns, 'type') && [ 'date', 'datetime' ].includes(columns.type)) {
                        if(!Utils.isEmpty(data) && DateUtils.isDateType(data))
                            // console.log(data)
                            if(columns.type === 'datetime') {
                                data = DateUtils.isStringToDateTime(data, DateUtils.SYMBOL.SLASH, this.state.language);
                            } else {
                                data = DateUtils.isStringToDate(data, DateUtils.SYMBOL.SLASH, this.state.language);
                            }
                    }
    
                    if(!Utils.isEmpty(style)) {
                        tds.push(<td key={ i } idx={ i } style={ style }>{ data }</td>);
                    } else {
                        tds.push(<td key={ i } idx={ i }>{ data }</td>);
                    }
                } else {
                    if(!Utils.isEmpty(style)) {
                        tds.push(<td key={ i } idx={ i } style={ style }>{ '' }</td>);
                    } else {
                        tds.push(<td key={ i } idx={ i }>{ '' }</td>);
                    }
                }
            }
            return(
                <tr
                    key={ index }
                    idx={ index }
                    id={ o[this.state.page['page_id_seq']] }
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
                <table className='table table-sm table-striped table-bordered table-hover'>
                    <tbody>{ trs }</tbody>
                </table>
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
        let tBody = document.getElementById(OBJECT.DIV_BODY_ID + this.props.id);
        if(Utils.isEmpty(tBody)) return;
        tBody = tBody.childNodes[0];
        if(Utils.isEmpty(tBody) || Utils.isEmpty(tBody.childNodes[0])) return;
        if(tBody.childNodes[0].tagName === HTML_TAG.TBODY) tBody = tBody.childNodes[0];
        return tBody;
    }

    _getTrSelected() {
        let ids = [];
        const tBody = this._getTBody();
        if(Utils.isEmpty(tBody)) return;
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

    // _onViewCalendar(e) {
    //     this._removeCalendar();
    //     const obj = e.target.parentElement;
    //     const type = obj.getAttribute('type');
    //     if(Utils.isEmpty(obj)
    //         || obj.tagName !== HTML_TAG.TH
    //         || (type !== TYPE.DATETIME && type !== TYPE.DATE)) return;
    //     const datetime = (type === TYPE.DATETIME)?true:false;
    //     const cBox = document.createElement(HTML_TAG.DIV);
    //     cBox.id = OBJECT.DIV_CALENDAR_BOX_VIEW_ID;
    //     obj.appendChild(cBox);
    //     ReactDOM.render(<Calendar
    //         objId={ obj.id }
    //         fromTo={ true }
    //         range={ true }
    //         datetime={ datetime }
    //         language={ this.state.language }
    //         onChangeCalendar={ this._onChangeCalendar.bind(this) } />
    //         ,document.getElementById(cBox.id));
    //     const cal = document.getElementById(OBJECT.DIV_CALENDAR_BOX_ID + obj.id);
    //     const pos = obj.getBoundingClientRect();
    //     if(Utils.isEmpty(pos)) return;
    //     const boxX = pos.x + cal.offsetWidth;
    //     if(boxX > window.innerWidth) {
    //         cal.style.left = (window.innerWidth - (cal.offsetWidth + 5)) + 'px';
    //     } else if(pos.x < 0) {
    //         cal.style.left = '0px';
    //     } else {
    //         cal.style.left = pos.x + 'px';
    //     }
    // }

    _onChangeCalendar(key, value) {
        console.log(key);
        console.log(value);
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
        // console.log(obj);
        if(obj.tagName !== HTML_TAG.TH) {
            // obj = obj.parentElement;
            if(obj.tagName === HTML_TAG.DIV) {
                if(obj.className.startsWith('ant-picker')) {
                    obj = obj.parentElement.parentElement.parentElement.parentElement;
                } else {
                    obj = obj.parentElement;
                }
            } else if(obj.tagName === HTML_TAG.INPUT
                    && obj.getAttribute('type') === 'text') {
                obj = obj.parentElement.parentElement;
            } else if(obj.tagName === HTML_TAG.INPUT
                    && !Utils.isEmpty(obj.parentElement)
                    && obj.parentElement.className.startsWith('ant-picker')) {
                obj = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            } else {
                obj = obj.parentElement;
            }
        }
        // console.log(obj);
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.TH || Utils.isEmpty(obj.id)) return;
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
        this.state.sort.style = { left : pos.x, zIndex: 2, display: 'inline-flex', width: obj.style.width };
        // this.state.sort.style = { marginTop: '-28px', left : pos.x, zIndex: 2, display: 'inline-flex', width: obj.style.width };
        // this.state.sort.style = { marginTop: '-28px', left : (left - 35), zIndex: 2, display: 'inline-flex', width: obj.style.width };
        // this.state.sort.style = { marginTop: '.4em', left : (left + 5) };
        this.state.sort.show = true;
        this.forceUpdate();
    }

    _onThMouseOut(e) {
        let obj = e.target;
        if(Utils.isEmpty(obj)) return;
        if(obj.tagName !== HTML_TAG.SELECT) obj = Html.getButton(e);
        // console.log(obj);
        if(Utils.isEmpty(obj)) return;
        if((obj.tagName === HTML_TAG.BUTTON && obj.className.indexOf('btn-hidden') !== -1)
            || obj.tagName === HTML_TAG.SELECT.toUpperCase()) {
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
        const codition = this.state.page.columns.filter(function(x){ return x.field === key })[0];
        if(!Utils.isEmpty(codition) && Utils.inJson(codition, OPTIONS_KEY.OPTIONS_SEARCH))
            delete codition[OPTIONS_KEY.OPTIONS_SEARCH];
    }

    _onSortButtonClick() {
        if(Utils.isEmpty(this.state.sort)
            || Utils.isEmpty(this.state.sort.obj)
            || Utils.isEmpty(this.state.datas)
            || !Array.isArray(this.state.datas)) return;
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

    _onCloseASortButtons(e) {
        this.state.sort.show = false;
        // if(!Utils.isEmpty(this.state.sort.obj)) {
        //     this.state.sort.obj.removeEventListener(MOUSE.MOUSEOUT, this._onThMouseOut.bind(this), false);
        // }
        this.forceUpdate()
    }

    _onSortButtons() {
        let obj = null;
        let codition = null;
        let ftype = null;
        if(!Utils.isEmpty(this.state.sort.obj) && Utils.inJson(this.state.sort.obj, 'id')) {
            const key = this.state.sort.obj.id;
            const tr = document.getElementById(key);
            if(!Utils.isEmpty(tr)) {
                obj = tr.getElementsByTagName(HTML_TAG.INPUT)[0];
            }
            ftype = key.substr(0, key.indexOf('_'))
            codition = this.state.page.columns.filter(function(x){ return x.field === key })[0];
        }

        const searchs = [];
        if(!Utils.isEmpty(obj) && obj.getAttribute('type') !== TYPE.CHECKBOX) {
            searchs.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
            for (let i=0; i<SEARCH_OPTIONS.length; i++) {
                if([ TYPE.DATETIME, TYPE.DATE, TYPE.TIME, TYPE.NUMBER ].includes(ftype) && i > 5) continue;
                if(![ TYPE.DATETIME, TYPE.DATE, TYPE.TIME, TYPE.NUMBER ].includes(ftype) && i > 1 && i < 6) continue;
                const label = (Utils.inJson(SEARCH_OPTIONS[i]['label'], this.state.language))
                    ?SEARCH_OPTIONS[i]['label'][this.state.language]
                    :SEARCH_OPTIONS[i]['label']['ja'];
                searchs.push( <option key={ i } value={ SEARCH_OPTIONS[i].value }>{ label }</option> );
            }
        }

        const value = (!Utils.isEmpty(codition) && Utils.inJson(codition, OPTIONS_KEY.OPTIONS_SEARCH))
            ?codition[OPTIONS_KEY.OPTIONS_SEARCH][OPTIONS_SEARCH.CONDITION]:'';
        const disabled = (!Array.isArray(this.state.datas) || this.state.datas.length <= 0);
        return(
            <Alert
                show={ this.state.sort.show }
                variant={ VARIANT_TYPES.LIGHT }
                style={ this.state.sort.style }
                className={ 'div-customize-actions div-customize-actions-child' }>

                {(() => {
                    if(!Utils.isEmpty(obj) && obj.getAttribute('type') !== TYPE.CHECKBOX) {
                        return (
                            <FormControl
                                as={ HTML_TAG.SELECT }
                                value={ value }
                                onMouseOver={ this._onThMouseOut.bind(this) }
                                onMouseLeave={ this._onCloseASortButtons.bind(this) }
                                onChange={ this._onSearchSelectChange.bind(this) }>
                                { searchs }
                            </FormControl>
                        );
                    }
                })()}

                <Button
                    disabled={ disabled }
                    type={ HTML_TAG.BUTTON }
                    className={ 'btn-hidden' }
                    onMouseOver={ this._onThMouseOut.bind(this) }
                    onMouseLeave={ this._onCloseASortButtons.bind(this) }
                    onClick={ this._onSortButtonClick.bind(this) }
                    variant={ VARIANT_TYPES.SECONDARY }>
                    <FaSort />
                </Button>    

                {(() => {
                    if(!Utils.isEmpty(obj)
                        && obj.getAttribute('type') !== TYPE.CHECKBOX
                        && ![ TYPE.DATETIME, TYPE.DATE, TYPE.TIME ].includes(ftype)) {
                        return (
                            <Button
                                type={ HTML_TAG.BUTTON }
                                className={ 'btn-hidden' }
                                onMouseOver={ this._onThMouseOut.bind(this) }
                                onMouseLeave={ this._onCloseASortButtons.bind(this) }
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

    _onSearchSelectChange(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj)) return;
        const key = this.state.sort.obj.id;
        if(Utils.isEmpty(key)) return;
        const input = this.state.sort.obj.getElementsByTagName(HTML_TAG.INPUT)[0];
        if(Utils.isEmpty(input)) return;
        let value = StringUtil.format(obj.value, key.substr(key.indexOf('_')+1));
        value = value.replace('${0}', input.value);
        this.state.page.columns.map((o) => {
            if(o.field === key) {
                if(Utils.isEmpty(obj.value)) {
                    if(Utils.inJson(o, OPTIONS_KEY.OPTIONS_SEARCH)) {
                        delete o[OPTIONS_KEY.OPTIONS_SEARCH];
                    }
                } else {
                    o[OPTIONS_KEY.OPTIONS_SEARCH] = {};
                    o[OPTIONS_KEY.OPTIONS_SEARCH][OPTIONS_SEARCH.CONDITION] = obj.value;
                    o[OPTIONS_KEY.OPTIONS_SEARCH][OPTIONS_SEARCH.VALUE] = value;
                }
            }
        });
        console.log(this.state.page.columns);
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Utils.inJson(nextProps, 'page')) {
            if(this.state.page != nextProps.page) {
                console.log(nextProps.page);
                this.state.page = nextProps.page;
                this.state.language = nextProps.page;
                this.state.cId = nextProps.cId;
                this.state.uId = nextProps.uId;
                this._onGetData();    
            }
        } else if(Utils.inJson(nextProps, 'schema')
            && Utils.inJson(nextProps['schema'], 'obj')
            && Utils.inJson(nextProps['schema']['obj'], 'page')) {
            if(this.state.page != nextProps.schema.obj.page) {
                console.log(nextProps.schema);
                this.state.page = nextProps.schema.obj.page;
                this.state.cId = nextProps.schema.obj.cId;
                this.state.uId = nextProps.schema.obj.uId;
                this.state.language = nextProps.schema.language;
                this._onGetData();
            }
        }
    }

    UNSAFE_componentWillMount() {
        if(Utils.inJson(this.props, 'page')) {
            this.state.page = this.props.page;
            this.state.language = this.props.page;
            this.state.cId = this.props.cId;
            this.state.uId = this.props.uId;
        } else if(Utils.inJson(this.props, 'schema')
            && Utils.inJson(this.props['schema'], 'obj')
            && Utils.inJson(this.props['schema']['obj'], 'page')) {
            this.state.page = this.props.schema.obj.page;
            this.state.cId = this.props.schema.obj.cId;
            this.state.uId = this.props.schema.obj.uId;
            this.state.language = this.props.schema.language;
        }
        this._onGetData(); 
    }

    UNSAFE_componentWillUnmount() {
        this.props.cancel();
    }

    _onGetData() {
        if(!Utils.inJson(this.state, 'page')
            || !Utils.inJson(this.state['page'], 'form')
            || !Array.isArray(this.state['page']['form'])) return;
        this.state.columns = this.state['page']['columns'];
        const columns = [];
        this.state['page']['form'].map((f) => {
            const objs = f['object'];
            if(Array.isArray(objs)) {
                objs.map((o) => {
                    Object.keys(o['schema']['properties']).map((key) => {
                        columns.push(key);
                    });        
                })
            } else {
                Object.keys(objs['schema']['properties']).map((key) => {
                    columns.push(key);
                });    
            }
        });
        const page = {
            page_id: this.state['page']['page_id'],
            page_key: this.state['page']['page_key'],
            page_id_seq: this.state['page']['page_id_seq'],
            columns: columns,
            reference: []
        };
        const options = { cId: this.state.cId, uId: this.state.uId, page: page };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'datas', options);
        f.then(data => {
            if(!Utils.isEmpty(data)) {
                this.state.datas = data;
                this.state.total = 500;
            } else {
                this.state.datas = [];
                this.state.total = 0;
            }
            this.forceUpdate();
        }).catch(err => {
          console.log(err);
        });
        this.forceUpdate();
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
                { <CMenu
                    ref={ this.divContextMenuRef }
                    objs={ this.state.actions }
                    onClick={ this.props.onClickAction }
                    newWindow={ (Utils.inJson(this.state.page, 'page_open')?this.state.page.page_open:0) } /> }
                { this._getHeader() }
                { this._getBody() }
            </div>
        )
    };
};