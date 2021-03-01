import React, {Component} from 'react'
import {Input} from 'antd'

//import {debounce} from 'lodash/fp'
//import * as _ from 'lodash'
//import debounce from 'lodash.debounce';

import {apiRequest, store, dispatch} from "../utils.js"

export default class SelectSalon extends Component {
	state = {
		firmsList: [],
		mySalons: [],
	}

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.updateMySalons()
	}

	ttt = null
	FindSalonsByStreet(e) {
		clearTimeout(this.ttt)
		e.persist()
		console.log(e.target.value)
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

	updateMySalons() {
		// console.log('ModalSetPassword --- componentDidMount')
		apiRequest('get_my_salons', {})
		.then(res => {
			//console.log(res)
			if (res.salons) {
				this.setState({mySalons: res.salons})
			}
		})
		// .catch(error => console.error(error))
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
					{this.state.mySalons.map(salon => (
						<li key={salon.id}>
							<span style={{display:'inline-block', width:'111px',}}>
								{salon.myRoles.length == 0
									? 'ожидаем'
									: <button
										onClick={e => {
											localStorage.setItem('currentSalonId', salon.id)
											this.props.history.push('/schedule')
										}}
										>перейти</button>}
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
