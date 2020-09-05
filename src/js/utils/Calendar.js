import React, { Component as C } from 'react';
import { DatePicker, TimePicker, Space, ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
const { RangePicker } = DatePicker;
import moment from 'moment';
import ja from 'antd/es/locale/ja_JP';
import en from 'antd/es/locale/en_US';
import vi from 'antd/es/locale/vi_VN';

import { MSG_TYPE, OBJECT } from './Types';
import { TYPE} from './HtmlTypes';
import { isEmpty, inJson, isFunc } from './Utils';
import DateTime from './Date';
import DateUtil from './DateUtils';
import Msg from '../../msg/Msg';

class Calendar extends C {
    constructor(props) {
        super(props)

        this._onChange = this._onChange.bind(this);
        // const datetime = (inJson(props, 'schema') && !isEmpty(props.schema['datetime']))?props.schema.datetime:props.datetime;
        const type = (inJson(props, 'schema') && !isEmpty(props.schema['datetype']))?props.schema.datetype:props.datetype;
        const language = (inJson(props, 'schema') && !isEmpty(props.schema['language']))?props.schema.language:props.language;
        let locale = ja;
        if(language === 'en') locale = en;
        if(language === 'vi') locale = vi;
        this.state = {
            id: (inJson(props, 'id'))?props.id:''
            ,range: (!inJson(props, 'range'))?false:props.range
            // ,datetime: (datetime === true)?true:false
            ,type: type
            ,locale: locale
            ,top: props.top
            ,left: props.left
            ,format : DateUtil.DATE_REGX.DATE_SLASH
            ,value: null
        }
    }

    _onChange(date, dateString) {
        let value = '';
        if(!isEmpty(date) && !isEmpty(dateString)) {
            if(Array.isArray(dateString) && dateString.length === 2) {
                value = dateString[0] + '〜' + dateString[1];
            } else {
                value = dateString;
            }    
        }
        if(isFunc(this.props, 'onChangeCalendar')) {
            this.props.onChangeCalendar(this.state.id, value);
        } else {
            this.props.onChange(value);
        }
    }

    _onPickerWithType() {
        const ranges = {
            'Today': [ moment(), moment()],
            'This Month': [ moment().startOf('month'), moment().endOf('month') ],
        };
        let datePicker = null;
        if(this.state.type === TYPE.DATETIME) {
            this.state.format = DateUtil.DATE_REGX.DATETIME_SLASH;
        }
        // console.log(this.state.format);
        if (this.state.type === TYPE.DATETIME && this.state.range) datePicker = <RangePicker onChange={ this._onChange.bind(this) } showTime format={ this.state.format } ranges={ ranges }/>;
        if (this.state.type === TYPE.DATETIME && !this.state.range) datePicker = <DatePicker onChange={ this._onChange.bind(this) } showTime format={ this.state.format } defaultValue={ this.state.value }/>;
        if (this.state.type === TYPE.DATE && this.state.range) datePicker = <RangePicker onChange={ this._onChange.bind(this) } format={ this.state.format } ranges={ ranges }/>;
        if (this.state.type === TYPE.DATE && !this.state.range) datePicker = <DatePicker onChange={ this._onChange.bind(this) } format={ this.state.format } defaultValue={ this.state.value } />;
        if (this.state.type === TYPE.TIME) datePicker = <TimePicker onChange={ this._onChange.bind(this) } defaultValue={ this.state.value } />;
        if(!isEmpty(datePicker)) {
            return (
                <Space direction="vertical" size={15} style={{ width: '100%' }}>
                    <ConfigProvider locale={ this.state.locale }>
                        { datePicker }
                    </ConfigProvider>
                </Space>
            );    
        } else {
            return '';
        }
    }

    UNSAFE_componentWillMount() {
        if(inJson(this.props, 'value') && DateUtil.isDateType(this.props['value'])) {
            if(this.state.type === TYPE.DATETIME) {
                this.state.value = moment(this.props['value'], DateUtil.DATE_REGX.DATETIME_SLASH)
            } else {
                this.state.value = moment(this.props['value'], DateUtil.DATE_REGX.DATE_SLASH)
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.state.id = (inJson(nextProps, 'id'))?nextProps.id:''
        this.state.range = (!inJson(nextProps, 'range'))?false:nextProps.range;
        this.state.type = (inJson(nextProps, 'schema') && !isEmpty(nextProps.schema['datetype']))?nextProps.schema.datetype:nextProps.datetype;
        const language = (inJson(nextProps, 'schema') && !isEmpty(nextProps.schema['language']))?nextProps.schema.language:nextProps.language;
        let locale = ja;
        if(language === 'en') locale = en;
        if(language === 'vi') locale = vi;
        this.state.locale = locale;
    }

    render() {
        const style = {};
        if(!isEmpty(this.state.top)) style['top'] = this.state.top;
        if(!isEmpty(this.state.top)) style['left'] = this.state.left;
        return (
            <div id={ OBJECT.DIV_CALENDAR_BOX_ID + this.state.id } className='div-calendar-box' style={ style }>
                { this._onPickerWithType() }
            </div>
        );
    }
}
export default Calendar;
