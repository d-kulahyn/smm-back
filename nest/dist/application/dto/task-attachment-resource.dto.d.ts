import { FormattedDate } from '../../shared/formatters/date.formatter';
export declare class TaskAttachmentResource {
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
    constructor(attachment: any);
    static fromEntity(attachment: any): TaskAttachmentResource;
    static collection(attachments: any[]): TaskAttachmentResource[];
}
