import React, { useEffect, useState, Fragment } from 'react';

import { formatAmount } from '../utils';

import CanvasJSReact from '../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function ReportTableHeader(props) {
  const months = MONTHS.map((month, index) =>
    <th key={index} onClick={(event) => props.onMonthClick(index)}><a>{month}</a></th>
  )
  
  return (
    <thead>
      <tr>
        <th>Category</th>
        {months}
        <th>TOTAL</th>
      </tr>
    </thead>
  );
}

function ReportTable(props) {
  const expensesByMonth = props.expensesByMonth.map((expenseByMonth, index) => 
    <tr key={index}>
      <td>{expenseByMonth.name}</td>
      <td>{formatAmount(expenseByMonth.data[0])}</td>
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
      <td>{formatAmount(expenseByMonth.total)}</td>
    </tr>
  );
  const totals = props.totals;
  const grandTotal = props.grandTotal;
  
  // function onMonthClick(event) {
  //   alert(event);
  // }
  
  return (
    <div className="report-table">
      <table>
        <ReportTableHeader onMonthClick={(event) => props.onMonthClick(event)} />
        <tbody>
          {expensesByMonth}
          <tr>
            <td>TOTAL</td>
            <td>{formatAmount(totals[0])}</td>
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
            <td>{formatAmount(grandTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function calculateRatio(expense, total) {
  return (expense / total * 100).toFixed(2);
}

function ReportVizMonthly(props) {
  const selectedMonth = props.month;
  const selectedMonthName = MONTHS[props.month];
  // const data1 = [
	// 				{ y: 18, label: "Direct" },
	// 				{ y: 49, label: "Organic Search" },
	// 				{ y: 9, label: "Paid Search" },
	// 				{ y: 5, label: "Referral" },
	// 				{ y: 19, label: "Social" }
	// 			];
  const data = props.expensesByMonth.map((expense, index) => {
    // TODO filter out the category whose amount is 0
    let monthlyExpense = 0;
    if (expense.data[selectedMonth]) {
        monthlyExpense = expense.data[selectedMonth];
    }
    return ({ label: expense.name, y: calculateRatio(monthlyExpense, props.totals[selectedMonth]) })
  });
  
  // console.log('data2');
  // console.log(data2);
  useEffect(() => {
    console.log('use effect');
    console.log(data);
  });
  
  
  const options = {
    exportEnabled: true,
			animationEnabled: false,
			title: {
				text: "Expenses for " + selectedMonthName,
			},
			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: data,
			}]
  };
  
  return (
    <div className="report-viz-monthly">
      <CanvasJSChart options={options}
            /* onRef = {ref => this.chart = ref} */
        />
    </div>
  );
}

function ReportVizYearly(props) {
  
  const data = MONTHS.map((month, index) => 
    ({ label: month, y: props.totals[index] })
  );
  
  const options = {
    title: {
      text: "Expenses by month"
    },
    axisY: {
  		title: "Expense ($)"
  	},
    data: [{				
      type: "column",
      dataPoints: data
    }]
  }
  
  return (
    <div>
      <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
    </div>
  );
}

function Report(props) {
  const [year, setYear] = useState(2020);
  const [month, setMonth] = useState(1);
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
    },
    {
      "name": "house",
      "total": 240,
      "data": {
        1: 240,
        // 2: 45,
      }
    },
  ],
  "grandTotal": 1588,
  "totals": {
    1: 390,
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
  
  function onMonthClick(event) {
    console.log(event);
    setMonth(event);
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
          onMonthClick={onMonthClick}
          />
        <ReportVizMonthly expensesByMonth={expensesByMonth} month={month} totals={totals}/>
        <ReportVizYearly totals={totals}/>
      </div>
    </div>
  );
}

export default Report;