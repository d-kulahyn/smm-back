"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMemberRole = exports.MessageType = exports.ChatStatus = exports.ProjectStatus = exports.InvitationStatus = exports.ProjectRole = exports.TaskPriority = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["pending"] = "pending";
    TaskStatus["on_hold"] = "on_hold";
    TaskStatus["completed"] = "completed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["OWNER"] = "owner";
    ProjectRole["ADMIN"] = "admin";
    ProjectRole["MEMBER"] = "member";
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "pending";
    InvitationStatus["ACCEPTED"] = "accepted";
    InvitationStatus["REJECTED"] = "rejected";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["INACTIVE"] = "inactive";
    ProjectStatus["COMPLETED"] = "completed";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ChatStatus;
(function (ChatStatus) {
    ChatStatus["ACTIVE"] = "active";
    ChatStatus["ARCHIVED"] = "archived";
})(ChatStatus || (exports.ChatStatus = ChatStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["VIDEO"] = "video";
    MessageType["FILE"] = "file";
})(MessageType || (exports.MessageType = MessageType = {}));
var ChatMemberRole;
(function (ChatMemberRole) {
    ChatMemberRole["ADMIN"] = "admin";
    ChatMemberRole["MEMBER"] = "member";
    ChatMemberRole["MODERATOR"] = "moderator";
})(ChatMemberRole || (exports.ChatMemberRole = ChatMemberRole = {}));
//# sourceMappingURL=index.js.map