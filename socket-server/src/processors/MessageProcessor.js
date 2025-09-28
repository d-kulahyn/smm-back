export class MessageProcessor {
    static parseFields(fields) {
        const messageData = {};
        for (let i = 0; i < fields.length; i += 2) {
            messageData[fields[i]] = fields[i + 1];
        }
        return messageData;
    }

    static parseJsonData(messageData) {
        let parsedMessage = { ...messageData };

        if (messageData.data) {
            try {
                parsedMessage.data = JSON.parse(messageData.data);
            } catch (error) {
                console.warn('⚠️ Failed to parse message data as JSON:', messageData.data);
            }
        }

        return parsedMessage;
    }

    static createSocketMessage(parsedMessage, streamName, messageId) {
        return {
            from: 'service',
            message: parsedMessage,
            roomId: streamName,
            event: parsedMessage.event || 'stream:message',
            messageId: messageId
        };
    }

    static processMessage(messageId, fields, streamName) {
        const messageData = this.parseFields(fields);
        const parsedMessage = this.parseJsonData(messageData);
        const socketMessage = this.createSocketMessage(parsedMessage, streamName, messageId);

        return {
            original: messageData,
            parsed: parsedMessage,
            socket: socketMessage
        };
    }
}
