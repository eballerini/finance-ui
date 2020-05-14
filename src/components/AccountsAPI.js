import React, { useState, useEffect } from "react";
import '../App.css';
import AccountList from './Accounts.js';
import axiosInstance from '../axiosApi';

function AccountsAPI() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    axiosInstance.get(`api/accounts/`)
      .then(response => {
        setIsLoading(false);
        setAccounts(response.data);
        console.log('accounts loaded');
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
