import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Switch,
  Link, Redirect
} from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import Dashboard from './components/Dashboard';


class App extends Component {

  render() {
    return (
      <div>
        <MetaTags>
          <meta name="viewport" content="height=device-height,width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,
                user-scalable=no,target-densitydpi=device-dpi"/>
        </MetaTags>
        <Router>
          <div>
            <Switch>

              <Route exact path="/" component={Dashboard} />

            </Switch>
          </div>
        </Router>

      </div>
    );
  }
}

export default App;
