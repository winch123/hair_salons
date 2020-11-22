import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {userLoginFetch} from '../redux/actions';

import {apiRequest} from "../utils.js"

class Login extends Component {
  state = {
    username: "",
    password: "",
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    //this.props.userLoginFetch(this.state)
    apiRequest('login', {
      email: this.state.username,
      password: this.state.password,
    }).then(res => {
      if (res.token) {
        localStorage.setItem("token", res.token)
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Login</h1>

        <label>
          Username
          <input
            name='username'
            placeholder='Username'
            value={this.state.username}
            onChange={this.handleChange}
            />
        </label>
        <br/>

        <label>
          Password
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={this.state.password}
            onChange={this.handleChange}
            />
        </label>          
        <br/>

        <input type='submit'/>
      </form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  // userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo))
})

export default connect(null, mapDispatchToProps)(Login);