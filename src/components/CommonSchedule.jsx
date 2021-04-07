import React from 'react';
import {Link} from 'react-router-dom'
import BaseComponent from './BaseComponent.js'

import {apiRequest, store} from "../utils.js";
import { connect } from 'react-redux';
import classNames from 'classnames';

import 'antd/dist/antd.css';

import DayPersonalSchedule from './DayPersonalSchedule';
import CreateShift from './CreateShift';

class CommonSchedule extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentShiftId: null,
		createShiftButtonVisible: false,
	    selectedMasterId: null,
	    selectedDate: null
        };
	this.myRef = React.createRef()
    };

    componentDidMount() {
		this.updateSalonServices()
      this.UpdateWorkshifts()
      setTimeout(() => {
	//this.myRef.current.scrollLeft = 100
      }, 500)
    }

    UpdateWorkshifts() {
        apiRequest('actual-workshifts-get')
        .then(res => {
	    store.dispatch({
	      type: 'UPDATE_WORKSHIFTS',
	      value: res.workshifts,
	    })
        })
    }

	onSelectWorkshift(masterId, dayId) {
		let shiftId = this.props.workshifts[dayId].masters[masterId].shift_id
        apiRequest('schedule-get', {shiftId})

        this.setState({
            currentShiftId: shiftId,
        });
    }

	onScroll = () => {
		//const scrollY = window.scrollY //Don't get confused by what's scrolling - It's not the window
		const scrollTop = this.myRef.current.scrollTop
		const scrollY = this.myRef.current.scrollLeft
		//console.log(`scrollY: ${scrollY} scrollTop: ${scrollTop}`)
	}

	onWheel = (e) => {
		e.preventDefault()
		//console.log(e.target, e.deltaY)
		this.myRef.current.scrollLeft += e.deltaY * 5
	}

    render() {
        let {workshifts} = this.props

        return (
            <div style={{userSelect: 'none'}}>
				<Link to="/settings">настройки</Link>
		<CreateShift
		    visible = {this.state.createShiftButtonVisible}
		    onClose = {(result) => {
		      if (result === 'ok') {
			  this.UpdateWorkshifts()
		      }
		      this.setState({createShiftButtonVisible:false})
		    }}
		    selectedMasterId = {this.state.selectedMasterId}
		    selectedDate = {this.state.selectedDate}
		/>

		<table style={{float:'left'}}>
			<thead>
				<tr className='CommonSchedule-rowDate' />
			</thead>
			<tbody>
			{Object.values(this.props.persons).map((master) => (
				<tr key={master.id} className='CommonSchedule-rowMaster'>
					<td>{master.name}</td>
				</tr>
			))}
			</tbody>
		</table>

		<div style={{width:'555px', overflowX:'scroll'}}
			ref={this.myRef}
			onScroll={this.onScroll}
			onWheel = {(e) => this.onWheel(e)}
		>
			<table style={{marginLeft:'100px'}}>
				<thead>
				<tr className='CommonSchedule-rowDate'>
				{Object.keys(workshifts).map((k1) => (
					<th key={k1}>{workshifts[k1].caption}</th>
				))}
				</tr>
				</thead>
				<tbody>
				{this.props.persons.map(master => (
					<tr key={master.id} className='CommonSchedule-rowMaster'>
					{Object.keys(workshifts).map((selDate) => (
					    <td key={selDate} style={{}}>
						{ workshifts[selDate].masters[master.id] &&
							<div
								onClick = {() => this.onSelectWorkshift(master.id, selDate)}
								className = {classNames('CommonSchedule-Shift',
								this.state.currentShiftId === workshifts[selDate].masters[master.id].shift_id  ? 'CommonSchedule-ShiftActive' : '')}
							>
								<div style={{fontSize:'1.1em', width:'155px'}}>
									{workshifts[selDate].masters[master.id].text}
								</div>
								<div style={{fontSize:'0.8em'}}  dangerouslySetInnerHTML={{__html: workshifts[selDate].masters[master.id].description}} />
							</div>
						||
							<div>
								Нет смены.<br/>
								<button onClick = {() => this.setState({
									createShiftButtonVisible: true,
									selectedMasterId: master.id,
									selectedDate: selDate,
								})}>
									создать
								</button>
							</div>
						}
						</td>
					))}
					</tr>
				))}
				</tbody>
			</table>
		</div>

                <div>
                    текущая смена: {this.state.currentShiftId}
                </div>

                <hr/>
                {
                    //console.log( this.props.schedule[this.state.currentShiftId] )
                }
                {
                    this.props.schedule[this.state.currentShiftId] &&
                        <DayPersonalSchedule
                            DaySchedule = {this.props.schedule[this.state.currentShiftId]}
                            currentShiftId = {this.state.currentShiftId}
                        />
                    ||
                      <p>загрузка....</p>
                }
           </div>
        );
    }
}

export default  connect(
    (storeState) => {
        //console.log(storeState.schedule)
        return {
            schedule: storeState.schedule,
            workshifts: storeState.workshifts,
			persons: Object.values(storeState.persons).filter(p => p.roles.ordinary),
        }
    },
    (dispatch) => {
        return {
            setSchedule: (id, value) => {
                dispatch({ type: 'SET_SCHEDULE', id: id, value: value, });
            }
        }
    }
)(CommonSchedule) ;
