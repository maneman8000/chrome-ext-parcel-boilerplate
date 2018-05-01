import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor() {
    super();
    this.handleGetListeners = this.handleGetListeners.bind(this);
  }

  handleGetListeners() {
    const expr = 'console.log("test eval", getEventListeners)';
    chrome.devtools.inspectedWindow.eval(expr, (isLoaded, isException) => {
      if (isException) {
        throw new Error('Eval failed for ' + expr);
      }
      console.log('eval success!', isLoaded);
    });
  }

  handleReload() {
    const options = {
      ignoreCache: true
    };
    chrome.devtools.inspectedWindow.reload(options);
  }

  render() {
    return (
      <div className="app">
        <button class='button' onClick={this.handleGetListeners}>Get Listeners</button>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
