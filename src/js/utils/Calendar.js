import React, { Component as C } from 'react';
import ReactLightCalendar from '@lls/react-light-calendar';
import '@lls/react-light-calendar/dist/index.css';
import '../../css/Calendar.css';

import { MSG_TYPE, OBJECT } from './Types';
import { HTML_TAG, MOUSE } from './HtmlTypes';
import { isEmpty, inJson } from './Utils';
import DateTime from './Date';
import DateUtil from './DateUtils';
import Msg from '../../msg/Msg';

class Calendar extends C {
    constructor(props) {
        super(props)

        this._onChange = this._onChange.bind(this);
        const date = new Date()
        const start = date.getTime()
        const datetime = (inJson(props, 'schema') && !isEmpty(props.schema['datetime']))?props.schema.datetime:props.datetime;
        const language = (inJson(props, 'schema') && !isEmpty(props.schema['language']))?props.schema.language:props.language;
        const timezone = (language === 'ja')?'JST':'UTC';
        // const language = this.props.language;
        this.state = {
            // show: this.props.show
            // ,
            id: this.props.objId
            ,range: (isEmpty(props.range))?false:true
            ,datetime: (datetime === true)?true:false
            ,timezone: timezone
            ,language: (isEmpty(language))?'ja':language
            ,top: props.top
            ,left: props.left
            ,start
            ,end: new Date(start).setDate(date.getDate() + 6)
            ,dayLabels: []
            ,monthLabels: []
        }
    }

    _onSetDefaultCalendar() {
        this._onSetValueToCalendar();
        console.log(this.state.language);
        const language = this.state.language;
        this.state.dayLabels = [
            Msg.getMsg(MSG_TYPE.CALENDAR, language, 'days')[1]
            ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'days')[2]
            ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'days')[3]
            ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'days')[4]
            ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'days')[5]
            ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'days')[6]
            ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'days')[0]
        ]

        this.state.monthLabels = [
                Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[1]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[2]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[3]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[4]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[5]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[6]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[7]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[8]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[9]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[10]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[11]
                ,Msg.getMsg(MSG_TYPE.CALENDAR, language, 'months')[12]]
    }

    _onChange(startDate, endDate) {
        if(isEmpty(startDate)) return;
        var start = DateTime.dateTime(new Date(startDate), this.state.language, this.state.datetime, null);
        if(this.state.range) {
            if(!isEmpty(endDate)) {
                const end = DateTime.dateTime(new Date(endDate), this.state.language, this.state.datetime, null);
                this._onGetValueFromCalendar(start + '～' + end);
                return this.props.onChangeCalendar(start, end);
            }
            this.setState({ start: startDate, end: endDate });
        } else {
            if(this.state.start === startDate && endDate > startDate) {
                start = DateTime.dateTime(new Date(endDate), this.state.language, this.state.datetime, null);
            }
            this.setState({ start: startDate });
            // console.log(start);
            // console.log(end);
            this._onGetValueFromCalendar();
            return this.props.onChangeCalendar(start);
        }
    }

    _onChangeAtDate(startDate) {
        if(isEmpty(startDate)) return;
        const start = DateTime.dateTime(new Date(startDate), this.state.language, this.state.datetime, null);
        this.setState({ start: startDate });
        this._onGetValueFromCalendar();
        return this.props.onChangeCalendar(start);
}

    _onSetValueToCalendar() {
        const p = document.getElementById(this.state.id);
        if(isEmpty(p)) return;
        var obj = null;
        if(p.tagName === HTML_TAG.TH) {
            obj = p.childNodes[0];
        }
        if(isEmpty(obj) && p.tagName === HTML_TAG.INPUT) {
            obj = p;
        }
        if(isEmpty(obj) || isEmpty(obj.value)) return;    
        const vals = obj.value.split('～');
        if(this.state.range) {
            if(!DateUtil.isDateType(vals[1]) || !DateUtil.isDateType(vals[0])) return;
            this.state.start = new Date(Date.parse(vals[0])).getTime();
            this.state.end = new Date(Date.parse(vals[1])).getTime();
        } else {
            if(!DateUtil.isDateType(vals[0])) return;
            this.state.start = new Date(Date.parse(vals[0])).getTime();
        }
    }

    _onGetValueFromCalendar(val) {
        if(isEmpty(val)) return;
        const p = document.getElementById(this.state.id);
        const obj = p.childNodes[0];
        if(isEmpty(obj) || obj.tagName !== HTML_TAG.INPUT) return;
        obj.value = val;
    }

    _onMouseOut() {
        var div = document.getElementById(OBJECT.DIV_CALENDAR_BOX_ID + this.state.id);
        div.style.display = 'none';
    }

    _onMouseOver() {
        var div = document.getElementById(OBJECT.DIV_CALENDAR_BOX_ID + this.state.id);
        div.style.display = 'block';
    }

    componentWillMount() {
        this._onSetDefaultCalendar();
    }

    componentDidMount() {
        var div = document.getElementById(OBJECT.DIV_CALENDAR_BOX_ID + this.state.id);
        if(!isEmpty(div)) {
            div.addEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
            div.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);
        }
    }

    render() {
        const style = {};
        if(!isEmpty(this.state.top)) style['top'] = this.state.top;
        if(!isEmpty(this.state.top)) style['left'] = this.state.left;
        return (
            <div id={ OBJECT.DIV_CALENDAR_BOX_ID + this.state.id } className='div-calendar-box' style={ style }>
                {(() => {
                    if(this.state.datetime && this.state.range) {
                        return (
                            <ReactLightCalendar
                                dayLabels={ this.state.dayLabels }
                                monthLabels={ this.state.monthLabels }
                                startDate={ this.state.start }
                                endDate={ this.state.end }
                                onChange={ this._onChange.bind(this) } range displayTime />        
                        );
                    }
                    if(!this.state.datetime && this.state.range) {
                        return (
                            <ReactLightCalendar
                                dayLabels={ this.state.dayLabels }
                                monthLabels={ this.state.monthLabels }
                                startDate={ this.state.start }
                                endDate={ this.state.end }
                                onChange={ this._onChange.bind(this) } range />        
                        );
                    }
                    if(this.state.datetime && !this.state.range) {
                        return (
                            <ReactLightCalendar
                                dayLabels={ this.state.dayLabels }
                                monthLabels={ this.state.monthLabels }
                                startDate={ this.state.start }
                                onChange={ this._onChange.bind(this) } displayTime />        
                        );
                    }
                    if(!this.state.datetime && !this.state.range) {
                        return (
                            <ReactLightCalendar
                                // markedDays={date => date < new Date().getTime()}
                                disableDates={date => date >= new Date().getTime() }
                                dayLabels={ this.state.dayLabels }
                                monthLabels={ this.state.monthLabels }
                                startDate={ this.state.start }
                                onChange={ this._onChange.bind(this) } />        
                        );
                    }
                })()}
            </div>
        );
    }
}
export default Calendar;
