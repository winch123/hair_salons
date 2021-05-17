import React, {Component} from 'react'
import {connect} from 'react-redux'
import {dispatch} from "../../utils.js"
import {Modal} from 'antd'

import ModalSetPassword from "../modals/SetPasswordModal"

class ModalDialog extends Component {
	state = {
		title: '',
	}

	constructor(props) {
		super(props)
	}

	onCloseDialog = e => {
		if (!this.props.currentModal.closingDisabled) {
			// закрываем, если не было настройки, запрещающей закрытие.
			dispatch('SET_CURRENT_MODAL', null)
		}
	}

	getComponent = () => {
		if (!this.props.currentModal) return

		const CommonProps = {
			init: (params) => {
				// Устанавливаем состояние, заданное дочерним компонентом
				this.setState(params)
			},
			// здесь закрытие без проверки настройки, запрещающей закрытие.
			closeDialog: () => dispatch('SET_CURRENT_MODAL', null),

			// прокидываем в дочерний комонент параметры из redux.
			...this.props.currentModal.contentProps
		}

		switch (this.props.currentModal.content) {
			case 'ModalSetPassword':
				return <ModalSetPassword {...CommonProps} />
			default:
				return null
		}
	}

	render() {
		const component = this.getComponent()

		return (
			<Modal destroyOnClose
				title={this.state.title}
				visible={this.props.currentModal}
				onOk={() => {
				}}
				onCancel={this.onCloseDialog}
				okButtonProps={{disabled: true}}
				cancelButtonProps={{
					disabled: this.props.currentModal && this.props.currentModal.closingDisabled
				}}
				className = "ModalDialog"
				bodyStyle = {{background:'#f3f3f3'}}
			>
				{component}
			</Modal>
		)
	}
}

export default connect((storeState) => {
	return {
		currentModal: storeState.currentModal,
	}
})(ModalDialog)
