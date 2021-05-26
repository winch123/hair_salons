import React, { Component } from 'react';
import { connect } from 'react-redux'

import TimeIntervalSelect from './TimeIntervalSelect';
import {apiRequest} from "../utils.js";

import classNames from 'classnames'

import { CrownTwoTone } from '@ant-design/icons'
import { Select, Button, Input } from 'antd'
const { Option, OptGroup } = Select
const { TextArea } = Input

class AddServiceDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
			addedType: 'pause',
			selectedPauseDuration: 20,
            fromTime:null, toTime:null, // интервал выбранного времени
            textComment: '',
	    //selectedService: null,
	    selectedCategoryId: null,
	    selectedServiceId: null,
	    //serviceSelectOpen: true,
        }
    }

    handleChangeSelectedInterval = (d) => {
        this.setState({
            fromTime: d.from,
            toTime: d.to,
        })
    }

    getIntervalDuration = () => {
		if (this.state.addedType === 'service') {
			let s = this._seekService(this.state.selectedCategoryId, this.state.selectedServiceId)
			if (s) {
				return s.duration_default
			}
		}
		if (this.state.addedType === 'pause') {
			return  Number(this.state.selectedPauseDuration)
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
			serviceId: this.state.addedType === 'service' ? this.state.selectedServiceId : 0,
			// в случае serviceId=0, будет добавлен перерыв.
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
			addedType: 'service',
		})
	}

	onSelectPauseDuration = value => {
		this.setState({
			selectedPauseDuration: value,
			addedType: 'pause',
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
		const intervals = {
			10: '10 мин',
			20: '20 мин',
			30: '30 мин',
			40: '40 мин',
			50: '50 мин',
			60: '1 час',
			80: '1 час 20 мин',
			90: '1 час 30 мин',
			100: '1 час 40 мин',
			120: '2 часа',
			150: '2 часа 30 мин',
			180: '3 часа',
		}

		const serviseSelect =
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

		return (
			<div className="AddServiceDialog">
				<div style = {{display:'flex'}}>
					<div style = {{marginRight:'22px'}}>
						<div className = {classNames('addedType', {
							active: this.state.addedType === 'service',
						})}>
							Услуга
						</div>
						{serviseSelect}
					</div>

					<div>
						<div className = {classNames('addedType', {
							active: this.state.addedType === 'pause',
						})}>
							Перерыв
						</div>
						<Select
							onChange = {this.onSelectPauseDuration}
							defaultValue = "20"
							style = {{width:'155px'}}
						>
							{Object.entries(intervals).map(([minutes,text]) => 
								<Option key={minutes} value={minutes}>{text}</Option>
							)}
						</Select>
					</div>
				</div>
				<br/>
				<div>Комментарий</div>
				<TextArea autoSize
					placeholder = "Например, имя клиента или любая другая пояснительная информация."
					value = {this.state.textComment}
					onChange = {e => this.setState({textComment: e.target.value})}
				/>

				<TimeIntervalSelect
                    interval = {this.getIntervalDuration()}
                    onChangeInterval = {this.handleChangeSelectedInterval}
                    beginTime = {this.props.beginTime}
                    endTime = {this.props.endTime}
                />

				<div>
					{this.state.fromTime} --- {this.state.toTime}
				</div>
				<Button type="primary" onClick={this.saveServiceInShedule}>
					Сохранить
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