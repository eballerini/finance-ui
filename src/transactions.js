import React from 'react';

class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const transactionList = this.props.transactions.map((tx, index) => 
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
}

export default TransactionList;