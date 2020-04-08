import React, { useState, useEffect } from "react";
import './App.css';
import TransactionList from './transactions.js';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // TODO move this to a function
  useEffect(() => {
    fetch(
      `http://localhost:8080/expense/accounts/1/transactions`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/vnd.github.cloak-preview"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setTransactions(response);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, []);
  
  return (
    <div className="App">
      {isLoading && <p>Loading transactions</p>}
      <div>
        <TransactionList transactions={transactions}/>
      </div>
    </div>
  );
}

export default App;
