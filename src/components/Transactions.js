import React from 'react';

function TransactionList(props) {
  
  const transactionList = props.transactions;
  
  const paymentMethods = {
    'CA': 'Cash',
    'CC': 'Credit Card',
    'ET': 'E-transfer',
    'TR': 'Direct transfer',
    'CK': 'Cheque',
  };
  
  return (
    <div>
      <div className="title">
        <h1>Your transactions</h1>
      </div>
      <div>
        {transactionList && transactionList.length > 0
        ? showTransactions(transactionList, paymentMethods)
        : `You don't have any transactions`}
      </div>
    </div>
  );
}

function showTransactions(transactions, paymentMethods) {
  const transactionList = transactions.map((transaction, index) => 
    <tr key={index}>
      <td>{ transaction.id }</td>
      <td>{ transaction.description }</td>
      <td>{ transaction.date_added }</td>
      <td>${ transaction.amount }</td>
      <td>{ paymentMethods[transaction.payment_method_type] }</td>
      <td>{ transaction.credit_card ? transaction.credit_card.name : '' }</td>
      <td>{ transaction.category ? transaction.category.name : '' }</td>
    </tr>
  );
  
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Payment method</th>
            <th>Credit card</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactionList}
        </tbody>
      </table>
    </div>
  );
}

{/* TODO prop types here*/} 

export default TransactionList;