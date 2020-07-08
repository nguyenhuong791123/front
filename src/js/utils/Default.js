export const DEFAULT_DIV_BLOCK = {
    object_type: 'div'
    ,class_name: 'div-box-100'
    ,object: { schema: { type: 'object', title: 'DIV', idx: 0, properties: {}}, ui: {}, data: {}}
}
export const DEFAULT_TAB_BLOCK = {
    object_type: 'tab'
    ,active: 0
    ,class_name: 'div-box-100'
    ,object: [{ schema: { type: 'object', tab_name: 'TAB', idx: 0, properties: {}}, ui: {}, data: {} }, { schema: { type: 'object', tab_name: 'TAB1', idx: 1, properties: {}}, ui: {}, data: {} }]
}