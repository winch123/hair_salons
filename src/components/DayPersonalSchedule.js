import React, { Component } from 'react';

export default class DayPersonalSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule: {
                50: {duration:30, type:'own', text:'aaaaaaaa'},
                115: {duration:15, type:'pause', text:'bbbbbbbbb'},
                0: {duration:40, type:'extenal', text:'ssssssss'},
                130: {duration:25, type:'own', text:'hdfsh dfhsrhb  hrthrth rehrt'},
            },
            BeginShiftMinutes : 23 * 60,
        };  
    };
    
    formatSchedule(schedule, begin, end) {
        let ret = [];
        for (let k in schedule) {
            //console.log(begin);
            if (begin < k) {
                ret.push( {duration: k - begin, begin:begin, type:'free'} );
            }
            ret.push(Object.assign(schedule[k], {begin: parseInt(k)}));
            begin = parseInt(k) + schedule[k].duration;
        }
        if (begin < end) {
            ret.push({duration: end - begin, begin:begin, type:'free'});
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
    
    render() {
        let sch1 = this.formatSchedule(this.state.schedule, 0, 240);
        console.log(sch1);
        
        return (
            <div>
            {sch1.map((d, index) => (
                <div key={index} style={{border:'solid 1px'}}>
                    <div>
                        <span className="DaySchedule-timePoint">
                            {this.getTimeFromMins(this.state.BeginShiftMinutes + d.begin)}
                        </span>
                        {d.duration}min {d.type} {d.text}
                        { d.type !== 'free' &&
                            <button onClick={this.delScheduleService.bind(this, d.begin)}> (X) {d.begin}</button>                            
                        }
                    </div>
                    {Array(d.duration - 1).fill(null).map((d2, ind2) => (
                        //console.log(d1);
                        <div key={ind2} style={{height:'3px'}}>
                            { (this.state.BeginShiftMinutes + d.begin + ind2 + 1) % 15 === 0 &&
                                <span className="DaySchedule-timePoint"> {this.getTimeFromMins(this.state.BeginShiftMinutes + d.begin + ind2 + 1)} </span> 
                            }
                            &nbsp;
                        </div>                     
                    ))}
                </div>
            ))}
            </div>
        );
    }
}
