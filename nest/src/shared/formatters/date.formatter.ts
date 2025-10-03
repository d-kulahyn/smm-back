export interface FormattedDate {
  formatted: string;
  relative: string;
  iso: string;
}

export class DateFormatter {
  /**
   * Format date for human-readable display
   * Format: "20 Oct 2025, 18:30"
   */
  static formatDate(date?: Date): string | null {
    if (!date) return null;

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ',');
  }

  /**
   * Format date with relative time (e.g., "2 hours ago")
   */
  static formatDateWithRelative(date?: Date): FormattedDate | null {
    if (!date) return null;

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let relative: string;
    if (diffInSeconds < 60) {
      relative = 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      relative = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      relative = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      relative = `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return {
      formatted: this.formatDate(date),
      relative,
      iso: date.toISOString(),
    };
  }

  /**
   * Format created_at field
   */
  static formatCreatedAt(createdAt?: Date): FormattedDate | null {
    return this.formatDateWithRelative(createdAt);
  }

  /**
   * Format updated_at field
   */
  static formatUpdatedAt(updatedAt?: Date): FormattedDate | null {
    return this.formatDateWithRelative(updatedAt);
  }
}
