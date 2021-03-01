import React, {Component} from 'react'
import {connect} from 'react-redux'
import {store} from "../../utils.js"
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
		store.dispatch({type: 'SET_CURRENT_MODAL', value: null})
	}

	getComponent = () => {
		if (!this.props.currentModal) return

		const CommonProps = {
			init: (params) => {
					this.setState(params)
			},
			closeDialog: this.onCloseDialog,
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
