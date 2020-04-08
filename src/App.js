import React from 'react';
import logo from './logo.svg';
import './App.css';
import TransactionList from './transactions.js';

function App() {
  const transactions = get_transactions();
  return (
    <div className="App">
      <div>
        <TransactionList transactions={transactions}/>
      </div>
    </div>
  );
}

function get_transactions() {
  // TODO make a network request
  return [{
    'key': 1,
    'description': 'lunch'
  }, {
    'key': 2,
    'description': 'dinner'
  }];
}

export default App;
