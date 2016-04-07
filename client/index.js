
// import io from 'socket.io-client';
// import auth from './lib/auth';
//
// const form = document.getElementsByTagName('form')[0];
// const messageComposer = document.getElementById('m');
// const messages = document.getElementById('messages');
//
// auth.fbInit();
// auth.whenReady(() => {
//   const socket = io();
//
//   socket.on('chat message', (message) => {
//     let li = document.createElement('li');
//     li.innerText = message;
//     messages.appendChild(li);
//   });
//
//   form.onsubmit = (event) => {
//     socket.emit('chat message', messageComposer.value);
//     messageComposer.value = '';
//     event.preventDefault();
//     return false;
//   };
//
// });

import ReactDOM from 'react-dom';
import router from './routes';

const appContainer = document.getElementById('app');

router.dispatch((component) => {
  ReactDOM.render(component, appContainer);
});
router.change('preload');
