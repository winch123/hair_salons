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

	<Modal title="Создание смены"
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

	  CreateShift
	  <RangePicker defaultValue={moment('12:05', format)} format={format} minuteStep={5} size="large" />
	  <br/>
	  начало: <TimePicker
	    defaultValue={moment('07:00', format)}
	    format={format}
	    minuteStep={10}
	    size="large"
	    showNow = {false}
	    onChange={val => this.setState( {timeBegin: val.format(format)} )}
	    style={{width:'120px'}}
	  />
	  конец: <TimePicker
	    defaultValue={moment('12:10', format)}
	    format={format}
	    minuteStep={10}
	    size="large"
	    showNow = {false}
	    onChange={val => this.setState( {timeEnd: val.format(format)} )}
	    style={{width:'120px'}}
	  />

	  <br/>
	  <div>{this.state.timeBegin}</div>

	</Modal>

      </div>);
  }
}