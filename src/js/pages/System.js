import React, { Component as C } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

import Actions from '../utils/Actions';
import { SYSTEM, VARIANT_TYPES } from '../utils/Types';
import { HTML_TAG, ATTR } from '../utils/HtmlTypes';
import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';
import '../../css/TreeList.css';

class System extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this._onButtonClick = this._onButtonClick.bind(this);
        this._onCheckBoxClick = this._onCheckBoxClick.bind(this);
        this._onClickSubmit = this._onClickSubmit.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,actions: { return: false, create: true }
            ,checked: []
            ,expanded: []
            ,objs: []
            ,btns: []
        };
    };

    _getObjs() {
        this.state.objs = [
            {
                value: 'mars',
                label: 'Mars',
                children: [
                    {
                        value: 'phobos1',
                        label: 'phobos1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                        children: [
                            {
                                value: 'phobos2',
                                label: 'Phobos2'
                                ,auth: [
                                    {  value: 'search', label: 'Search' }
                                    ,{  value: 'view', label: 'View' }
                                    ,{  value: 'create', label: 'Create' }
                                    ,{  value: 'edit', label: 'Edit' }
                                    ,{  value: 'delete', label: 'Delete' }
                                    ,{  value: 'upload', label: 'Upload' }
                                    ,{  value: 'download', label: 'Download' }
                                ]
                            },
                            {
                                value: 'deimos2',
                                label: 'Deimos2'
                                ,auth: [
                                    {  value: 'search', label: 'Search' }
                                    ,{  value: 'view', label: 'View' }
                                    ,{  value: 'create', label: 'Create' }
                                    ,{  value: 'edit', label: 'Edit' }
                                    ,{  value: 'delete', label: 'Delete' }
                                ]
                            },
                        ]
                    },
                    {
                        value: 'deimos',
                        label: 'Deimos'
                        ,auth: [
                            {  value: 'search', label: 'Search' }
                            ,{  value: 'view', label: 'View' }
                        ]
                    },
                ],
            }
            ,{
                value: 'mars1',
                label: 'Mars1',
                children: [
                    {
                        value: 'phobos',
                        label: 'Phobos1'
                        ,auth: [
                            {  value: 'search', label: 'Search' }
                            ,{  value: 'delete', label: 'Delete' }
                            ,{  value: 'upload', label: 'Upload' }
                            ,{  value: 'download', label: 'Download' }
                        ]
                    },
                    {
                        value: 'deimos',
                        label: 'Deimos1'
                        ,auth: [
                            {  value: 'search', label: 'Search' }
                        ]
                    },
                ],
            }
        ]
    }

    _onClick(e) {
        var obj = e.target;
        if(obj.tagName !== HTML_TAG.DIV) return;
        var className = (Html.hasAttribute(obj, ATTR.CLASS))?obj.className:'';
        const selected = (className.indexOf('selected') === -1);
        this._addSelected(obj, selected);
        this._addChildSelected(obj, selected);
        this._addParentSelected(obj, selected);
    }

    _onButtonClick(e) {
        var obj = e.target;
        console.log(obj);
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.BUTTON) return;
        const className = obj.className;
        const selected = (className.indexOf('selected') === -1);
        this._addButtonSelected(obj, selected);
    }

    _addButtonSelected(obj, selected) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.BUTTON) return;
        const className = obj.className;
        if(className.indexOf(' selected') === -1 && selected)
            obj.className = className + ' selected';
        if(!Utils.isEmpty(className) && className.indexOf(' selected') !== -1 && !selected)
            obj.className = className.replace(' selected', '');
    }

    _onCheckBoxClick(e) {
        var obj = e.target;
        console.log(obj);
        if(Utils.isEmpty(obj)
            || !Html.hasAttribute(obj, ATTR.TYPE)
            || obj.type !== HTML_TAG.CHECKBOX.toLowerCase()) return;
        const div = obj.parentElement;
        if(Utils.isEmpty(div) || div.childNodes.length <=1) return;
        const btns =  Array.from(div.childNodes);
        if(!Utils.isEmpty(this.state['selected'])) obj.checked = this.state['selected'];
        const selected = obj.checked;
        btns.map((bt) => {
            if(bt.tagName === HTML_TAG.BUTTON) {
                this._addButtonSelected(bt, selected);
            }
        });
        const ul = div.parentElement.childNodes[div.parentElement.childNodes.length-1];
        if(Utils.isEmpty(ul) || ul.tagName !== HTML_TAG.UL) return;
        this.state['selected'] = selected;
        const ulis = Array.from(ul.childNodes);
        ulis.map((li) => {
            this._onCheckBoxAutoClick(li);
        });
        this.state['selected'] = null;
    }

    _onCheckBoxAutoClick(obj) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const div = obj.childNodes[obj.childNodes.length-1];
        if(div.tagName === HTML_TAG.UL) {
            const ulis = Array.from(div.childNodes);
            ulis.map((li) => {
                this._onCheckBoxAutoClick(li);
            });
        }
        if(div.tagName === HTML_TAG.DIV && div.className.indexOf('div-btn-group') !== -1) {
            div.childNodes[0].click();
        }
    }

    _onClickSubmit() {
        const div = document.getElementById(SYSTEM.IS_DIV_TREE_VIEW_BOX);
        if(Utils.isEmpty(div.childNodes[0]) || div.childNodes[0].childNodes.length <= 0) return;
        const ulis = Array.from(div.childNodes[0].childNodes);
        console.log(ulis);
        ulis.map((obj) => {
            this._getSelected(obj);
        });
    }

    _getSelected(obj) {
        if(Utils.isEmpty(obj)
            || obj.tagName !== HTML_TAG.LI
            || Utils.isEmpty(obj.childNodes[0])) return;
        const className = obj.childNodes[0].className;
        if(Utils.isEmpty(className) || className.indexOf('selected') === -1) return;
        // console.log('_getSelected');
        const ul = obj.childNodes[obj.childNodes.length-1];
        if((obj.className.indexOf('parent') === -1) || ul.tagName !== HTML_TAG.UL) {
            console.log(obj);
        } else {
            const ulis = Array.from(ul.childNodes);
            ulis.map((li) => {
                this._getSelected(li);
            });    
        }
}

    _addSelected(obj, selected) {
        if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.LI) obj = obj.childNodes[0];
        const className = obj.className;
        if(selected) {
            if(Utils.isEmpty(className) || className.indexOf('selected') === -1) {
                obj.className = className + 'selected';
            }
        } else {
            obj.className = className.replace('selected', '');
        }
    }

    _addChildSelected(obj, selected) {
        if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.LI) obj = obj.childNodes[0];
        this._addSelected(obj, selected);
        const p = obj.parentElement;
        const pUl = p.childNodes[p.childNodes.length-1];
        if(Utils.isEmpty(pUl) || pUl.tagName !== HTML_TAG.UL) return;
        const ulis = Array.from(pUl.childNodes);
        ulis.map((li) => {
            this._addChildSelected(li, selected);
        });
    }

    _addParentSelected(obj, selected) {
        if(Utils.isEmpty(obj) || (obj.tagName === HTML_TAG.DIV && obj.id === SYSTEM.IS_DIV_TREE_VIEW_BOX)) return;
        const p = obj.parentElement.parentElement;
        if(Utils.isEmpty(p) || p.childNodes.length <= 0 || p.tagName !== HTML_TAG.UL) return;
        const ulis = Array.from(p.childNodes);
        if(!selected) {
            ulis.map((li) => {
                if(!selected)
                    selected = (!Utils.isEmpty(li.childNodes[0])
                                && Html.hasAttribute(li.childNodes[0], ATTR.CLASS)
                                && li.childNodes[0].className.indexOf('selected') !== -1);
            });    
        }
        const pp = p.parentElement;
        if(Utils.isEmpty(pp) || (pp.tagName === HTML_TAG.DIV && pp.id === SYSTEM.IS_DIV_TREE_VIEW_BOX)) return;
        this._addSelected(pp.childNodes[0], selected);
        this._addParentSelected(pp.childNodes[0], selected);
    }

    _getAllList() {
        if(Utils.isEmpty(this.state.objs) || this.state.objs.length <= 0) return "";
        var childs = [];
        this.state.objs.map((obj, index) => {
            childs.push(this._geList(obj, index));
        });
        return(<ul>{ childs }</ul>);
    }

    _geList(obj, idx) {
        if(!Utils.inJson(obj, 'children') || obj.children.length <= 0) {
            var div = (<div key={ idx } title={ obj.label }>{ obj.label }</div>);
            if(this.state.isUser.uLid === SYSTEM.IS_ADMIN)
                div = (<div key={ idx } onClick={ this._onClick.bind(this) } title={ obj.label }>{ obj.label }</div>);
            const auths = [];
            if(Utils.inJson(obj, 'auth')) {
                obj.auth.map((a, index) => {
                    auths.push(<Button
                                    key={ index }
                                    id={ a.value }
                                    variant={ VARIANT_TYPES.INFO }
                                    onClick={ this._onButtonClick.bind(this) }
                                    title={ a.label }>
                                    { a.label }
                                </Button>);
                });
            }

            return (
                <li key={ idx } id={ obj.value }>
                    { div }
                    {(() => {
                        if(!Utils.isEmpty(auths) && auths.length > 0) {
                            return (
                                <ButtonGroup className='div-btn-group'>
                                    <input type={ HTML_TAG.CHECKBOX } onClick={ this._onCheckBoxClick.bind(this) } />
                                    { auths }
                                </ButtonGroup>
                            );
                        }
                    })()}
                </li>);
        } else {
            var childs = [];
            obj.children.map((o, index) => {
                childs.push(this._geList(o, index));
            });
            var div = (<div key={ 'div_' + idx } title={ obj.label }>{ obj.label }</div>);
            if(this.state.isUser.uLid === SYSTEM.IS_ADMIN)
                div = (<div key={ 'div_' + idx } onClick={ this._onClick.bind(this) } title={ obj.label }>{ obj.label }</div>);
            return(
                <li
                    key={ idx }
                    id={ obj.value }
                    className='parent'>
                    { div }
                    <ul key={ 'ul_' + idx }>{ childs }</ul>
                </li>
                );
        }
    }

    _getChildButtons(obj, idx) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const ul = obj.childNodes[obj.childNodes.length-1];
        if(Utils.isEmpty(ul) || (ul.tagName !== HTML_TAG.DIV && ul.tagName !== HTML_TAG.UL)) return;
        if(ul.tagName === HTML_TAG.DIV
            && !Utils.isEmpty(ul.className)
            && ul.className.indexOf('div-btn-group') !== -1
            && (Utils.isEmpty(this.state.btns[idx]) || ul.childNodes.length > this.state.btns[idx].length)) {
            this.state.btns[idx] = ul;
        } else {
            const ulis = Array.from(ul.childNodes);
            ulis.map((li) => {
                this._getChildButtons(li, idx);
            });
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.state.isUser = props.isUser;
        this.state.actions = props.actions;
    }

    componentDidMount() {
        const div = document.getElementById(SYSTEM.IS_DIV_TREE_VIEW_BOX);
        if(Utils.isEmpty(div) || Utils.isEmpty(div.childNodes[0]) || div.childNodes[0].childNodes.length <= 0) return;
        const ulis = Array.from(div.childNodes[0].childNodes);
        ulis.map((li, index) => {
            this._getChildButtons(li, index);
        });

        if(!Utils.isEmpty(this.state.btns) && this.state.btns.length > 0) {
            this.state.btns.map((o, index) => {
                const obj = o.cloneNode(true);
                obj.id = 'div_btn_' + index;
                const btns = Array.from(obj.childNodes);
                btns.map((b, index) => {
                    if(index === 0 && b.tagName === HTML_TAG.INPUT) {
                        b.onclick = this._onCheckBoxClick.bind(this);
                    } else {
                        b.className = 'btn btn-warning';
                        b.onclick = this._onButtonClick.bind(this);
                    }
                });
                div.childNodes[0].childNodes[index].childNodes[0].after(obj);
            });
        }
    }

    render() {
        this._getObjs();

        return (
            <div id={ SYSTEM.IS_DIV_TREE_VIEW_BOX } className='div-tree-view-box'>
                { this._getAllList() }

                <Actions
                    isUser={ this.state.isUser }
                    actions={ this.state.actions }
                    onClickSubmit={ this._onClickSubmit.bind(this) } />
            </div>
        )
    };
};

export default System;
