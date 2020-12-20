import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddServiceDialog from './AddServiceDialog'
import Dialog from '@material-ui/core/Dialog'

class DayPersonalSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IntervalSelector_open: false,
            IntervalSelector_beginTime: null,
            IntervalSelector_endTime: null,
        };
    };

    static defaultProps = {
        DaySchedule: {
            schedule: {
                50: {duration:30, s_type:'own', text:'aaaaaaaa'},
                115: {duration:15, s_type:'pause', text:'bbbbbbbbb'},
                0: {duration:40, s_type:'extenal', text:'ssssssss'},
                130: {duration:25, s_type:'own', text:'hdfsh dfhsrhb  hrthrth rehrt'},
            },
            BeginShiftMinutes : 21 * 60,
            DurationShiftMinutes : 300,
        },
    }

    formatSchedule(schedule, duration) {
        let ret = [];
        let begin = 0;
        for (let k in schedule) {
            //console.log(begin);
            if (begin < k) {
                ret.push( {duration: k - begin, begin:begin, s_type:'free'} );
            }
            ret.push(Object.assign(schedule[k], {begin: Number(k)}));
            begin = Number(k) + Number(schedule[k].duration);
        }
        if (begin < duration) {
            ret.push({duration: duration - begin, begin:begin, s_type:'free'});
        }
        return ret;
    };

    getTimeFromMins(mins) {
        let hours = Math.trunc(mins/60);
        if (hours>23)
            hours -= 24;
        if (hours<10)
            hours = '0' + hours;
        let minutes = mins % 60;
        if (minutes<10)
            minutes = '0' + minutes;
        return hours + ':' + minutes;
    };

    delScheduleService (idBegin) {
        delete(this.state.schedule[idBegin]);
        this.setState({ schedule: this.state.schedule });
    }

    onIntervalClick(intBegin, intDuration, intervalType) {
        let beginT = this.getTimeFromMins( Number(this.props.DaySchedule.BeginShiftMinutes) + Number(intBegin) )
        let endT = this.getTimeFromMins( Number(this.props.DaySchedule.BeginShiftMinutes) + Number(intBegin) + Number(intDuration) )
        console.log(beginT, endT, intervalType)
        if (intervalType === 'free') {
            this.setState({
                IntervalSelector_open: true,
                IntervalSelector_beginTime: beginT,
                IntervalSelector_endTime: endT,
            })
        }
    }

    IntervalSelector_handleClose = () => {
        this.setState({IntervalSelector_open: false})
    }

    render() {
        const schedule = this.props.DaySchedule.schedule
        const DurationShiftMinutes = Number(this.props.DaySchedule.DurationShiftMinutes)
        const BeginShiftMinutes = Number(this.props.DaySchedule.BeginShiftMinutes)

        let sch1 = this.formatSchedule(schedule, DurationShiftMinutes)
        //console.log(this.props.DaySchedule);

        return (
            <div>
                <h2>{this.props.persons[this.props.DaySchedule.master_id].name}  рассписание на </h2>
                {sch1.map((d, index) => (
                    <div key={index} className="DaySchedule-interval" onClick={this.onIntervalClick.bind(this, d.begin, d.duration, d.s_type)}>
                        <div>
                            <span className="DaySchedule-timePoint">
                                {this.getTimeFromMins(BeginShiftMinutes + d.begin)}
                            </span>
                            {d.duration}min {d.s_type} {d.text}
                            { d.s_type !== 'free' &&
                                <button onClick={this.delScheduleService.bind(this, d.begin)}> (X) {d.begin}</button>
                            }
                        </div>
                        {Array(d.duration - 1).fill(null).map((d2, ind2) => (
                            <div key={ind2} style={{height:'3px'}}>
                                { (BeginShiftMinutes + d.begin + ind2 + 1) % 15 === 0 &&
                                    <span className="DaySchedule-timePoint"> {this.getTimeFromMins(BeginShiftMinutes + d.begin + ind2 + 1)} </span>
                                }
                                &nbsp;
                            </div>
                        ))}
                        { index+1 === sch1.length &&
                            <span className="DaySchedule-timePoint">
                                {this.getTimeFromMins(BeginShiftMinutes + DurationShiftMinutes)}
                            </span>
                        }
                    </div>
                ))}

                <Dialog  maxWidth='xl'
                    open={this.state.IntervalSelector_open}
                    onClose={this.IntervalSelector_handleClose}
                >
                    <AddServiceDialog
                        onClose={this.IntervalSelector_handleClose}
                        beginTime = {this.state.IntervalSelector_beginTime}
                        endTime = {this.state.IntervalSelector_endTime}
                        currentShiftId = {this.props.currentShiftId}
                    />
                </Dialog>
            </div>
        );
    }
}

export default  connect(
    (storeState) => {
        return {
            schedule: storeState.schedule,
	    persons: storeState.persons,
        }
    }
)(DayPersonalSchedule);
