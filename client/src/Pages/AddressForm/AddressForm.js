import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {toast } from "react-toastify";

const AddressForm = () => {

  
  const [address,setAddress]=useState({});
  const [isAddressChanged,setChanged]=useState(false);

  
  const {customerId,addressId}=useParams();
  const navigate=useNavigate();

  const getExistedAddress=async()=>{
    const call=await fetch(`https://cms-backend-9ied.onrender.com/addresses/${addressId}`);
    const response=await call.json();
    if(response.success){
      setAddress(response.address);
    }else{
      toast(response.err_msg);
    }
  }

  useEffect(()=>{
    getExistedAddress();
  },[])

  const addAddress=async()=>{
    if(address.address_details!==undefined && address.city!==undefined && address.state!==undefined && address.pin_code!==undefined && customerId!==undefined){
      const call=await fetch(`https://cms-backend-9ied.onrender.com/api/customers/${customerId}/addresses`,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(address)});
      const response=await call.json();
      console.log(response);
      if(response.success){
         toast(`${response.success_msg}`);
         setTimeout(() => {
          navigate("/")
         }, 1000);
      }else{
        toast(`Failed to add the address : ${response.err_msg}`);
      }
    }else{
      toast("please fill all the fields");
    }
  }


  const updateAddress=async()=>{
    if(isAddressChanged){
      const r=await fetch(`https://cms-backend-9ied.onrender.com/api/addresses/${addressId}`,{method:"PUT",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(address)});
      const d=await r.json();
      if(d.success){
        toast(d.success_msg);
        setTimeout(() => {
          navigate(`/api/customers/${customerId}`);
        }, 1000);
      }else{
        toast(d.err_msg);
      }
    }else{
      toast("There are no changes.")
    }
  }

  const submitAddress=async(e)=>{
    e.preventDefault();
  customerId!==undefined && addressId!==undefined?updateAddress():addAddress();;
  }

  const changeAddressDetails=(e)=>{
    setAddress({...address,address_details:e.target.value})
    setChanged(true);
  }

  const changeCity=(e)=>{
    setAddress({...address,city:e.target.value})
    setChanged(true);
  }

  const changeState=(e)=>{
    setAddress({...address,state:e.target.value})
    setChanged(true);
    
  }

  const changePincode=(e)=>{
    setAddress({...address,pin_code:e.target.value})
     setChanged(true);  
  }

  return (
    <div>
      <h1>Add address</h1>
      <form onSubmit={submitAddress}>
        <h5>{`Customer name : Rakesh`}</h5>

        <label htmlFor='street'>Street/Landmark</label>
        <br/>
        <input type="text" id="street" required defaultValue={address!==undefined ? address.address_details:""}  placeholder='street' onChange={changeAddressDetails}/>
        <br/>

        <label htmlFor="city">City</label>
        <br/>
        <input type="text" id="city" required defaultValue={address!==undefined?address.city:""} placeholder='city' onChange={changeCity}/>
        <br/>

        <label htmlFor='state' >State</label>
        <br/>
        <input type="text" id="state" required placeholder="state" defaultValue={address!==undefined?address.state:""} onChange={changeState}/>
        <br/>

        <label htmlFor='pincode'>Pin code</label>
        <br/>
        <input type="text" id="pincode"  placeholder="pincode" defaultValue={address!==undefined?address.pin_code:""} onChange={changePincode}/>
        <br/>
        <button type='submit'>{addressId!==undefined? "Update": "Submit"}</button>
      </form>
    </div>
  )
}

export default AddressForm
