import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Menu, Affix, PageHeader, Badge, Avatar, Button, Popover, Tooltip} from 'antd'
import {MailOutlined, AppstoreOutlined, SettingOutlined, GlobalOutlined, UserOutlined, KeyOutlined} from '@ant-design/icons'

import BaseComponent from './BaseComponent'
import {dispatch, apiRequest, history} from "../utils.js"
import MySalonActiveRequests from './MySalonActiveRequests'

const { SubMenu } = Menu

const styleOfUserLinks = {
	cursor: 'pointer',
	color: 'green',
}

class MainMenu extends BaseComponent {
	state = {
		showMenuOfUser: false,
		current: 'mail',
	}

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.updateMySalons()
	}

	handleMenuClick = e => {
		//console.log('click ', e)
		this.setState({ current: e.key })
		if (e.key === 'user:password') {
			this.showSetPasswordDialog()
		}
		if (e.key === 'user:exit') {
			this.userLogout()
		}
		if (e.key === 'mail') {
			history.push('/schedule')
		}
	}

	userLogout = () => {
		apiRequest('logout', {})
		.then(res => {
			console.log('logout', res)
			history.push('/Login')
		})
		this.setState({showMenuOfUser: false})
	}

	showSetPasswordDialog = () => {
		dispatch('SET_CURRENT_MODAL', {
			content:'ModalSetPassword',
			contentProps: {showNickname: true},
		})
		this.setState({showMenuOfUser: false})
	}

	render() {
		let currentSalonId = localStorage.getItem('currentSalonId')

		return (
		<>
			<Affix offsetTop={0} style={{width:'100%'}}>
				<PageHeader
					style={{background:'#eee', boxShadow: '7px 7px 25px #000' }}
					ghost={true}
					//onBack={() => window.history.back()}
					title = {
						<Tooltip title="Выбор салона"  placement="bottomLeft">
							<Button>
								<Link to="/SelectSalon"><KeyOutlined /></Link>
							</Button>
						</Tooltip>
					}
					subTitle = {this.props.mySalons[currentSalonId] && this.props.mySalons[currentSalonId].name}
					extra={<>
						<div  style={{border:'solid blue 1px', position:'absolute', left:'33%', top:'10%', background:'white', padding:'11px', borderRadius:'11px'}}>
							<MySalonActiveRequests />
						</div>
						<Avatar.Group>
							<Popover content={<>
									<div style={styleOfUserLinks} 
										onClick={this.showSetPasswordDialog}>
										Сменить пароль
									</div>
									<div style={styleOfUserLinks}
										onClick={this.userLogout}>
										Выйти
									</div>
								</>}
								placement="bottomRight" trigger="click"
								visible = {this.state.showMenuOfUser}
								onVisibleChange = {visible => this.setState({showMenuOfUser: visible})}
							>
								<Avatar
									style={{color: '#f56a00', backgroundColor: '#fde3cf' }}
									icon={<UserOutlined />}
									shape="round" size="large"
									placement="top"
									src=""
								/>
							</Popover>
					
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
			mySalons: storeState.mySalons,
		}
	}
)(MainMenu)
