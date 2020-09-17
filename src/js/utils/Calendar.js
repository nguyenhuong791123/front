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
        // const type = (inJson(props, 'schema') && !isEmpty(props.schema['datetype']))?props.schema.datetype:props.datetype;
        let language = (inJson(props, 'schema') && !isEmpty(props.schema['language']))?props.schema.language:props.language;
        if(isEmpty(language)) language = 'ja';
        let locale = ja;
        if(language === 'en') locale = en;
        if(language === 'vi') locale = vi;
        this.state = {
            id: (inJson(props, 'id'))?props.id:''
            ,range: (!inJson(props, 'range'))?false:props.range
            ,language: language
            ,type: null
            ,locale: locale
            ,top: props.top
            ,left: props.left
            ,format : DateUtil.DATE_REGX.YYYYMMDD_SLASH
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
            if(this.state.type === TYPE.MONTH) value = dateString + '/01';
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
        // if(this.state.type === TYPE.DATETIME) {
        //     this.state.format = DateUtil.DATE_REGX.YYYYMMDDHHmmss_SLASH;
        // }
        // let value = null;
        // if(DateUtil.isDateType(this.props.value)) {
        //     if(this.state.type === TYPE.DATETIME) {
        //         this.state.value = DateUtil.isStringToFullDateTime(this.props.value, DateUtil.SYMBOL.SLASH, this.state.language);
        //     } else {
        //         this.state.value = DateUtil.isStringToDate(this.props.value, DateUtil.SYMBOL.SLASH, this.state.language);
        //     }
        //     value = moment(this.state.value, this.state.format)
        // } else if(this.state.type === TYPE.TIME && !isEmpty(this.props.value)) {
        //     this.state.value = this.props.value;
        //     value = moment(this.state.value, DateUtil.DATE_REGX.HHmmss);
        // }
        // console.log(this.state.format);
        // if(DateUtil.isDateType(this.state.value)) value = moment(this.state.value, this.state.format)
        // console.log(this.state.value);
        // console.log(value);
        if (this.state.type === TYPE.DATETIME && this.state.range) {
            datePicker = <RangePicker onChange={ this._onChange.bind(this) } showTime format={ this.state.format } ranges={ ranges }/>;
        } else if (this.state.type === TYPE.DATETIME && !this.state.range) {
            datePicker = <DatePicker onChange={ this._onChange.bind(this) } showTime format={ this.state.format } value={ this.state.value }/>;
        } else if (this.state.type === TYPE.DATE && this.state.range) {
            datePicker = <RangePicker onChange={ this._onChange.bind(this) } format={ this.state.format } ranges={ ranges }/>;
        } else if (this.state.type === TYPE.DATE && !this.state.range) {
            datePicker = <DatePicker onChange={ this._onChange.bind(this) } format={ this.state.format } value={ this.state.value } />;
        } else if (this.state.type === TYPE.MONTH && this.state.range) {
            datePicker = <RangePicker onChange={ this._onChange.bind(this) } format={ this.state.format } ranges={ ranges } picker="month"/>;
        } else if (this.state.type === TYPE.MONTH && !this.state.range) {
            datePicker = <DatePicker onChange={ this._onChange.bind(this) } format={ this.state.format } value={ this.state.value } picker="month"/>;
        } else if (this.state.type === TYPE.TIME) {
            datePicker = <TimePicker onChange={ this._onChange.bind(this) } format={ this.state.format } value={ this.state.value } />;
        }
        console.log(datePicker);
        console.log(this.state.format);
        console.log(this.state.value);
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

    _onSetStateValue(type, pVal) {
        let value = null;
        if(!isEmpty(pVal)) {
            if(type === TYPE.DATETIME) {
                value = DateUtil.isStringToFullDateTime(pVal, DateUtil.SYMBOL.SLASH, this.state.language);
            } else if(type === TYPE.DATE) {
                value = DateUtil.isStringToFullDateTime(pVal, DateUtil.SYMBOL.SLASH, this.state.language);
            } else if(type === TYPE.MONTH) {
                value = DateUtil.isStringToYearMonth(pVal, DateUtil.SYMBOL.SLASH, this.state.language);
            } else if(type === TYPE.TIME) {
                value = pVal;
            }
        }
        if(type === TYPE.DATETIME) {
            this.state.format = DateUtil.DATE_REGX.YYYYMMDDHHmmss_SLASH;
        } else if(type === TYPE.MONTH) {
            this.state.format = DateUtil.DATE_REGX.YYYYMM_SLASH;
        } else if(type === TYPE.TIME) {
            this.state.format = DateUtil.DATE_REGX.HHmmss;
        }
        this.state.type = type;
        if(!isEmpty(value)) this.state.value = moment(value, this.state.format)
    }

    UNSAFE_componentWillMount() {
        const type = (inJson(this.props, 'schema') && !isEmpty(this.props.schema['datetype']))?this.props.schema.datetype:this.props.datetype;
        this._onSetStateValue(type, this.props['value']);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.state.id = (inJson(nextProps, 'id'))?nextProps.id:''
        this.state.range = (!inJson(nextProps, 'range'))?false:nextProps.range;
        const language = (inJson(nextProps, 'schema') && !isEmpty(nextProps.schema['language']))?nextProps.schema.language:nextProps.language;
        let locale = ja;
        if(language === 'en') locale = en;
        if(language === 'vi') locale = vi;
        this.state.locale = locale;
        const type = (inJson(nextProps, 'schema') && !isEmpty(nextProps.schema['datetype']))?nextProps.schema.datetype:nextProps.datetype;
        const value = (inJson(nextProps, 'value'))?nextProps.value:null;
        this._onSetStateValue(type, value);
    }

    render() {
        const style = {};
        if(!isEmpty(this.state.top)) style['top'] = this.state.top;
        if(!isEmpty(this.state.top)) style['left'] = this.state.left;
        // <div id={ OBJECT.DIV_CALENDAR_BOX_ID + this.state.id } className='div-calendar-box' style={ style }>
        return (
            <div id={ this.state.id } className='div-calendar-box' style={ style }>
                { this._onPickerWithType() }
            </div>
        );
    }
}
export default Calendar;
