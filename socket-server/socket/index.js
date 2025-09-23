import {handleRoomJoin, handleLeaveRoom, handleDisconnect, handleRoomMessage} from './handlers.js';

export function registerSocketHandlers(socket, io) {
    handleRoomJoin(socket);
    handleRoomMessage(socket, io);
    handleLeaveRoom(socket);
    handleDisconnect(socket);
}