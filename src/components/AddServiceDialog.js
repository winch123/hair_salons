import React, { Component } from 'react';
import { connect } from 'react-redux'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';

import TimeIntervalSelect from './TimeIntervalSelect';
import {apiRequest} from "../utils.js";

class AddServiceDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromTime:null, toTime:null, // интервал выбранного времени
            textComment: '',
	    //selectedService: null,
	    selectedCategoryId: null,
	    selectedServiceId: null,
	    serviceSelectOpen: true,
        }
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

    getDurationOfService = () => {
       let s = this.props.salonServices[this.state.selectedCategoryId]
       if (s) {
	  s = s.services[this.state.selectedServiceId]
	  if (s) {
	    return s.duration_default
	  }
       }
    }

	saveServiceInShedule = () => {
		apiRequest('schedule-add-service', {
			shiftId: this.props.currentShiftId,
			serviceId: this.state.selectedServiceId,
			beginTime: this.state.fromTime,
			endTime: this.state.toTime,
			comment: this.state.textComment,
		})
		this.props.onClose()
	}

    render() {
        return (
            <div style={{overflowX:'hidden'}} >
                <label>
		    Услуга:
		    <Select
		      value={this.state.selectedCategoryId + '-' + this.state.selectedServiceId}
		      open={this.state.serviceSelectOpen}
		      onChange={(e) => {
			  if (e.target.value) {
			    let [catId, servId] = e.target.value.split('-')
			    this.setState({selectedServiceId: servId, selectedCategoryId:catId})
			  }
		      }}
		      onClose={(e) => {
			  console.log( e.target )
			  this.setState({serviceSelectOpen: !e.target.classList.contains('MuiMenuItem-root')})
		      }}
		      onOpen={() => this.setState({serviceSelectOpen: true})}
		    >
		      {Object.entries(this.props.salonServices).map(([catId, cat]) => (
			[<ListSubheader key={catId}> {cat.name}</ListSubheader>,

			Object.entries(cat.services)
				.filter(([servId, serv]) => serv.masters[this.props.masterId])
				.map(([servId, serv]) => (
			    <MenuItem value={catId + '-' + servId} key={servId} >
			      {serv.duration_default} мин - {serv.name}
			    </MenuItem>
			  ))
			]
		      ))}
		    </Select>
                </label>

                <div>
                    {this.state.fromTime} --- {this.state.toTime}
                </div>

                <TimeIntervalSelect
                    interval = {this.getDurationOfService()}
                    onChangeInterval = {this.handleChangeSelectedInterval}
                    beginTime = {this.props.beginTime}
                    endTime = {this.props.endTime}
                />

                <div style={{width:'80vw', margin:'22px', display:'block', overflow:'hidden' }}>
                    <div style={{textAlign:'right'}}>Комментарий</div>
                    <TextField
                        label="Например имя клиента или любая другая пояснительная информация."
                        style={{width:'100%'}}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                </div>

                <Button autoFocus onClick={this.saveServiceInShedule} color="primary" variant="contained">
                    Save
                </Button>


            </div>
        );
    }
}

export default  connect(
    (storeState) => {
        return {
          salonServices: storeState.salonServices,
        }
    }
)(AddServiceDialog)