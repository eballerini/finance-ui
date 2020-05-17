import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosApi';
import { addMonths, formatDate, formatAmount, formatSignupBonus, convertToString } from '../utils';

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
        <th>Minimum spending</th>
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
    <tr className={creditCard.cancellation_date ? 'inactive' : 'active'}>
      <td>{creditCard.id}</td>
      <td>{creditCard.name}</td>
      <td>{creditCard.application_date ? formatDate(creditCard.application_date) : ''}</td>
      <td>{creditCard.deadline_minimum_spending ? formatDate(creditCard.deadline_minimum_spending) : ''}</td>
      <td>{creditCard.approval_date ? formatDate(creditCard.approval_date) : ''}</td>
      <td>{creditCard.cancellation_date ? formatDate(creditCard.cancellation_date) : ''}</td>
      <td>{formatAmount(creditCard.minimum_spending)}</td>
      <td>{formatSignupBonus(creditCard.signup_bonus)}</td>
      <td>{formatAmount(creditCard.first_year_fee)}</td>
      <td>{formatAmount(creditCard.annual_fee)}</td>
      <td>{creditCard.cycle_day}</td>
      <td>{creditCard.earning_rates}</td>
      <td>{creditCard.account.name}</td>
    </tr>
  );
}

function CreditCardTableForm(props) {
  const today = convertToString(new Date());
  const threeMonthsFromNow = convertToString(addMonths(new Date(), 3));
  
  const [accounts, setAccounts] = useState([]);
  
  const [name, setName] = useState();
  const [applicationDate, setApplicationDate] = useState(today);
  const [deadlineMinimumSpending, setDeadlineMinimumSpending] = useState(threeMonthsFromNow);
  const [approvalDate, setApprovalDate] = useState();
  const [cancellationDate, setCancellationDate] = useState();
  const [minimumSpending, setMinimumSpending] = useState();
  const [signupBonus, setSignupBonus] = useState();
  const [firstYearFee, setFirstYearFee] = useState();
  const [annualFee, setAnnualFee] = useState();
  const [cycleDay, setCycleDay] = useState();
  const [earningRates, setEarningRates] = useState();
  const [account, setAccount] = useState();

  const addMode = props.addMode;
  
  useEffect(() => {
    axiosInstance.get(`api/accounts/`)
      // .then(handleErrors)
      .then(response => {
        console.log('loaded accounts');
        setAccounts(response.data);
      })
      .catch(error => console.log(error));
  }, []);
  
  function mySubmitHandler(event, props) {
    event.preventDefault();
    const payload = {
      name: name,
      application_date: applicationDate,
      deadline_minimum_spending: deadlineMinimumSpending,
      approval_date: approvalDate,
      cancellation_date: cancellationDate,
      minimum_spending: minimumSpending,
      signup_bonus: signupBonus,
      first_year_fee: firstYearFee,
      annual_fee: annualFee,
      cycle_day: cycleDay,
      earning_rates: earningRates,
      account: account,
    }
    console.log('submit payload: ');
    console.log(payload);
    axiosInstance.post('api/creditcards/', payload)
    .then(
        result => {
          console.log('success: credit card created');
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
  
  return (
    <div className={addMode ? '' : 'hidden'}>
      <p>New credit card</p>TODO only show this on click 'add'
      <form id="new_creditcard" onSubmit={(event) => mySubmitHandler(event)}>
        <table className="input_form">
          <tbody>
            <tr>
              <td>Name*</td>
              <td><input type="text" name="name" onChange={(event) => setName(event.target.value)} placeholder="Name" maxLength="50"/></td>
            </tr>
            <tr>
              <td>Application date</td>
              <td><input type="date" name="applicationDate" onChange={(event) => setApplicationDate(event.target.value)} defaultValue={today}/></td>
            </tr>
            <tr>
              <td>Deadline for minimum spending</td>
              <td><input type="date" name="deadlineMinimumSpending" onChange={(event) => setDeadlineMinimumSpending(event.target.value)} defaultValue={threeMonthsFromNow}/></td>
            </tr>
            <tr>
              <td>Approval date</td>
              <td><input type="date" name="approvalDate" onChange={(event) => setApprovalDate(event.target.value)}/></td>
            </tr>
            <tr>
              <td>Cancellation date</td>
              <td><input type="date" name="cancellationDate" onChange={(event) => setCancellationDate(event.target.value)}/></td>
            </tr>
            <tr>
              <td>Minimum spending ($)</td>
              <td><input type="text" name="minimumSpending" onChange={(event) => setMinimumSpending(event.target.value)} placeholder="Minimum spending"/></td>
            </tr>
            <tr>
              <td>Signup bonus</td>
              <td><input type="text" name="signupBonus" onChange={(event) => setSignupBonus(event.target.value)} placeholder="Signup bonus"/></td>
            </tr>
            <tr>
              <td>First year fee*</td>
              <td><input type="text" name="firstYearFee" onChange={(event) => setFirstYearFee(event.target.value)} placeholder="First year fee"/></td>
            </tr>
            <tr>
              <td>Annual fee*</td>
              <td><input type="text" name="annualFee" onChange={(event) => setAnnualFee(event.target.value)} placeholder="Annual fee"/></td>
            </tr>
            <tr>
              <td>Cycle day</td>
              <td><input type="text" name="cycleDay" onChange={(event) => setCycleDay(event.target.value)} placeholder="Cycle day"/></td>
            </tr>
            <tr>
              <td>Earning rates</td>
              <td><textarea name="earningRates" onChange={(event) => setEarningRates(event.target.value)} placeholder="Earning rates" maxLength="200" rows="4" cols="40"/></td>
            </tr>
            <tr>
              <td>Account</td>
              <td>
                <select name="account" onChange={(event) => setAccount(event.target.value)}>
                  <option key="-1" value="-1">-</option>
                  {
                    accounts.map((account, index) => (
                      <option key={index} value={account.id}>{account.name}</option>
                    ))
                  }
                </select>
              </td>
            </tr>
            <tr>
              <td/>
              <td><input type="submit"/></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

function CreditCards(props) {
  const [creditCards, setCreditCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addMode, setAddMode] = useState(false);
  
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
        <div><button onClick={() => setAddMode(true)}>Add new credit card</button></div>
        <CreditCardTableForm addMode={true} />
        <br/>
        {creditCards && creditCards.length > 0
        ? <div className="credit_cards">
            <table className="list">
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
