import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosApi';
import { formatAmount } from '../utils';

function Dashboard(props) {
  const [numCreditCardsOpened, setNumCreditCardsOpened] = useState(-1);
  const [firstYearFees, setFirstYearFees] = useState(undefined);
  
  useEffect(() => {
    axiosInstance.get(`api/dashboard/`)
      // .then(handleErrors)
      .then(response => {
        console.log('loaded dashboard');
        setNumCreditCardsOpened(response.data.num_credit_cards_opened);
        setFirstYearFees(response.data.first_year_fees);
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
        <p>Number of credit cards opened in the last year: {numCreditCardsOpened !== -1 ? numCreditCardsOpened : 'unknown'}</p>
        <p>First year fees: {firstYearFees !== undefined ? '$' + firstYearFees : 'unknown'}</p>
      </div>
    </div>
  );
}

export default Dashboard;