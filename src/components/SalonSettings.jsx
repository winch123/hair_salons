import React from 'react'
import { connect } from 'react-redux'
import BaseComponent from './BaseComponent.js'

import { /*SaveTwoTone,*/ RemoveCircleTwoTone, ExpandMore } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import {scroller} from 'react-scroll'
import salonCss from './salon.css'

import {apiRequest, dispatch, store} from "../utils.js"
import UploaderTest from './UploaderTest'
import {InputNumber, Select} from 'antd'
const {Option} = Select


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
              catId: 0,
              serviceId: null,
              serviceName: null,
            },
            CurrentCatSelectDisabled: true,
            CurrentCatSelectOpen: false,
            expCategory: 1,
			expService: null,
        }
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

    SaveBattonClick = () => {
		//console.log(salonCss)
		//return
		
      apiRequest('save-salon-service', this.state.CurrentForSave)
      .then(res => {
          store.dispatch({
            type: 'UPDATE_SALON_SERVICES',
            value: res.servicesBaranch,
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

	ReloadSalonService = (serviceId) => {
		//console.log('ReloadSalonService', serviceId)
		apiRequest('get-salon-services-list', {serviceId})
		.then(res => {
			console.log(res)
			dispatch('UPDATE_ONE_SALON_SERVICE', res)
		})
	}
	
	editServiceForm(serviceId, service) {
		const intervals = {
			10: '10 мин',
			20: '20 мин',
			30: '30 мин',
			40: '40 мин',
			50: '50 мин',
			60: '1 час',
			80: '1 час 20 мин',
			90: '1 час 30 мин',
			100: '1 час 40 мин',
			120: '2 часа',
			150: '2 часа 30 мин',
			180: '3 часа',
		}
		
		return <>
			<b style={{display:'inline-block', width:'202px'}}>{service.name}</b>
			<div style={{}}>
				<div className = {salonCss.service}>
					цена:
					<InputNumber
						defaultValue = {100}
						formatter = {value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser = {value => value.replace(/\$\s?|(,*)/g, '')}
						onChange = {value => console.log('changed', value)}
					/>
					<br/>
					продолжительность:
					<Select size='large' defaultValue={20}
						onChange={e => console.log(e)}
						style={{ width: 200 }}
					>
						{Object.entries(intervals).map(([minutes,text]) => 
							<Option key={minutes}>{text}</Option>
						)}
					</Select>

				</div>

				<UploaderTest
					style={{float:'right'}}
					objId = {service.id}
					objType = 'masters_services'
					fileList = {(service.images || []).map(img => {
						return {
							url: 'https://hs.local' + img.preview,
							standard: 'https://hs.local' + img.standard,
						}
					})}
					afterUpdate = {() => this.ReloadSalonService(service.id)}
				/>
			</div>
		</>
		
		return (<>
			<ul>

			{Object.entries(service.masters || {}).map(([k1, master]) => (
				<li key={k1}>
					<span style={{display:'inline-block', width:'122px'}}>
						{master.name}
					</span>
					<RemoveCircleTwoTone
						style={{marginBottom:'-5px', cursor:'pointer'}}
						onClick={(event) => this.RemoveMaster(event, serviceId, k1) }  />
				</li>
			))}
			</ul>
		</>)
	}

    render() {
        let {salonServices} = this.props
        const filter = createFilterOptions()
        //console.log('render', this.state.SalonServicesParams)

        return (
            <div>
                <Autocomplete
                    style={{margin:'33px'}}
                    options={Object.values(this.state.AllServices)}
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
                          })
                      }
                      if (typeof newValue === 'string') {
                          this.setState({
                              CurrentForSave: {
                                  catId: '',
                                  serviceId: null,
                                  serviceName: newValue,
                              },
                              CurrentCatSelectDisabled: false,
                          })
                      this.setState({CurrentCatSelectOpen: true})
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
                <div>
                    <span>{this.state.CurrentForSave.serviceName}</span>
                    <Select
                        onChange={(ev) => this.setStateA(['CurrentForSave','catId'], ev.target.value)}
                        value={this.state.CurrentForSave.catId}
                        open={this.state.CurrentCatSelectOpen}
                        onClose={() => this.setState({CurrentCatSelectOpen: false})}
                        onOpen={() => this.setState({CurrentCatSelectOpen: true})}
                        disabled={this.state.CurrentCatSelectDisabled}
                    >
	                    {Object.values(this.state.AllCategories).map((cat) => (
	                        <MenuItem value={cat.id} key={cat.id} >{cat.name} </MenuItem>
	                    ))}
                    </Select>
                    <button onClick={this.SaveBattonClick}>сохранить</button>
                </div>

                <ul>
                {Object.entries(salonServices || {}).map(([catId, cat]) => (

                    <Accordion key={catId}
                      expanded={this.state.expCategory === catId}
                      onChange={ () => this.setExpandedCategory(catId)}
                    >
                        <AccordionSummary  style={{background:'#eee'}} expandIcon={<ExpandMore />}>
                            {cat.name}
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul>
                            {Object.entries(cat.services || {}).map(([serviceId, service]) => (
                                <li key={serviceId} name={'service'+serviceId}>
									{this.state.expService === serviceId
										? this.editServiceForm(serviceId, service)
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
