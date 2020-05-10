import React, { useEffect, useState, Fragment } from 'react';
import { formatDate, getTodayDate } from '../utils';

import axiosInstance from '../axiosApi';

function TransactionList(props) {  
  const defaultDateAdded = getTodayDate();
  
  const [creditCards, setCreditCards] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [description, setDescription] = useState();
  const [dateAdded, setDateAdded] = useState(defaultDateAdded);
  const [amount, setAmount] = useState();
  const [paymentMethodType, setPaymentMethodType] = useState('CC');
  const [creditCard, setCreditCard] = useState();
  const [category, setCategory] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [editableRowNumber, setEditableRowNumber] = useState(-1);
  
  function handleErrors(response) {
    console.log("response.status: " + response.status);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
  }
  
  useEffect(() => {
    axiosInstance.get(`api/creditcards/`)
      // .then(handleErrors)
      .then(response => {
        console.log('loaded credit cards');
        setCreditCards(response.data);
      })
      .catch(error => console.log(error));
  }, []);
  
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
    setNewValue(field, newValue);
  }
  
  function setNewValue(field, newValue) {
    // console.log(field);
    // console.log(newValue);
    if (field === 'description') {
      setDescription(newValue);
    } else if (field === 'dateAdded') {
      setDateAdded(newValue);
    } else if (field === 'amount') {
      setAmount(newValue);
    } else if (field === 'paymentMethodType') {
      setPaymentMethodType(newValue);
    } else if (field === 'creditCard') {
      setCreditCard(newValue);
    } else if (field === 'category') {
      setCategory(newValue);
    } 
  }
  
  function mySubmitHandler(event, props) {
    event.preventDefault();
    const payload = {
      description: description,
      date_added: dateAdded,
      amount: amount,
      payment_method_type: paymentMethodType,
      credit_card: creditCard,
      category: category,
    }
    axiosInstance.post('api/transactions/', payload)
    // .then(async response => {
    //       const data = await response.json();
    // 
    //       // check for error response
    //       if (!response.ok) {
    //           // get error message from body or default to response status
    //           const error = (data && data.message) || response.status;
    //           return Promise.reject(error);
    //       }
    //       console.log('success: transaction created');
    //       window.location.reload(false);
    //   })
    .then(
        result => {
          console.log('success: transaction created');
          // TODO ideally we'd only reload the transactions rather than the whole page
          window.location.reload(false);
        }
    )
      .catch(error => {
          console.error('There was an error!', error);
          alert('failed:' + error);
          // this.setState({ errorMessage: error });
      });
  }
  
  function submitEditHandler(event, transaction_id) {
    event.preventDefault();
    const payload = {};
    if (description) {
      payload.description = description;
    }
    if (dateAdded) {
      payload.date_added = dateAdded;
    }
    if (amount) {
      payload.amount = amount;
    }
    if (paymentMethodType) {
      payload.payment_method_type = paymentMethodType;
    }
    if (creditCard) {
      if (creditCard === '-1') {
        payload.credit_card = '';  
      } else {
        payload.credit_card = creditCard;
      }
    }
    if (category) {
      if (category === '-1') {
        payload.category = '';
      } else {
        payload.category = category;  
      }
    }
    console.log(payload);
    axiosInstance.put('api/transactions/' + transaction_id + '/', payload)
    .then(
        result => {
          console.log('success: transaction updated');
          // TODO ideally we'd only reload the transactions rather than the whole page
          window.location.reload();
        }
    )
      .catch(error => {
          console.error('There was an error!', error);
          alert('failed:' + error);
          // this.setState({ errorMessage: error });
      });
  }
  
  function submitDeleteHandler(event, transaction_id) {
    event.preventDefault();
    const payload = {};
    console.log(payload);
    axiosInstance.delete('api/transactions/' + transaction_id + '/', payload)
    .then(
        result => {
          console.log('success: transaction updated');
          // TODO ideally we'd only reload the transactions rather than the whole page
          window.location.reload();
        }
    )
      .catch(error => {
          console.error('There was an error!', error);
          alert('failed:' + error);
          // this.setState({ errorMessage: error });
      });
  }

  const transactionList = props.transactions;
  
  const paymentMethods = {
    'CC': 'Credit Card',
    'CA': 'Cash',
    'ET': 'E-transfer',
    'TR': 'Direct transfer',
    'CK': 'Cheque',
  };
  
  return (
    <div>
      <div className="title">
        <h1>Your transactions</h1>
      </div>
      <span>Quick add</span>
      <form id="transaction" onSubmit={(event) => mySubmitHandler(event)}>
        <table>
          <tbody>
            <tr>
              <td><input type="text" name="description" onChange={(event) => setValue(event)} placeholder="Description" maxLength="200"/></td>
              <td><input type="text" name="amount" onChange={(event) => setValue(event)} placeholder="Amount"/></td>
              <td><input type="date" name="dateAdded" onChange={(event) => setValue(event)} defaultValue={defaultDateAdded}/></td>
              <td>
                <select name="paymentMethodType" onChange={(event) => setValue(event)}>
                  {
                    Object.keys(paymentMethods).map((method, index) => (
                      <option key={index} value={method}>{paymentMethods[method]}</option>
                    ))
                  }
                </select>
              </td>
              <td>
                <select name="creditCard" onChange={(event) => setValue(event)}>
                  <option key="-1" value="-1">-</option>
                  {
                    creditCards.map((creditCard, index) => (
                      <option key={index} value={creditCard.id}>{creditCard.name}</option>
                    ))
                  }
                </select>
              </td>
              <td>
                <select name="category" onChange={(event) => setValue(event)}>
                  <option key="-1" value="-1">-</option>
                  {
                    categories.map((category, index) => (
                      <option key={index} value={category.id}>{category.name}</option>
                    ))
                  }
                </select>
              </td>
              <td><input type="submit"/></td>
            </tr>
          </tbody>
        </table>
      </form>
      <p>
          <span className="editButton"><button onClick={() => setIsEditable(true)}>Edit</button></span>
          {isEditable
            ? <span className="editButton"><button onClick={() => {setIsEditable(false); setEditableRowNumber(-1)}}>Cancel</button></span>
            : ''
          }
      </p>
      
      <div>
        {transactionList && transactionList.length > 0
        ? showTransactions(transactionList, paymentMethods, isEditable, setEditableRowNumber, editableRowNumber, setValue, creditCards, categories, submitEditHandler, setNewValue, submitDeleteHandler)
        : `You don't have any transactions`}
      </div>
    </div>
  );
}

