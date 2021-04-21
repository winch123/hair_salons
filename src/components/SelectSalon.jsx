import React from 'react'
import {connect} from 'react-redux'
import {Input, Tooltip} from 'antd'
import {ClockCircleTwoTone, LoginOutlined} from '@ant-design/icons'

//import {debounce} from 'lodash/fp'
//import * as _ from 'lodash'
//import debounce from 'lodash.debounce';

import BaseComponent from './BaseComponent'
import {apiRequest, dispatch} from "../utils.js"

class SelectSalon extends BaseComponent {
	state = {
		firmsList: [],
	}

	constructor(props) {
		super(props)
	}

	ttt = null
	FindSalonsByStreet(e) {
		clearTimeout(this.ttt)
		e.persist()
		//console.log(e.target.value)
		this.ttt = setTimeout(() => {
			if (e.target.value.length > 1) {
				apiRequest('find_salons_by_street_name', {
					street_name: e.target.value,
				})
				.then(res => {
					console.log(res)
					this.setState({firmsList: res.firms})
				})
			}
			else {
				this.setState({firmsList: []})
			}
		}, 1000)
	}

	AddMeToSalon(firmId) {
		apiRequest('add_me_to_salon', {firmId})
		.then(res => {
			//console.log(res)
			this.updateMySalons()
		})
	}

	render() {
		return (
			<>
				<h3>Мои салоны</h3>
				<ul>
					{Object.values(this.props.mySalons).map(salon => (
						<li key={salon.id}>
							<span style={{display:'inline-block', width:'122px',}}>
								{salon.myRoles.length == 0
									? <Tooltip placement="topLeft" title='Ожидание решения от администратора салона.'>
										<ClockCircleTwoTone
											twoToneColor="#eb2f96"
											style={{fontSize: "20px"}}
										/>
									</Tooltip>
									: <button
										onClick={e => {
											localStorage.setItem('currentSalonId', salon.id)
											this.props.history.push('/salon')
										}}
									>
										<LoginOutlined style={{fontSize: "18px"}}/>
										&nbsp; Войти
									</button>}
							</span>
							{salon.name}
						</li>
					))}
				</ul>
				<hr/>
				Поиск салона
				<div>
					город <select>
						<option>Тольятти</option>
					</select>
				</div>
				<Input placeholder="улица"
					onChange={e => this.FindSalonsByStreet(e)}
				/>
				<div>
					{this.state.firmsList.map(firm => (
						<li key={firm.id}>
							<button
								onClick={e => this.AddMeToSalon(firm.id)}
							>add</button>
							<b style={{width:'333px', display:'inline-block'}}>{firm.name}</b>
							{firm.street}, {firm.house}
						</li>
					))}
				</div>
			</>
		)
	}
}

export default  connect(
    (storeState) => {
        return {
          mySalons: storeState.mySalons,
        }
    }
)(SelectSalon)
