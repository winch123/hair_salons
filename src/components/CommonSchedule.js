import React, { Component } from 'react';
import {api} from "../utils.js";

export default class CommonSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workshifts: {
                20201001: {caption:'сегодня', masters:{1: 'иии 1', 2:'ппп 1' ,3:'sss 1'} },
                20201002: {caption:'завтра', masters:{1: 'иии 2', 2:'ппп 2' ,3:'sss 2'}},
                20201003: {caption:'послезавтра', masters:{1: 'иии 3', 3:'sss 3'}},
            },
            persons: [
                {id:1, name:'Иванова',},
                {id:2, name:'Петрова',},
                {id:3, name:'Сидорова',},
            ],
        };
    };

    setCurrentMasterAndDay (masterId, dayId) {
        console.log(masterId, dayId);
    }
    
    componentDidMount() {  
        console.log('componentDidMount');
        api.get('/site/test1')
        .then(res => {
            console.log(res.data);
            this.setState({ 
                persons: res.data.persons,
                workshifts: res.data.workshifts,                
            });
        })
    }
    
    render() {
        
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {Object.keys(this.state.workshifts).map((k1) => (
                                <th key={k1}>{this.state.workshifts[k1].caption}</th>
                            )) }
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.persons.map((master) => (
                            <tr key={master.id}>
                                <td>{master.name}</td>
                                {Object.keys(this.state.workshifts).map((k2) => (
                                    <td key={k2}>
                                        { this.state.workshifts[k2].masters[master.id] &&
                                            <button onClick={this.setCurrentMasterAndDay.bind(this, master.id, k2)}>
                                                {this.state.workshifts[k2].masters[master.id]}
                                            </button>
                                        }
                                    </td>
                                )) }                                
                            </tr>                                                        
                        ))}
                    </tbody>
                </table>
                
                
           </div>
        );
    }
}
