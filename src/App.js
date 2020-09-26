import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import mainReduser from './reducers';

import TimeIntervalSelect from './components/TimeIntervalSelect';
import  CommonSchedule from './components/CommonSchedule';
import './App.css';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const store = createStore(mainReduser, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
//const unsubscribe = store.subscribe(() => console.info( {...store.getState()} ));


export default function App() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Provider store={store}>
        <CommonSchedule />

        <header className="App-header">
            <Button variant="contained" color="primary" onClick={handleClickOpen}> Hello World </Button>
        </header>
        <Dialog  maxWidth='xl'
            open={open}
            onClose={handleClose}
        >
            <TimeIntervalSelect />
        </Dialog>

    </Provider>
  );
}
