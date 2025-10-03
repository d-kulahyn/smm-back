"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAttachmentResource = void 0;
const date_formatter_1 = require("../../../shared/formatters/date.formatter");
class TaskAttachmentResource {
    constructor(attachment) {
        this.id = attachment.id;
        this.task_id = attachment.taskId;
        this.original_name = attachment.originalName;
        this.file_path = attachment.filePath;
        this.file_size = attachment.fileSize;
        this.mime_type = attachment.mimeType;
        this.download_url = `/storage/tasks/${attachment.filePath}`;
        this.uploaded_by = attachment.uploadedBy;
        this.created_at = date_formatter_1.DateFormatter.formatCreatedAt(attachment.createdAt);
        if (attachment.uploader) {
            this.uploader = {
                id: attachment.uploader.id,
                name: attachment.uploader.name,
                email: attachment.uploader.email,
                avatar: attachment.uploader.avatar ? `/storage/${attachment.uploader.avatar}` : null,
            };
        }
    }
    static fromEntity(attachment) {
        return new TaskAttachmentResource(attachment);
    }
    static collection(attachments) {
        return attachments.map(attachment => new TaskAttachmentResource(attachment));
    }
}
exports.TaskAttachmentResource = TaskAttachmentResource;
//# sourceMappingURL=task-attachment-resource.dto.js.map