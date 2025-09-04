import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./CustomerListPage.css"
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

const CustomerListPage = () => { 
    const [customers, setCustomers] = useState([]);
    const [apiStatus,setApiStatus]=useState("Initial");
    const [searchCriteria,setSearchCriteria]=useState("");
   
    
    const getCustomers=async()=>{
        const response=await fetch('http://localhost:3030/api/customers');
        let data;
        if(response.ok){
            data=await response.json();
            if(data.success){
                setCustomers(data.customers);
                setApiStatus("Success");
            }
        }
    }

    useEffect(() => {
        getCustomers();
    }, []); 

    const onchangeSearchCriteria=(e)=>{
        setSearchCriteria(e.target.value);
    }

    const Loderview=()=><h1>Loader</h1>

    const deleteCustomer=async (id)=>{
        if(prompt("Are you sure to want to delete..?")===""){
            const delCusr=await fetch(`http://localhost:3030/api/customers/${id}`,{method:"DELETE",headers:{"Content-Type":"application/json","Accept":"application/json"}})
            const delCusd=await delCusr.json();
            if(delCusd.success){
                toast(delCusd.success_msg)
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }else{
                toast(delCusd.err_msg);
            }
        }
    }

   
    const SuccessView=()=>{
        const filteredCustomers=customers.filter(customer=>customer.first_name.toLowerCase().includes(searchCriteria.toLowerCase()) || customer.last_name.toLowerCase().includes(searchCriteria.toLowerCase()))
        return(
        <div className='cslist-page-container'> 
         <h1>Customer List</h1>
            <input type='search' onChange={onchangeSearchCriteria}/>
            <Link className='create-customer-btn' to={`/api/customers/addCustomer`}>Create</Link>
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Customer Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length!==0?filteredCustomers.map((customer,index)=><tr key={index}>
                        <td>{index+1}</td>
                        <td>{customer.first_name+ " "  + customer.last_name}</td>
                        <td><Link to={`/api/customers/updateCustomer/${customer.id}`}><FaEdit/></Link><Link to={`api/customers/${customer.id}`}><FaEye/></Link><MdDelete onClick={()=>{deleteCustomer(customer.id)}}/></td>
                    </tr>):
                    <tr><td colSpan={6}>No Data</td></tr>}
                </tbody> 
            </table>
        </div>
        )
    }

    const FailureView=()=><h1>Failure</h1>

    switch (apiStatus) {
        case "Initial":
            return Loderview();
        case "Success":
            return SuccessView();
        case "Failed":
            return FailureView();
        default:
            return Loderview();
    }
}

export default CustomerListPage;