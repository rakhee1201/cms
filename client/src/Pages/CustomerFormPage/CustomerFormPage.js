import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

//!/^\d{10}$/.test(formData.phone)
//!/^\d{6}$/.test(formData.pinCode
const CustomerFormPage = () => {
  const [customer,setCustomer]=useState({})

  const params=useParams();
  const navigate=useNavigate();

  const addNewCustomer=async()=>{
    if(customer.first_name!==undefined && customer.last_name!==undefined && customer.phone_number!==undefined){
      const r=await fetch(`http://localhost:3030/api/customers`,{method:"POST",headers:{"Content-Type" : "application/json","Accept":"application/json"},body:JSON.stringify(customer)});
      let data;
      if(r.ok){
         data=await r.json();
        if(data.success){
          toast(data.success_msg);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        else{
          toast(data.err_msg);
        }
      }
    }else{
      toast("please fill all the fields")
    }
  }

  const updateCustomer=async()=>{
    const response=await fetch(`http://localhost:3030/api/customers/${params.id}`)
    const existedCustomer=await response.json();
    if(existedCustomer.customer.first_name===customer.first_name && existedCustomer.customer.last_name===customer.last_name && existedCustomer.customer.phone_number===customer.phone_number){
        toast("There are no updates to update");
    }else{
      const r=await fetch(`http://localhost:3030/api/customers/${params.id}`,{method:"PUT",headers:{"Content-Type" : "application/json","Accept":"application/json"},body:JSON.stringify(customer)});
      const d=await r.json();
      if(d.success){
        toast(d.success_msg);
        setTimeout(() => {
            navigate("/");
          }, 2000);
      }else{
        toast(d.err_msg);
      }
    }
  
  
  }

  const submitForm=(e)=>{
    e.preventDefault()
    customer.id===undefined?addNewCustomer():updateCustomer();
  }

  const getCustData=async()=>{
    const customerResponse =await fetch(`http://localhost:3030/api/customers/${params.id}`) 
    if(customerResponse.ok){
      let data=await customerResponse.json();
      if(data.success){
         setCustomer(data.customer);
      }
    }
  }
  useEffect(()=>{
    getCustData();
  },[])


  //console.log(customer)
  return(
    <div>
      <form  onSubmit={submitForm}>
        <h1>Create Customer</h1>
        <label htmlFor='firstName'>First Name</label>
        <br/>
        <input type="text" id="firstName" defaultValue={customer.id!==undefined?customer.first_name:""}  required onChange={(e)=>{setCustomer({...customer,first_name:e.target.value})}}/>
        <br/><br/>
        <label htmlFor='lastName'>Last Name</label>
        <br/>
        <input type="text" id="lastName"  defaultValue={customer.id!==undefined?customer.last_name:""} required onChange={(e)=>{setCustomer({...customer,last_name:e.target.value})}}/>
        <br/><br/>
        <label htmlFor='mobileNumber'> Mobile Number</label>
        <br/>
        <input type="text" id="mobileNumber" defaultValue={customer.id!==undefined?customer.phone_number:""}   onChange={(e)=>{setCustomer({...customer,phone_number:e.target.value})}}/>
        <br/>
        <button type="submit">{customer.id!==undefined?"Update":"Create"}</button>
      </form>
    </div>
  )
}


export default CustomerFormPage
