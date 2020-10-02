import React from 'react';
import { Provider } from 'react-redux';


import AddServiceDialog from './components/AddServiceDialog';
import  CommonSchedule from './components/CommonSchedule';
import './App.css';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import {store} from './utils'


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
            <AddServiceDialog
                onClose={handleClose}
                beginTime = '16:40'
                endTime = '19:40'
            />
        </Dialog>

    </Provider>
  );
}
