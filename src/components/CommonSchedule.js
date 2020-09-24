import React, { Component } from 'react';
import {api} from "../utils.js";
import { connect } from 'react-redux';

import  DayPersonalSchedule from './DayPersonalSchedule';

class CommonSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workshifts: {
                20201001: {caption:'сегодня', masters:{1: 'иии 1', 2:'ппп 1' ,3:'sss 1'} },
                20201002: {caption:'завтра', masters:{1: 'иии 2', 2:'ппп 2' ,3:'sss 2'}},
                20201003: {caption:'послезавтра', masters:{1: 'иии 3', 3:'sss 3'}},
            },
            persons: [
                {id:1, name:'Иванова',},
                {id:2, name:'Петрова',},
                {id:3, name:'Сидорова',},
            ],
            currentShiftId: null,
        };
    };

    componentDidMount() {
        //if (true) return;

        api.get('/salon/actual-workshifts-get')
        .then(res => {
            console.log(res.data);
            this.setState({
                persons: res.data.persons,
                workshifts: res.data.workshifts,
            });
        })
    }

    onSelectWorkshift(shiftId, masterId, dayId) {
        //console.info(shiftId, masterId, dayId);
        api.get('/salon/schedule-get?shiftId=' + shiftId)
        .then(res => {
            //console.log(res.data);
            this.props.setSchedule(shiftId, res.data);
        })
        this.setState({
            currentShiftId: shiftId,
        });
    }

    render() {
        let {workshifts} = this.state
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
                        {this.state.persons.map((master) => (
                            <tr key={master.id}>
                                <td>{master.name}</td>
                                {Object.keys(workshifts).map((k2) => (
                                    <td key={k2}>
                                        { workshifts[k2].masters[master.id] &&
                                            <button
                                                onClick = {() => this.onSelectWorkshift(workshifts[k2].masters[master.id].shift_id, master.id, k2)}
                                                className = {this.state.currentShiftId === workshifts[k2].masters[master.id].shift_id  ? 'CommonSchedule-ShiftActive' : ''}
                                            >
                                                {workshifts[k2].masters[master.id].text}
                                            </button>
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
                        <DayPersonalSchedule title="рассписание"  DaySchedule={this.props.schedule[this.state.currentShiftId]} />
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
