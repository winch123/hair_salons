import React from 'react';
import { connect } from 'react-redux'
import BaseComponent from './BaseComponent.js'

import {apiRequest} from "../utils.js"
import {Button, Progress, Popover} from 'antd'
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons'

class MySalonActiveRequests extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
	  k: 100 / 80,
	  activeRequestsList: [],
			intervalInstance: null,
	}
    }

	componentDidMount() {
        this.intervalInstance = setInterval(() => {
			//console.log(new Date().toString(), this.state.activeRequestsList.length)
			for (let i in this.state.activeRequestsList) {
				let el = this.state.activeRequestsList[i]
				//console.log(i, el)
				if (el.limit_seconds === 0) {
				  this.deleteFromState(['activeRequestsList', i])
				}
				else {
				  this.setStateA(['activeRequestsList',i,'limit_seconds'], el.limit_seconds-1)
				}
			}
		}, 1000);
    }

  	componentWillUnmount() {
		clearInterval(this.intervalInstance)
	}

    answer = (serviceRequest, answer, shiftId) => {
		console.log(serviceRequest.id, answer)

		apiRequest('/set_my_response', {serviceRequestId: serviceRequest.id, shiftId: shiftId})
		.then( r => {

		})
		this.deleteFromState(['activeRequestsList', serviceRequest.id])
		serviceRequest.title = 'угуу '
    }

    mumumu = () => {
      apiRequest('/get_my_salon_services_active_requests')
      .then( r => {
	//console.log(r.activeRequests)
	this.setState({activeRequestsList: r.activeRequests})

      })
    }

    render() {

	const popoverContent = (serviceRequest) => (<div>
			{Object.entries(serviceRequest.vacancyInShifts).map(([shiftId, shiftData]) => (
				<div key={shiftId}>
					{shiftData.can_be_shoved &&
						<Button type="primary" size="small"
							icon={<CheckCircleOutlined />}
							onClick={() => this.answer(serviceRequest, 'yes', shiftId)}
						>
						</Button>
					}
					{this.props.persons[shiftData.masterId].name}
				</div>
			))}

			<Button type="primary" size="small" danger
				icon={<CloseCircleOutlined />}
				onClick={() => this.answer(serviceRequest, 'no')}
			>
				Отказать
			</Button>
	</div>);

      return (<div>
	  <button onClick={this.mumumu}>mu</button>

	  <div>
	    {Object.values(this.state.activeRequestsList).map((request) => (
	      <div key={request.id} style={{cursor:'pointer'}}>
		<Popover content={popoverContent(request)}  placement="bottomRight" title={request.title || ' '} trigger="click">

		    <Progress type="dashboard" percent={request.limit_seconds * this.state.k } width={50} strokeWidth={15} gapDegree={100}
		      strokeColor={{
			'0%': '#108ee9',
			'100%': '#87d068',
		      }}
		      format={percent => `${Math.round(percent / this.state.k)} s`}
		    />

		    {request.desired_time} {request.service_name}
		</Popover>
	      </div>
	    ))}
	  </div>

      </div>)

    }
}

export default  connect(
    (storeState) => {
        //console.log(storeState.schedule)
        return {
			persons: storeState.persons,
        }
    }
)(MySalonActiveRequests);
