import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch, Redirect } from "react-router-dom"
//import {createBrowserHistory} from 'history'

import PrivateRoute from './components/helpers/PrivateRoute'
import ModalDialog from './components/helpers/ModalDialog'
import {store, apiRequest, history} from './utils'
import MySalonActiveRequests from './components/MySalonActiveRequests'
import MainMenu from './components/MainMenu'
import SelectSalon from './components/SelectSalon'

//import AddServiceDialog from './components/AddServiceDialog';
import CommonSchedule from './components/CommonSchedule';
import SalonSettings from './components/SalonSettings';
import Login from './components/Login';
import test from './components/test';
import './App.css';

export default function App() {
	/*
  apiRequest('get-salon-services-list', {salonId:1})
  .then(res => {
      //console.log(res)
      store.dispatch({
        type: 'UPDATE_SALON_SERVICES',
        value: res,
      })
  })
  */

  //const history = createBrowserHistory()

  return (
    <Provider store={store}>
        <header className="App-header">
			<MainMenu />
			<MySalonActiveRequests/>
			<h2>H. S.</h2>
        </header>

        <Router history={history}>
            <Switch>
                <PrivateRoute path='/schedule' component={CommonSchedule} />
				<PrivateRoute path='/SelectSalon' component={SelectSalon} />
                <Route path='/settings' component={SalonSettings} />
                <Route path='/Login' component={Login} />
                <Route path='/test' component={test} />
                <Redirect from='/' to='/schedule'/>
            </Switch>
        </Router>

		<ModalDialog />

    </Provider>
  );
}
