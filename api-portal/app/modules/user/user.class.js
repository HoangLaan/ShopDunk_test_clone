const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    user_id: '{{#? USERID}}',
    full_name: '{{#? FULLNAME}}',
    email: '{{#? EMAIL}}',
    phone_number: '{{#? PHONENUMBER}}',
    address_full: '{{#? ADDRESSFULL}}',
    gender: '{{ GENDER ? 1 : 0 }}',
    default_picture_url: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    user_name: '{{#? USERNAME}}',
    sub_username: '{{#? SUBUSERNAME}}',
    password: '{{#? PASSWORD}}',
    first_name: '{{#? FIRSTNAME}}',
    last_name: '{{#? LASTNAME}}',
    birthday: '{{#? BIRTHDAY }}',
    user_level_id: '{{#? USERLEVELID}}',

    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    country_id: '{{#? COUNTRYID}}',
    address: '{{#? ADDRESS}}',

    current_province_id: '{{#? CURRENTPROVINCEID}}',
    current_district_id: '{{#? CURRENTDISTRICTID}}',
    current_ward_id: '{{#? CURRENTWARDID}}',
    current_country_id: '{{#? CURRENTCOUNTRYID}}',
    current_address: '{{#? CURRENTADDRESS}}',

    permanent_province_id: '{{#? PERMANENTPROVINCEID}}',
    permanent_district_id: '{{#? PERMANENTDISTRICTID}}',
    permanent_ward_id: '{{#? PERMANENTWARDID}}',
    permanent_country_id: '{{#? PERMANENTCOUNTRYID}}',
    permanent_address: '{{#? PERMANENTADDRESS}}',

    description: '{{#? DESCRIPTION}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_id: '{{#? POSITIONID}}',
    position_name: '{{#? POSITIONNAME}}',
    position_level_name: '{{#? POSITIONLEVELNAME}}',
    user_groups: '{{#? USERGROUPS.split("|")}}',
    user_business: '{{#? USERBUSINESS.split("|")}}',
    about_me: '{{#? ABOUTME}}',
    updated_user: '{{#? UPDATEDUSER}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    entry_date: '{{#? ENTRYDATE}}',
    identity_date: '{{#? IDENTITYDATE}}',
    identity_number: '{{#? IDENTITYNUMBER}}',
    identity_place: '{{#? IDENTITYPLACE}}',
    identity_front_image: [
        {
            '{{#if IDENTITYFRONTIMAGE}}': `${config.domain_cdn}{{IDENTITYFRONTIMAGE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    identity_back_image: [
        {
            '{{#if IDENTITYBACKIMAGE}}': `${config.domain_cdn}{{IDENTITYBACKIMAGE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_time_keeping: '{{ISTIMEKEEPING ? 1 : 0}}',
    quit_job_date: '{{#? QUITJOBDATE}}',
    status: '{{STATUS ? 1 : 0}}',
    company_name: '{{#? COMPANYNAME}}',
    hard_salary: '{{#? HARDSALARY}}',
    level_id: '{{#? LEVELID}}',
    user_level_id: '{{#? USERLEVELID}}',
    company_id: '{{#? COMPANYID }}',
    email_company: '{{#? EMAILCOMPANY}}',

    user_status: '{{#? USERSTATUS}}',
    block_id: '{{#? BLOCKID}}',
    nation_id: '{{#? NATIONID}}',
    marital_status: '{{MARITALSTATUS ? 1 : 0}}',
    number_of_children: '{{#? NUMBEROFCHILDREN}}',
    emergency_contact: '{{#? EMERGENCYCONTACT}}',
    emergency_phone: '{{#? EMERGENCYPHONE}}',
    tax_code: '{{#? TAXCODE}}',

    work_address: '{{#? WORKADDRESS}}',
    is_sync_voip: '{{#? ISSYNCVOIP}}',
    voip_ext: '{{#? VOIPEXT}}',
    is_enough: '{{#? ISENOUGH}}',

    block_name: '{{#? BLOCKNAME}}',
    birth_day: '{{#? BIRTHDAY}}',
    email_company: '{{#? EMAILCOMPANY}}',
    nation_name: '{{#? NATIONNAME}}',

    apprentice_date: '{{#? APPRENTICEDATE}}',
    probation_date: '{{#? PROBATIONDATE}}',
    entry_date: '{{#? ENTRYDATE}}',

    full_address: '{{#? FULLADDRESS}}',
    current_address: '{{#? CURRENTADDRESS}}',

    business_stores: '{{#? BUSINESSSTORES}}',
    user_sample_images: [
        {
            '{{#if USERSAMPLEIMAGES}}': `${config.domain_cdn}{{USERSAMPLEIMAGES}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
};

let transform = new Transform(template);

const basicInfo = (user) => {
    return transform.transform(user, ['user_id', 'user_name', 'password', 'full_name', 'email', 'phone_number']);
};

const detail = (user) => {
    return transform.transform(user, [
        'user_id',
        'user_name',
        'sub_username',
        'full_name',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'gender',
        'default_picture_url',
        'birthday',
        'hard_salary',
        'entry_date',
        'quitjob_date',
        'department_id',
        'position_id',
        'user_level_id',
        'user_status',
        'block_id',
        'nation_id',
        'description',

        'marital_status',
        'number_of_children',
        'emergency_contact',
        'emergency_phone',
        'tax_code',
        'about_me',
        'address',
        'province_id',
        'district_id',
        'country_id',
        'ward_id',
        'current_address',
        'current_province_id',
        'current_district_id',
        'current_country_id',
        'current_ward_id',
        'permanent_address',
        'permanent_province_id',
        'permanent_district_id',
        'permanent_country_id',
        'permanent_ward_id',

        'identity_date',
        'identity_number',
        'identity_place',
        'identity_front_image',
        'identity_back_image',
        'is_active',
        'is_time_keeping',
        'quit_job_date',

        'company_id',
        'email_company',
        'created_user',
        'created_date',
        'user_level_id',
        'work_address',
        'is_sync_voip',
        'voip_ext',
        'is_enough',
        'user_sample_images',
        'probation_date',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, Object.keys(template));
};

const banks = (bankusers = []) => {
    const transform = new Transform({
        user_id: '{{#? USERID}}',
        bank_user_id: '{{#? BANKUSERID}}',
        bank_id: '{{#? BANKID}}',
        bank_number: '{{#? BANKNUMBER}}',
        bank_branch: '{{#? BANKBRANCH}}',
        is_default: '{{ISDEFAULT ? 1 : 0}}',
    });
    return transform.transform(bankusers, ['bank_id', 'bank_user_id', 'bank_branch', 'bank_number', 'is_default']);
};

const userGroups = (groups = []) => {
    const transform = new Transform({
        user_id: '{{#? USERID}}',
        id: '{{#? USERGROUPID}}',
        value: '{{#? USERGROUPID}}',
    });
    return transform.transform(groups, ['id', 'user_id', 'value']);
};

const userEducations = (educations = []) => {
    const transform = new Transform({
        user_id: '{{#? USERID}}',
        education_level_id: '{{#? EDUCATIONLEVELID}}',
        training_center: '{{#? TRAININGCENTER}}',
        specialized: '{{#? SPECIALIZED}}',
        graduation_year: '{{#? GRADUATIONYEAR}}',
        education_user_id: '{{#? EDUCATIONUSERID}}',
    });
    return transform.transform(educations, [
        'education_level_id',
        'user_id',
        'training_center',
        'specialized',
        'graduation_year',
        'education_user_id',
    ]);
};

const userDocuments = (documents = []) => {
    const transform = new Transform({
        user_id: '{{#? USERID}}',
        document_id: '{{#? DOCUMENTID}}',
        attachment_name: '{{#? ATTACHMENTNAME}}',
        attachment_path: [
            {
                '{{#if ATTACHMENTPATH}}': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        document_type_id: '{{#? DOCUMENTTYPEID}}',
        description: '{{#? DESCRIPTION}}',
        is_review: '{{#? ISREVIEW}}',
        review_user: '{{#? REVIEWUSER}}',
        review_date: '{{#? REVIEWDATE}}',
        review_note: '{{#? REVIEWNOTE}}',
        review_user_fullname: '{{#? REVIEWUSERFULLNAME}}',
        is_expected: '{{ISEXPECTED ? 1 : 0}}',
    });
    return transform.transform(documents, [
        'document_id',
        'user_id',
        'attachment_name',
        'attachment_path',
        'document_type_id',
        'description',
        'is_review',
        'review_user',
        'review_date',
        'review_note',
        'review_user_fullname',
        'is_expected',
    ]);
};

const userHobbies = (hobbies = []) => {
    const transform = new Transform({
        id: '{{#? HOBBIESID}}',
        value: '{{#? HOBBIESID}}',
        label: '{{#? HOBBIESNAME}}',
    });

    return transform.transform(hobbies, ['id', 'value', 'label']);
};

const profile = (user) => {
    return transform.transform(user, [
        'user_id',
        'full_name',
        'email',
        'phone_number',
        'address',
        'gender',
        'default_picture_url',
        'user_name',
        'first_name',
        'last_name',
        'birthday',
        'province_id',
        'district_id',
        'country_id',
        'description',
        'department_id',
        'user_business',
        'position_id',
        'about_me',
        'user_groups',
        'ward_id',
        'company_id',
        'is_sync_voip',
        'voip_ext',
    ]);
};

const generateUsername = (user) => {
    return transform.transform(user, ['user_name']);
};

// options
const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    user_name: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
};

const options = (userGroups = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(userGroups, ['id', 'name', 'user_name', 'full_name']);
};

//skill
const templateSkill = {
    skill_group_id: '{{#? SKILLGROUPID}}',
    skill_id: '{{#? SKILLID}}',
    skill_group_name: '{{#? SKILLGROUPNAME}}',
    skill_name: '{{#? SKILLNAME}}',
    required_level_id: '{{#? REQUIREDLEVELID}}',
    levels: '{{#? LEVELS}}',
    level_id: '{{#? LEVELID}}',
    file_name: '{{#? FILENAME}}',
    file_path: [
        {
            '{{#if FILEPATH}}': `${config.domain_cdn}{{FILEPATH}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
};

let skillTransform = new Transform(templateSkill);
const skillGroupSkill = (skillGroupSkills = []) => {
    return skillTransform.transform(skillGroupSkills, ['skill_group_id', 'skill_id']);
};

const skillGroup = (skillGroups = []) => {
    return skillTransform.transform(skillGroups, ['skill_group_id', 'skill_group_name']);
};

const skill = (skills = []) => {
    return skillTransform.transform(skills, ['skill_id', 'skill_name', 'required_level_id', 'levels', 'level_id']);
};

const skillGroupSkillLevel = (skillGroupSkillLevels = []) => {
    return skillTransform.transform(skillGroupSkillLevels, ['skill_group_id', 'skill_id', 'level_id']);
};

const jdFile = (obj = {}) => {
    return skillTransform.transform(obj, ['file_name', 'file_path']);
};

const salaryHistory = (list = []) => {
    const transform = new Transform({
        created_date: '{{#? CREATEDDATE}}',
        created_user: '{{#? CREATEDUSER}}',
        effective_date: '{{#? EFFECTIVEDATE}}',
        old_salary: '{{#? OLDSALARY}}',
        new_salary: '{{#? NEWSALARY}}',
        proposal_type_name: '{{#? PROPOSALTYPENAME}}',
    });

    return transform.transform(list, [
        'created_date',
        'created_user',
        'effective_date',
        'old_salary',
        'new_salary',
        'proposal_type_name',
    ]);
};

const positionHistory = (list = []) => {
    const transform = new Transform({
        created_date: '{{#? CREATEDDATE}}',
        created_user: '{{#? CREATEDUSER}}',
        effective_date: '{{#? EFFECTIVEDATE}}',
        proposal_type_name: '{{#? PROPOSALTYPENAME}}',
        content: '{{#? CONTENT}}',
    });

    return transform.transform(list, [
        'created_date',
        'created_user',
        'effective_date',
        'proposal_type_name',
        'content',
    ]);
};

const optionsShift = (data) => {
    const transform = new Transform({
        store_id: '{{#? STOREID}}',
        store_name: '{{#? STORENAME}}',
        business_id: '{{#? BUSINESSID}}',
        company_id: '{{#? COMPANYID}}',
    });
    return transform.transform(data, ['store_id', 'store_name', 'business_id', 'company_id']);
};

module.exports = {
    basicInfo,
    detail,
    list,
    generateUsername,
    options,
    banks,
    userDocuments,
    userGroups,
    userEducations,
    profile,
    skillGroupSkill,
    skillGroup,
    skill,
    skillGroupSkillLevel,
    jdFile,
    userHobbies,
    salaryHistory,
    positionHistory,
    optionsShift,
};
