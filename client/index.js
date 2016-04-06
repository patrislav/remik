
import io from 'socket.io-client';

const socket = io();

const form = document.getElementsByTagName('form')[0];
const messageComposer = document.getElementById('m');
const messages = document.getElementById('messages');

socket.on('chat message', (message) => {
  let li = document.createElement('li');
  li.innerText = message;
  messages.appendChild(li);
});

form.onsubmit = (event) => {
  socket.emit('chat message', messageComposer.value);
  messageComposer.value = '';
  event.preventDefault();
  return false;
};
