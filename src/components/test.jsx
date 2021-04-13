import React, {Component} from 'react'
import {Popover} from 'antd'

export default class Mycompanent extends Component {
	constructor(props) {
		super(props)
		this.myRef = React.createRef()
	}	
	
	render() {
		const myInput = (
			<input ref={this.myRef} />
		)
		
		return (<>
			<br/>
			<Popover
				content = {myInput}
				title = "Будет создана услуга"
				placement = "bottomLeft"
				trigger = "click"
			>
				<button onClick = {e => {
						//this.myRef.current.focus()
						setTimeout(() => this.myRef.current.focus(), 0)
					}}>bbb</button>
			</Popover>
		</>)
	}
}
