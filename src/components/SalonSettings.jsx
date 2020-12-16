import React from 'react'
import { connect } from 'react-redux'
import BaseComponent from './BaseComponent.js'

import { /*SaveTwoTone,*/ RemoveCircleTwoTone, GroupAddTwoTone, ExpandMore } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import {scroller} from 'react-scroll'

import {apiRequest, store} from "../utils.js"

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
            expanded: 1,
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

    setExpanded(exp) {
        this.setState({expanded: (this.state.expanded === exp ? null : String(exp))})
    }

    SaveBattonClick = () => {
      apiRequest('save-salon-service', this.state.CurrentForSave)
      .then(res => {
          store.dispatch({
            type: 'UPDATE_SALON_SERVICES',
            value: res.servicesBaranch,
          })

          this.setExpanded(res.categoryId)
          scroller.scrollTo('service' + res.serviceId, {
            duration: 1500,
            delay: 100,
            smooth: true,
            //containerId: 'ContainerElementID',
            offset: 50, // Scrolls to element + 50 pixels down the page
          })
       })
    }

    render() {
        let {salonServices} = this.props
        const filter = createFilterOptions()
        console.log('render', this.state.SalonServicesParams)

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
                      expanded={this.state.expanded === catId}
                      onChange={ () => this.setExpanded(catId)}
                    >
                        <AccordionSummary  style={{background:'#eee'}} expandIcon={<ExpandMore />}>
                            {cat.name}
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul>
                            {Object.entries(cat.services || {}).map(([serviceId, service]) => (
                                <li key={serviceId} name={'service'+serviceId}>
                                    <b style={{display:'inline-block', width:'202px'}}>{service.name}</b>
                                    <span style={{display:'inline-block', width:'122px'}}>
                                        <input type="number"
                                            value={(this.state.SalonServicesParams[serviceId] || {}).price_default}
                                            onChange={(event) => this.setStateA(['SalonServicesParams',serviceId,'price_default'], event.target.value)}
                                            onFocus={(event) => event.target.select()}
                                            style={{width:'44px'}} /> руб.
                                    </span>

                                    <span style={{display:'inline-block', width:'122px'}}>
                                        <input type="number" step='5'
                                            value={(this.state.SalonServicesParams[serviceId] || {}).duration_default}
                                            onChange={(event) => this.setStateA(['SalonServicesParams',serviceId,'duration_default'], event.target.value)}
                                            style={{width:'44px'}} /> мин
                                    </span>
                                    <ul>
                                    <button title="Добавить всех мастеров" style={{cursor:'pointer'}}>
                                        <GroupAddTwoTone style={{marginBottom:'-5px', fontSize: 24, color:'green'}} />
                                    </button>
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
