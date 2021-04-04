import React, {Component} from 'react'
import {connect} from 'react-redux'

import {apiRequest, dispatch} from "../utils.js"

import {Input, Button, message, Spin} from 'antd'
import { LockOutlined } from '@ant-design/icons'
import MaskedInput from 'antd-mask-input'

class Login extends Component {
	state = {
		loginButtonDisabled: true,
		modeSendSms: false,
		PhoneImputDisabled: false,
		Phone: "",
		isWaitingLogin: false,
	}

	constructor(props) {
		super(props)
		this.smsCodeInput = React.createRef()
		this.passwordInput = React.createRef()
	}

	onPhoneChange = e => {
		let p = e.target.value.replace(/[^\d\+]/g, '')
		let buttons_disabled = p.length < 12
		if (!buttons_disabled && this.state.loginButtonDisabled) {
			// если ввели последнюю решающую цифру, переводим фокус
			this.passwordInput.focus()
		}
		this.setState({
			loginButtonDisabled: buttons_disabled,
			Phone: p,
		})
	}

	ShowSmsSender = e => {
		this.setState({modeSendSms: true})
	}

	SendSms = e => {
		this.setState({PhoneImputDisabled: true})
		this.smsCodeInput.focus()
		apiRequest('send_sms_code', {
			phone: this.state.Phone,
		})
		.then(res => {
		})
	}

	ComfirmSms = e => {
		console.log(this.smsCodeInput.state.value, this.state.Phone)
		apiRequest('verify_sms_code', {
			phone: this.state.Phone,
			smsCode: this.smsCodeInput.state.value,
		})
		.then(res => {
			//console.log(res)
			if (res.token) {
				localStorage.setItem("token", res.token)
				dispatch('SET_CURRENT_MODAL', {
					content:'ModalSetPassword',
					contentProps: {
						showNickname: true,
						title: "Пожалуйста задайте имя и пароль.",
					},
					closingDisabled: true,
				})
				this.props.history.replace('/SelectSalon')
			}
		})
	}

	doLogin = e => {
		this.setState({isWaitingLogin:true})
		apiRequest('login', {
			email: this.state.Phone,
			password: this.passwordInput.state.value,
		})
		.then(res => {
			this.setState({isWaitingLogin:false})
			if (res.token) {
				localStorage.setItem("token", res.token)
				this.props.history.push('/SelectSalon')
			}
			else {
				message.error('Ошибка логина')
				this.passwordInput.focus()
			}
		})
		.catch(error => {
			//console.log(error)
			this.setState({isWaitingLogin:false})
		})
	}

	render() {
		return (
			<div style={{maxWidth:'444px', margin:'0 auto',}}>

				<div>
					<label>
						Телефон:
						<MaskedInput
							mask="+7 (111) 111-11-11"
							//size="5"
							onChange={this.onPhoneChange}
							disabled={this.state.PhoneImputDisabled}
						/>
					</label>
					<div style={{display: this.state.modeSendSms ? 'none' : 'block'}}>
						<label>
							пароль:
							<Input.Password
								size="large"
								placeholder="input password"
								prefix={<LockOutlined />}
								ref = {input => this.passwordInput = input}
							/>
						</label>
						<br/>
						<br/>

						<Spin size="large" spinning={this.state.isWaitingLogin}>
							<Button
								type="primary" block
								disabled={this.state.loginButtonDisabled}
								onClick = {this.doLogin}
							>
								Войти в личный кабинет.
							</Button>
						</Spin>

						<br/>
						<br/>
						<Button block onClick={this.ShowSmsSender}>
							Регистрация нового пользователя. / Напоминание пароля.
						</Button>
					</div>
					<div style={{display: this.state.modeSendSms ? 'block' : 'none'}}>
						<br/>
						<Button danger onClick={this.SendSms}
							disabled={this.state.loginButtonDisabled}
						>
							Отправить СМС код.
						</Button>
						<br/>
						<br/>
						<Input
							placeholder="Введите СМС код"
							ref={input => { this.smsCodeInput = input }}
						/>
						<Button  type="primary" onClick={this.ComfirmSms}>
							Подтвердить СМС код.
						</Button>
					</div>
				</div>
				<br/>
				<br/>
				<hr/>


				<form onSubmit={this.handleSubmit}>
					<h1>Login</h1>

					<label>
					  Username
					  <input
						name='username'
						placeholder='Username'
						value={this.state.username}
						onChange={this.handleChange}
						/>
					</label>
					<br/>

					<label>
					  Password
					  <input
						type='password'
						name='password'
						placeholder='Password'
						value={this.state.password}
						onChange={this.handleChange}
						/>
					</label>
					<br/>

					<input type='submit'/>
				</form>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => ({
  // userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo))
})

export default connect(null, mapDispatchToProps)(Login);
