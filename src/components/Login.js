import React, { Component } from "react";
import PropTypes from 'prop-types';
import axiosInstance from "../axiosApi";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "", password: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        axiosInstance.post('/token/obtain/', {
            username: this.state.username,
            password: this.state.password
        }).then(
            result => {
              const access_token = result.data.access;
              const parsed_token = JSON.parse(atob(access_token.split('.')[1]));
              const username = parsed_token.username;
              console.log(username);
              axiosInstance.defaults.headers['Authorization'] = "JWT " + access_token;
              localStorage.setItem('access_token', access_token);
              localStorage.setItem('refresh_token', result.data.refresh);
              this.props.history.push('/accounts');
            }
        ).catch (error => {
            throw error;
        })
    }

    render() {
        return (
            <div>
                <h1>Welcome to Expenses!</h1>
                Login
                <form onSubmit={e => this.props.handle_submit(e, this.state.username, this.state.password)}>
                    <label>
                        Username:
                        <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Password:
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                <br/>
                <br/>
                <br/>
                <div>Link to signup</div>
            </div>
        )
    }
}
export default Login;

Login.propTypes = {
  handle_submit: PropTypes.func.isRequired
};