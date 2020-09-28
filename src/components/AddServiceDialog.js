import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TimeIntervalSelect from './TimeIntervalSelect';
import {api} from "../utils.js";

export default class AddServiceDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currInterval:40,
            listOfIntervals: [10,15,20,30,40,50,60,70,80,90,100,110,120,150,180],
            fromTime:null, toTime:null, // интервал выбранного времени
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

    render() {

        const saveServiceInShedule = () => {
            api.post('/salon/....')
            .then(res => {
                console.log(res.data);

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
                    <TextField  label="Например имя клиента или любая другая пояснительная информация." style={{width:'100%'}} variant="outlined" />
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

                <Button autoFocus onClick={this.props.onClose} color="primary" variant="contained">
                    Save
                </Button>

            </div>
        );
    }
}
