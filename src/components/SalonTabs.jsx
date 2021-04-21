import React, { useState } from 'react'
import { connect } from 'react-redux'

import CommonSchedule from './CommonSchedule'
import PersonnelManagement from './PersonnelManagement'
import SalonSettings from './SalonSettings'

import { TeamOutlined, SettingTwoTone } from '@ant-design/icons'
import {Tabs, Badge} from 'antd'
const { TabPane } = Tabs

function SalonTabs(props) {
	const [count, setCount] = useState(0)

	function callback(key) {
		console.log(key)
	}
	const operations = {left: <div>***</div>, right: <span/>}

	return (
		<Tabs defaultActiveKey = "1"
			onChange = {callback}
			centered
			size = "large"
			tabBarExtraContent = {operations}
			type="line"
		>
			<TabPane tab="Рассписание." key="2">
				<CommonSchedule />
			</TabPane>
			<TabPane key="3"
				tab = {
					<span>
						<Badge ount = {Object.values(props.persons).filter(p => p.roles.requested).length}>
							<TeamOutlined />
						</Badge>
						Сотрудники.
					</span>
				}
			>
				<PersonnelManagement />
			</TabPane>
			<TabPane key="4" disabled={false}
				tab = {
					<span>
						<SettingTwoTone twoToneColor="#888" />
						Настройки услуг.
					</span>
				}
			>
				<SalonSettings />
			</TabPane>
		</Tabs>
	)
}

export default  connect(
	(storeState) => {
		return {
			persons: storeState.persons,
		}
	}
)(SalonTabs)