function showTransactions(transactions, paymentMethods, isEditable, setRowNumber, editableRowNumber, setValue, creditCards, categories, submitEditHandler, setNewValue, submitDeleteHandler) {
  const transactionList = transactions.map((transaction, index) => 
  <Fragment key={index}>
  {editableRowNumber === index
    ?
    <tr key={index}>
      <td>{ transaction.id }</td>
      <td><input type="text" name="description" onChange={(event) => setValue(event)} defaultValue={transaction.description} maxLength="200"/></td>
      <td>$<input type="text" name="amount" onChange={(event) => setValue(event)} defaultValue={transaction.amount}/></td>
      <td><input type="date" name="dateAdded" onChange={(event) => setValue(event)} defaultValue={transaction.date_added}/></td>
      <td>
        <select name="paymentMethodType" onChange={(event) => setValue(event)} defaultValue={transaction.payment_method_type}>
          {
            Object.keys(paymentMethods).map((method, index) => (
              <option key={index} value={method} >{paymentMethods[method]}</option>
            ))
          }
        </select>
      </td>
      <td>
        <select name="creditCard" onChange={(event) => setValue(event)} defaultValue={transaction.credit_card ? transaction.credit_card.id : -1}>
          <option key="-1" value="-1">-</option>
          {
            creditCards.map((creditCard, index) => (
              <option key={index} value={creditCard.id}>{creditCard.name}</option>
            ))
          }
        </select>
      </td>
      <td>
        <select name="category" onChange={(event) => setValue(event)} defaultValue={transaction.category ? transaction.category.id : -1}>
          <option key="-1" value="-1">-</option>
          {
            categories.map((category, index) => (
              <option key={index} value={category.id}>{category.name}</option>
            ))
          }
        </select>
      </td>
      <td><button type="button" onClick={(event) => {submitEditHandler(event, transaction.id)}}>Submit</button></td>
      <td></td>
    </tr>
    :
    <tr key={index}>
      <td>{ transaction.id }</td>
      <td>{transaction.description}</td>
      <td>${ transaction.amount }</td>
      <td>{formatDate(transaction.date_added)}</td>
      <td>{ paymentMethods[transaction.payment_method_type] }</td>
      <td>{ transaction.credit_card ? transaction.credit_card.name : '' }</td>
      <td>{ transaction.category ? transaction.category.name : '' }</td>
      <td className={isEditable ? '' : 'hidden'}>
        <button type="button" onClick={() => {
          setRowNumber(index);
          setNewValue('description', '');
          setNewValue('dateAdded', '');
          setNewValue('amount', '');
          setNewValue('paymentMethodType', '');
          setNewValue('creditCard', '');
          setNewValue('category', '');
        }}>Edit</button>
      </td>
      <td className={isEditable ? '' : 'hidden'}>
        <button type="button" onClick={(event) => {
          if (window.confirm('Are you sure you want to delete this transaction?')) {
            // Save it!
            submitDeleteHandler(event, transaction.id);
          } else {
            // Do nothing!
            console.log('Delete cancelled');
          }
        }}>Delete</button>
      </td>
    </tr>
  }
  </Fragment>
  );
  
  return (
    <div className="transaction-list">
        <form className="transaction-edit">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment method</th>
                <th>Credit card</th>
                <th>Category</th>
                <th className={isEditable ? '' : 'hidden'}></th>
                <th className={isEditable ? '' : 'hidden'}></th>
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

{/* TODO prop types here*/} 

export default TransactionList;