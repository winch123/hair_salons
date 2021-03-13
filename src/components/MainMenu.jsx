import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Menu, Affix, PageHeader, Badge, Avatar} from 'antd'
import {MailOutlined, AppstoreOutlined, SettingOutlined, GlobalOutlined, UserOutlined} from '@ant-design/icons'

import {dispatch, apiRequest, history} from "../utils.js"
import MySalonActiveRequests from './MySalonActiveRequests'

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

		if (e.key === 'mail') {
			history.push('/schedule')
		}
	}


	render() {
		return (
		<>
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
						<Menu.Item key="setting:3">
							<Link to="/PersonnelManagement">Сотрудники</Link>
						</Menu.Item>
						<Menu.Item key="setting:4">
							<Link to="/settings">Настройки салона 2</Link>
						</Menu.Item>
					</Menu.ItemGroup>
				</SubMenu>
				<Menu.Item key="settings" icon={<SettingOutlined />}>
					<a href="/settings" rel="noopener noreferrer">
						Настройки салона
					</a>
				</Menu.Item>
			</Menu>

			<Affix offsetTop={0} style={{width:'100%'}}>
				<PageHeader
					style={{background:'#eee', boxShadow: '7px 7px 25px #000' }}
					ghost={true}
					onBack={() => window.history.back()}
					title = "Titlegg"
					subTitle="This is a subtitle"
					extra={[
					<>
						<MySalonActiveRequests/>
						<Avatar.Group>
							<Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
							<Badge count={17}>
								<Avatar
									style={{color: '#f56a00', backgroundColor: '#fde3cf' }} 
									icon={<GlobalOutlined />}
									shape="square" size="large"
									placement="top"
								/>
							</Badge>
						</Avatar.Group>
					</>
					]}
				>
				</PageHeader>
			</Affix>
		</>
		)
	}
}
