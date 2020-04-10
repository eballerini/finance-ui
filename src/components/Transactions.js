import React from 'react';

function TransactionList(props) {
  
  const transactionList = props.transactions.map((tx, index) => 
    <li key={index}>Desc: {tx.description}</li>
  );
  
  return (
    <div>
      <h1>Welcome to the transactions page</h1>
      <div>
        <ul>{transactionList}</ul>
      </div>
    </div>
  );
}

export default TransactionList;