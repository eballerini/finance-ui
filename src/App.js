import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AccountsAPI from './components/AccountsAPI';
import TransactionsAPI from './components/TransactionsAPI';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: ''
    };
  }

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

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8080/token-auth/', {
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
          username: json.user.username
        });
      });
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

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }

    return (
      <div className="App">

        {/*
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        {form}
        */}
        <div>
          {this.state.logged_in
            ? <Menu handle_logout={this.handle_logout} username={this.state.username}/>
            : <div>
               <LoginForm handle_login={this.handle_login} />
              </div>
            }
        </div>
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
              <li>
                <a href="/login" onClick={props.handle_logout}>Logout</a>
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

export default App;