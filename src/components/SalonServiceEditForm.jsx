import React from 'react'
import {connect} from 'react-redux'

import {apiRequest, dispatch} from '../utils.js'
import UploaderTest from './UploaderTest'
import BaseComponent from './BaseComponent'
import {InputNumber, Select, Button, Form} from 'antd'
const {Option} = Select


class SalonServiceEditForm extends BaseComponent {
	state = {
		saveButtonDisabled: true,
	}

	componentDidMount() {
	}

	saveServise = values => {
		console.log(values)
		apiRequest('save_salon_service', {
			servId: this.props.service.service_id,
			servPrice: values.price,
			servDuration: values.duration,
			servMastersList: values.mastersList, 
		})
		.then(res => {
			console.log('updated')
			this.updateSalonServices(this.props.service.id)
			this.setState({saveButtonDisabled: true})
		})
	}
	
	changeFormElement(t, val) {
		//console.log(t, val)
		this.setState({saveButtonDisabled: false})
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
		
		let service = this.props.service

		return <>
			<b style={{display:'inline-block', width:'202px', color:'red', padding:'11px'}}>
				{service.name}
			</b>
			<div style={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'11px'}}>
				<div style = {{width:'555px', margin:'11px'}}>
 				<Form 
					onFinish={this.saveServise}
				>
					<Form.Item name="price"  label="цена:">
						<InputNumber
							defaultValue = {service.price_default}
							//initialValues = {service.price_default}
							formatter = {value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser = {value => value.replace(/\$\s?|(,*)/g, '')}
							onChange = {val => this.changeFormElement('price', val)}
						/>
					</Form.Item>
					<Form.Item name="duration"  label="продолжительность:">
						<Select size='large'
							defaultValue = {String(service.duration_default)}
							//initialValues={service.duration_default}
							onChange = {val => this.changeFormElement('duration', val)}
							style = {{width:'151px'}}
						>
							{Object.entries(intervals).map(([minutes,text]) => 
								<Option key={minutes} value={minutes}>{text}</Option>
							)}
						</Select>
					</Form.Item>
					<br/>
					<Form.Item name="mastersList"  label="мастера:">
						<Select size='large' mode="multiple"
							onChange = {val => this.changeFormElement('mastersList', val)}
							style={{ width:'100%' }}
							defaultValue={Object.keys(service.masters || {}).map(Number)}
							//defaultValue = {[6,7]}
							//initialValues = {[6,7]}
							//initialValues={Object.keys(service.masters || {}).map(Number)}
						>
							{Object.values(this.props.persons).map(person => 
								<Option key={person.id} value={person.id}>
									{person.name}
								</Option>
							)}
						</Select>
					</Form.Item>

					<Button type="primary" htmlType="submit" 
						disabled = {this.state.saveButtonDisabled}
					>
						Сохранить
					</Button>
				</Form>
				</div>

				<UploaderTest
					style={{border:'solid red'}}
					objId = {service.id}
					objType = 'masters_services'
					fileList = {(service.images || []).map(img => {
						return {
							url: process.env.REACT_APP_SERVER_URL + img.preview,
							standard: process.env.REACT_APP_SERVER_URL + img.standard,
						}
					})}
					afterUpdate = {() => this.updateSalonServices(service.id)}
				/>
			</div>
		</>
	}
}
export default  connect(
	(storeState) => {
		return {
			persons: storeState.persons,
		}
	}
)(SalonServiceEditForm)
