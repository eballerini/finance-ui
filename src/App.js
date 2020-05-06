import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { withRouter } from 'react-router';

import AccountsAPI from './components/AccountsAPI';
import Hello from './components/Hello';
import Login from './components/Login';
import LoginForm from './components/LoginForm';
import Nav from './components/Nav';
import SignupForm from './components/SignupForm';
import TransactionsAPI from './components/TransactionsAPI';

import './App.css';

import axiosInstance from './axiosApi';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: ''
    };
    this.handleLogout = this.handleLogout.bind(this);
  }
  
  async handleLogout() {
    try {
        const response = await axiosInstance.post('/blacklist/', {
            "refresh_token": localStorage.getItem("refresh_token")
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        axiosInstance.defaults.headers['Authorization'] = null;
        console.log('successfully logged out');
        this.setState({ logged_in: false, username: '' });
        this.props.history.push('/login');
        return response;
    }
    catch (e) {
        console.log(e);
    }
  };

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8080/expense/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }
  
  handleSubmit = (event, username, password)  => {
      event.preventDefault();
      axiosInstance.post('/token/obtain/', {
          username: username,
          password: password
      }).then(
          result => {
            const access_token = result.data.access;
            const parsed_token = JSON.parse(atob(access_token.split('.')[1]));
            const username = parsed_token.username;
            console.log(username);
            axiosInstance.defaults.headers['Authorization'] = "JWT " + access_token;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', result.data.refresh);
            this.setState({
              logged_in: true,
              username: username
            });
            this.props.history.push('/accounts');
          }
      ).catch (error => {
          throw error;
      })
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8080/expense/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      });
  };
  
  render(){
    return (
        <div className="site row">
            <nav className="column side">
                {this.state.logged_in
                  ?
                  <>
                    <p>Hello, {this.state.username}</p>
                    <ul>
                      <li><Link className={"nav-link"} to={"/hello/"}>Hello</Link></li>
                      <li><Link className={"nav-link"} to={"/accounts/"}>Accounts</Link></li>
                    </ul>
                    <button onClick={this.handleLogout}>Logout</button>
                  </>
                  :
                  <Link className={"nav-link"} to={"/login/"}>Login</Link>
                }
                
            </nav>
            <main className="column middle">
                <Switch>
                    <Route exact path={"/login/"} 
                    render={(props) => <Login {...props} handle_submit={this.handleSubmit} />}
                    />
                    <Route exact path={"/hello/"} component={Hello}/>
                    <Route exact path={"/accounts/"} component={AccountsAPI}/>
                    <Route path={"/"} render={() => <div>Home again</div>}/>
               </Switch>
           </main>
        </div>
    );
  }
}

function Menu(props) {
  return (
    <Router>
      <div className="row">
        <div className="column side">
          Hello, {props.username}
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/accounts">Accounts</Link>
              </li>
              <li>
                <Link to="/transactions">Transactions</Link>
              </li>
            </ul>
          </nav>
        </div>
        

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <div className="column middle">
        <Switch>
          <Route path="/accounts">
            <AccountsAPI />
          </Route>
          {/*TODO change this to /accounts/:account_id/transactions */}
          <Route path="/transactions">
            <TransactionsAPI />
          </Route>
          {/*<Route path="/">
            <Home />
          </Route>*/}
        </Switch>
        </div>
      </div>
    </Router>
  );
}

export default withRouter(App);
