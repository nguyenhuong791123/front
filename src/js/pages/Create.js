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
import InputCalendarBox from '../utils/Compoment/InputCalendarBox';

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
        "object_key": "page_nz8uv4e4u1",
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
              "text_qvu72u6dvz": {
                "type": "string",
                "title": "Text",
                "idx": 3,
                "language": "ja",
                "obj": {
                  "label_ja": "Text",
                  "placeholder_ja": "Placeholder",
                  "item_type": "text",
                  "language": "ja",
                  "label_color": "#4379a3",
                  "label_layout_color": "#d8baba",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "デフォルト",
                  "max_length": "30",
                  "required": true,
                  "item_name": "text_qvu72u6dvz"
                }
              },
              "textarea_o9syv8jtiy": {
                "type": "string",
                "title": "TextArea",
                "idx": 9,
                "language": "ja",
                "obj": {
                  "label_ja": "TextArea",
                  "placeholder_ja": "Placeholder",
                  "item_type": "textarea",
                  "language": "ja",
                  "label_color": "#44639c",
                  "label_layout_color": "#a77272",
                  "box_width": 25,
                  "box_height": "178",
                  "default": "デフォルト",
                  "max_length": "500",
                  "required": true,
                  "item_name": "textarea_o9syv8jtiy"
                }
              },
              "date_7x8j2w1ngl": {
                "type": "string",
                "title": "Date",
                "idx": 1,
                "language": "ja",
                "obj": {
                  "label_ja": "Date",
                  "placeholder_ja": "",
                  "item_type": "date",
                  "language": "ja",
                  "label_color": "#379a55",
                  "label_layout_color": "#cd9d9d",
                  "box_width": 25,
                  "box_height": 89,
                  "required": true,
                  "item_name": "date_7x8j2w1ngl",
                  "default": "2020-07-14"
                },
                "datetime": false
              },
              "datetime_vth4kc4bfd": {
                "type": "string",
                "title": "DateTime",
                "idx": 2,
                "language": "ja",
                "obj": {
                  "label_ja": "DateTime",
                  "placeholder_ja": "",
                  "item_type": "datetime",
                  "language": "ja",
                  "label_color": "#569cae",
                  "label_layout_color": "#c06262",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "2020-07-14T21:55",
                  "required": true,
                  "item_name": "datetime_vth4kc4bfd"
                },
                "datetime": true
              },
              "time_ljhcsxhe7c": {
                "type": "string",
                "title": "Time",
                "idx": 4,
                "language": "ja",
                "obj": {
                  "label_ja": "Time",
                  "placeholder_ja": "",
                  "item_type": "time",
                  "language": "ja",
                  "label_color": "#d0bb53",
                  "label_layout_color": "#5b3e7e",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "21:56",
                  "required": true,
                  "item_name": "time_ljhcsxhe7c"
                }
              },
              "number_7b80mdxqat": {
                "type": "number",
                "title": "Number",
                "idx": 5,
                "language": "ja",
                "obj": {
                  "label_ja": "Number",
                  "placeholder_ja": "Placeholder",
                  "item_type": "number",
                  "language": "ja",
                  "label_color": "#986161",
                  "label_layout_color": "#baeaf3",
                  "box_width": 25,
                  "box_height": 89,
                  "max_length": "9",
                  "required": true,
                  "item_name": "number_7b80mdxqat"
                }
              },
              "checkbox_bwwmzg64uj": {
                "type": "string",
                "title": "CheckBox one",
                "idx": 6,
                "language": "ja",
                "obj": {
                  "label_ja": "CheckBox one",
                  "placeholder_ja": "",
                  "item_type": "checkbox",
                  "language": "ja",
                  "label_color": "#d09a9a",
                  "label_layout_color": "#50798b",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    }
                  ],
                  "required": true,
                  "item_name": "checkbox_bwwmzg64uj",
                  "default": "1"
                },
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  }
                ],
                "required": true
              },
              "checkbox_pfecu0oxsf": {
                "type": "string",
                "title": "CheckBox in",
                "idx": 7,
                "language": "ja",
                "obj": {
                  "label_ja": "CheckBox in",
                  "placeholder_ja": "",
                  "item_type": "checkbox",
                  "language": "ja",
                  "label_color": "#508795",
                  "label_layout_color": "#8e5d5d",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "User1"
                    }
                  ],
                  "option_target": "groups",
                  "default": "1",
                  "required": true,
                  "item_name": "checkbox_pfecu0oxsf"
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
              "checkbox_b36j7knwnq": {
                "type": "string",
                "title": "CheckBox List",
                "idx": 8,
                "language": "ja",
                "obj": {
                  "label_ja": "CheckBox List",
                  "placeholder_ja": "",
                  "item_type": "checkbox",
                  "language": "ja",
                  "label_color": "#ca8c8c",
                  "label_layout_color": "#386c99",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "CCCCC"
                    },
                    {
                      "value": 2,
                      "label": "DDDDD"
                    },
                    {
                      "value": 3,
                      "label": "SSSSS"
                    },
                    {
                      "value": 4,
                      "label": "AAAA"
                    },
                    {
                      "value": 5,
                      "label": "WWWWW"
                    },
                    {
                      "value": 6,
                      "label": "QQQQQ"
                    }
                  ],
                  "option_checked": true,
                  "default": "3",
                  "required": true,
                  "item_name": "checkbox_b36j7knwnq"
                },
                "option_checked": true,
                "options": [
                  {
                    "value": 1,
                    "label": "CCCCC"
                  },
                  {
                    "value": 2,
                    "label": "DDDDD"
                  },
                  {
                    "value": 3,
                    "label": "SSSSS"
                  },
                  {
                    "value": 4,
                    "label": "AAAA"
                  },
                  {
                    "value": 5,
                    "label": "WWWWW"
                  },
                  {
                    "value": 6,
                    "label": "QQQQQ"
                  }
                ],
                "required": true
              },
              "radio_z9b5nu94js": {
                "type": "string",
                "title": "Radio in",
                "idx": 10,
                "language": "ja",
                "obj": {
                  "label_ja": "Radio in",
                  "placeholder_ja": "",
                  "item_type": "radio",
                  "language": "ja",
                  "label_color": "#814c90",
                  "label_layout_color": "#8f4242",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    },
                    {
                      "value": 2,
                      "label": "AAAAA"
                    }
                  ],
                  "default": "2",
                  "item_name": "radio_z9b5nu94js",
                  "required": true
                },
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  },
                  {
                    "value": 2,
                    "label": "AAAAA"
                  }
                ],
                "required": true
              },
              "radio_p0qy0somcy": {
                "type": "string",
                "title": "Radio List",
                "idx": 11,
                "language": "ja",
                "obj": {
                  "label_ja": "Radio List",
                  "placeholder_ja": "",
                  "item_type": "radio",
                  "language": "ja",
                  "label_color": "#a67777",
                  "label_layout_color": "#344c83",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "EEEEE"
                    },
                    {
                      "value": 2,
                      "label": "QQQQQ"
                    },
                    {
                      "value": 3,
                      "label": "DDDDD"
                    },
                    {
                      "value": 4,
                      "label": "AAAAA"
                    },
                    {
                      "value": 5,
                      "label": "SSSSS"
                    },
                    {
                      "value": 6,
                      "label": "ZZZZZ"
                    }
                  ],
                  "default": "3",
                  "required": true,
                  "item_name": "radio_p0qy0somcy"
                },
                "options": [
                  {
                    "value": 1,
                    "label": "EEEEE"
                  },
                  {
                    "value": 2,
                    "label": "QQQQQ"
                  },
                  {
                    "value": 3,
                    "label": "DDDDD"
                  },
                  {
                    "value": 4,
                    "label": "AAAAA"
                  },
                  {
                    "value": 5,
                    "label": "SSSSS"
                  },
                  {
                    "value": 6,
                    "label": "ZZZZZ"
                  }
                ],
                "required": true
              },
              "select_kwqg0490eb": {
                "type": "string",
                "title": "Select",
                "idx": 12,
                "language": "ja",
                "obj": {
                  "label_ja": "Select",
                  "placeholder_ja": "",
                  "item_type": "select",
                  "language": "ja",
                  "label_color": "#665095",
                  "label_layout_color": "#b67777",
                  "box_width": 25,
                  "box_height": 89,
                  "options": [
                    {
                      "value": 1,
                      "label": "QQQQQ"
                    },
                    {
                      "value": 2,
                      "label": "AAAAA"
                    },
                    {
                      "value": 3,
                      "label": "SSSSS"
                    },
                    {
                      "value": 4,
                      "label": "EEEEE"
                    }
                  ],
                  "default": "2",
                  "required": true,
                  "item_name": "select_kwqg0490eb"
                },
                "options": [
                  {
                    "value": 1,
                    "label": "QQQQQ"
                  },
                  {
                    "value": 2,
                    "label": "AAAAA"
                  },
                  {
                    "value": 3,
                    "label": "SSSSS"
                  },
                  {
                    "value": 4,
                    "label": "EEEEE"
                  }
                ],
                "required": true
              },
              "file_u3klqjktel": {
                "type": "string",
                "title": "File",
                "idx": 13,
                "language": "ja",
                "obj": {
                  "label_ja": "File",
                  "placeholder_ja": "",
                  "item_type": "file",
                  "language": "ja",
                  "label_color": "#533777",
                  "label_layout_color": "#225b77",
                  "box_width": 25,
                  "box_height": 89,
                  "required": true,
                  "max_length": "5",
                  "item_name": "file_u3klqjktel"
                },
                "format": "data-url"
              },
              "file_2uyl0qn93h": {
                "type": "array",
                "title": "File Multi",
                "idx": 14,
                "language": "ja",
                "obj": {
                  "label_ja": "File Multi",
                  "placeholder_ja": "",
                  "item_type": "file",
                  "language": "ja",
                  "label_color": "#6e4087",
                  "label_layout_color": "#347f7d",
                  "box_width": 25,
                  "box_height": 89,
                  "multiple_file": true,
                  "required": true,
                  "max_length": "5",
                  "item_name": "file_2uyl0qn93h"
                },
                "items": {
                  "type": "string",
                  "format": "data-url"
                }
              },
              "password_bz55trgzcr": {
                "type": "string",
                "title": "Password",
                "idx": 15,
                "language": "ja",
                "obj": {
                  "label_ja": "Password",
                  "placeholder_ja": "Placeholder",
                  "item_type": "password",
                  "language": "ja",
                  "label_color": "#704242",
                  "label_layout_color": "#32798b",
                  "box_width": 25,
                  "box_height": 89,
                  "required": true,
                  "max_length": "8",
                  "item_name": "password_bz55trgzcr"
                }
              },
              "disabled_it2f6yrvto": {
                "type": "string",
                "title": "Disable",
                "idx": 17,
                "language": "ja",
                "obj": {
                  "label_ja": "Disable",
                  "placeholder_ja": "",
                  "item_type": "disabled",
                  "language": "ja",
                  "label_color": "#337574",
                  "label_layout_color": "#8d6f30",
                  "box_width": 25,
                  "box_height": 89,
                  "childens": 1,
                  "default": "デフォルト",
                  "item_name": "disabled_it2f6yrvto"
                }
              },
              "childens_kn5kaptqb1": {
                "type": "string",
                "title": "Pages",
                "idx": 16,
                "language": "ja",
                "obj": {
                  "label_ja": "Pages",
                  "placeholder_ja": "",
                  "item_type": "childens",
                  "language": "ja",
                  "label_color": "#497d97",
                  "label_layout_color": "#64a084",
                  "box_width": "75",
                  "box_height": 178,
                  "childens": 1,
                  "style": "font-weight: bold;",
                  "item_name": "childens_kn5kaptqb1"
                }
              },
              "color_c6qwbn44co": {
                "type": "string",
                "title": "Color",
                "idx": 18,
                "language": "ja",
                "obj": {
                  "label_ja": "Color",
                  "placeholder_ja": "",
                  "item_type": "color",
                  "language": "ja",
                  "label_color": "#ecb6b6",
                  "label_layout_color": "#2c8081",
                  "box_width": 25,
                  "box_height": 89,
                  "default": "#292197",
                  "required": true,
                  "item_name": "color_c6qwbn44co"
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
            "text_qvu72u6dvz": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "max_length": "30",
              "style": "color:#4379a3;background-color:#d8baba;",
              "required": true
            },
            "textarea_o9syv8jtiy": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-178",
              "ui:widget": "textarea",
              "max_length": "500",
              "style": "color:#44639c;background-color:#a77272;",
              "required": true
            },
            "date_7x8j2w1ngl": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "style": "color:#379a55;background-color:#cd9d9d;",
              "required": true
            },
            "datetime_vth4kc4bfd": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "style": "color:#569cae;background-color:#c06262;",
              "required": true
            },
            "time_ljhcsxhe7c": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "style": "color:#d0bb53;background-color:#5b3e7e;",
              "required": true
            },
            "number_7b80mdxqat": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "max_length": "9",
              "style": "color:#986161;background-color:#baeaf3;",
              "required": true
            },
            "checkbox_bwwmzg64uj": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#d09a9a;background-color:#50798b;",
              "required": true
            },
            "checkbox_pfecu0oxsf": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#508795;background-color:#8e5d5d;",
              "required": true
            },
            "checkbox_b36j7knwnq": {
              "classNames": "div-box div-box-25 div-box-height-89 div-not-inline div-not-inline",
              "style": "color:#ca8c8c;background-color:#386c99;",
              "required": true
            },
            "radio_z9b5nu94js": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#814c90;background-color:#8f4242;",
              "required": true
            },
            "radio_p0qy0somcy": {
              "classNames": "div-box div-box-25 div-box-height-89 div-inline",
              "style": "color:#a67777;background-color:#344c83;",
              "required": true
            },
            "select_kwqg0490eb": {
              "classNames": "div-box div-box-25 div-box-height-89 div-not-inline",
              "style": "color:#665095;background-color:#b67777;",
              "required": true
            },
            "file_u3klqjktel": {
              "classNames": "div-box div-box-25 div-box-height-89 div-file-box",
              "max_length": "5",
              "style": "color:#533777;background-color:#225b77;",
              "required": true
            },
            "file_2uyl0qn93h": {
              "classNames": "div-box div-box-25 div-box-height-89 div-file-box",
              "max_length": "5",
              "style": "color:#6e4087;background-color:#347f7d;",
              "required": true
            },
            "password_bz55trgzcr": {
              "ui:placeholder": "Placeholder",
              "classNames": "div-box div-box-25 div-box-height-89",
              "ui:widget": "password",
              "max_length": "8",
              "style": "color:#704242;background-color:#32798b;",
              "required": true
            },
            "disabled_it2f6yrvto": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "ui:disabled": true,
              "style": "color:#337574;background-color:#8d6f30;"
            },
            "childens_kn5kaptqb1": {
              "classNames": "div-box div-box-75 div-box-height-178 div-customize-table",
              "style": "color:#497d97;background-color:#64a084;font-weight: bold;"
            },
            "color_c6qwbn44co": {
              "classNames": "div-box div-box-25 div-box-height-89",
              "ui:widget": "color",
              "style": "color:#ecb6b6;background-color:#2c8081;",
              "required": true
            }
          },
          "data": {
            "text_qvu72u6dvz": "デフォルト",
            "textarea_o9syv8jtiy": "デフォルト",
            "date_7x8j2w1ngl": "2020-07-04",
            "datetime_vth4kc4bfd": "2020-07-14T21:55",
            "time_ljhcsxhe7c": "21:56",
            "checkbox_bwwmzg64uj": 1,
            "checkbox_pfecu0oxsf": 1,
            "checkbox_b36j7knwnq": [
              "3"
            ],
            "radio_z9b5nu94js": 2,
            "radio_p0qy0somcy": 3,
            "select_kwqg0490eb": 2,
            "disabled_it2f6yrvto": "デフォルト",
            "childens_kn5kaptqb1": 1,
            "color_c6qwbn44co": "#292197"
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
    const targets = [ TYPE.IMAGE, TYPE.TIME, TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT, TYPE.CHILDENS, TYPE.DATE, TYPE.DATETIME ];
    uiKeys.map((o) => {
      const field = o.split('_')[0];
      if(!Utils.isEmpty(field) && (targets.includes(field))) {
        if(field === TYPE.IMAGE && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = ImageBox;
        if(field === TYPE.TIME && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TimeBox;
        if(field === TYPE.RADIO && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = RadioBox;
        if(field === TYPE.CHECKBOX && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = CheckBox;
        if(field === TYPE.SELECT && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = SelectBox;
        if(field === TYPE.CHILDENS && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = TableBox;
        if((field === TYPE.DATE || field === TYPE.DATETIME) && !Utils.inJson(ui[o], 'ui:widget')) ui[o]['ui:widget'] = InputCalendarBox;
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
                }, 2000);  
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
  //             }, 2000);
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
    } else if(type === TYPE.CHILDENS) {
      const key = target.getAttribute('for');
      const div = document.getElementById(key);
      if(Utils.isEmpty(div) || Array.from(div.childNodes).length < 2) return;
      const headers = div.childNodes[1];
      if(Utils.isEmpty(headers) || Utils.isEmpty(headers.id) || headers.id.indexOf(key) === -1) return;
      const tr = headers.childNodes[0].getElementsByTagName(HTML_TAG.TR)[0];
      if(Utils.isEmpty(tr)) return;
      const ths = Array.from(tr.childNodes);
      ths.map((o) => {
        const obj = o.childNodes[0];
        if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.INPUT) {
          if(obj.getAttribute('type') === TYPE.CHECKBOX && obj.checked) {
            // obj.checked = false;
            obj.click();
          } else {
            obj.value = '';
          }
        }
      });
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