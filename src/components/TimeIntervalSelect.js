import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

export default class TimeIntervalSelect extends Component {
    constructor(props) {
        console.info('constructor');
        super(props);

        let [beginHour, beginMinute] = this.props.beginTime.split(':').map((v) => (Number(v)) )
        let [endHour, endMinute] = this.props.endTime.split(':').map((v) => (Number(v)) )
        //console.log(beginHour, beginMinute, endHour, endMinute)
        let hours = beginHour <= endHour ? _.range(beginHour, endHour+1) : [..._.range(beginHour, 24), ..._.range(0, endHour)]
        //console.log(hours)

        this.state = {
            hours,
            minutes: [0,5,10,15,20,25,30,35,40,45,50,55],
            beginHour, beginMinute, endHour, endMinute, // интервал показаного времени
            fromHour:null, fromMinute:null, toHour:null, toMinute:null, // интервал выбираемового времени
            fromHourFix:null, fromMinuteFix:null, toHourFix:null, toMinuteFix:null, // интервал выбранного времени
        }
    }

    static defaultProps = {
        beginTime: '7:30',
        endTime: '15:00',
        interval: 30,
    }

    componentDidMount() {
        console.info('componentDidMount');
    }

    componentWillUnmount() {
        console.info('componentWillUnmount');
    }

    clickTimepoint() {
        this.setState({
            fromHourFix:    this.state.fromHour,
            fromMinuteFix:  this.state.fromMinute,
            toHourFix:      this.state.toHour,
            toMinuteFix:    this.state.toMinute,
        })
        //console.log(this.state)
        this.props.onChangeInterval({
            from: `${this.state.fromHour} :  ${('00' + this.state.fromMinute).substr(-2)}`,
            to: `${this.state.toHour} : ${('00' + this.state.toMinute).substr(-2)}`,
        })
    }

    compareTime(t1, t2) {

    }

    mouseEnterTimepoint(hour, minute) {
        //console.log(this.state.interval)
        let addHour = 0
        let toMinute = Number(minute) + this.props.interval
        if (toMinute > 55) {
            addHour = Math.floor(toMinute / 60)
            toMinute = toMinute - 60 * addHour
        }
        //console.log(toHour, toMinute)
        this.setState({fromHour: hour, fromMinute: minute, toHour: hour+addHour, toMinute: toMinute})
    }

    mouseLeaveTimepoint(hour, minute) {
        this.setState({fromHour: null, fromMinute: null, toHour: null, toMinute: null})
    }

    /*
    timeDiff (fh, fm, th, tm) {
        console.info(fh, fm, th, tm)
        if (fm > tm) {
            th -= 1;
            tm = parseInt(tm);
            tm += 60;
        }
        return `${th-fh} час ${tm-fm} мин`;
    }
    */

  render() {
    console.info('render');
    //console.log(this.state);

    let {fromHour, fromMinute, toHour, toMinute, fromHourFix, fromMinuteFix, toHourFix, toMinuteFix, beginHour, beginMinute, endHour, endMinute} = this.state
    return (
        <div id="time-contaner">
            {this.state.hours.map((hour) => (
                <div key={hour}>
                    {this.state.minutes.map((minute) => {
                        if ((minute >= beginMinute || hour > beginHour) && (hour < endHour || minute <= endMinute) )
                            return <div
                                key={minute}
                                onClick = {() => this.clickTimepoint(hour, minute)}
                                onMouseEnter={() => this.mouseEnterTimepoint(hour, minute)}
                                onMouseLeave={() => this.mouseLeaveTimepoint(hour, minute)}
                                className={classNames("time-point", {
                                    act: ((hour===fromHour && minute>=fromMinute) || hour>fromHour) && ((hour===toHour && minute<=toMinute) || hour<toHour),
                                    lastAct: hour === toHour && minute === toMinute,
                                    actFix: ((hour===fromHourFix && minute>=fromMinuteFix) || hour>fromHourFix) && ((hour===toHourFix && minute<=toMinuteFix) || hour<toHourFix),
                                })} >
                                {hour} : {('00' + minute).substr(-2) }
                            </div>
                        else
                            return <div key={minute}>&nbsp;</div>
                    })}
                </div>
            ))}
        </div>
    );
  }
}
