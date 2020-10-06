import React, { Component } from 'react'
import {apiRequest} from "../utils.js"

class SalonSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SalonServicesList: [],
        }
    }

    componentDidMount() {
        apiRequest('/salon/get-salon-services-list', {salonId:1})
        .then(res => {
            console.log(res)
            this.setState({SalonServicesList: res})
        })
    }

    render() {
        let {SalonServicesList} = this.state

        return (
            <div>
                <ul>
                {Object.keys(SalonServicesList).map((k) => (
                    <li key={k}>
                        <span style={{display:'inline-block', width:'202px'}}>{SalonServicesList[k].name}</span>
                        <span style={{display:'inline-block', width:'88px'}}>{SalonServicesList[k].price_default} руб.</span>
                        <span style={{display:'inline-block', width:'77px'}}>{SalonServicesList[k].duration_default} мин</span>
                        <button> edit </button>
                        <ul>
                        {Object.keys(SalonServicesList[k].masters).map((k1) => (
                            <li key={k1}>
                                {SalonServicesList[k].masters[k1].name}
                            </li>
                        ))}
                        </ul>
                    </li>
                ))}
                </ul>
            </div>
        )
    }
}

export default SalonSettings
