import React, {Component} from 'react'
import {Menu} from 'antd'
import { MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'

import {dispatch, apiRequest, history} from "../utils.js"

const { SubMenu } = Menu


export default class MainMenu extends Component {
	state = {
		current: 'mail',
	}

	constructor(props) {
		super(props)
	}

	handleClick = e => {
		//console.log('click ', e)
		this.setState({ current: e.key })
		if (e.key === 'user:password') {
			dispatch('SET_CURRENT_MODAL', {
				content:'ModalSetPassword',
				contentProps: {showNickname: true},
			})
		}
		if (e.key === 'user:exit') {
			apiRequest('logout', {})
			.then(res => {
				console.log('logout', res)
				history.push('/Login')
			})
		}

		if (e.key === 'setting:3') {
			dispatch('SET_CURRENT_MODAL', null)
		}
	}


	render() {
		return (
			<Menu onClick={this.handleClick} selectedKeys={[this.current]} mode="horizontal">
				<Menu.Item key="mail" icon={<MailOutlined />}>
					Navigation One
				</Menu.Item>
				<Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
					Navigation Two
				</Menu.Item>
				<SubMenu key="SubMenu"  title="Пользователь" icon={<UserOutlined />} >
					<Menu.ItemGroup title="Item 1">
						<Menu.Item key="user:password">Сменить пароль</Menu.Item>
						<Menu.Item key="user:exit">Выйти</Menu.Item>
					</Menu.ItemGroup>
					<Menu.ItemGroup title="Item 2">
						<Menu.Item key="setting:3">Option 3</Menu.Item>
						<Menu.Item key="setting:4">Option 4</Menu.Item>
					</Menu.ItemGroup>
				</SubMenu>
				<Menu.Item key="settings" icon={<SettingOutlined />}>
					<a href="/settings" rel="noopener noreferrer">
						Настройки салона
					</a>
				</Menu.Item>
			</Menu>
		)
	}
}
