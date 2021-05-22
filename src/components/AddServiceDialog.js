import React, { Component } from 'react';
import { connect } from 'react-redux'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';

import TimeIntervalSelect from './TimeIntervalSelect';
import {apiRequest} from "../utils.js";

import { CrownTwoTone } from '@ant-design/icons';
import { Select } from 'antd'
const { Option, OptGroup } = Select

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
		let s = this._seekService(this.state.selectedCategoryId, this.state.selectedServiceId)
		if (s) {
			return s.duration_default
		}
    }

	// Ищет сервис в сторе. (возможно функцию стоит перенести в глобальное место)
	_seekService(catId, servId) {
		let s = this.props.salonServices[catId]
		if (s) {
			return s.services[servId]
		}
	}

	saveServiceInShedule = () => {
		apiRequest('schedule-add-service', {
			shiftId: this.props.currentShiftId,
			serviceId:  this.state.selectedServiceId,
			beginTime: this.state.fromTime,
			endTime: this.state.toTime,
			comment: this.state.textComment,
		})
		this.props.closeDialog()
	}

	onSelectCurrentService = value => {
		let [catId, servId] = value.split('-')
		this.setState({
			selectedServiceId: servId,
			selectedCategoryId: catId,
		})
	}

	filterService = (inputVal, option) => {
		//if (option.children)
		//	return option.children.toLowerCase().indexOf(inputVal.toLowerCase()) > -1
		if (option.value) {
			//console.log(option.label)
			let name = this._seekService(...option.value.split('-')).name
			return name.toLowerCase().indexOf(inputVal.toLowerCase()) > -1
		}
	}

    render() {
        return (
            <div style={{overflowX:'hidden'}} >
				<Select showSearch
					placeholder = "Выбрать услугу"
					style = {{ width: 200 }}
					onChange = {this.onSelectCurrentService}
					filterOption = {this.filterService}
					optionLabelProp = "label"
				>
					{Object.values(this.props.salonServices).map(cat => (
						<OptGroup key = {cat.id} label = {cat.name}>
							{Object.values(cat.services)
							.filter(serv => (serv.masters || [])[this.props.masterId])
							.map(serv => (
								<Option
									key = {serv.service_id}
									value = {cat.id + '-' + serv.id}
									label = {`${serv.name} (${serv.duration_default} мин)`}
								>
									<CrownTwoTone style={{marginRight:'5px', fontSize:'18px', color:'#08c'}} />
									<span style={{color:'lightgreen'}}>
										{serv.duration_default} мин
									</span> {serv.name}
								</Option>
							))}
						</OptGroup>
					))}
				</Select>

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

				<div>
					{this.state.fromTime} --- {this.state.toTime}
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