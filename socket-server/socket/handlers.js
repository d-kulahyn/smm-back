export function handleRoomJoin(socket) {
    socket.on('room:join', ({roomId}) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });
}

export function handleDisconnect(socket) {
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
}

export function handleLeaveRoom(socket) {
    socket.on('room:leave', ({ roomId }) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });
}

export function handleRoomMessage(socket, io) {
    socket.on('room:message', ({ roomId, message }) => {
        console.log(`📨 Message from ${socket.id} to room ${roomId}: ${message}`);
        socket.to(roomId).emit('room:message', {
            from: socket.id,
            message,
            roomId,
        });
    });
}