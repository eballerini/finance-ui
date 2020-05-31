import React, { useEffect, useState } from 'react';

import axiosInstance from '../axiosApi';

function ImportTransactionsForm(props) {
  const creditCards = props.creditCards;
  const [creditCardId, setCreditCardId] = useState();
  const [file, setFile] = useState();
  const [message, setMessage] = useState();
  
  function mySubmitHandler(event) {
    event.preventDefault();
    console.log("submit file");
    console.log('credit card: ' + creditCardId);
    const data = new FormData();
    data.append('file', file);
    data.append('credit_card_id', creditCardId);
    axiosInstance.post("api/upload/", data, { // receive two parameter endpoint url ,form data 
     })
     .then(res => { // then print response status
       console.log(res.statusText);
       setMessage(res.statusText);
     })
     .catch(error => {
       console.log(error);
       setMessage("error");
     })
  }
  
  return (
    <form id="import" className="import-transactions" onSubmit={(event) => mySubmitHandler(event)}>
      <table>
        <tbody>
          <tr>
            <td>Credit card</td>
            <td>
              <select name="creditCard" onChange={(event) => setCreditCardId(event.target.value)}>
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