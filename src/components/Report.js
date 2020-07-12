import React, { useEffect, useState, Fragment } from 'react';

import { formatAmount } from '../utils';

function ReportTableHeader() {
  return (
    <thead>
      <tr>
        <th>Category</th>
        <th>January</th>
        <th>February</th>
        <th>March</th>
        <th>April</th>
        <th>May</th>
        <th>June</th>
        <th>July</th>
        <th>August</th>
        <th>September</th>
        <th>October</th>
        <th>November</th>
        <th>December</th>
        <th>TOTAL</th>
      </tr>
    </thead>
  );
}

function ReportTable(props) {
  const expensesByMonth = props.expensesByMonth.map((expenseByMonth, index) => 
    <tr key={index}>
      <td>{expenseByMonth.name}</td>
      <td>{formatAmount(expenseByMonth.data[1])}</td>
      <td>{formatAmount(expenseByMonth.data[2])}</td>
      <td>{formatAmount(expenseByMonth.data[3])}</td>
      <td>{formatAmount(expenseByMonth.data[4])}</td>
      <td>{formatAmount(expenseByMonth.data[5])}</td>
      <td>{formatAmount(expenseByMonth.data[6])}</td>
      <td>{formatAmount(expenseByMonth.data[7])}</td>
      <td>{formatAmount(expenseByMonth.data[8])}</td>
      <td>{formatAmount(expenseByMonth.data[9])}</td>
      <td>{formatAmount(expenseByMonth.data[10])}</td>
      <td>{formatAmount(expenseByMonth.data[11])}</td>
      <td>{formatAmount(expenseByMonth.data[12])}</td>
      <td>{formatAmount(expenseByMonth.total)}</td>
    </tr>
  );
  const totals = props.totals;
  const grandTotal = props.grandTotal;
  
  return (
    <div>
      <table>
        <ReportTableHeader />
        <tbody>
          {expensesByMonth}
          <tr>
            <td>TOTAL</td>
            <td>{formatAmount(totals[1])}</td>
            <td>{formatAmount(totals[2])}</td>
            <td>{formatAmount(totals[3])}</td>
            <td>{formatAmount(totals[4])}</td>
            <td>{formatAmount(totals[5])}</td>
            <td>{formatAmount(totals[6])}</td>
            <td>{formatAmount(totals[7])}</td>
            <td>{formatAmount(totals[8])}</td>
            <td>{formatAmount(totals[9])}</td>
            <td>{formatAmount(totals[10])}</td>
            <td>{formatAmount(totals[11])}</td>
            <td>{formatAmount(totals[12])}</td>
            <td>{formatAmount(grandTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Report(props) {
  const [year, setYear] = useState(2020);
  const [expensesByMonth, setExpensesByMonth] = useState([]);
  const [totals, setTotals] = useState({});
  const [grandTotal, setGrandTotal] = useState();
  
  const d = {
    "expensesByMonth" : [
    { 
      "name": "food",
      "total": 257,
      "data": {
        1: 123,
        2: 34,
        11: 100 
      }
    },
    {
      "name": "travel",
      "total": 1331,
      "data": {
        1: 27,
        2: 304,
        8: 1000,
      }
    }
  ],
  "grandTotal": 1588,
  "totals": {
    1: 150,
    2: 338,
    8: 1000,
    11: 100,
  }
};
  
  useEffect(() => {
     setExpensesByMonth(d.expensesByMonth);
     setTotals(d.totals);
     setGrandTotal(d.grandTotal);
  }, []);
  
  function switchYear(event) {
    setYear(event.target.value);
    // TODO get data for the new year
  }
  
  return (
    <div>
      <div className="title">
        <h1>Report</h1>
      </div>
      <div>
        <h2>Year: {year}</h2>
        <div>
          Change year:
          <select name="year" onChange={(event) => switchYear(event)}>
            <option key="2020" value="2020">2020</option>
            <option key="2019" value="2019">2019</option>
            <option key="2018" value="2018">2018</option>
          </select>
        </div>
        <ReportTable 
          expensesByMonth={expensesByMonth}
          totals={totals}
          grandTotal={grandTotal}
          />
      </div>
    </div>
  );
}

export default Report;