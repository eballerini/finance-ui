import React, { useEffect, useState, Fragment } from 'react';
import { formatDate } from '../utils';

import axiosInstance from '../axiosApi';

function ImportTransactionsList(props) {
  const transactions = props.transactions;
  const accountId = props.accountId;
  
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState();
  
  useEffect(() => {
    axiosInstance.get(`api/categories/`)
      // .then(handleErrors)
      .then(response => {
        console.log('loaded categories');
        setCategories(response.data);
      })
      .catch(error => console.log(error));
  }, []);
  
  function setValue(event) {
    const field = event.target.name;
    const newValue = event.target.value;
    console.log(field);
    console.log(newValue);
  }
  
  function submitEditHandler(event, transaction_id) {
    event.preventDefault();
    const payload = {
      'category': event.target.value,
    };
    console.log(payload);
    axiosInstance.put('api/accounts/' + accountId + '/transactions/' + transaction_id + '/', payload)
    .then(
        result => {
          console.log('success: transaction updated');
          setMessage('success: transaction ' + transaction_id  + ' updated')
          // TODO ideally we'd only reload the transactions rather than the whole page
          // window.location.reload();
        }
    )
      .catch(error => {
          console.error('There was an error!', error);
          setMessage('There was an error: transaction ' + transaction_id  + ' could not be updated')
          // alert('failed:' + error);
      });
  }
  
  const transactionList = transactions.map((transaction, index) => 
  <Fragment key={index}>
    <tr key={index}>
      <td>{ transaction.id }</td>
      <td>{ transaction.description }</td>
      <td>${ transaction.amount }</td>
      <td>{ formatDate(transaction.date_added) }</td>
      <td>Credit card</td>
      <td>{ transaction.credit_card.name }</td>
      <td>
        <select name="category" onChange={(event) => submitEditHandler(event, transaction.id)} defaultValue={transaction.category ? transaction.category.id : -1}>
          <option key="-1" value="-1">-</option>
          {
            categories.map((category, index) => (
              <option key={index} value={category.id}>{category.name}</option>
            ))
          }
        </select>
      </td>
    </tr>
  </Fragment>
  );
  
  return (
    <div className="transaction-list">
        <div>{message ? message : ''}</div>
        <form className="transaction-edit">
          <table className="list">
            <thead>
              <tr>
                <th>Id</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment method</th>
                <th>Credit card</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactionList}
            </tbody>
          </table>
        </form>
    </div>
  );
}

function ImportTransactionsForm(props) {
  const creditCards = props.creditCards;
  
  const [creditCardId, setCreditCardId] = useState();
  // accountId is derived from the select credit card
  const [accountId, setAccountId] = useState();
  const [file, setFile] = useState();
  const [message, setMessage] = useState();
  const [transactions, setTransactions] = useState([]);
  
  function loadTransactions(transaction_import_id) {
    axiosInstance.get(`api/accounts/` + accountId + `/transactions/?transaction_import_id=` + transaction_import_id)
      .then(response => {
        console.log('new transactions loaded');
        setTransactions(response.data);
      })
      .catch(error => {
        console.log(error);
        setMessage('Could not load transactions');
      });
  }
  
  function setCreditCardIdAndAccountId(creditCardId) {
    setCreditCardId(creditCardId);
    var selectedAccount = null;
    for (var index = 0; index < creditCards.length; index++) {
      const creditCard = creditCards[index];
      if (parseInt(creditCard.id) === parseInt(creditCardId)) {
        selectedAccount = creditCard.account;
        break;
      }
    }
    setAccountId(selectedAccount.id);
  }
  
  function mySubmitHandler(event) {
    event.preventDefault();
    console.log("submit file");
    console.log('[submit] account id: ' + accountId);
    const data = new FormData();
    data.append('file', file);
    data.append('credit_card_id', creditCardId);
    axiosInstance.post("api/upload/", data, { // receive two parameter endpoint url ,form data 
     })
     .then(res => { // then print response status
       console.log(res.statusText);
       console.log(res);
       setMessage(res.statusText);
       loadTransactions(res.data.transaction_import_id);
     })
     .catch(error => {
       console.log(error.response);
       if (error.response) {
          setMessage("Error importing transactions: " + error.response.data.reason);
       } else {
          setMessage("Error importing transactions");
       }
     })
  }
  
  return (
    <>
    <form id="import" className="import-transactions" onSubmit={(event) => mySubmitHandler(event)}>
      <table>
        <tbody>
          <tr>
            <td>Credit card</td>
            <td>
              <select name="creditCard" onChange={(event) => setCreditCardIdAndAccountId(event.target.value)}>
                <option key="-1" value="-1">-</option>
                {
                  creditCards.map((creditCard, index) => (
                    <option key={index} value={creditCard.id}>{creditCard.name}</option>
                  ))
                }
              </select>
            </td>
          </tr>
          <tr>
            <td>File</td>
            <td><input type="file" name="file" onChange={(event) => setFile(event.target.files[0])}/></td>
          </tr>
          <tr>
            <td></td>
            <td><input type="submit"/></td>
          </tr>
        </tbody>
      </table>
      <div>{message ? message : ''}</div>
    </form>
    <div>
      <ImportTransactionsList 
        transactions={transactions} 
        accountId={accountId}
      />
    </div>
    </>
  );
}

function ImportTransactions(props) {
  const [creditCards, setCreditCards] = useState([]);
  
  useEffect(() => {
    axiosInstance.get('api/creditcards/?sort=name')
      .then(response => {
        setCreditCards(response.data);
        console.log('credit cards loaded');
      })
      .catch(error => console.log(error));
  }, []);
  
  return (
    <div>
      <div className="title">
        <h1>Import transactions</h1>
      </div>
      <div>
        <ImportTransactionsForm 
          creditCards={creditCards}
        />
      </div>
    </div>
  );
}

export default ImportTransactions;