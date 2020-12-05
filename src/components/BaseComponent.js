import { Component } from 'react'

export default class BaseComponent extends Component {

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

}