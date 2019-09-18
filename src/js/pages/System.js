import React, { Component as C } from 'react';
import Tree from 'react-animated-tree';

import { SYSTEM } from '../../js/utils/Types';
import { HTML_TAG } from '../utils/HtmlTypes';
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
            ,nodes: [
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
        console.log(e.target);
    }

    _onClick(e) {
        console.log(e.target);
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
        console.log(div);
        if(Utils.isEmpty(div.childNodes) || div.childNodes.length <= 0) return;
        const lDiv = div.childNodes[div.childNodes.length-1];
        console.log(lDiv.childNodes);
        if(Utils.isEmpty(lDiv.childNodes) || lDiv.childNodes.length <= 0) return;
        const divs = Array.from(lDiv.childNodes);
        divs.map((d) => {
            this._setMouseUpDown(d);
        });
    }

    render() {
        return (
            <div id={ SYSTEM.IS_DIV_TREE_VIEW_BOX }>
                {/* <Tree content="main" type="ITEM" open> */}
                {/* <Tree content="main" type="ITEM" canHide open style={treeStyles}> */}
                    {/* <Tree content="hello" type={<span style={typeStyles}>🙀</span>} canHide /> */}
                    <Tree content="hello" type={<span>🙀</span>} />
                    <Tree content="subtree with children">
                    <Tree content="hello" />
                    <Tree content="sub-subtree with children" type={<input type="checkbox"></input>}>
                        <Tree content="child 1"/>
                        <Tree content="child 2"/>
                        <Tree content="child 3"/>
                    </Tree>
                    <Tree content="hello" />
                    </Tree>
                    <Tree content="hello" />
                    <Tree content="hello" />
                {/* </Tree> */}
            </div>
        )
    };
};

export default System;
