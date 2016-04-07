
import React from 'react';
import Router from './lib/router';
import App from './components/App';

const routes = [
  require('./routes/preload'),
  require('./routes/lobby')
];

const router = new Router();

const context = {
  insertCss: styles => styles._insertCss()
}

routes.forEach(route => {
  router.on(route.action, () => {
    const component = route.controller();
    return <App context={context}>{component}</App>;
  });
})

export default router;
