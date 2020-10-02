import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TimeIntervalSelect from './TimeIntervalSelect';
import {apiRequest} from "../utils.js";

export default class AddServiceDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currInterval:40,
            listOfIntervals: [10,15,20,30,40,50,60,70,80,90,100,110,120,150,180],
            fromTime:null, toTime:null, // интервал выбранного времени
            textComment: '',
        }
    }

    onChangeInterval = (event) => {
        this.setState({currInterval: Number(event.target.value)})
    }

    handleChangeSelectedInterval = (d) => {
        this.setState({
            fromTime: d.from,
            toTime: d.to,
        })
    }

    handleChange = (event) => {
        this.setState({textComment: event.target.value})
    }

    render() {

        const saveServiceInShedule = () => {

            apiRequest('/salon/schedule-add-service', {
                shiftId: this.props.currentShiftId,
                masterServiceId: 4, /// стрижка какая-то
                beginTime: this.state.fromTime,
                endTime: this.state.toTime,
                comment: this.state.textComment,
            })

            this.props.onClose()
        };

        return (
            <div style={{overflowX:'hidden'}} >
                <select onChange={this.onChangeInterval} value={this.state.currInterval} >
                    {this.state.listOfIntervals.map((interval) => (
                        <option value={interval} key={interval} >{interval} </option>
                    ))}
                </select>

                <div style={{width:'80vw', margin:'22px', display:'block', overflow:'hidden' }}>
                    <div style={{textAlign:'right'}}>Комментарий</div>
                    <TextField
                        label="Например имя клиента или любая другая пояснительная информация."
                        style={{width:'100%'}}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    {this.state.fromTime} --- {this.state.toTime}
                </div>

                <TimeIntervalSelect
                    interval = {this.state.currInterval}
                    onChangeInterval = {this.handleChangeSelectedInterval}
                    beginTime = {this.props.beginTime}
                    endTime = {this.props.endTime}
                />

                <Button autoFocus onClick={saveServiceInShedule} color="primary" variant="contained">
                    Save
                </Button>


            </div>
        );
    }
}
