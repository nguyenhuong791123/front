import React, { Component as C } from 'react';
// import onClickOutside from 'react-onclickoutside';
import ReactLightCalendar from '@lls/react-light-calendar';
import '@lls/react-light-calendar/dist/index.css';
import '../../css/Calendar.css';

import { MSG_TYPE, HTML_TAG } from './Types';
import { isEmpty } from './Utils';
import DateTime from './Date';
import GetMsg from '../../msg/Msg';

class CalendarBox extends C {
    constructor(props) {
        super(props)

        this._onChange = this._onChange.bind(this);
        const date = new Date()
        const start = date.getTime()
        // const language = this.props.language;
        this.state = {
            show: this.props.show
            ,objId: this.props.objId
            ,fromTo: this.props.fromTo
            ,datetime: this.props.datetime
            ,range: this.props.range
            ,timezone: this.props.timezone
            ,language: this.props.language
            ,top: this.props.top
            ,left: this.props.left
            ,start
            ,end: new Date(start).setDate(date.getDate() + 6)
            ,dayLabels: []
            ,monthLabels: []
        }
    }

    _getDayMonthLabel() {
        console.log(this.state.language);
        const language = this.state.language;
        this.state.dayLabels = [
            GetMsg(MSG_TYPE.CALENDAR, language, 'days')[1]
            ,GetMsg(MSG_TYPE.CALENDAR, language, 'days')[2]
            ,GetMsg(MSG_TYPE.CALENDAR, language, 'days')[3]
            ,GetMsg(MSG_TYPE.CALENDAR, language, 'days')[4]
            ,GetMsg(MSG_TYPE.CALENDAR, language, 'days')[5]
            ,GetMsg(MSG_TYPE.CALENDAR, language, 'days')[6]
            ,GetMsg(MSG_TYPE.CALENDAR, language, 'days')[0]
        ]

        this.state.monthLabels = [
                GetMsg(MSG_TYPE.CALENDAR, language, 'months')[1]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[2]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[3]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[4]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[5]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[6]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[7]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[8]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[9]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[10]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[11]
                ,GetMsg(MSG_TYPE.CALENDAR, language, 'months')[12]]
    }

    _onChange(startDate, endDate) {
        if(isEmpty(startDate)) return;
        const start = DateTime.dateTime(new Date(startDate), this.state.language, this.state.datetime, null);
        this.setState({ start: startDate, end: endDate });
        if(this.state.fromTo) {
            if(!isEmpty(endDate)) {
                const end = DateTime.dateTime(new Date(endDate), this.state.language, this.state.datetime, null);
                this._getValueToObj(start + '～' + end);
                return this.props.onChangeCalendar(start, end);
            }
        } else {
            this._getValueToObj();
            return this.props.onChangeCalendar(start, '');
        }
    }

    _getValueToObj(val) {
        if(isEmpty(val)) return;
        const p = document.getElementById(this.state.objId);
        const obj = p.childNodes[0];
        if(isEmpty(obj) || obj.tagName !== HTML_TAG.INPUT) return;
        obj.value = val;
    }

    // handleClickOutside = (e) => {
    //     const obj = e.target;
    //     const className = ('class' in obj)?obj.className:'';
    //     console.log(className);
    //     if(!isEmpty(className) && className.indexOf('rlc-') !== -1) return;
    //     const cBox = document.getElementById('div_calendar_box_view');
    //     if(!isEmpty(cBox)) cBox.remove();
    // }

    componentWillMount() {
        this._getDayMonthLabel();
    }

    render() {
        const style = { top: this.state.top, left: this.state.left }
        return (
            <div id='div_calendar_box' className='div-calendar-box' style={ style }>
                {(() => {
                    if(this.state.datetime && this.state.range) {
                        return (
                            <ReactLightCalendar
                                dayLabels={ this.state.dayLabels }
                                monthLabels={ this.state.monthLabels }
                                startDate={ this.state.start }
                                endDate={ this.state.end }
                                timezone={ this.state.timezone }
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
                                timezone={ this.state.timezone }
                                onChange={ this._onChange.bind(this) } range />        
                        );
                    }
                    if(this.state.datetime && !this.state.range) {
                        return (
                            <ReactLightCalendar
                                dayLabels={ this.state.dayLabels }
                                monthLabels={ this.state.monthLabels }
                                startDate={ this.state.start }
                                endDate={ this.state.end }
                                timezone={ this.state.timezone }
                                onChange={ this._onChange.bind(this) } displayTime />        
                        );
                    }
                    if(!this.state.datetime && !this.state.range) {
                        return (
                            <ReactLightCalendar
                                dayLabels={ this.state.dayLabels }
                                monthLabels={ this.state.monthLabels }
                                startDate={ this.state.start }
                                endDate={ this.state.end }
                                timezone={ this.state.timezone }
                                onChange={ this._onChange.bind(this) } />        
                        );
                    }
                })()}
            </div>
        );
    }
}
export default CalendarBox;
// export default onClickOutside(CalendarBox);