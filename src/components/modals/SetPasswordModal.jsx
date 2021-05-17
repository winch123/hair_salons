import React from 'react'
import {connect} from 'react-redux'
import {Form, Input, Button, Tooltip} from 'antd'
import {QuestionCircleOutlined} from '@ant-design/icons'
import {apiRequest, dispatch} from "../../utils.js"
import BaseComponent from '../BaseComponent'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

class ModalSetPassword extends BaseComponent {
	state = {
	}

	constructor(props) {
		super(props)
		this.props.init({
			title: this.props.title || 'Смена пароля',
		})
	}

	componentDidMount() {
		console.log('ModalSetPassword --- componentDidMount')

	}
	componentWillUnmount() {
		console.log('ModalSetPassword --- componentWillUnmount')
	}

	onFinish = (values: any) => {
		//console.log('Received values of form: ', values)

		apiRequest('set_password', values)
		.then(res => {
			console.log(res)
			this.updateSalonServices()
			this.props.closeDialog()
		})
	}

	render() {
		return (
			<Form
				{...formItemLayout}
				// form={form}
				name="set password"
				onFinish={this.onFinish}
				initialValues={{
					residence: ['zhejiang', 'hangzhou', 'xihu'],
					prefix: '86',
				}}
				scrollToFirstError
			>
				{this.props.showNickname && <Form.Item
					name="nickname"
					label={
						<span>
							Ваше имя&nbsp;
							<Tooltip title="Только русские буквы">
								<QuestionCircleOutlined />
							</Tooltip>
						</span>
					}
					rules={[{
						required: true,
						message: 'Please input your nickname!',
						whitespace: true,
					}]}
				>
					<Input defaultValue={this.props.selfUser.name} />
				</Form.Item>}

				<Form.Item
					name="password"
					label="Password"
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
						{
							validator: (_, val) => val.length > 5
								? Promise.resolve()
								: Promise.reject('Пароль должен быть не короче 6 символов.')
						},
					]}
					hasFeedback
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					name="confirm"
					label="Confirm Password"
					dependencies={['password']}
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Please confirm your password!',
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve();
								}
								return Promise.reject('The two passwords that you entered do not match!');
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">
						Сохранить данные
					</Button>
				</Form.Item>
			</Form>
		)
	}
}

export default  connect(
	(storeState) => {
		return {
			selfUser: storeState.persons[storeState.loginSession.person_id],
		}
	}
)(ModalSetPassword)
