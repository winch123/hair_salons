import { Component } from 'react'
import {apiRequest, dispatch} from "../utils.js"

export default class BaseComponent extends Component {

  setStateA = (path, value) => {
      let rootName = path.shift()
	  //console.log(this.state[rootName])
	  //console.log(typeof this.state[rootName])
	  //console.log(Object.prototype.toString.call(this.state[rootName]))

      let ss = Array.isArray(this.state[rootName])
		? [...this.state[rootName]]
		: {...this.state[rootName]}
      //console.log(rootName)
      //console.log(path)
      //console.log(value)
      //console.log(someProperty)

      let cur = ss
      for (let ind of path ) {
          if (typeof cur[ind] === 'undefined') {
              throw new Error(ind + " not found");
          }
		  //console.log(ind)
		  //console.log(Object.prototype.toString.call(cur))
          if (path[path.length - 1] === ind) {
              cur[ind] = value
		  }
          else {
              cur = cur[ind]
		  }
      }
      //someProperty['catId'] = value
	  //console.log(someProperty)

      this.setState({[rootName]: ss})
  }

  deleteFromState = (path) => {
      let rootName = path.shift()
      let ss = Array.isArray(this.state[rootName])
		? [...this.state[rootName]]
		: {...this.state[rootName]}

      let cur = ss
      let iterations = path.length
      for (let ind of path ) {
          if (typeof cur[ind] === 'undefined') {
              throw new Error(ind + " not found");
          }
          if (--iterations) {
	    cur = cur[ind]
	  }
      }

      if (Array.isArray(cur)) {
	  cur.splice(path[path.length - 1], 1)
      }
      else {
	  delete cur[path[path.length - 1]]
      }

      this.setState({[rootName]: ss})
  }

	updateSalonServices () {
		apiRequest('get-salon-services-list')
		.then(res => {
			//console.log(res)
			dispatch('UPDATE_SALON_SERVICES', res)
		})
	}

}