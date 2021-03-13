import React from 'react'
import {connect} from 'react-redux'
import {Button, Popconfirm} from 'antd';
import {CheckSquareTwoTone, CloseCircleTwoTone} from '@ant-design/icons'
import BaseComponent from './BaseComponent.js'
import {apiRequest} from '../utils.js'

class PersonnelManagement extends BaseComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {

	}

	ActionToPerson(memberId, action) {
		console.log({memberId, action})
		apiRequest('salon/set_member', {memberId, action})
	}

	PersonButtons (person) {
		if (person.roles.admin)
			return ('администратор')

		if (person.roles.ordinary)
			return ('сотрудник')

		if (person.roles.requested)
			return (<>
				<Popconfirm
					placement="topLeft"
					title={`Готовы принять ${person.name}?`}
					onConfirm={e => this.ActionToPerson(person.memberId, 'accept')}
					okText="Yes" cancelText="No">
					<Button
						//type="primary"
						//size='large'
						shape="round"
						style={{background:'#37B049'}}
						icon={<CheckSquareTwoTone twoToneColor="green" style={{fontSize: '22px'}}  />}
					/>
				</Popconfirm>

				<Popconfirm
					placement="rightBottom"
					title={`Отказываем запросу от ${person.name}?`}
					onConfirm={e => this.ActionToPerson(person.memberId, 'reject')}
					okText="Yes" cancelText="No">
					<Button
						shape="round"
						style={{background:'red'}}
						icon={<CloseCircleTwoTone twoToneColor="#ff6347" style={{fontSize: '22px'}}  />}
					/>
				</Popconfirm>
			</>)

		return ('ошибка природы!')
	}

	render() {
		return (<>
			PersonnelManagement
			{Object.values(this.props.persons).map(person => (
				<li key={person.id}
					style={{color: person.roles.length === 0 ? 'red' : null}}
				>
					<span style={{display:'inline-block', width:'133px'}}>
						{this.PersonButtons(person)}
					</span>
					{person.name}
				</li>
			))}
		</>)
	}
}

export default connect((storeState) => {
	return {
		persons: storeState.persons,
	}
})(PersonnelManagement)
