import React, { Component as C } from 'react';
import { FormControl } from 'react-bootstrap';

import { HTML_TAG } from '../HtmlTypes';
import { isEmpty } from '../Utils';

export default class TimeBox extends C {
    constructor(props) {
        super(props)

        this._onChangeHour = this._onChangeHour.bind(this);
        this._onChangeMinute = this._onChangeMinute.bind(this);

        this.state = {
            id: this.props.id
            ,hour: new Date().getHours()
            ,minute: new Date().getMinutes()
            ,hours: new Array(24).fill(0).map((n, i) => { return (<option key={n + i} value={n + i}>{n + i}</option>)})
            ,minutes: new Array(60).fill(0).map((n, i) => { return (<option key={n + i} value={n + i}>{n + i}</option>)})
        }
    }

    _onChangeHour(e) {
        this.state.hour = e.target.value;
        const value = this.state.hour + ':' + this.state.minute;
        this.props.onChange(value);
    }

    _onChangeMinute(e) {
        this.state.minute = e.target.value;
        const value = this.state.hour + ':' + this.state.minute;
        this.props.onChange(value);
    }

    UNSAFE_componentWillMount() {
        if(isEmpty(this.props['value'])
            || this.props['value'].indexOf(':') === -1) return;
        var times = this.props['value'].split(':');
        if(!Array.isArray(times) || times.length !== 2) return;
        this.state.hour = times[0];
        this.state.minute = times[1];
    }

    render() {
        console.log(this.props);
        return(
            <div id={ this.state.id } className={ 'div-time-box' }>
                <FormControl
                    className={ 'form-control' }
                    as={ HTML_TAG.SELECT }
                    value={ this.state.hour }
                    onChange={ this._onChangeHour.bind(this) }>
                    { this.state.hours }
                </FormControl>
                <FormControl
                    className={ 'form-control' }
                    as={ HTML_TAG.SELECT }
                    value={ this.state.minute }
                    onChange={ this._onChangeMinute.bind(this) }>
                    { this.state.minutes }
                </FormControl>
            </div>
        );
    }
}