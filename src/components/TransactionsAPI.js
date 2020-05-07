import React, { useState, useEffect } from "react";
import '../App.css';
import TransactionList from './Transactions.js';

import axiosInstance from '../axiosApi';

function TransactionsAPI() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    axiosInstance.get(`api/transactions/`)
      .then(response => {
        console.log('transactions loaded');
        setTransactions(response.data);
        setIsLoading(false);
        setIsError(false);
      })
      .catch(error => {
        console.log(error);
        setIsError(true);
        setIsLoading(false);
      });
  }, []);
    
  // TODO change class name
  return (
    <div className="">
      <div>
        <TransactionList transactions={transactions}/>
        {isLoading && <p>Loading transactions</p>}
        {isError && <p>Error loading transactions</p>}
      </div>
    </div>
  );
}

export default TransactionsAPI;
