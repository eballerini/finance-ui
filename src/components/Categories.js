import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosApi';

function CategoriesTableHeader(props) {
  return (
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
  );
}

function CategoryRow(props) {
  const category = props.category;
  
  return (
    <tr>
      <td>{category.id}</td>
      <td>{category.name}</td>
    </tr>
  );
}

function CategoryForm(props) {
    const [name, setName] = useState();
    
    function mySubmitHandler(event, props) {
      event.preventDefault();
      const payload = {
        name: name,
      }
      axiosInstance.post('api/categories/', payload)
      .then(
          result => {
            console.log('success: category created');
            // TODO ideally we'd only reload the transactions rather than the whole page
            window.location.reload(false);
          }
      )
        .catch(error => {
            console.error('There was an error!', error);
            // alert('failed:' + error);
            // this.setState({ errorMessage: error });
        });
    }
    
    return (
      <div>
        <p>Quick add</p>
        <form id="transaction" onSubmit={(event) => mySubmitHandler(event)}>
          <table>
            <tbody>
              <tr>
                <td><input type="text" name="name" onChange={(event) => setName(event.target.value)} placeholder="Name" maxLength="100"/></td>
                <td><input type="submit"/></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
}

function Categories(props) {
  const [categories, setCategories] = useState([]);
  const categoryList = categories.map((category, index) =>
    <CategoryRow 
      category={category} 
      key={index}
    />
  );
  
  useEffect(() => {
    axiosInstance.get(`api/categories/`)
      .then(response => {
        setCategories(response.data);
        console.log('categories loaded');
      })
      .catch(error => console.log(error));
  }, []);

  
  return (
    <div>
      <div className="title">
        <h1>Your categories</h1>
      </div>
      <div>
        <CategoryForm />
        {categories && categories.length > 0
        ? <div className="categories">
            <table className="list">
              <CategoriesTableHeader/>
              <tbody>
                {categoryList}
              </tbody>
            </table>
          </div>
        : `You don't have any credit cards`}
      </div>
    </div>
  );
}

export default Categories;