import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch, Redirect } from "react-router-dom"
//import {createBrowserHistory} from 'history'

import PrivateRoute from './components/helpers/PrivateRoute'
//import AddServiceDialog from './components/AddServiceDialog';
import MySalonActiveRequests from './components/MySalonActiveRequests'
import CommonSchedule from './components/CommonSchedule';
import SalonSettings from './components/SalonSettings';
import Login from './components/Login';
import test from './components/test';
import './App.css';

import {store, apiRequest, history} from './utils'

export default function App() {
  apiRequest('get-salon-services-list', {salonId:1})
  .then(res => {
      //console.log(res)
      store.dispatch({
        type: 'UPDATE_SALON_SERVICES',
        value: res,
      })
  })

  //const history = createBrowserHistory()

  return (
    <Provider store={store}>
        <div style={{float:'left'}}>
          <a href="/settings">settings</a>
        </div>
        <header className="App-header">
	    <MySalonActiveRequests/>
            <h2>H. S.</h2>
        </header>

        <Router history={history}>
            <Switch>
                <PrivateRoute path='/schedule' component={CommonSchedule} />
                <Route path='/settings' component={SalonSettings} />
                <Route path='/Login' component={Login} />
                <Route path='/test' component={test} />
                <Redirect from='/' to='/schedule'/>
            </Switch>
        </Router>

    </Provider>
  );
}
