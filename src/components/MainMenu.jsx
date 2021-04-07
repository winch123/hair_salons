import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Menu, Affix, PageHeader, Badge, Avatar} from 'antd'
import {MailOutlined, AppstoreOutlined, SettingOutlined, GlobalOutlined, UserOutlined, TeamOutlined} from '@ant-design/icons'

import BaseComponent from './BaseComponent'
import {dispatch, apiRequest, history} from "../utils.js"
import MySalonActiveRequests from './MySalonActiveRequests'

const { SubMenu } = Menu


class MainMenu extends BaseComponent {
	state = {
		current: 'mail',
	}

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.updateMySalons()
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
		let currentSalonId = localStorage.getItem('currentSalonId')

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
					subTitle = {this.props.mySalons[currentSalonId] && this.props.mySalons[currentSalonId].name}
					extra={<>
						<div  style={{border:'solid blue 1px', position:'absolute', left:'33%', top:'10%', background:'white', padding:'11px', borderRadius:'11px'}}>
							<MySalonActiveRequests />
						</div>
						<Avatar.Group>
							<Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
							<Link to="/PersonnelManagement">
								<Badge
									count = {Object.values(this.props.persons).filter(p => p.roles.requested).length}
								>
									<Avatar
										style={{color: '#f56a00', backgroundColor: '#fde3cf' }}
										icon={<TeamOutlined />}
										shape="round" size="large"
										placement="top"
									/>
								</Badge>
							</Link>
						</Avatar.Group>
					</>}
				>
				</PageHeader>
			</Affix>
		</>
		)
	}
}
export default  connect(
	(storeState) => {
		return {
			persons: storeState.persons,
			mySalons: storeState.mySalons,
		}
	}
)(MainMenu)
