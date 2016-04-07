
let _routes = {};
let _currentAction = '';
let _callback = () => {};

class Router {

  on(action, controller) {
    _routes[action] = controller;
  }

  change(action) {
    if (_routes[action]) {
      _currentAction = action;
      let component = _routes[action]();
      _callback(component);
    }
  }

  dispatch(callback) {
    _callback = callback;
  }

}

export default Router;
