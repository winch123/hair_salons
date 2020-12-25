import React from 'react';
import BaseComponent from './BaseComponent.js'

import {apiRequest, store} from "../utils.js";
import { connect } from 'react-redux';
import classNames from 'classnames';

import 'antd/dist/antd.css';

import DayPersonalSchedule from './DayPersonalSchedule';
import CreateShift from './CreateShift';

class CommonSchedule extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentShiftId: null,
	    createShiftButtonVisible: false,
	    selectedMasterId: null,
	    selectedDate: null
        };
    };

    componentDidMount() {
      this.UpdateWorkshifts()
    }

    UpdateWorkshifts() {
        apiRequest('actual-workshifts-get')
        .then(res => {
            //console.log(res);
	    store.dispatch({
	      type: 'UPDATE_PERSONS',
	      value: res.persons,
	    })
	    store.dispatch({
	      type: 'UPDATE_WORKSHIFTS',
	      value: res.workshifts,
	    })
        })
    }

    onSelectWorkshift(shiftId, masterId, dayId) {
        //console.info(shiftId, masterId, dayId);
        apiRequest('schedule-get', {shiftId})

        this.setState({
            currentShiftId: shiftId,
        });
    }

    render() {
        let {workshifts} = this.props
        return (
            <div>
		<CreateShift
		    visible = {this.state.createShiftButtonVisible}
		    onClose = {(result) => {
		      if (result === 'ok') {
			  this.UpdateWorkshifts()
		      }
		      this.setState({createShiftButtonVisible:false})
		    }}
		    selectedMasterId = {this.state.selectedMasterId}
		    selectedDate = {this.state.selectedDate}
		/>

                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {Object.keys(workshifts).map((k1) => (
                                <th key={k1}>{workshifts[k1].caption}</th>
                            )) }
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(this.props.persons).map((master) => (
                            <tr key={master.id}>
                                <td>{master.name}</td>
                                {Object.keys(workshifts).map((selDate) => (
                                    <td key={selDate}>
                                        { workshifts[selDate].masters[master.id] &&
                                            <div
                                                onClick = {() => this.onSelectWorkshift(workshifts[selDate].masters[master.id].shift_id, master.id, selDate)}
                                                className = {classNames('CommonSchedule-Shift',
						    this.state.currentShiftId === workshifts[selDate].masters[master.id].shift_id  ? 'CommonSchedule-ShiftActive' : '')}
                                            >
                                                <div style={{fontSize:'1.1em'}}>{workshifts[selDate].masters[master.id].text}</div>
                                                <div style={{fontSize:'0.8em'}}>{workshifts[selDate].masters[master.id].description}</div>
                                            </div>
                                        ||
					  <div>
					    Нет смены.<br/>
					    <button onClick = {() => this.setState({
						createShiftButtonVisible: true,
						selectedMasterId: master.id,
						selectedDate: selDate,
					    })}>
					      создать
					    </button>
					  </div>
					}
                                    </td>
                                )) }
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    текущая смена: {this.state.currentShiftId}
                </div>

                <hr/>
                {
                    //console.log( this.props.schedule[this.state.currentShiftId] )
                }
                {
                    this.props.schedule[this.state.currentShiftId] &&
                        <DayPersonalSchedule
                            DaySchedule = {this.props.schedule[this.state.currentShiftId]}
                            currentShiftId = {this.state.currentShiftId}
                        />
                    ||
                      <p>загрузка....</p>
                }
           </div>
        );
    }
}

export default  connect(
    (storeState) => {
        //console.log(storeState.schedule)
        return {
            schedule: storeState.schedule,
            workshifts: storeState.workshifts,
	    persons: storeState.persons,
        }
    },
    (dispatch) => {
        return {
            setSchedule: (id, value) => {
                dispatch({ type: 'SET_SCHEDULE', id: id, value: value, });
            }
        }
    }
)(CommonSchedule) ;
