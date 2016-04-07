
import React, {Component, PropTypes} from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';

class App extends Component {

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction
    };
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  context: PropTypes.shape({
    insertCss: PropTypes.func
  }),
  children: PropTypes.element.isRequired
};

App.childContextTypes = {
  insertCss: PropTypes.func.isRequired
};

export default App;
