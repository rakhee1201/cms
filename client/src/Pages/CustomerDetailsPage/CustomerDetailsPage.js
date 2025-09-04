import React, { useEffect, useState } from 'react'
import { useParams,Link} from 'react-router-dom'
import { FaEdit} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./CustomerDetailsPage.css"
import {toast} from "react-toastify"

const CustomerDetailsPage = () => {
  const params=useParams();
  const [customerDetails,setCustomerDetails]=useState("");
  const [addressDetails,setAddressDetails]=useState([]);
  const [delEle,setDelEle]=useState(null);
  
  

  const getCustomerDetails=async()=>{
    const r=await fetch(`https://cms-backend-9ied.onrender.com/api/customers/${params.id}`);
    const addressesResponse=await fetch(`https://cms-backend-9ied.onrender.com/api/customers/${params.id}/addresses`)
    
    if(addressesResponse.ok){
      let data=await addressesResponse.json();
      if(data.success){
        setAddressDetails(data.addresses)
      }
    }

    if(r.ok){
      let data=await r.json();
      if(data.success){
        setCustomerDetails(data.customer);
      }else{
        setCustomerDetails({});
      }
    }
  }

  const showPopup=(id)=>{
    document.getElementById("pop-up").classList.remove("hide-popup");
    document.getElementById("pop-up").classList.add("show-popup");
    setDelEle(id);
  }

  const closePopup=()=>{
    document.getElementById("pop-up").classList.remove("show-popup");
    document.getElementById("pop-up").classList.add("hide-popup");
    setDelEle(null);
  }




  const delAdd=async()=>{
    const r=await fetch(`https://cms-backend-9ied.onrender.com/api/addresses/${delEle}`,{method:"DELETE",headers:{"Content-Type":"application/json","Accept":"application/json"}})
    const d=await r.json();
    if(d.success){
      toast(d.success_msg);
      window.location.reload();
    }else{
      toast(d.err_msg)
    }
  }

  useEffect(()=>{
    getCustomerDetails();
  },[])


  if(customerDetails.first_name!==undefined){
    return (
   <div className='cust-details-page'>

    <div id="pop-up" className='pop-up hide-popup'>
      <h1>Pop up</h1>
      <p>Are you sure to want to delete?</p>
      <div>
        <button type='button' onClick={delAdd}>Ok</button>
        <button type='button' onClick={closePopup}>No</button>
      </div>
      
    </div>
        <h1>Customer details</h1>
        <h5>First Name : {customerDetails.first_name}</h5>
        <h5>Last Name : {customerDetails.last_name}</h5>
        <h5>Phone Number : {customerDetails.phone_number}</h5>
        <h1>Address Details</h1>
        
        {addressDetails.length!==0?
        <div>
        <ul>{addressDetails.map((address,index)=>
          <li key={index}>
            <p>Address No: {index+1}</p>
            <p>Street : {address.address_details}</p>
            <p>City : {address.city}</p>
            <p>State : {address.state}</p>
            <p> Pin code:{address.pin_code}</p>    
            <Link to={`/api/customers/${customerDetails.id}/updateAddress/${address.id}`}><FaEdit/></Link>
            <MdDelete onClick={()=>{showPopup(address.id)}}/>
          </li>
        )}</ul>
         <Link to={`/api/customers/${customerDetails.id}/addAddress`}>Add new address</Link>
        </div>
        :
        <div>
          <p>Address not found</p>
         <Link to={`/api/customers/${customerDetails.id}/addAddress`}>Add address</Link>
         </div>}
    </div>
  )
  }else{
    return <div><h2>Customer does not found</h2></div>
  }       
}

export default CustomerDetailsPage
