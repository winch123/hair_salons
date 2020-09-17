import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import TimeIntervalSelect from './components/TimeIntervalSelect';
import  DayPersonalSchedule from './components/DayPersonalSchedule';
import  CommonSchedule from './components/CommonSchedule';
import './App.css';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

export default function App() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };    
    
  return (
    <div>
        {/* <DayPersonalSchedule /> */}
        <CommonSchedule />
        
        <header className="App-header">
            <Button variant="contained" color="primary" onClick={handleClickOpen}> Hello World </Button>
        </header>
        <Dialog
            open={open}
            onClose={handleClose}
        > 
            <TimeIntervalSelect />
        </Dialog>      
      
    </div>
  );
}
