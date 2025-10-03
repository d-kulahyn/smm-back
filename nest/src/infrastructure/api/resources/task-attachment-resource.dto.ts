import { DateFormatter, FormattedDate } from '../../../shared/formatters/date.formatter';

export class TaskAttachmentResource {
  id: string;
  task_id: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  download_url: string;
  uploaded_by: string;
  uploader?: any;
  created_at: FormattedDate;

  constructor(attachment: any) {
    this.id = attachment.id;
    this.task_id = attachment.taskId;
    this.original_name = attachment.originalName;
    this.file_path = attachment.filePath;
    this.file_size = attachment.fileSize;
    this.mime_type = attachment.mimeType;
    this.download_url = `/storage/tasks/${attachment.filePath}`;
    this.uploaded_by = attachment.uploadedBy;
    this.created_at = DateFormatter.formatCreatedAt(attachment.createdAt);

    if (attachment.uploader) {
      this.uploader = {
        id: attachment.uploader.id,
        name: attachment.uploader.name,
        email: attachment.uploader.email,
        avatar: attachment.uploader.avatar ? `/storage/${attachment.uploader.avatar}` : null,
      };
    }
  }

  static fromEntity(attachment: any): TaskAttachmentResource {
    return new TaskAttachmentResource(attachment);
  }

  static collection(attachments: any[]): TaskAttachmentResource[] {
    return attachments.map(attachment => new TaskAttachmentResource(attachment));
  }
}
