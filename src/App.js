import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch, Redirect } from "react-router-dom"
//import {createBrowserHistory} from 'history'

import PrivateRoute from './components/helpers/PrivateRoute'
import ModalDialog from './components/helpers/ModalDialog'
import {store, apiRequest, history} from './utils'
import MainMenu from './components/MainMenu'
import SelectSalon from './components/SelectSalon'
import PersonnelManagement from './components/PersonnelManagement'
import SalonTabs from './components/SalonTabs'

//import AddServiceDialog from './components/AddServiceDialog';
import CommonSchedule from './components/CommonSchedule';
import SalonSettings from './components/SalonSettings';
import Login from './components/Login';
import test from './components/test';
import './App.scss';

export default function App() {
  //const history = createBrowserHistory()

	return (
		<Provider store={store}>

			<Router history={history}>
				<header className="App-header">
					<MainMenu />
				</header>
				<br/>

				<Switch>
					<PrivateRoute path='/schedule' component={CommonSchedule} />
					<PrivateRoute path='/SelectSalon' component={SelectSalon} />
					<PrivateRoute path='/PersonnelManagement' component={PersonnelManagement} />
					<Route path='/settings' component={SalonSettings} />
					<Route path='/Login' component={Login} />
					<Route path='/test' component={test} />
					<PrivateRoute path='/salon' component={SalonTabs} />
					<Redirect from='/' to='/SelectSalon'/>
				</Switch>
			</Router>

			<ModalDialog />

		</Provider>
	)
}
