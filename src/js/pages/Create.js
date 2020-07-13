import React, { Component as C } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import Actions from '../utils/Actions';
import CForm from '../utils/CForm';
import ImageBox from '../utils/Compoment/ImageBox';
import TimeBox from '../utils/Compoment/TimeBox';
import RadioBox from '../utils/Compoment/RadioBox';
import CheckBox from '../utils/Compoment/CheckBox';
import SelectBox from '../utils/Compoment/SelectBox';
import TableBox from '../utils/Compoment/TableBox';

import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';
import StringUtil from 'util';
import Msg from '../../msg/Msg';
import { HTML_TAG, CUSTOMIZE, TYPE, MOUSE } from '../utils/HtmlTypes';
import { PAGE_ACTION, ACTION, SYSTEM, VARIANT_TYPES, MSG_TYPE } from '../utils/Types';

class Create extends C {
  constructor(props) {
    super(props);

    this._onClickBack = this._onClickBack.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onUpdateFormData = this._onUpdateFormData.bind(this);
    this._onError = this._onError.bind(this);
    this._onResetClick = this._onResetClick.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,options: this.props.options
      ,alertActions: { show: false, style: {} }
      ,overObject: null
      ,isValidate: true
      ,form: []
    }
  };

  componentWillMount(){
    console.log("Data submitted: ", this.props.onUpdateStateIsUser);
    this.state.form = [
      {
        "object_type": "div",
        "object_key": "page_okkjk65698",
        "class_name": "div-box-100",
        "idx": 0,
        "object": {
          "schema": {
            "type": "object",
            "title": "DIV_00",
            "block": "DIV",
            "fIdx": 0,
            "idx": 0,
            "properties": {
              "text_yj0jjyiu4h": {
                "type": "string",
                "title": "Text",
                "idx": 1,
                "obj": {
                  "label_ja": "Text",
                  "placeholder_ja": "Placeholder",
                  "item_type": "text",
                  "language": "ja",
                  "label_color": "#c58c8c",
                  "label_layout_color": "#303e88",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "デフォルト",
                  "required": true,
                  "max_length": "30",
                  "item_name": "text_yj0jjyiu4h"
                }
              },
              "textarea_gkvv40nv9a": {
                "type": "string",
                "title": "Textarea",
                "idx": 2,
                "obj": {
                  "label_ja": "Textarea",
                  "placeholder_ja": "Placeholder",
                  "item_type": "textarea",
                  "language": "ja",
                  "label_color": "#d9b4b4",
                  "label_layout_color": "#42459a",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "デフォルト",
                  "max_length": "500",
                  "required": true,
                  "item_name": "textarea_gkvv40nv9a"
                }
              },
              "date_qeis620i4e": {
                "type": "string",
                "title": "Date",
                "idx": 3,
                "obj": {
                  "label_ja": "Date",
                  "placeholder_ja": "",
                  "item_type": "date",
                  "language": "ja",
                  "label_color": "#d3abab",
                  "label_layout_color": "#1d3d58",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "2020-07-13",
                  "required": true,
                  "item_name": "date_qeis620i4e"
                },
                "format": "date"
              },
              "datetime_oz3lf5bsn6": {
                "type": "string",
                "title": "Datetime",
                "idx": 4,
                "obj": {
                  "label_ja": "Datetime",
                  "placeholder_ja": "",
                  "item_type": "datetime",
                  "language": "ja",
                  "label_color": "#906464",
                  "label_layout_color": "#2b8c5f",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "2020-07-13T20:07",
                  "required": true,
                  "item_name": "datetime_oz3lf5bsn6"
                },
                "format": "date-time"
              },
              "time_rcifjv8ash": {
                "type": "string",
                "title": "Time",
                "idx": 5,
                "obj": {
                  "label_ja": "Time",
                  "placeholder_ja": "",
                  "item_type": "time",
                  "language": "ja",
                  "label_color": "#b771c1",
                  "label_layout_color": "#823030",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "20:07",
                  "required": true,
                  "item_name": "time_rcifjv8ash"
                }
              },
              "number_xcu2iops9s": {
                "type": "number",
                "title": "Number",
                "idx": 6,
                "obj": {
                  "label_ja": "Number",
                  "placeholder_ja": "Placeholder",
                  "item_type": "number",
                  "language": "ja",
                  "label_color": "#75ce73",
                  "label_layout_color": "#346a93",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "2",
                  "max_length": "9",
                  "required": true,
                  "item_name": "number_xcu2iops9s"
                }
              },
              "checkbox_yz205w4y28": {
                "type": "string",
                "title": "Checkbox One",
                "idx": 7,
                "obj": {
                  "label_ja": "Checkbox One",
                  "placeholder_ja": "",
                  "item_type": "checkbox",
                  "language": "ja",
                  "label_color": "#e8c0c0",
                  "label_layout_color": "#1d2c4e",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    }
                  ],
                  "item_name": "checkbox_yz205w4y28"
                },
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  }
                ]
              },
              "checkbox_z76ojqxm4j": {
                "type": "string",
                "title": "Checbox in List",
                "idx": 8,
                "obj": {
                  "label_ja": "Checbox in List",
                  "placeholder_ja": "",
                  "item_type": "checkbox",
                  "language": "ja",
                  "label_color": "#533455",
                  "label_layout_color": "#2a245c",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "User1"
                    }
                  ],
                  "option_target": "groups",
                  "default": "",
                  "item_name": "checkbox_z76ojqxm4j"
                },
                "option_target": "groups",
                "options": [
                  {
                    "value": 1,
                    "label": "User1"
                  }
                ]
              },
              "checkbox_34hh4lrpia": {
                "type": "string",
                "title": "Checkbox list",
                "idx": 9,
                "obj": {
                  "label_ja": "Checkbox list",
                  "placeholder_ja": "",
                  "item_type": "checkbox",
                  "language": "ja",
                  "label_color": "#417b9f",
                  "label_layout_color": "#207e23",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    },
                    {
                      "value": 2,
                      "label": "WWWWW"
                    },
                    {
                      "value": 3,
                      "label": "AAAAA"
                    },
                    {
                      "value": 4,
                      "label": "SSSSS"
                    },
                    {
                      "value": 5,
                      "label": "RRRRR"
                    }
                  ],
                  "option_checked": true,
                  "item_name": "checkbox_34hh4lrpia"
                },
                "option_checked": true,
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  },
                  {
                    "value": 2,
                    "label": "WWWWW"
                  },
                  {
                    "value": 3,
                    "label": "AAAAA"
                  },
                  {
                    "value": 4,
                    "label": "SSSSS"
                  },
                  {
                    "value": 5,
                    "label": "RRRRR"
                  }
                ]
              },
              "radio_9gor1chp0k": {
                "type": "string",
                "title": "Radio One",
                "idx": 10,
                "obj": {
                  "label_ja": "Radio One",
                  "placeholder_ja": "",
                  "item_type": "radio",
                  "language": "ja",
                  "label_color": "#6940a5",
                  "label_layout_color": "#822b2b",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    },
                    {
                      "value": 2,
                      "label": "WWWWW"
                    }
                  ],
                  "item_name": "radio_9gor1chp0k",
                  "required": true
                },
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  },
                  {
                    "value": 2,
                    "label": "WWWWW"
                  }
                ],
                "required": true
              },
              "radio_u2t8ucyltn": {
                "type": "string",
                "title": "Radio List",
                "idx": 11,
                "obj": {
                  "label_ja": "Radio List",
                  "placeholder_ja": "",
                  "item_type": "radio",
                  "language": "ja",
                  "label_color": "#ecc1c1",
                  "label_layout_color": "#392b7d",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    },
                    {
                      "value": 2,
                      "label": "WWWWW"
                    },
                    {
                      "value": 3,
                      "label": "SSSSS"
                    },
                    {
                      "value": 4,
                      "label": "DDDDD"
                    },
                    {
                      "value": 5,
                      "label": "FFFFF"
                    }
                  ],
                  "option_checked": true,
                  "item_name": "radio_u2t8ucyltn",
                  "required": true
                },
                "option_checked": true,
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  },
                  {
                    "value": 2,
                    "label": "WWWWW"
                  },
                  {
                    "value": 3,
                    "label": "SSSSS"
                  },
                  {
                    "value": 4,
                    "label": "DDDDD"
                  },
                  {
                    "value": 5,
                    "label": "FFFFF"
                  }
                ],
                "required": true
              },
              "radio_ozoehgh8xi": {
                "type": "string",
                "title": "Radio in",
                "idx": 12,
                "obj": {
                  "label_ja": "Radio in",
                  "placeholder_ja": "",
                  "item_type": "radio",
                  "language": "ja",
                  "label_color": "#b46464",
                  "label_layout_color": "#2e948d",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "User1"
                    }
                  ],
                  "option_target": "users",
                  "default": "1",
                  "required": true,
                  "item_name": "radio_ozoehgh8xi"
                },
                "option_target": "users",
                "options": [
                  {
                    "value": 1,
                    "label": "User1"
                  }
                ],
                "required": true
              },
              "select_4w5jwxwdyn": {
                "type": "string",
                "title": "Select",
                "idx": 13,
                "obj": {
                  "label_ja": "Select",
                  "placeholder_ja": "",
                  "item_type": "select",
                  "language": "ja",
                  "label_color": "#bf5a5a",
                  "label_layout_color": "#89721f",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    },
                    {
                      "value": 2,
                      "label": "WWWWW"
                    }
                  ],
                  "default": "2",
                  "required": true,
                  "item_name": "select_4w5jwxwdyn"
                },
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  },
                  {
                    "value": 2,
                    "label": "WWWWW"
                  }
                ],
                "required": true
              },
              "select_u9in5h4b7f": {
                "type": "string",
                "title": "Select in",
                "idx": 14,
                "obj": {
                  "label_ja": "Select in",
                  "placeholder_ja": "",
                  "item_type": "select",
                  "language": "ja",
                  "label_color": "#c16767",
                  "label_layout_color": "#244570",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "User1"
                    }
                  ],
                  "option_target": "groups",
                  "default": "",
                  "required": true,
                  "item_name": "select_u9in5h4b7f"
                },
                "option_target": "groups",
                "options": [
                  {
                    "value": 1,
                    "label": "User1"
                  }
                ],
                "required": true
              },
              "file_a3ath91eab": {
                "type": "string",
                "title": "File",
                "idx": 15,
                "obj": {
                  "label_ja": "File",
                  "placeholder_ja": "",
                  "item_type": "file",
                  "language": "ja",
                  "label_color": "#223077",
                  "label_layout_color": "#cb5252",
                  "box_width": 25,
                  "box_height": 89,
                  "required": true,
                  "item_name": "file_a3ath91eab"
                },
                "format": "data-url"
              },
              "file_o0xl2ywr7w": {
                "type": "array",
                "title": "File Multi",
                "idx": 16,
                "obj": {
                  "label_ja": "File Multi",
                  "placeholder_ja": "",
                  "item_type": "file",
                  "language": "ja",
                  "label_color": "#f0b7b7",
                  "label_layout_color": "#3c2b54",
                  "box_width": 25,
                  "box_height": 89,
                  "required": true,
                  "multiple_file": true,
                  "item_name": "file_o0xl2ywr7w"
                },
                "items": {
                  "type": "string",
                  "format": "data-url"
                }
              },
              "password_u7c07xfz94": {
                "type": "string",
                "title": "Password",
                "idx": 17,
                "obj": {
                  "label_ja": "Password",
                  "placeholder_ja": "Placeholder",
                  "item_type": "password",
                  "language": "ja",
                  "label_color": "#9e4747",
                  "label_layout_color": "#217d4e",
                  "box_width": 25,
                  "box_height": 89,
                  "required": true,
                  "item_name": "password_u7c07xfz94"
                }
              },
              "disabled_byf9t34wt8": {
                "type": "string",
                "title": "Disabled",
                "idx": 18,
                "obj": {
                  "label_ja": "Disabled",
                  "placeholder_ja": "",
                  "item_type": "disabled",
                  "language": "ja",
                  "label_color": "#c59b9b",
                  "label_layout_color": "#195d2d",
                  "box_width": 25,
                  "box_height": 89,
                  "childens": 1,
                  "default": "デフォルト",
                  "item_name": "disabled_byf9t34wt8"
                }
              },
              "color_d5z4vhkqyd": {
                "type": "string",
                "title": "Color",
                "idx": 19,
                "obj": {
                  "label_ja": "Color",
                  "placeholder_ja": "",
                  "item_type": "color",
                  "language": "ja",
                  "label_color": "#4c2790",
                  "label_layout_color": "#8b8718",
                  "box_width": 25,
                  "box_height": 89,
                  "childens": 1,
                  "default": "#ad4848",
                  "required": true,
                  "item_name": "color_d5z4vhkqyd"
                }
              },
              "childens_x1w5wqbb92": {
                "type": "string",
                "title": "List",
                "idx": 20,
                "obj": {
                  "label_ja": "List",
                  "placeholder_ja": "",
                  "item_type": "childens",
                  "language": "ja",
                  "label_color": "#4e51b1",
                  "label_layout_color": "#1a895f",
                  "box_width": 100,
                  "box_height": 89,
                  "childens": 1,
                  "item_name": "childens_x1w5wqbb92"
                }
              }
            },
            "definitions": {},
            "requireds": [],
            "obj": {
              "language": "ja",
              "box_width": 100,
              "label_ja": "DIV_00"
            }
          },
          "ui": {
            "text_yj0jjyiu4h": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "max_length": "30",
              "style": "color:#c58c8c;background-color:#303e88;",
              "required": true
            },
            "textarea_gkvv40nv9a": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "ui:widget": "textarea",
              "max_length": "500",
              "style": "color:#d9b4b4;background-color:#42459a;",
              "required": true
            },
            "date_qeis620i4e": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "style": "color:#d3abab;background-color:#1d3d58;",
              "required": true
            },
            "datetime_oz3lf5bsn6": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "style": "color:#906464;background-color:#2b8c5f;",
              "required": true
            },
            "time_rcifjv8ash": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "style": "color:#b771c1;background-color:#823030;",
              "required": true
            },
            "number_xcu2iops9s": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "max_length": "9",
              "style": "color:#75ce73;background-color:#346a93;",
              "required": true
            },
            "checkbox_yz205w4y28": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#e8c0c0;background-color:#1d2c4e;"
            },
            "checkbox_z76ojqxm4j": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#533455;background-color:#2a245c;"
            },
            "checkbox_34hh4lrpia": {
              "classNames": "div-box div-box-25 div-box-height-89 div-not-inline div-not-inline",
              "style": "color:#417b9f;background-color:#207e23;"
            },
            "radio_9gor1chp0k": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#6940a5;background-color:#822b2b;",
              "required": true
            },
            "radio_u2t8ucyltn": {
              "classNames": "div-box div-box-25 div-box-height-89 div-not-inline",
              "style": "color:#ecc1c1;background-color:#392b7d;",
              "required": true
            },
            "radio_ozoehgh8xi": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#b46464;background-color:#2e948d;",
              "required": true
            },
            "select_4w5jwxwdyn": {
              "classNames": "div-box div-box-25 div-box-height-89 div-not-inline",
              "style": "color:#bf5a5a;background-color:#89721f;",
              "required": true
            },
            "select_u9in5h4b7f": {
              "classNames": "div-box div-box-25 div-box-height-89 div-not-inline",
              "style": "color:#c16767;background-color:#244570;",
              "required": true
            },
            "file_a3ath91eab": {
              "classNames": "div-box div-box-25 div-box-height-89 div-file-box",
              "style": "color:#223077;background-color:#cb5252;",
              "required": true
            },
            "file_o0xl2ywr7w": {
              "classNames": "div-box div-box-25 div-box-height-89 div-file-box",
              "style": "color:#f0b7b7;background-color:#3c2b54;",
              "required": true
            },
            "password_u7c07xfz94": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "ui:widget": "password",
              "style": "color:#9e4747;background-color:#217d4e;",
              "required": true
            },
            "disabled_byf9t34wt8": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "ui:disabled": true,
              "style": "color:#c59b9b;background-color:#195d2d;"
            },
            "color_d5z4vhkqyd": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "ui:widget": "color",
              "style": "color:#4c2790;background-color:#8b8718;",
              "required": true
            },
            "childens_x1w5wqbb92": {
              "classNames": "div-box div-box-100 div-box-height-89 div-customize-table",
              "style": "color:#4e51b1;background-color:#1a895f;"
            }
          },
          "data": {
            "text_yj0jjyiu4h": "デフォルト",
            "textarea_gkvv40nv9a": "デフォルト",
            "date_qeis620i4e": "2020-07-13",
            "datetime_oz3lf5bsn6": "2020-07-13T20:07",
            "time_rcifjv8ash": "20:07",
            "number_xcu2iops9s": 2,
            "checkbox_z76ojqxm4j": "",
            "checkbox_34hh4lrpia": [],
            "radio_ozoehgh8xi": 1,
            "select_4w5jwxwdyn": 2,
            "select_u9in5h4b7f": "",
            "disabled_byf9t34wt8": "デフォルト",
            "color_d5z4vhkqyd": "#ad4848",
            "childens_x1w5wqbb92": 1
          }
        }
      }
    ]

    this._onSortForms();
  }

  _onSortForms() {
    var forms = this.state.form;
    console.log(forms);
    forms.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        return objs.map((obj) => {
          // this._formatUiWidget(obj.ui, obj.schema.definitions);  
          this._formatUiWidget(obj.ui);  
          var lists = Object.keys(obj.schema.properties).map((o) => { 
            return { key: o, obj: obj.schema.properties[o] };
          });
          lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
          var properties = {};
          for(let i=0; i<lists.length; i++) {
            properties[lists[i].key] = lists[i].obj;
          }
          obj.schema.properties = properties;
          return obj;
        });
      } else {
        this._formatUiWidget(objs.ui);
        var lists = Object.keys(objs.schema.properties).map((o) => { 
          return { key: o, obj: objs.schema.properties[o] };
        });
        lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
        var properties = {};
        for(let i=0; i<lists.length; i++) {
          properties[lists[i].key] = lists[i].obj;
        }
        objs.schema.properties = properties;
        return objs;
      }
    });
    forms.sort((a, b) => ((a.idx > b.idx)?1:-1));
  }

  _formatUiWidget(ui) {
    const uiKeys = Object.keys(ui);
    const targets = [ TYPE.IMAGE, TYPE.TIME, TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT, TYPE.CHILDENS ];
    uiKeys.map((o) => {
      const field = o.split('_')[0];
      if(!Utils.isEmpty(field) && (targets.includes(field))) {
        if(field === TYPE.IMAGE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = ImageBox;
        if(field === TYPE.TIME && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TimeBox;
        if(field === TYPE.RADIO && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = RadioBox;
        if(field === TYPE.CHECKBOX && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = CheckBox;
        if(field === TYPE.SELECT && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = SelectBox;
        if(field === TYPE.CHILDENS && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TableBox;
      }
    });
  }

  _onClickBack() {
    this.state.isUser.path = ACTION.SLASH + ACTION.LIST;
    const auth = { info: this.state.isUser, options: this.state.options };
    this.props.onUpdateStateIsUser(auth);
    // this.props.history.push(ACTION.SLASH + ACTION.LIST);
    // this.forceUpdate();
  }

  _onClickSubmit() {
    this._onFormValidate();
    if(this.state.isValidate) return

    console.log("Data submitted: ", this.state.formData);
    this._onClickBack();
  }

  _onUpdateFormData(e) {
    if(!Utils.inJson(e, 'schema') || !Utils.inJson(e, 'formData')) return;
    console.log(e);
    const fIdx = e.schema.fIdx;
    const idx = e.schema.idx;
    if(e.schema.block === HTML_TAG.DIV) {
      this.state.form[fIdx].object.data = e.formData;
    }
    if(e.schema.block === HTML_TAG.TAB) {
      this.state.form[fIdx].object[idx].data = e.formData;
    }
  }

  _onError(errors) {
    console.log("I have", errors.length, "errors to fix");
  }

  _onCheckValidate(object) {
    var objs = Object.keys(object.ui);
    if(!Array.isArray(objs) || objs.length <= 0) return;
    const targets = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.NUMBER ];
    objs.map((o) => {
      const field = o;
      const type = field.split('_')[0];
      const obj = object.ui[o];
      if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
        || (Utils.inJson(obj, CUSTOMIZE.MAX_LENGTH) && !Utils.isEmpty(obj[CUSTOMIZE.MAX_LENGTH]))) {

        const root = document.getElementById('root_' + field);
        if(!Utils.isEmpty(root)) {
          const div = root.parentElement;
          var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
          if(!Utils.isEmpty(root) && !Utils.isEmpty(root.parentElement)) {
            if(!Utils.isEmpty(l) && l.tagName === HTML_TAG.LABEL) {
              const label = l.innerHTML;
              const value = object.data[field];
              var error = null;
              const rIdx = label.indexOf('<font');
              error = (rIdx > 0)?label.substr(0, rIdx):label;
              var viewError = false;
              if(Utils.inJson(obj, CUSTOMIZE.REQUIRED)
                && obj[CUSTOMIZE.REQUIRED]
                && Utils.isEmpty(value)) {
                if(targets.includes(type)) {
                  error += Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'required');
                } else {
                  error += Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'selected');
                }
                viewError = true;
              } else if(Utils.inJson(obj, CUSTOMIZE.MAX_LENGTH)
                        && !Utils.isEmpty(value)
                        && value.length > obj[CUSTOMIZE.MAX_LENGTH]) {
                  error = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'max_length'), error, obj[CUSTOMIZE.MAX_LENGTH], (value.length - obj[CUSTOMIZE.MAX_LENGTH]));
                  viewError = true;
              }
              if(!Utils.isEmpty(error) && viewError) {
                l.innerHTML = "<font class='required'>" + error + "</font>";
                setTimeout(function() {
                  l.innerHTML = label;
                }, 3000);  
              }
            }
          }
        }
      }
    });
  }

  _onAddAttribute(object) {
    var objs = Object.keys(object.ui);
    if(!Array.isArray(objs) || objs.length <= 0) return;
    objs.map((o) => {
      const field = o;
      const obj = object.ui[o];
      if((Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED])
        || (Utils.inJson(obj, CUSTOMIZE.STYLE) && !Utils.isEmpty(obj[CUSTOMIZE.STYLE]))) {

        const root = document.getElementById('root_' + field);
        if(!Utils.isEmpty(root)) {
          var div = root.parentElement;
          var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
          if(field.split('_')[0] === TYPE.FILE) {
            div = root.parentElement.parentElement.parentElement;
            l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
          }
          if(!Utils.isEmpty(l) && !Utils.isEmpty(div)) {
            if(Utils.inJson(obj, CUSTOMIZE.REQUIRED) && obj[CUSTOMIZE.REQUIRED]) {
              const label = l.innerHTML;
              l.innerHTML = label + "<font class='required'>*</font>";
            }
            if(Utils.inJson(obj, CUSTOMIZE.STYLE) && !Utils.isEmpty(obj[CUSTOMIZE.STYLE])) {
              l.setAttribute('style', obj[CUSTOMIZE.STYLE]);
            }
          }  
        }
      }
    });
  }

  // _addRequiredOrErrorMsgToDom(requireds, required) {
  //   if(!Array.isArray(requireds) || requireds.length <= 0) return;
  //   const targets = [ TYPE.TEXT, TYPE.TEXTAREA, TYPE.NUMBER ];
  //   requireds.map((o) => {
  //     const field = o['item_name'];
  //     const type = field.split('_')[0];
  //     if((Utils.inJson(o, CUSTOMIZE.REQUIRED) && o[CUSTOMIZE.REQUIRED])
  //       || (Utils.inJson(o, CUSTOMIZE.STYLE) && !Utils.isEmpty(o[CUSTOMIZE.STYLE]))) {

  //       const root = document.getElementById('root_' + field);
  //       const div = root.parentElement;
  //       var l = div.getElementsByTagName(HTML_TAG.LABEL)[0];
  //       if(!Utils.isEmpty(root) && !Utils.isEmpty(root.parentElement)) {
  //         if(Utils.inJson(o, CUSTOMIZE.REQUIRED) && o[CUSTOMIZE.REQUIRED]) {
  //           const label = l.innerHTML;
  //           if(!required) {
  //             var msg = '';
  //             if(targets.includes(type)) {
  //               msg = label + Msg.getMsg(null, this.state.isUser.language, 'required');
  //               // msg = o[CUSTOMIZE.LABEL + '_' + this.state.isUser.language] + Msg.getMsg(null, this.state.isUser.language, 'required');
  //             } else {
  //               msg = label + Msg.getMsg(null, this.state.isUser.language, 'selected');
  //               // msg = o[CUSTOMIZE.LABEL + '_' + this.state.isUser.language] + Msg.getMsg(null, this.state.isUser.language, 'selected');
  //             }
  //             l.innerHTML = "<font class='required'>" + msg + "</font>";
  //             setTimeout(function() {
  //               l.innerHTML = label;
  //             }, 3000);
  //           } else {
  //             l.innerHTML = label + "<font class='required'>*</font>";
  //           }
  //         }
  //         if(Utils.inJson(o, CUSTOMIZE.STYLE) && !Utils.isEmpty(o[CUSTOMIZE.STYLE])) {
  //           l.setAttribute('style', o[CUSTOMIZE.STYLE]);
  //         }
  //       }
  //     }
  //   });
  // }

  _onFormValidate() {
    this.state.form.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.map((obj) => {
          this._onCheckValidate(obj);
        });
      } else {
        this._onCheckValidate(objs);
      }
    });
  }

  _onFormAddAttribute() {
    this.state.form.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        objs.map((obj) => {
          this._onAddAttribute(obj);
        });
      } else {
        this._onAddAttribute(objs);
      }
    });
  }

  _onResetButtons() {
    return(
        <Alert
          show={ this.state.alertActions.show }
          variant={ VARIANT_TYPES.LIGHT }
          style={ this.state.alertActions.style }
          className={ 'div-customize-actions div-customize-actions-child' }>

        <Button
          type={ HTML_TAG.BUTTON }
          className={ 'btn-hidden' }
          onMouseOver={ this._onMouseOut.bind(this) }
          onClick={ this._onResetClick.bind(this) }
          variant={ VARIANT_TYPES.SECONDARY }>
          <FaTimes />
        </Button>
      </Alert>
    );
  }

  _onResetClick() {
    const obj = this.state.overObject;
    if(Utils.isEmpty(obj)) return;
    const div = Html.getDivParent(obj);
    if(Utils.isEmpty(div) || Utils.isEmpty(div.id)) return;
    const fIdx = div.id.split('_')[2];
    const nav = div.childNodes[0];
    var object = null;
    if(nav.tagName === HTML_TAG.NAV) {
      object = this.state.form[fIdx].object[Html.getIdxTabSelected(nav)];
    } else {
      object = this.state.form[fIdx].object;
    }
    if(Utils.isEmpty(object)) return;
    var objs = Array.from(obj.parentElement.childNodes);
    if(Utils.isEmpty(objs) || obj.length < 2) return;
    const target = objs[0];
    if(Utils.isEmpty(target) && Utils.isEmpty(target.getAttribute('for'))) return;
    const field = target.getAttribute('for').replace('root_', '');
    if(Utils.isEmpty(field)) return;
    const type = field.split('_')[0];
    if(type === TYPE.CHECKBOX || type === TYPE.FILE) {
      var p = objs[1].childNodes[0];
      var isArray = false;
      if(p.tagName === HTML_TAG.DIV) isArray = (objs[1].childNodes.length > 1);
      if(type === TYPE.FILE && !isArray) {
        const input = objs[1].childNodes[0].getElementsByTagName(HTML_TAG.INPUT)[0];
        input.value = '';
        if(!Utils.isEmpty(input)) isArray = input.multiple;
      }
      if(isArray) {
        object.data[field] = [];
      } else {
        object.data[field] = '';
      }
    } else {
      object.data[field] = '';
    }
    this.state.overObject = null;
    this.forceUpdate();
  }

  _onMouseOver(e) {
    const obj = e.target;
    const attr = obj.getAttribute('for');
    if(Utils.isEmpty(attr)) return;
    obj.addEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    this.state.overObject = obj;
    this.state.alertActions.style = { top: obj.offsetTop, left : (obj.offsetLeft + obj.offsetWidth) - 30 };
    this.state.alertActions.show = true;
    this.forceUpdate();
  }

  _onMouseOut(e) {
    const obj = Html.getButton(e);
    if(!Utils.isEmpty(obj.className) && obj.className.startsWith('form-')) return;
    if(obj.tagName === HTML_TAG.BUTTON && obj.className.indexOf('btn-hidden') !== -1) {
      this.state.alertActions.show = true;
    } else {
      this.state.alertActions.show = false;
    }
    if(!Utils.isEmpty(this.state.overObject)) {
      this.state.overObject.removeEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    }
    this.forceUpdate();
  }

  _onFindFields() {
    const div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    const childs = Array.from(div.childNodes);
    childs.map((o) => {
      const obj = o.childNodes[0].childNodes[0].childNodes[0];
      if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.FIELDSET) {
        const objs = Array.from(obj.childNodes);
        objs.map((d) => {
          if(d.tagName === HTML_TAG.DIV) {
            const l = d.getElementsByTagName(HTML_TAG.LABEL)[0];
            if(!Utils.isEmpty(l.getAttribute('for'))) {
              var type = l.getAttribute('for').replace('root_', '');
              type = type.split('_')[0];
              if(!Utils.isEmpty(l) && type !== TYPE.IMAGE && type !== TYPE.DISABLE)
                l.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);    
            }
          }
        });
      }
    });
  }
  
  componentDidMount() {
    this._onFormAddAttribute();
    this._onFindFields();
  }

  render() {
    this.state.isUser.actions = PAGE_ACTION.CREATE;

    return (
      <div>
        { this._onResetButtons() }
        <Actions
            isUser={ this.state.isUser }
            onClickBack={ this._onClickBack.bind(this) }
            onClickSubmit={ this._onClickSubmit.bind(this) } />
        <div className="div-title">
          <h5>{ this.state.isUser.path + '/' + this.state.isUser.action }</h5>
        </div>

        <CForm
          isUser={ this.state.isUser }
          form={ this.state.form }
          updateFormData={ this._onUpdateFormData.bind(this) } />
      </div>
    )

  };
};

export default connect()(withRouter(Create));