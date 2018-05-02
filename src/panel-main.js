import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col, Input, Table } from 'antd';
import 'antd/dist/antd.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listeners: []
    };
    this.handleGetListeners = this.handleGetListeners.bind(this);
    this.columns = [
      {
        title: 'Selector',
        dataIndex: 'selector',
        key: 'selector'
      },
      {
        title: 'Events',
        dataIndex: 'events',
        key: 'events'
      }
    ];
  }

  readCode(filename) {
    return new Promise((resolve, reject) => {
      const onError = () => {
        reject();
      };
      chrome.runtime.getPackageDirectoryEntry((root) => {
        root.getFile(filename, {}, (fileEntry) => {
          fileEntry.file((file) => {
            var reader = new FileReader();
            reader.onloadend = function(e) { resolve(this.result); };
            reader.readAsText(file);
          }, onError);
        }, onError);
      });
    });
  }

  handleGetListeners() {
    this.readCode("src/get-event-listeners.js").then((expr) => {
      chrome.devtools.inspectedWindow.eval(expr, (data, isException) => {
        if (isException) {
          throw new Error('Eval failed for ' + expr);
        }
        console.log('eval success!', data);
        this.setState({
          listeners: data.result.map((d, i) => {
            return {
              key: String(i),
              selector: d.selector,
              events: d.events.join(', ')
            };
          })
        });
      });
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
        <Row>
          <Col span={6}>
            <Button type="primary" onClick={this.handleGetListeners}>Get Listeners</Button>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={this.handleReload}>Reload</Button>
          </Col>
          <Col span={6}>
            <Input placeholder="params" />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table dataSource={this.state.listeners} columns={this.columns} />
          </Col>
        </Row>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
