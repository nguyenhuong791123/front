
import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-bootstrap';
import { FaRegEye } from 'react-icons/fa';

import Calendar from '../Calendar';
import View from '../../pages/View';
import CMenu from '../CMenu';

import Utils from '../Utils';
import { ACTION, HTML_TAG, INPUT_TYPE } from '../Types';
import GetMsg from '../../../msg/Msg';
import "../../../css/Table.css";

export default class Table extends C {
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

        this.state = {
            isUser: this.props.isUser
            ,columns: this.props.columns
            ,datas: this.props.datas
            ,isCols: []
            ,actions: {
                show: false
                ,ids: []
                ,items: [
                  { type: ACTION.EDIT, label: GetMsg(null, this.props.isUser.language, 'bt_edit') }
                  ,{ type: ACTION.DELETE, label: GetMsg(null, this.props.isUser.language, 'bt_delete') }
                  ,{ type: ACTION.DOWNLOAD, label: GetMsg(null, this.props.isUser.language, 'bt_download') }
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
        this._getCalendar(e);
    }

    _onThKeyDown(e) {
        console.log(e);
        console.log(e.target);
        console.log(e.key);
        console.log(e.keyCode);
    }

    _onTrClick(e) {
        var obj = this._getObjTr(e);
        if(Utils.isEmpty(obj)) return;
        const checked = document.getElementById('input_checkbox_all');
        if(!Utils.isEmpty(checked)) checked.checked = false;
        var body =  this._getTBody();
        this._removeTrView(body);
        if(this.state.view) {
            this.state.view = false;
            this._removeTrClass(body);
            obj.setAttribute('class', 'selected');

            const idx =  obj.getAttribute('idx');
            console.log(idx);
            if(Utils.isEmpty(idx) || !Utils.isNumber(idx)) return;
            const rowId = ACTION.VIEW +'_'+ idx;
            const isExists = document.getElementById(rowId);
            if(!Utils.isEmpty(isExists)) isExists.remove();
            var row = body.insertRow((parseInt(idx)+1));
            row.id = rowId;
            const cell = document.createElement(HTML_TAG.TD);
            cell.colSpan = (this.state.columns.length+1);
            cell.id = rowId + '_' + HTML_TAG.TD;
            row.appendChild(cell);
            ReactDOM.render(<View id={ obj.id } isUser={ this.state.isUser } />, document.getElementById(rowId + '_' + HTML_TAG.TD));
        } else {
            if(Utils.isEmpty(obj.className)
                || obj.className.indexOf('selected') === -1) {
                obj.setAttribute('class', 'selected');
            } else {
                obj.removeAttribute('class');
            }
        }
    }

    _onDblClick(e) {
        console.log(e);
        var obj = this._getObjTr(e);
        if(Utils.isEmpty(obj)) return;
        const body = this._getTBody();
        this._removeTrClass(body);
        obj.setAttribute('class', 'selected');
    }

    _onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        const ids = this._getTrSelected();
        if(Utils.isEmpty(ids) || ids.length <= 0) return;
        this.state.actions.show = true;
        this.state.actions.ids = ids;
        this.state.actions.top = e.pageY;
        this.state.actions.left = e.pageX;
        this.forceUpdate();
    }

    _onCheckBoxClick(e) {
        if(Utils.isEmpty(e.target) || e.target.type !== HTML_TAG.CHECKBOX) return;
        const isChecked = e.target.checked;
        var thead = e.target.parentElement.parentElement;
        if(thead.tagName !== HTML_TAG.TR) return;
        this.state.view = false;
        const body = this._getTBody();
        this._removeTrView(body);
        var node = body.childNodes;
        for(var i=0; i<node.length; i++) {
            if(isChecked) {
                node[i].setAttribute('class', 'selected');
            } else {
                node[i].removeAttribute('class');
            }
        };
    }

    _onScroll(e) {
        const divHeader = document.getElementById('div_table_header');
        var scroll = e.target.scrollLeft;
        if(Utils.isEmpty(scroll)) return;
        divHeader.style.marginLeft = -scroll + 'px';
    }

    _getHeader() {
        // [ { field: 'name', text: '', sort: true, filter: true, style: { width: '100px', minWidth: '100px', maxWidth: '100px' } } ]
        if(Utils.isEmpty(this.state.columns)) return "";
        this.state.isCols = [];
        var ths = this.state.columns.map((o, index) => {
            this.state.isCols.push(o.field);
            const key = 'label_' + o.field;
            var style = ('style' in o)?o.style:'';
            var type = ('type' in o)?o.type:'';
            if(Utils.isEmpty(style)) style = { width: 100 };
            const label = GetMsg(this.state.isUser.action, this.state.isUser.language, key);
            var isLabel = <label>{ label }</label>;
            if(('filter' in o) && o.filter) {
                isLabel = (<Form.Control type="text" placeholder={ label } onFocus={ this._onFocus.bind(this) } onKeyDown={ this._onThKeyDown.bind(this) } />);
            }
            if(o.sort) {
                if(!Utils.isEmpty(style)) {
                    return(<th key={ index } id={ o.field } type={ type } style={ style } onClick={ this._onSort.bind(this) }>{ isLabel }</th>);
                } else {
                    return(<th key={ index } id={ o.field } type={ type } style={ style } onClick={ this._onSort.bind(this) }>{ isLabel }</th>);
                }
            } else {
                if(!Utils.isEmpty(style)) {
                    return(<th key={ index } id={ o.field } type={ type } style={ style }>{ isLabel }</th>);
                } else {
                    return(<th key={ index } id={ o.field } type={ type } style={ style }>{ isLabel }</th>);
                }
            }
        });

        return(
            <div id="div_table_header">
               <table className='table table-sm table-bordered'>
                <thead>
                    <tr>
                        <th>
                            <input id='input_checkbox_all' type={ HTML_TAG.CHECKBOX } onClick={ this._onCheckBoxClick.bind(this) } />
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
        var trs = this.state.datas.map((o, index) => {
            var keys = Object.keys(o);
            var tds = [];
            for(var i=0; i<keys.length; i++) {
                if(!Utils.inArray(this.state.isCols, keys[i])) continue;
                if(index === 0) {
                    var style = ('style' in this.state.columns[i])?this.state.columns[i].style:'';
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
            <div id="div_table_body" onScroll={ this._onScroll.bind(this) }>
                <table className='table table-sm table-striped table-bordered table-hover'><tbody>{ trs }</tbody></table>
            </div>
        );
    }

    _getObjTr(e) {
        var obj = e.target;
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
        var tBody = document.getElementById('div_table_body').childNodes[0];
        if(Utils.isEmpty(tBody) || Utils.isEmpty(tBody.childNodes[0])) return;
        if(tBody.childNodes[0].tagName === HTML_TAG.TBODY) tBody = tBody.childNodes[0];
        return tBody;
    }

    _getTrSelected() {
        var ids = [];
        const tBody = this._getTBody();
        for(var i=0; i<tBody.childNodes.length; i++) {
            var trId =  tBody.childNodes[i].getAttribute('id');
            var className = tBody.childNodes[i].className;
            if(className !== 'selected'
                || Utils.isEmpty(trId)
                || !Utils.isNumber(trId)) continue;
                ids.push(trId);
        }
        return ids;
    }

    _removeTrView(body) {
        const nodes = body.childNodes;
        for(var i=0; i<nodes.length; i++) {
            if(nodes[i].id.indexOf(ACTION.VIEW +'_') === -1) continue;
            nodes[i].remove();
        }
    }

    _removeTrClass(body) {
        const nodes = body.childNodes;
        for(var i=0; i<nodes.length; i++) {
            nodes[i].removeAttribute('class');
        }
    }

    _getCalendar(e) {
        this._removeCalendar();
        const obj = e.target.parentElement;
        const type = obj.getAttribute('type');
        if(Utils.isEmpty(obj)
            || obj.tagName !== HTML_TAG.TH
            || (type !== INPUT_TYPE.DATETIME && type !== INPUT_TYPE.DATE)) return;
        const datetime = (type === INPUT_TYPE.DATETIME)?true:false;
        const cBox = document.createElement(HTML_TAG.DIV);
        cBox.id = 'div_calendar_box_view';
        obj.appendChild(cBox);
        console.log(this.state.isUser);
        ReactDOM.render(<Calendar
            show={ true }
            objId={ obj.id }
            fromTo={ true }
            range={ true }
            datetime={ datetime }
            language={ this.state.isUser.language }
            onChangeCalendar={ this._onChangeCalendar.bind(this) } />
            ,document.getElementById(cBox.id));
        const cal = document.getElementById('div_calendar_box');
        const boxX = cal.offsetLeft + cal.offsetWidth;
        if(boxX > window.innerWidth) {
            cal.style.left = (window.innerWidth - (cal.offsetWidth + 5)) + 'px';
        }
    }

    _onChangeCalendar(start, end) {
        console.log(start);
        console.log(end);
        this._removeCalendar();
    }

    _removeCalendar() {
        const cal = document.getElementById('div_calendar_box_view');
        if(Utils.isEmpty(cal)) return;
        cal.remove();
    }

    componentDidMount() {
        window.onresize = function(event) {
            const divHeader = document.getElementById('div_table_header');
            const divBody = document.getElementById('div_table_body');
            if(Utils.isEmpty(divHeader) || Utils.isEmpty(divBody)) return;
            divBody.style.height = (window.innerHeight - (110 + divHeader.offsetHeight)) + 'px';
        };
        window.onresize();  
    }

    // UNSAFE_componentWillReceiveProps(props) {
    //     console.log('TabMenu componentWillReceiveProps');
    //     this.state.isUser = props.isUser;
    // }

    render() {
        return (
            <div className='div-table'>
                { <CMenu ref={ this.divContextMenuRef } objs={ this.state.actions }/> }
                { this._getHeader() }
                { this._getBody() }
            </div>
        )
    };
};