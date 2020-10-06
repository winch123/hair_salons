import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch, Redirect } from "react-router-dom"
import {createBrowserHistory} from 'history'

import AddServiceDialog from './components/AddServiceDialog';
import CommonSchedule from './components/CommonSchedule';
import SalonSettings from './components/SalonSettings';
import './App.css';

import {store} from './utils'

export default function App() {

  const history = createBrowserHistory()

  return (
    <Provider store={store}>
        <header className="App-header">
            <h2>H. S.</h2>
        </header>

        <Router history={history}>
            <Switch>
                <Route path='/schedule' component={CommonSchedule} />
                <Route path='/settings' component={SalonSettings} />
                <Redirect from='/' to='/schedule'/>
            </Switch>
        </Router>

    </Provider>
  );
}
