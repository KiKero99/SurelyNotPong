import { io, Socket } from 'socket.io-client';

const URL =  'http://localhost:3000/';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(URL, { transports: ['websocket'], upgrade: false });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  emit(event: string, payload?: any) {
    this.socket?.emit(event, payload);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  getSocket() {
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;