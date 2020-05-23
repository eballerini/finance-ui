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
    <div className="title">
      <h1>Your categories</h1>
      <div>
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