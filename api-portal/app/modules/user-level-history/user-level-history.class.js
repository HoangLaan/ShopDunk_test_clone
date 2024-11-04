const Transform = require("../../common/helpers/transform.helper");

const template = {
    user_level_history_id: "{{#? USERLEVELHISTORYID}}",
    apply_date: "{{#? APPLYDATE}}",
    fullname: "{{#? FULLNAME}}",
    username:  {
        id: "{{#? USERNAME}}",
        value: "{{#? USERNAME}}",
        label: "{{#? FULLNAME}}",
        name: "{{#? FULLNAME}}"
    },
    department_new_name: "{{#? DEPARTMENTNEWNAME}}",
    position_new_name: "{{#? POSITIONNEWNAME}}",
    department_new_id: "{{#? DEPARTMENTNEWID}}",
    position_new_id: "{{#? POSITIONNEWID}}",
    department_old_id: "{{#? DEPARTMENTOLDID}}",
    position_old_id: "{{#? POSITIONOLDID}}",
    position_level_old_name: "{{#? POSITIONLEVELOLDNAME}}",
    position_level_old_id: "{{#? POSITIONLEVELOLDID}}",
    position_level_new_name: "{{#? POSITIONLEVELNEWNAME}}",
    position_level_new_id: "{{#? POSITIONLEVELNEWID}}",
    created_user: "{{#? CREATEDUSER}}",
    reason: "{{#? REASON}}",

    id: "{{#? USERNAME}}",
    name: "{{#? FULLNAME}}",
    value: "{{#? USERNAME}}",
    label: "{{#? FULLNAME}}",

    position: [
        {
            id: "{{#? POSITIONOLDID}}",
            name: "{{#? POSITIONNAME}}",
            value: "{{#? POSITIONOLDID}}",
            label: "{{#? POSITIONNAME}}",
        }
    ],
    department: [
        {
            id: "{{#? DEPARTMENTOLDID}}",
            name: "{{#? DEPARTMENTNAME}}",
            value: "{{#? DEPARTMENTOLDID}}",
            label: "{{#? DEPARTMENTNAME}}",
        }
    ],
    position_level: [
        {
            id: "{{#? POSITIONLEVELOLDID}}",
            name: "{{#? POSITIONLEVELNAME}}",
            value: "{{#? POSITIONLEVELOLDID}}",
            label: "{{#? POSITIONLEVELNAME}}",
        }
    ]
};

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        "user_level_history_id",
        "apply_date",
        "reason",
        "username",
        "department_old_id",
        "department_new_id",
        "position_old_id",
        "position_new_id",
        "position_level_new_id",
        "position_level_old_id",
        "fullname"
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        "user_level_history_id",
        "fullname",
        "position_new_name",
        "department_new_name",
        "position_level_old_name",
        "position_level_new_name",
        "created_user",
        "reason",
        "apply_date"
    ]);
};

const userOptions = (data = []) => {
    return transform.transform(data, [
        "id",
        "name",
        'value',
        'label'
    ]);
}

const detailUser = (data = []) => {
    return transform.transform(data, [
        'position',
        'department',
        'position_level',
        'department_old_id',
        'position_old_id',
        'position_level_old_id'
    ]);
}

module.exports = {
    list,
    detail,
    userOptions,
    detailUser
};
