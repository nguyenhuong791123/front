import React, { Component as C } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Utils from './Utils';

class CTabs extends C {
    constructor(props) {
        super(props);

        this._onSelect = this._onSelect.bind(this);
        this.state = {
            isActive: this.props.isActive 
            ,objs: this.props.objs };
    };

    _onSelect(tabIdx) {
        console.log(tabIdx);
        if(!Utils.isEmpty(this.props.onSelect)) this.props.onSelect(tabIdx);
    }

    _getTabs(items) {
        if(Utils.isEmpty(items) || items.length === 0) return "";
        return items.map((o, index) => {
            return (
                <Tab key={ index } eventKey={ index } title={ o.label }></Tab>
            );
        });
    }

    render() {
        return (
            <Tabs defaultActiveKey={ this.state.isActive } onSelect={ this._onSelect.bind(this) }>
                { this._getTabs(this.state.objs) }
            </Tabs>
        )
    };
};

export default CTabs;
