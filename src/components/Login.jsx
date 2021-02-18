import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {userLoginFetch} from '../redux/actions';

import {apiRequest} from "../utils.js"
import SetPassword from "./SetPassword"

import { Input, Button } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import MaskedInput from 'antd-mask-input'

class Login extends Component {
	state = {
		username: "",
		password: "",
		loginButtonDisabled: true,
		smsButtonDisabled: true,
		modeSendSms: false,
		PhoneImputDisabled: false,
		Phone: "",
	}

	constructor(props) {
		super(props)
		this.smsCodeInput = React.createRef()
	}

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    //this.props.userLoginFetch(this.state)
    apiRequest('login', {
      email: this.state.username,
      password: this.state.password,
    }).then(res => {
      if (res.token) {
        localStorage.setItem("token", res.token)
		this.props.history.replace('/')
      }
    })
  }

	PhoneChange = e => {
		let p = e.target.value.replace(/[^\d\+]/g, '')
		let buttons_disabled = p.length < 12
		this.setState({
			loginButtonDisabled: buttons_disabled,
			smsButtonDisabled: buttons_disabled,
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
			console.log(res)
		})
	}

	render() {
		return (
			<div style={{maxWidth:'444px', margin:'0 auto',}}>

                <SetPassword />

				<div>
					<label>
						Телефон:
						<MaskedInput
							mask="+7 (111) 111-11-11"
							//size="5"
							onChange={this.PhoneChange}
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
							/>
						</label>
						<br/>
						<br/>
						<Button type="primary" block disabled={this.state.loginButtonDisabled}>
							Воход в личный кабинет.
						</Button>
						<br/>
						<br/>
						<Button block onClick={this.ShowSmsSender}>
							Регистрация нового пользователя. / Напоминание пароля.
						</Button>
					</div>
					<div style={{display: this.state.modeSendSms ? 'block' : 'none'}}>
						<br/>
						<Button danger onClick={this.SendSms}
							disabled={this.state.smsButtonDisabled}
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
