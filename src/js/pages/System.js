import React, { Component as C } from 'react';

import Actions from '../utils/Actions';
import { SYSTEM } from '../utils/Types';
import { HTML_TAG, ATTR } from '../utils/HtmlTypes';
import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';
import '../../css/TreeList.css';

class System extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this._onClickSubmit = this._onClickSubmit.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,actions: { return: false, create: true }
            ,checked: []
            ,expanded: []
            ,objs: [
                {
                    value: 'mars',
                    label: 'Mars',
                    children: [
                        {
                            value: 'phobos1',
                            label: 'Phobos1',
                            children: [
                                { value: 'phobos2', label: 'Phobos2' },
                                { value: 'deimos2', label: 'Deimos2' },
                            ]
                        },
                        { value: 'deimos', label: 'Deimos' },
                    ],
                }
                ,{
                    value: 'mars1',
                    label: 'Mars1',
                    children: [
                        { value: 'phobos', label: 'Phobos1' },
                        { value: 'deimos', label: 'Deimos1' },
                    ],
                }
            ]
        };
    };

    _onClick(e) {
        var obj = e.target;
        if(obj.tagName !== HTML_TAG.DIV) return;
        var className = (Html.hasAttribute(obj, ATTR.CLASS))?obj.className:'';
        const selected = (className.indexOf('selected') === -1);
        this._addSelected(obj, selected);
        this._addChildSelected(obj, selected);
        this._addParentSelected(obj, selected);
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
                    selected = (!Utils.isEmpty(li.childNodes[0]) && Html.hasAttribute(li.childNodes[0], ATTR.CLASS) && li.childNodes[0].className.indexOf('selected') !== -1);
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
            return (
                <li key={ idx } id={ obj.value }>
                    <div key={ idx } onClick={ this._onClick.bind(this) }>{ obj.label }</div>
                </li>);
        } else {
            var childs = [];
            obj.children.map((o, index) => {
                childs.push(this._geList(o, index));
            });
            return(
                <li
                    key={ idx }
                    id={ obj.value }
                    className='parent'>
                    <div key={ 'div_' + idx } onClick={ this._onClick.bind(this) }>{ obj.label }</div>
                    <ul key={ 'ul_' + idx }>{ childs }</ul>
                </li>
                );
        }
    }

    render() {
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
