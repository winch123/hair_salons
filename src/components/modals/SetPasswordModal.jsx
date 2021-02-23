import React, {Component} from 'react'
import {Form, Input, Button} from 'antd'
import {apiRequest} from "../../utils.js"

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

export default class ModalSetPassword extends Component {
	state = {
	}

	constructor(props) {
		super(props)
		this.props.init({
			title: 'Смена пароля',
		})
	}

	componentDidMount() {
		console.log('ModalSetPassword --- componentDidMount')

	}
	componentWillUnmount() {
		console.log('ModalSetPassword --- componentWillUnmount')
	}

	onFinish = (values: any) => {
		console.log('Received values of form: ', values)
		apiRequest('set_password', {
			new_password: values.password,
		})
		.then(res => {
			console.log(res)
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
						установить новый пароль
					</Button>
				</Form.Item>
			</Form>
		)
	}
}
