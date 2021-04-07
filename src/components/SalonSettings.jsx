import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import BaseComponent from './BaseComponent'
import SalonServiceEditForm from './SalonServiceEditForm'

import { /*SaveTwoTone,*/ RemoveCircleTwoTone, ExpandMore } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import {scroller} from 'react-scroll'

import {apiRequest, dispatch, store} from "../utils.js"
import {Select,Popover,Button} from 'antd'

class SalonSettings extends BaseComponent {
    constructor(props) {
        super(props);
        //console.log('constructor', props);

        this.state = {
            SalonServicesParams: {},
            options: [{text:'aaaaaaa'}, {text:'bbbbb'}],
            AllServices: {},
            AllCategories: {},
            CurrentForSave: {
              catId: null,
              serviceId: null,
              serviceName: null,
            },
            CurrentCatSelectDisabled: true,
            CurrentCatSelectOpen: false,
            expCategory: 1,
			expService: null,
			createServiceFormVisible: false,
        }
		this.ButtonCreateService = React.createRef()
		this.refSelectCreatedCategory = React.createRef()
    }

    componentDidMount() {
        apiRequest('get-all-services-dir')
        .then(res => {
            //console.log(res)
            this.setState({
              AllServices: res.servs,
              AllCategories: res.cats,
            })
        })
		this.updateSalonServices()
    }

    componentDidUpdate(prevProps) {
      //console.log('componentDidUpdate', prevProps, this.props)

      if (this.props.salonServices !== prevProps.salonServices) {
	let p = {}
	for (let i in this.props.salonServices) {
		for (let j in this.props.salonServices[i].services) {
			//console.log(j, this.props.salonServices[i].services[j])
			p[j] = this.props.salonServices[i].services[j]
		}
	}
	this.setState({SalonServicesParams: p})
      }
    }

    RemoveMaster(event, serviceId, masterId) {
        console.log(serviceId, masterId)
        let someProperty = {...this.state.SalonServicesList}
        delete someProperty[serviceId].masters[masterId]
        this.setState(someProperty)
    }

    setExpandedCategory(exp) {
        this.setState({expCategory: (this.state.expCategory === exp ? null : String(exp))})
    }

    SaveButtonClick = () => {
      apiRequest('create_salon_service', this.state.CurrentForSave)
      .then(res => {
			console.log(res)
			dispatch('UPDATE_SALON_SERVICES', res.servicesBranch)
			this.setState({
				createServiceFormVisible: false,
				CurrentForSave: {
					catId: null,
					serviceId: null,
					serviceName: null,
				},
				expService: res.salonServiceId,
			}, () => {
				console.log(this.state)
			})
			this.setExpandedCategory(res.categoryId)

          scroller.scrollTo('service' + res.serviceId, {
            duration: 1500,
            delay: 100,
            smooth: true,
            //containerId: 'ContainerElementID',
            offset: 50, // Scrolls to element + 50 pixels down the page
          })
       })
    }

	handleFormVisibleChange = visible => {
		console.log('handleFormVisibleChange', visible)
		this.setState({createServiceFormVisible: visible})
	}

    render() {
        let {salonServices} = this.props
        const filter = createFilterOptions()
		const {CurrentForSave} = this.state
		//console.log({createServiceFormVisible: this.state.createServiceFormVisible})

		const createServiceForm = (
			<div className='create-service-form'>
				<div><b>{CurrentForSave.serviceName}</b></div>
				В разделе:
				<Select
					className = "class-tst111"
					ref = {this.refSelectCreatedCategory}
					//ref = {element => this.selCC = element}
					onSelect = {(val) => {
						console.log(val)
						this.setStateA(['CurrentForSave','catId'], val)
						this.ButtonCreateService.current.focus()
					}}
					style = {{width:'222px'}}
					onFocus = {() => this.setState({CurrentCatSelectOpen: true})}
					onBlur = {() => this.setState({CurrentCatSelectOpen: false})}

					value={CurrentForSave.catId}
					open={this.state.CurrentCatSelectOpen}
					//onClose={() => this.setState({CurrentCatSelectOpen: false})}
					//onOpen={() => this.setState({CurrentCatSelectOpen: true})}
					disabled={this.state.CurrentCatSelectDisabled}
				>
					{Object.values(this.state.AllCategories).map((cat) => (
						<MenuItem value={cat.id} key={cat.id} >{cat.name} </MenuItem>
					))}
				</Select>
				<Button onClick={this.SaveButtonClick}
					ref = {this.ButtonCreateService}
					disabled = {!CurrentForSave.serviceId && !(CurrentForSave.catId && CurrentForSave.serviceName)}
				>
					сохранить
				</Button>
			</div>
		)

        return (
            <div className="salon-settings">
				<div className="create-service">
                <Autocomplete
                    style={{margin:'33px'}}
                    options={Object.values(this.state.AllServices)}
                    groupBy={(option) => option.category_name}
                    groupBy={(option) => option.category_name}
                    getOptionLabel={(option) => typeof option == 'object' ? option.name : option}
                    autoComplete
                    includeInputInList
                    renderInput={(params) => <TextField {...params} label="autoComplete" margin="normal" />}
                    noOptionsText="Будет создана новая услуга."
                    freeSolo={true}
                    onChange={(event, newValue) => {
                      //console.log(event.target, newValue, typeof newValue)
                      if (newValue && typeof newValue === 'object') {
                          this.setState({
                              CurrentForSave: {
                                  catId: newValue.category_id,
                                  serviceId: newValue.id,
                                  serviceName: newValue.name,
                              },
                              CurrentCatSelectDisabled: true,
								createServiceFormVisible: true,
                          })
                      }
                      if (typeof newValue === 'string') {
							this.setState({
								CurrentForSave: {
									catId: null,
									serviceId: null,
									serviceName: newValue,
								},
								CurrentCatSelectDisabled: false,
								createServiceFormVisible: true,
							})
							setTimeout(() => this.refSelectCreatedCategory.current.focus(), 0)
                      }

                    }}
                    filterOptions={(options, params) => {

                            const filtered = filter(options, params);

                            if (params.inputValue !== '') {
                                filtered.push({
                                    inputValue: params.inputValue,
                                    title: `Add "${params.inputValue}"`,
                                });
                            }

                            return filtered;
                        }}
                />

					<Popover
						content={createServiceForm}
						title="Будет создана услуга"
						visible = {this.state.createServiceFormVisible }
						onVisibleChange = {this.handleFormVisibleChange}
						placement = "bottomLeft"
						trigger = "click"
					>
						<br/>
					</Popover>

				</div>
				<hr/>
				<br/>
                <ul>
                {Object.entries(salonServices || {}).map(([catId, cat]) => (

                    <Accordion key={catId}
                      expanded={this.state.expCategory == catId}
                      onChange={ () => this.setExpandedCategory(catId)}
                    >
                        <AccordionSummary  style={{background:'#eee'}} expandIcon={<ExpandMore />}>
                            {cat.name}
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul>
                            {Object.entries(cat.services || {}).map(([serviceId, service]) => (
                                <li key={serviceId} name={'service'+serviceId}>
									{this.state.expService == serviceId
										? <SalonServiceEditForm 
											service = {service}
										/>
										: <button 
											style={{width:'277px'}}
											onClick={e => this.setState({expService:serviceId})}
										>{service.name}</button>
									}
                                </li>
                            ))}
                            </ul>

                        </AccordionDetails>
                    </Accordion>
                ))}
                </ul>
            </div>
        )
    }
}

export default  connect(
    (storeState) => {
        return {
          salonServices: storeState.salonServices,
        }
    }
)(SalonSettings)
