import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosApi';

function CategoriesTableHeader(props) {
  const isEditable = props.isEditable;
  
  return (
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th className={isEditable ? '' : 'hidden'}></th>
      </tr>
    </thead>
  );
}

function CategoryRow(props) {
  const index = props.index;
  const category = props.category;
  const isEditable = props.isEditable;
  const editableRowId = props.editableRowId;
  const setEditableRowId = props.setEditableRowId;
  const setName = props.setName;
  const submitEditHandler = props.submitEditHandler;
  const submitDeleteHandler = props.submitDeleteHandler;
  
  return (
    <tr>
      <td>{category.id}</td>
      <td>{category.id === editableRowId
      ? <input type="text" name="name" onChange={(event) => setName(event.target.value)} defaultValue={category.name} placeHolder="Name (required)" maxLength="100"/>
      : category.name}
      </td>
      <td className={isEditable ? '' : 'hidden'}>
      {category.id === editableRowId
        ? <button type="button" onClick={(event) => submitEditHandler(event)}>Submit</button>
        : <>
          <button type="button" onClick={() => {setEditableRowId(category.id); setName(category.name)}}>Edit</button>
          <button type="button" onClick={(event) => {
            if (window.confirm('Are you sure you want to delete this category?')) {
              submitDeleteHandler(event, category.id);
            } else {
              console.log('Delete cancelled');
            }
          }}>Delete</button>
          </>
      }
      </td>
    </tr>
  );
}

function NewCategoryForm(props) {
    const isEditable = props.isEditable;
    
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
        <form className="quick-add" onSubmit={(event) => mySubmitHandler(event)}>
          <table>
            <tbody>
              <tr>
                <td><input type="text" name="name" onChange={(event) => setName(event.target.value)} placeholder="Name" maxLength="100"/></td>
                <td><input type="submit" disabled={isEditable}/></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
}

function Categories(props) {
  const [categories, setCategories] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [editableRowId, setEditableRowId] = useState(-1);
  const [name, setName] = useState();
  
  function submitEditHandler(event) {
    event.preventDefault();
    const payload = {
      name: name,
    }
    axiosInstance.put('api/categories/' + editableRowId + '/', payload)
    .then(
        result => {
          console.log('success: category updated');
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
  
  function submitDeleteHandler(event, category_id) {
    event.preventDefault();
    const payload = {};
    axiosInstance.delete('api/categories/' + category_id + '/', payload)
    .then(
        result => {
          console.log('success: category deleted');
          // TODO ideally we'd only reload the categories rather than the whole page
          window.location.reload();
        }
    )
      .catch(error => {
          console.error('There was an error!', error);
          alert('failed:' + error);
          // this.setState({ errorMessage: error });
      });
  }
  
  const categoryList = categories.map((category, index) =>
    <CategoryRow 
      category={category} 
      key={index}
      index={index}
      isEditable={isEditable}
      editableRowId={editableRowId}
      setEditableRowId={setEditableRowId}
      submitEditHandler={submitEditHandler}
      submitDeleteHandler={submitDeleteHandler}
      setName={setName}
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
        <NewCategoryForm isEditable={isEditable}/>
        <div className="buttons">
            <span className="editButton"><button onClick={() => setIsEditable(true)} disabled={isEditable}>Edit</button></span>
            {isEditable
              ? <span className="editButton"><button onClick={() => {setIsEditable(false); setEditableRowId(-1)}}>Cancel</button></span>
              : ''
            }
        </div>
        {categories && categories.length > 0
        ? <div className="categories">
            <form className="category-edit">
              <table className="list">
                <CategoriesTableHeader
                  isEditable={isEditable}
                />
                <tbody>
                  {categoryList}
                </tbody>
              </table>
            </form>
          </div>
        : `You don't have any categories`}
      </div>
    </div>
  );
}

export default Categories;