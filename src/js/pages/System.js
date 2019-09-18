import React, { Component as C } from 'react';
import Tree from 'react-animated-tree';

class System extends C {
    constructor(props) {
        super(props);

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


    render() {
        return (
            <div>
                <Tree content="main" type="ITEM" open>
                {/* <Tree content="main" type="ITEM" canHide open style={treeStyles}> */}
                    {/* <Tree content="hello" type={<span style={typeStyles}>🙀</span>} canHide /> */}
                    <Tree content="hello" type={<span>🙀</span>} />
                    <Tree content="subtree with children">
                    <Tree content="hello" />
                    <Tree content="sub-subtree with children">
                        <Tree content="child 1"/>
                        <Tree content="child 2"/>
                        <Tree content="child 3"/>
                    </Tree>
                    <Tree content="hello" />
                    </Tree>
                    <Tree content="hello" />
                    <Tree content="hello" />
                </Tree>
            </div>
        )
    };
};

export default System;
