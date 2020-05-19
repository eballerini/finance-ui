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
  const populateMode = props.populateMode;
  const selectCreditCard = props.selectCreditCard;
  const creditCardSelected = props.creditCardSelected;
  const handleDelete = props.handleDelete;
  
  return (
    <tr className={creditCard.cancellation_date ? 'inactive' : 'active'}>
      <td>
        {populateMode 
          ? 
          <>
            <button onClick={() => {selectCreditCard(creditCard)}} disabled={creditCardSelected}>Edit</button> 
            <button type="button" disabled={creditCardSelected} onClick={(event) => {
              if (window.confirm('Are you sure you want to delete this credit card?')) {
                handleDelete(event, creditCard.id);
              } else {
                console.log('Delete cancelled');
              }
            }}>Delete</button>
          </>
          : creditCard.id}
      </td>
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

  const [id, setId] = useState();
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

  const selectedCreditCard = props.selectedCreditCard;
  const addMode = props.addMode;
  
  useEffect(() => {
    if (selectedCreditCard) {
      setId(selectedCreditCard.id);
      setName(selectedCreditCard.name);
      setApplicationDate(selectedCreditCard.application_date);
      setDeadlineMinimumSpending(selectedCreditCard.deadline_minimum_spending);
      setApprovalDate(selectedCreditCard.approval_date);
      setCancellationDate(selectedCreditCard.cancellation_date);
      setMinimumSpending(selectedCreditCard.minimum_spending);
      setSignupBonus(selectedCreditCard.signup_bonus);
      setFirstYearFee(selectedCreditCard.first_year_fee);
      setAnnualFee(selectedCreditCard.annual_fee);
      setCycleDay(selectedCreditCard.cycle_day);
      setEarningRates(selectedCreditCard.earning_rates);
      setAccount(selectedCreditCard.account.id);
    }
  }, []);
  
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
      first_year_fee: firstYearFee,
      annual_fee: annualFee,
      account: account,
    }
    if (applicationDate) {
      payload.application_date = applicationDate;
    } else {
      payload.application_date = null;
    }
    if (cancellationDate) {
      payload.cancellation_date = cancellationDate;
    } else {
      payload.cancellation_date = null;
    }
    if (deadlineMinimumSpending) {
      payload.deadline_minimum_spending = deadlineMinimumSpending;
    } else {
      payload.deadline_minimum_spending = null;
    }
    if (approvalDate) {
      payload.approval_date = approvalDate;
    } else {
      payload.approval_date = null;
    }
    if (signupBonus) {
      payload.signup_bonus = signupBonus;
    } else {
      payload.signup_bonus = null;
    }
    if (cycleDay) {
      payload.cycle_day = cycleDay;
    } else {
      payload.cycle_day = null;
    }
    if (earningRates) {
      payload.earning_rates = earningRates;
    } else {
      payload.earning_rates = null;
    }
    if (minimumSpending) {
      payload.minimum_spending = minimumSpending;
    } else {
      payload.minimum_spending = null;
    }
    console.log('submit payload: ');
    console.log(payload);
    const url = 'api/creditcards/';
    if (id) {
      axiosInstance.put(url + id + '/', payload)
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
    } else {
      axiosInstance.post(url, payload)
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
  }
  
  return (
    <div>
      <p>{addMode ? 'Add new' : 'Edit'} credit card</p>
      <form id="new_creditcard" onSubmit={(event) => mySubmitHandler(event)}>
        <table className="input_form">
          <tbody>
            <tr>
              <td>Name*</td>
              <td><input type="text" name="name" value={name || ''} onChange={(event) => setName(event.target.value)} placeholder="Name" maxLength="50"/></td>
            </tr>
            <tr>
              <td>Application date</td>
              <td><input type="date" name="applicationDate" value={applicationDate || ''} onChange={(event) => setApplicationDate(event.target.value)}/></td>
            </tr>
            <tr>
              <td>Deadline for minimum spending</td>
              <td><input type="date" name="deadlineMinimumSpending" value={deadlineMinimumSpending || ''} onChange={(event) => setDeadlineMinimumSpending(event.target.value)}/></td>
            </tr>
            <tr>
              <td>Approval date</td>
              <td><input type="date" name="approvalDate" value={approvalDate || ''} onChange={(event) => setApprovalDate(event.target.value)}/></td>
            </tr>
            <tr>
              <td>Cancellation date</td>
              <td><input type="date" name="cancellationDate" value={cancellationDate || ''} onChange={(event) => setCancellationDate(event.target.value)}/></td>
            </tr>
            <tr>
              <td>Minimum spending ($)</td>
              <td><input type="text" name="minimumSpending" value={minimumSpending || ''} onChange={(event) => setMinimumSpending(event.target.value)} placeholder="Minimum spending"/></td>
            </tr>
            <tr>
              <td>Signup bonus</td>
              <td><input type="text" name="signupBonus" value={signupBonus || ''} onChange={(event) => setSignupBonus(event.target.value)} placeholder="Signup bonus"/></td>
            </tr>
            <tr>
              <td>First year fee*</td>
              <td><input type="text" name="firstYearFee" value={firstYearFee || ''} onChange={(event) => setFirstYearFee(event.target.value)} placeholder="First year fee"/></td>
            </tr>
            <tr>
              <td>Annual fee*</td>
              <td><input type="text" name="annualFee" value={annualFee || ''} onChange={(event) => setAnnualFee(event.target.value)} placeholder="Annual fee"/></td>
            </tr>
            <tr>
              <td>Cycle day</td>
              <td><input type="text" name="cycleDay" value={cycleDay || ''} onChange={(event) => setCycleDay(event.target.value)} placeholder="Cycle day"/></td>
            </tr>
            <tr>
              <td>Earning rates</td>
              <td><textarea name="earningRates" value={earningRates || ''} onChange={(event) => setEarningRates(event.target.value)} placeholder="Earning rates" maxLength="200" rows="4" cols="40"/></td>
            </tr>
            <tr>
              <td>Account*</td>
              <td>
                <select name="account" onChange={(event) => setAccount(event.target.value)} value={account ? account : -1}>
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
  const [enableEditMode, setEnableEditMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] = useState();
  
  useEffect(() => {
    axiosInstance.get(`api/creditcards/`)
      .then(response => {
        setIsLoading(false);
        setCreditCards(response.data);
        console.log('credit cards loaded');
      })
      .catch(error => console.log(error));
  }, []);
  
  function handleDelete(event, credit_card_id) {
    event.preventDefault();
    const payload = {};
    console.log('id: ' + credit_card_id);
    axiosInstance.delete('api/creditcards/' + credit_card_id + '/', payload)
    .then(
        result => {
          console.log('success: credit card deleted');
          // TODO ideally we'd only reload the credit cards rather than the whole page
          window.location.reload();
        }
    )
      .catch(error => {
          console.error('There was an error!', error);
          alert('failed:' + error);
          // this.setState({ errorMessage: error });
      });
  }
  
  const creditCardList = creditCards.map((creditCard, index) =>
    <CreditCardTableRow 
      creditCard={creditCard} 
      key={index} 
      populateMode={enableEditMode} 
      selectCreditCard={(creditCard) =>  { setSelectedCreditCard(creditCard); setEditMode(true); }} creditCardSelected={selectedCreditCard} 
      handleDelete={(event, credit_card_id) => handleDelete(event, credit_card_id)}
    />
  );
  
  function resetState() {
    setAddMode(false);
    setEnableEditMode(false);
    setEditMode(false);
    setSelectedCreditCard();
  }
  
  return (
    <div>
      <div className="title">
        <h1>Your credit cards</h1>
      </div>
      <div>
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
      <br/>
      <div>
        {addMode
        ? <button onClick={() => resetState()}>Cancel</button>
        :
        <>
          <button onClick={() => setAddMode(true)} disabled={enableEditMode}>Add new credit card</button>
        </>
        }
        {enableEditMode
        ? <button onClick={() => resetState()}>Cancel</button>
        :
        <>
          <button onClick={() => setEnableEditMode(true)} disabled={addMode}>Edit</button>
        </>
        }
      </div>
      {addMode || editMode
      ? <CreditCardTableForm addMode={addMode} selectedCreditCard={selectedCreditCard}/>
      : ''
      }
      
    </div>
  );
  
}

export default CreditCards;
