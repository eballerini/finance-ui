import React, { useState, useEffect } from "react";
import '../App.css';
import AccountList from './Accounts.js';

function AccountsAPI() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // TODO move this to a function
  useEffect(() => {
    fetch(
      `http://localhost:8080/expense/api/accounts/`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `JWT ${localStorage.getItem('token')}`,
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setAccounts(response);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, []);
  
  // TODO change CSS class name
  return (
    <div className="App">
      <div>
        <AccountList accounts={accounts}/>
        {isLoading && <p>Loading accounts</p>}
      </div>
    </div>
  );
}

export default AccountsAPI;
