import React, { useEffect, useState } from 'react';

function TransactionList(props) {
  const defaultDescription = 'good food';
  const defaultDateAdded = '2020-03-09';
  const defaultAmount = '10';
  
  const [creditCards, setCreditCards] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [description, setDescription] = useState(defaultDescription);
  const [dateAdded, setDateAdded] = useState(defaultDateAdded);
  const [amount, setAmount] = useState(defaultAmount);
  const [paymentMethodType, setPaymentMethodType] = useState('CC');
  const [creditCard, setCreditCard] = useState();
  const [category, setCategory] = useState();
  
  function handleErrors(response) {
    console.log("response.status: " + response.status);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
  }
  
  useEffect(() => {
    fetch(
      `http://localhost:8080/expense/api/creditcards/`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `JWT ${localStorage.getItem('token')}`,
        })
      }
    )
      // .then(res => {
        // if (res.status == 200) {
        //   console.log('loaded credit cards');
        //   return res.json();
        // } else {
        //   console.log('error loading credit cards');
        //   return res;
        // }
        // return res.json();
      // })
      .then(handleErrors)
      .then(response => {
        console.log('loaded credit cards');
        setCreditCards(response);
      })
      .catch(error => console.log(error));
  }, []);
  
  useEffect(() => {
    fetch(
      `http://localhost:8080/expense/api/categories/`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `JWT ${localStorage.getItem('token')}`,
        })
      }
    )
      .then(handleErrors)
      .then(response => {
        console.log('loaded categories');
        setCategories(response);
      })
      .catch(error => console.log(error));
  }, []);
  
  function setMyDescription(event) {
    setDescription(event.target.value);
  }
  
  function setMyDateAdded(event) {
    setDateAdded(event.target.value);
  }
  
  function setMyAmount(event) {
    setAmount(event.target.value);
  }
  
  function setMyPaymentMethodType(event) {
    setPaymentMethodType(event.target.value);
  }
  
  function setMyCreditCard(event) {
    setCreditCard(event.target.value);
  }
  
  function setMyCategory(event) {
    setCategory(event.target.value);
  }
  
  function mySubmitHandler(event, props) {
    event.preventDefault();
    fetch(
      `http://localhost:8080/expense/api/transactions/`,
      {
        method: "POST",
        headers: {
          'Authorization': `JWT ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          date_added: dateAdded,
          amount: amount,
          payment_method_type: paymentMethodType,
          credit_card: creditCard,
          category: category,
        }),
      }
    )
    .then(async response => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
              // get error message from body or default to response status
              const error = (data && data.message) || response.status;
              return Promise.reject(error);
          }
          console.log('success: transaction created');
          window.location.reload(false);
      })
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
      <form id="transaction" onSubmit={(event) => mySubmitHandler(event)}>
        <table>
          <tbody>
            <tr>
              <td><input type="submit"/></td>
              <td><input type="text" name="description" onChange={setMyDescription} defaultValue={defaultDescription}/></td>
              <td><input type="text" name="dateAdded" onChange={setMyDateAdded} defaultValue={defaultDateAdded}/></td>
              <td><input type="text" name="amount" onChange={setMyAmount} defaultValue={defaultAmount}/></td>
              <td>
                <select name="paymentMethodType" onChange={setMyPaymentMethodType}>
                  {
                    Object.keys(paymentMethods).map((method, index) => (
                      <option key={index} value={method}>{paymentMethods[method]}</option>
                    ))
                  }
                </select>
              </td>
              <td>
                <select name="creditCard" onChange={setMyCreditCard}>
                  <option key="-1" value="-1">-</option>
                  {
                    creditCards.map((creditCard, index) => (
                      <option key={index} value={creditCard.id}>{creditCard.name}</option>
                    ))
                  }
                </select>
              </td>
              <td>
                <select name="category" onChange={setMyCategory}>
                  <option key="-1" value="-1">-</option>
                  {
                    categories.map((category, index) => (
                      <option key={index} value={category.id}>{category.name}</option>
                    ))
                  }
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
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