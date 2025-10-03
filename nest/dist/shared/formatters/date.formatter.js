"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFormatter = void 0;
class DateFormatter {
    static formatDate(date) {
        if (!date)
            return null;
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', ',');
    }
    static formatDateWithRelative(date) {
        if (!date)
            return null;
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let relative;
        if (diffInSeconds < 60) {
            relative = 'just now';
        }
        else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            relative = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            relative = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        else {
            const days = Math.floor(diffInSeconds / 86400);
            relative = `${days} day${days > 1 ? 's' : ''} ago`;
        }
        return {
            formatted: this.formatDate(date),
            relative,
            iso: date.toISOString(),
        };
    }
    static formatCreatedAt(createdAt) {
        return this.formatDateWithRelative(createdAt);
    }
    static formatUpdatedAt(updatedAt) {
        return this.formatDateWithRelative(updatedAt);
    }
}
exports.DateFormatter = DateFormatter;
//# sourceMappingURL=date.formatter.js.map