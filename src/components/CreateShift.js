import React from 'react'
import BaseComponent from './BaseComponent.js'
import {apiRequest} from "../utils.js"

import { TimePicker, Modal} from 'antd';
import moment from 'moment';

export default class CreateShift extends BaseComponent {
  constructor(props) {
      super(props);
      this.state = {
	timeBegin: null,
	timeEnd: null,
      };
  };

  render() {
    const { RangePicker } = TimePicker;
    const format = 'HH:mm';

    return (<div>

			<Modal title = {"Создание смены на " + moment(this.props.selectedDate).format('D MMM Y')}
	    visible={this.props.visible}
	    onOk={() => {
	      apiRequest('create-workshift', {
		  timeBegin: this.state.timeBegin,
		  timeEnd: this.state.timeEnd,
		  dateBegin: this.props.selectedDate,
		  masterId: this.props.selectedMasterId,
	      })
	      .then(res => {
		  this.props.onClose('ok')
	      })
	    }}
	    onCancel={this.props.onClose}
	    okButtonProps={{disabled: !this.state.timeBegin || !this.state.timeEnd }}
	>

	  начало: <TimePicker
	    defaultValue={moment('07:00', format)}
	    format={format}
	    minuteStep={10}
	    size="large"
	    showNow = {false}
	    onChange={val => this.setState( {timeBegin: val.format(format)} )}
	    style={{width:'120px'}}
	  />

			&emsp; конец: <TimePicker
	    defaultValue={moment('12:10', format)}
	    format={format}
	    minuteStep={10}
	    size="large"
	    showNow = {false}
	    onChange={val => this.setState( {timeEnd: val.format(format)} )}
	    style={{width:'120px'}}
	  />

	</Modal>

      </div>);
  }
}
