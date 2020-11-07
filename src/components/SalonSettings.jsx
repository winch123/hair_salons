import React, { Component } from 'react'
import { SaveTwoTone, RemoveCircleTwoTone, GroupAddTwoTone, ExpandMore } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import {apiRequest} from "../utils.js"

class SalonSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SalonServicesList: {},
            options: [{text:'aaaaaaa'}, {text:'bbbbb'}],
            AllServices: {},
            expanded: 1,
        }
    }

    componentDidMount() {
        apiRequest('/salon/get-salon-services-list', {salonId:1})
        .then(res => {
            //console.log(res)
            //this.setState({SalonServicesList: res})
        })

        apiRequest('/salon/get-all-services-dir')
        .then(res => {
            //console.log(res)
            this.setState({AllServices: res})
        })
    }

    EditButtonClick(serviceId) {
        console.log(serviceId)
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
        //console.log(exp)
        this.setState({expanded: (this.state.expanded==exp ? null : exp)})
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
                    getOptionLabel={(option) => option.name}
                    autoComplete
                    includeInputInList
                    renderInput={(params) => <TextField {...params} label="autoComplete" margin="normal" />}
                    noOptionsText="Будет создана новая услуга."
                    freeSolo={true}
                    onChange={(event, newValue) => console.log(event.target, newValue) }

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

                <ul>
                {Object.entries(SalonServicesList).map(([catId, cat]) => (

                    <Accordion key={catId} expanded={this.state.expanded == catId} onChange={ () => this.setExpanded(catId)}>
                        <AccordionSummary  style={{background:'#eee'}} expandIcon={<ExpandMore />}>
                            <p>{cat.name}</p>
                        </AccordionSummary>
                        <AccordionDetails>

                            <button title="сохранить"  onClick={this.EditButtonClick.bind(this)}>
                                <SaveTwoTone style={{ fontSize: 24, color:'green' }} />
                            </button>

                            <ul>
                            {Object.entries(cat.services || {}).map(([k, service]) => (
                                <li key={k}>
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
                                    {Object.entries(service.masters).map(([k1, master]) => (
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
