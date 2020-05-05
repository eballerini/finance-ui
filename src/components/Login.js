import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "", password: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitWThen = this.handleSubmitWThen.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    
    handleSubmitWThen(event) {
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
            }
        ).catch (error => {
            throw error;
        })
    }

    render() {
        return (
            <div>Login
                <form onSubmit={this.handleSubmitWThen}>
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
            </div>
        )
    }
}
export default Login;