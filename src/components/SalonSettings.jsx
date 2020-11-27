import React, { Component } from 'react'
import { SaveTwoTone, RemoveCircleTwoTone, GroupAddTwoTone, ExpandMore } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import {scroller} from 'react-scroll'

import {apiRequest} from "../utils.js"

class SalonSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SalonServicesList: {},
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
        apiRequest('get-salon-services-list', {salonId:1})
        .then(res => {
            //console.log(res)
            this.setState({SalonServicesList: res})
        })

        apiRequest('get-all-services-dir')
        .then(res => {
            //console.log(res)
            this.setState({
              AllServices: res.servs,
              AllCategories: res.cats,
            })
        })
    }

    EditButtonClick(serviceId) {
        console.log(serviceId)
    }

    setStateA = (path, value) => {
      let rootName = path.shift()
      let someProperty = {...this.state[rootName]}
      //console.log(rootName)
      //console.log(path)
      //console.log(value)
      //console.log(someProperty)

      let cur = someProperty
      for (let ind of path ) {
          if(typeof cur[ind] === 'undefined') {
              throw new Error(ind + " not found");
          }
          if (path[path.length - 1] === ind)
              cur[ind] = value
          else
              cur = cur[ind]
      }
      //someProperty['catId'] = value

      this.setState({[rootName]: someProperty})
    }

    DurationChange = (event, serviceId, type='duration_default') => {
        //console.log(event.target.value, serviceId)
        //console.log(this)
        let someProperty = {...this.state.SalonServicesList}
        someProperty[serviceId][type] = event.target.value
        this.setState(someProperty)
    }

    RemoveMaster(event, serviceId, masterId) {
        console.log(serviceId, masterId)
        let someProperty = {...this.state.SalonServicesList}
        delete someProperty[serviceId].masters[masterId]
        this.setState(someProperty)
    }

    setExpanded(exp) {
        this.setState({expanded: (this.state.expanded == exp ? null : String(exp))})
    }

    SaveBattonClick = () => {
      apiRequest('save-salon-service', this.state.CurrentForSave)
      .then(res => {
          for (let k of Object.keys(res.servicesBaranch)) {
            //console.log(k, res[k])
            this.setStateA(['SalonServicesList',k], res.servicesBaranch[k])
          }
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
        let {SalonServicesList} = this.state
        const filter = createFilterOptions()

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
                {Object.entries(SalonServicesList).map(([catId, cat]) => (

                    <Accordion key={catId}
                      expanded={this.state.expanded === catId}
                      onChange={ () => this.setExpanded(catId)}
                    >
                        <AccordionSummary  style={{background:'#eee'}} expandIcon={<ExpandMore />}>
                            {cat.name}
                        </AccordionSummary>
                        <AccordionDetails>

                            <button title="сохранить"  onClick={this.EditButtonClick.bind(this)}>
                                <SaveTwoTone style={{ fontSize: 24, color:'green' }} />
                            </button>

                            <ul>
                            {Object.entries(cat.services || {}).map(([k, service]) => (
                                <li key={k} name={'service'+k}>
                                    <b style={{display:'inline-block', width:'202px'}}>{service.name}</b>
                                    <span style={{display:'inline-block', width:'122px'}}>
                                        <input type="number"
                                            value={service.price_default}
                                            onChange={(event) => this.DurationChange(event, k, 'price_default')}
                                            onFocus={(event) => event.target.select()}
                                            style={{width:'44px'}} /> руб.
                                    </span>

                                    <span style={{display:'inline-block', width:'122px'}}>
                                        <input type="number" step='5'
                                            value={service.duration_default}
                                            onChange={(event) => this.DurationChange(event, k)}
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
                                                onClick={(event) => this.RemoveMaster(event, k, k1) }  />
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

export default SalonSettings
