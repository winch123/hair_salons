import React, { Component } from 'react';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';

export default class TimeIntervalSelect extends Component {
    constructor(props) {
        console.info('constructor');
        super(props);
        this.state = {
            hours: [10,11,12,13,14,15,16,17,18],
            minutes: [0,5,10,15,20,25,30,35,40,45,50,55],
            fromHour:null,
            fromMinute:null,
            toHour:null,
            toMinute:null,
            currInterval:40,
            listOfIntervals: [10,15,20,30,40,50,60,70,80,90,100,110,120,150,180],
        };
    };

    static defaultProps = {
        beginTime: '12:30',
        endTime: '21:00',
    }

    componentDidMount() {
        console.info('componentDidMount');
        let [beginHour, beginMinute] = this.props.beginTime.split(':').map((v) => (Number(v)) )
        let [endHour, endMinute] = this.props.endTime.split(':').map((v) => (Number(v)) )
        console.log(beginHour, beginMinute, endHour, endMinute);
        let hours = []
        for (let i=beginHour; i<endHour; i++){
            hours.push(i)
        }
        this.setState({hours})
    }

    componentWillUnmount() {
        console.info('componentWillUnmount');
    }

    clickTimepoint(hour, minute) {
        let {fromHour, fromMinute, toHour, toMinute} = this.state
        if ((hour===fromHour && minute>=fromMinute) || hour>fromHour) {
            this.setState({toHour: hour, toMinute: minute})
        }
        else {
            this.setState({fromHour: hour, fromMinute: minute})
        }
    }

    mouseEnterTimepoint(hour, minute) {
        //console.log(this.state.interval)
        let addHour = 0
        let toMinute = Number(minute) + this.state.currInterval
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

    onChangeInterval = (event) => {
        this.setState({currInterval: Number(event.target.value)})
    }

    timeDiff (fh, fm, th, tm) {
        console.info(fh, fm, th, tm)
        if (fm > tm) {
            th -= 1;
            tm = parseInt(tm);
            tm += 60;
        }
        return `${th-fh} час ${tm-fm} мин`;
    }

  render() {
    console.info('render');

    let {fromHour, fromMinute, toHour, toMinute} = this.state
    return (
        <div style={{overflowX:'hidden'}} >
            <select onChange={this.onChangeInterval} >
                {this.state.listOfIntervals.map((interval) => (
                    <option value={interval} selected={this.state.currInterval===interval} >{interval} </option>
                ))}
            </select>

            <div style={{width:'80vw', margin:'22px', display:'block', overflow:'hidden' }}>
                <div style={{textAlign:'right'}}>Комментарий</div>
                <TextField  label="Например имя клиента или любая другая пояснительная информация." style={{width:'100%'}} variant="outlined" />
            </div>

            <div id="time-contaner">
                {this.state.hours.map((hour) => (
                    <div key={hour}>
                        {this.state.minutes.map((minute) => {
                            if ((minute > 15 || hour > 10) && (hour<18 || minute<=30) )
                                return <div
                                    key={minute}
                                    onClick = {() => this.clickTimepoint(hour, minute)}
                                    onMouseEnter={() => this.mouseEnterTimepoint(hour, minute)}
                                    onMouseLeave={() => this.mouseLeaveTimepoint(hour, minute)}
                                    className={classNames("time-point", {
                                        act: ((hour===fromHour && minute>=fromMinute) || hour>fromHour) && ((hour===toHour && minute<=toMinute) || hour<toHour),
                                        lastAct: hour === toHour && minute === toMinute,
                                    })} >
                                    {hour} : {('0' + minute).substr(-2) }
                                </div>
                            else
                                return <div key={minute}>&nbsp;</div>
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
  }
}
