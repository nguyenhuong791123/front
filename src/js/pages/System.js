import React, { Component as C } from 'react';


class System extends C {
    constructor(props) {
        super(props);

        this.state = {
            isUser: this.props.isUser
        };
    };


    render() {
        return (
            <div>
            </div>
        )
    };
};

export default System;
