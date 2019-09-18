import React, { Component as C } from 'react';

import { SYSTEM } from '../../js/utils/Types';
import { HTML_TAG, ATTR } from '../utils/HtmlTypes';
import Html from '../../js/utils/HtmlUtils';
import Utils from '../../js/utils/Utils';
import '../../css/TreeList.css';

class System extends C {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);

        this.state = {
            isUser: this.props.isUser
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
        // console.log(selected);
        this._addSelected(obj, selected);
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

        const p = obj.parentElement;
        const pUl = p.childNodes[p.childNodes.length-1];
        if(Utils.isEmpty(pUl) || pUl.tagName !== HTML_TAG.UL) return;
        const ulis = Array.from(pUl.childNodes);
        ulis.map((li) => {
            this._addSelected(li, selected);
        });
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
            </div>
        )
    };
};

export default System;
