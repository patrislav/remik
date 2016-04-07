
import io from 'socket.io-client';

let socket;

class Socket {
  connect() {
    socket = io();
  }

  get socket() {
    return socket;
  }
}

const instance = new Socket();
export default instance;
