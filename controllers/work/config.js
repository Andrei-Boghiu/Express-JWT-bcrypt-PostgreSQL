const forbiddenHeaders = [
    "id",
    "team_id",
    "created_by",
    "assignee_id",
    "",
    " "
];

const acceptableHeaders = [
    "priority",
    "due_date",
    "follow_up_date",
    "aux_id",
    "aux_tool",
    "aux_subject",
    "aux_status",
    "aux_queue",
    "aux_creation_date"
];

const uploadRequiredHeaders = [
    "aux_id",
    "aux_tool"
]

const updateRequiredHeaders = [
    "aux_id"
]

const updateSomeHeaders = [
    "status",
    "priority",
    "due_date",
    "follow_up_date",
    "aux_id",
    "aux_tool",
    "aux_subject",
    "aux_status",
    "aux_queue",
    "aux_creation_date"
]

const userStatusChange = [
    'Resolved',
    'Pending'
]

module.exports = { uploadRequiredHeaders, updateRequiredHeaders, updateSomeHeaders, acceptableHeaders, forbiddenHeaders, userStatusChange }