import React from 'react';

function AccountList(props) {
  
  const accountList = props.accounts;
  
  return (
    <div>
      <div className="title">
        <h1>Your accounts</h1>
      </div>
      <div>
        {accountList && accountList.length > 0
        ? showAccounts(accountList)
        : `You don't have any accounts`}
      </div>
    </div>
  );
}

function showAccounts(accounts) {
  const accountList = accounts.map((account, index) => 
    <tr key={index}>
      <td>{ account.id }</td>
      <td>{ account.name }</td>
      <td>{ account.currency_code }</td>
    </tr>
  );
  
  return (
    <div>
      <p>Here are your accounts</p>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {accountList}
        </tbody>
      </table>
    </div>
  );
}

{/* TODO prop types here*/} 

export default AccountList;