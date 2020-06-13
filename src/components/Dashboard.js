import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosApi';
import { formatAmount, formatDate } from '../utils';

function Dashboard(props) {
  const [numCreditCardsOpened, setNumCreditCardsOpened] = useState(undefined);
  const [firstYearFees, setFirstYearFees] = useState(undefined);
  const [lastApprovalDate, setLastApprovalDate] = useState(undefined);
  
  useEffect(() => {
    axiosInstance.get(`api/dashboard/`)
      // .then(handleErrors)
      .then(response => {
        console.log('loaded dashboard');
        setNumCreditCardsOpened(response.data.num_credit_cards_opened);
        setFirstYearFees(response.data.first_year_fees);
        if (response.data.last_approval_date != null) {
            setLastApprovalDate(response.data.last_approval_date);
        }
      })
      .catch(error => console.log(error));
  }, []);
  
  return (
    <div className="dashboard">
      <div className="title">
        <h1>Your dashboard</h1>
      </div>
      <h2>Credit cards</h2>
      <div>
        <p>Number of credit cards opened in the last year: {numCreditCardsOpened !== undefined ? numCreditCardsOpened : 'unknown'}</p>
        <p>First year fees: {firstYearFees !== undefined ? '$' + firstYearFees : 'unknown'} (need to separate currencies)</p>
        <p>Last approval date: {lastApprovalDate !== undefined ? formatDate(lastApprovalDate) : 'unknown'}</p>
        <p>Deadline coming up: </p>
      </div>
      <h2>Transactions</h2>
      <div>
        <p>To categorize: </p>
      </div>
    </div>
  );
}

export default Dashboard;