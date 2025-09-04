import React from 'react'
import {Route,Routes} from "react-router-dom";
import CustomerListPage from './Pages/CustomerListPage/CustomerListPage';
import CustomerDetailsPage from './Pages/CustomerDetailsPage/CustomerDetailsPage';
import CustomerFormPage from "./Pages/CustomerFormPage/CustomerFormPage";
import NotFound from "./Pages/NotFound/NotFound";
import AddressForm from './Pages/AddressForm/AddressForm';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path="/" Component={CustomerListPage}/>
      <Route path="/api/customers/:id" Component={CustomerDetailsPage}/>
      <Route path="/api/customers/addCustomer" Component={CustomerFormPage}/>
      <Route path="/api/customers/updateCustomer/:id" Component={CustomerFormPage}/>
      <Route path="/api/customers/updateCustomer/:id" Component={CustomerFormPage}/>
      <Route path="/api/customers/:customerId/addAddress" Component={AddressForm}/>
      <Route path="/api/customers/:customerId/updateAddress/:addressId" Component={AddressForm}/>
      <Route path="*" Component={NotFound}/>
    </Routes>
    </>
  )
}

export default App
