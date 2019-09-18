import React, { Component as C } from 'react';
import Tree from 'react-animated-tree';

import { SYSTEM } from '../../js/utils/Types';
import { HTML_TAG, ATTR, MOUSE } from '../utils/HtmlTypes';
import Html from '../../js/utils/HtmlUtils';
import Utils from '../../js/utils/Utils';
import '../../css/TreeList.css';

class System extends C {
    constructor(props) {
        super(props);

        this._onMouseOver = this._onMouseOver.bind(this);
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
                            value: 'phobos',
                            label: 'Phobos',
                            children: {
                                value: 'mars1',
                                label: 'Mars1',
                                children: [
                                    { value: 'phobos', label: 'Phobos1' },
                                    { value: 'deimos', label: 'Deimos1' },
                                ],
                            }
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

    _onMouseOver(e) {
        // console.log(e.target);
    }

    _onClick(e) {
        var obj = e.target;
        if(obj.tagName === HTML_TAG.SVG || obj.tagName === HTML_TAG.G || obj.tagName === HTML_TAG.PATH) return;
        e.preventDefault();
        e.stopPropagation();
        if(obj.tagName === HTML_TAG.SPAN) {
            obj = e.target.parentElement;
        }
        // console.log(obj.className);
        var className = (Html.hasAttribute(obj, ATTR.CLASS))?obj.className:'';
        const selected = (className.indexOf('selected') === -1);
        this._addSelected(obj, selected);
    }

    componentDidMount() {
        const div = document.getElementById(SYSTEM.IS_DIV_TREE_VIEW_BOX);
        if(Utils.isEmpty(div) || div.childNodes.length <= 0) return;
        const divs = Array.from(div.childNodes);
        divs.map((d) => {
            this._setMouseUpDown(d);
        });
    }

    _setMouseUpDown(div) {
        if(Utils.isEmpty(div) || div.tagName !== HTML_TAG.DIV) return;
        console.log(Html.hasAttribute(div, MOUSE.ONCLICK));
        div.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);
        div.addEventListener(MOUSE.CLICK, this._onClick.bind(this), false);
        if(Utils.isEmpty(div.childNodes) || div.childNodes.length <= 0) return;
        const lDiv = div.childNodes[div.childNodes.length-1];
        if(Utils.isEmpty(lDiv.childNodes) || lDiv.childNodes.length <= 0) return;
        const parentClass = div.className.replace('treeview', 'parent-treeview');
        div.className = parentClass;
        const divs = Array.from(lDiv.childNodes);
        divs.map((d) => {
            this._setMouseUpDown(d);
        });
    }

    _addSelected(div, selected) {
        console.log(selected);
        const className = div.className;
        if(selected) {
            if(Utils.isEmpty(className) || className.indexOf('selected') === -1) {
                div.className = className + ' selected';
            }
        } else {
            div.className = className.replace(' selected', '');
        }
        if(Utils.isEmpty(div.childNodes) || div.childNodes.length <= 0) return;
        const lDiv = div.childNodes[div.childNodes.length-1];
        if(Utils.isEmpty(lDiv.childNodes) || lDiv.childNodes.length <= 0) return;
        const divs = Array.from(lDiv.childNodes);
        divs.map((d) => {
            this._addSelected(d, selected);
        });
    }

    _getAllList() {
        if(Utils.isEmpty(this.state.objs) || this.state.objs.length <= 0) return "";
        return this.state.objs.map((obj, index) => {
            return this._geList(obj, index);
        });
    }

    _geList(obj, idx) {
        if(!Utils.inJson(obj, 'children') || obj.children.length <= 0) {
            return (<Tree key={ idx } page={ obj.value } content={ obj.label }/>);
        } else {
            var childs = [];
            obj.children.map((o, index) => {
                childs.push(<Tree key={ index } page={ o.value } content={ o.label }/>);
            });
            return(<Tree key={ idx } page={ obj.value } content={ obj.label }>{ childs }</Tree>);
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
