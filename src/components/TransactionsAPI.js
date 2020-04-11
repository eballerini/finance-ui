import React, { useState, useEffect } from "react";
import '../App.css';
import TransactionList from './Transactions.js';

function TransactionsAPI() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // TODO move this to a function
  useEffect(() => {
    fetch(
      `http://localhost:8080/expense/api/transactions`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `JWT ${localStorage.getItem('token')}`,
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setTransactions(response);
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
