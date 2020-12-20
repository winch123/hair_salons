import React from 'react';
import BaseComponent from './BaseComponent.js'

import {apiRequest, store} from "../utils.js";
import { connect } from 'react-redux';
import classNames from 'classnames';

import  DayPersonalSchedule from './DayPersonalSchedule';

class CommonSchedule extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentShiftId: null,
        };
    };

    componentDidMount() {
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
                                {Object.keys(workshifts).map((k2) => (
                                    <td key={k2}>
                                        { workshifts[k2].masters[master.id] &&
                                            <div
                                                onClick = {() => this.onSelectWorkshift(workshifts[k2].masters[master.id].shift_id, master.id, k2)}
                                                className = {classNames('CommonSchedule-Shift',
						    this.state.currentShiftId === workshifts[k2].masters[master.id].shift_id  ? 'CommonSchedule-ShiftActive' : '')}
                                            >
                                                <div style={{fontSize:'1.1em'}}>{workshifts[k2].masters[master.id].text}</div>
                                                <div style={{fontSize:'0.8em'}}>{workshifts[k2].masters[master.id].description}</div>
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
