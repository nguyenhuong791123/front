import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import StringUtil from 'util';

import Calendar from '../Calendar';
import DateTime from '../Date';
import { HTML_TAG } from '../HtmlTypes';
import { MSG_TYPE } from '../Types';
import { isEmpty, inJson } from '../Utils';
import Msg from '../../../msg/Msg';

export default  class InputCalendarBox extends C {
    constructor(props) {
        super(props)

        this._onChange = this._onChange.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);

        this.state = {
            id: this.props.id
            ,language: (inJson(props, 'schema') && !isEmpty(props.schema['language']))?props.schema.language:'ja'
        }
    }

    _onRemove() {
        const box = document.getElementById('div_calendar_box_view');
        if(isEmpty(box)) return;
        box.remove();
    }

    _onChangeCalendar(start) {
        this.state.value = start;
        this._onRemove();
        const obj = document.getElementById(this.state.id);
        if(!isEmpty(obj) && obj.tagName === HTML_TAG.INPUT)
            obj.value = this.state.value;
            this.props.onChange(this.state.value);
    }

    _onMouseDown(e) {
        var obj = e.target;
        this._onRemove();
        if(isEmpty(obj) ||isEmpty(obj.parentElement) || obj.tagName !== HTML_TAG.INPUT) return;
        const cBox = document.createElement(HTML_TAG.DIV);
        cBox.id = 'div_calendar_box_view';
        obj.parentElement.appendChild(cBox);
        ReactDOM.render(<Calendar
            objId={ this.state.id }
            // datetime={ this.state.datetime }
            onChangeCalendar={ this._onChangeCalendar.bind(this) }
            {...this.props} />
            ,document.getElementById(cBox.id));
        const cal = document.getElementById('div_calendar_box_' + this.state.id);
        const boxX = cal.offsetLeft + cal.offsetWidth;
        if(boxX > window.innerWidth) {
            cal.style.left = (window.innerWidth - (cal.offsetWidth + 5)) + 'px';
        }
    }

    _onChange(e) {
        this.props.onChange(e.target.value);
    }

    // componentWillMount() {
    //     if(!isEmpty(this.props['value'])) {
    //         const datetime = (inJson(props, 'schema') && !isEmpty(props.schema['datetime']))?props.schema.datetime:false;
    //         this.state.value = DateTime.dateTime(new Date(this.props['value']), this.state.language, datetime, null);
    //     } else {
    //         this.state.value = '';
    //     }
    // }

    componentWillReceiveProps() {
        console.log(this.props);
        if(isEmpty(this.props['value'])) return;
        if(!DateTime.isDate(this.props['value'])) {
            const obj = document.getElementById(this.state.id);
            const div = obj.parentElement;
            var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
            if(isEmpty(l)) return;
            var error = null;
            const label = l.innerHTML;
            const rIdx = label.indexOf('<font');
            error = (rIdx > 0)?label.substr(0, rIdx):label;
            error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.language, 'not_date'), error);
            l.innerHTML = "<font class='required'>" + error + "</font>";
            setTimeout(function() {
                l.innerHTML = label;
            }, 2000);
        }
    }

    render() {
        const value = (!isEmpty(this.props['value']))?this.props['value']:'';
        return (
            <input
                readOnly
                type={ HTML_TAG.INPUT }
                className={ 'form-control' }
                style={ { backgroundColor: 'white' } }
                id={ this.state.id }
                value={ value }
                onChange={ this._onChange.bind(this) }
                onFocus={ this._onMouseDown.bind(this) }
                onMouseDown={ this._onMouseDown.bind(this) } />
        );
    }
}
