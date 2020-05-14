import React, { useState, useEffect, Fragment } from "react";
import axiosInstance from '../axiosApi';
import { formatDate } from '../utils';

function CreditCardTableHeader(props) {
  return (
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Application date</th>
        <th>Deadline for minimum spending</th>
        <th>Approval date</th>
        <th>Cancellation date</th>
        <th>Mininum spending</th>
        <th>Signup bonus</th>
        <th>First year fee</th>
        <th>Annual fee</th>
        <th>Cycle day</th>
        <th>Earning rates</th>
        <th>Account</th>
      </tr>
    </thead>
  );
}

function CreditCardTableRow(props) {
  const creditCard = props.creditCard;
  
  return (
    <Fragment>
      <tr>
        <td>{creditCard.id}</td>
        <td>{creditCard.name}</td>
        <td>{creditCard.application_date ? formatDate(creditCard.application_date) : ''}</td>
        <td>{creditCard.deadline_minimum_spending ? formatDate(creditCard.deadline_minimum_spending) : ''}</td>
        <td>{creditCard.approval_date ? formatDate(creditCard.approval_date) : ''}</td>
        <td>{creditCard.cancellation_date ? formatDate(creditCard.cancellation_date) : ''}</td>
        <td>{creditCard.mininum_spending ? '$' + creditCard.mininum_spending : ''}</td>
        <td>{creditCard.signup_bonus}</td>
        <td>{creditCard.first_year_fee ? '$' + creditCard.first_year_fee : ''}</td>
        <td>{creditCard.annual_fee ? '$' + creditCard.annual_fee : ''}</td>
        <td>{creditCard.cycle_day}</td>
        <td>{creditCard.earning_rates}</td>
        <td>{creditCard.account.name}</td>
      </tr>
    </Fragment>
  );
}

function CreditCards(props) {
  const [creditCards, setCreditCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    axiosInstance.get(`api/creditcards/`)
      .then(response => {
        setIsLoading(false);
        setCreditCards(response.data);
        console.log('credit cards loaded');
      })
      .catch(error => console.log(error));
  }, []);
  
  const creditCardList = creditCards.map((creditCard, index) =>
    <CreditCardTableRow creditCard={creditCard} key={index}/>
  );
  
  return (
    <div>
      <div className="title">
        <h1>Your credit cards</h1>
      </div>
      <div>
        {creditCards && creditCards.length > 0
        ? <div>
            <table>
              <CreditCardTableHeader/>
              <tbody>
                {creditCardList}
              </tbody>
            </table>
          </div>
        : `You don't have any credit cards`}
      </div>
      <div>
        {isLoading && <p>Loading credit cards</p>}
      </div>
    </div>
  );
  
}

export default CreditCards;