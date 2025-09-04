const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors=require("cors");
const { error } = require("console");

const databasePath = path.join(__dirname, "database.db");

const app = express();

app.use(express.json());
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3030, () =>
      console.log("Server Running at http://localhost:3030/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();


//TESTING
app.get("/",(req,res)=>{
    res.send("ok");
})


//GET all the customers in the table
//GET /api/customers: 
app.get("/api/customers",async (req,res)=>{
    try{
        const {city,state,pin_code}=req.query;
        let q;

        if(city!==undefined && state!==undefined){
            q=`select * from customer inner join addresses on customer.id=addresses.customer_id where city="${city}" and state="${state}"`;
        }else if(city===undefined && state!==undefined){
            q=`select * from customer inner join addresses on customer.id=addresses.customer_id where state="${state}"`;
        }else if(city!==undefined && state===undefined){
            q=`select * from customer inner join addresses on customer.id=addresses.customer_id where city="${city}"`;
        }else{
            q=`select * from customer`;
        }
        const customers=await database.all(q);
        res.json({success:true,error:false,customers});
    }catch(e){
       res.json({success:false,error:true,err_msg:e.message});
    }
})

//POST new customer into database
//POST /api/customers
app.post("/api/customers",async (req,res)=>{
    try{
            const {first_name,last_name,phone_number}=req.body;
            if(first_name===undefined || last_name===undefined || phone_number===undefined){
                res.json({success:false,error:true,err_msg:"Please send all the fields"});
            }else{
                const r=await database.run(`insert into customer (first_name,last_name,phone_number) 
                    values ("${first_name}","${last_name}","${phone_number}")`)
                    res.json({success:true,error:false,success_msg:"Customer create successfully"});
            }
        }catch(e){
            if(e.message=="SQLITE_CONSTRAINT: UNIQUE constraint failed: customer.phone_number"){
                res.json({success:false,error:true,err_msg:"Phone_number already exists"});
            }else{
                res.json({success:false,error:true,err_msg:e.message});
            }
        }
})

//GET Specific user
//GET /api/customers/:id
app.get("/api/customers/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const existedCustomer=await database.get(`select * from customer where id="${id}"`)
        if(existedCustomer===undefined){
            res.json({success:false,error:true,err_msg:"Customer does not exists."});
        }else{
            res.json({success:true,error:false,customer:existedCustomer});
        }
    }catch(e){
         res.json({success:false,error:true,err_msg:e.message});
    }
})

//PUT customer
//PUT /api/customers/:id
app.put("/api/customers/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const {first_name,last_name,phone_number}=req.body;
        const exiCus=await database.get(`select * from customer where id="${id}"`);
        if(exiCus!==undefined){
                if(first_name!==undefined){
                    exiCus.first_name=first_name;
                }
                if(last_name!==undefined){
                    exiCus.last_name=last_name;
                }
                if(phone_number!==undefined){
                    exiCus.phone_number=phone_number;
                }
                await database.run(`update customer set first_name="${exiCus.first_name}",last_name="${exiCus.last_name}",phone_number="${exiCus.phone_number}" where id="${id}"`);
                res.json({success:true,error:false,success_msg:"Customer updates successfylly"});
        }else{
            res.json({success:false,error:true,err_msg:"Cusotomer does not exists"});
        }
    }catch(e){
        res.json({success:false,error:true,err_msg:e.message});
    }
})

//DELETE specific user
//DELETE /api/customers/:id
app.delete("/api/customers/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const exiCus=await database.get(`select * from customer where id="${id}"`);
        if(exiCus!==undefined){
            await database.run(`delete from customer where id="${id}"`);
            res.json({success:true,error:false,success_msg:"Customer deleted successfully"});
        }else{
            res.json({success:false,error:true,err_msg:"Cusotomer does not exists"});
        }
    }catch(e){
        res.json({success:false,error:true,err_msg:e.message});   
    }
});




//ADDRESS APIS//
//POST Address into database
//POST /api/customers/:id/addresses
app.post("/api/customers/:id/addresses",async (req,res)=>{
    try{
        const {id}=req.params;
        const {address_details,city,state,pin_code}=req.body;
        if(await database.get(`select * from customer where id="${id}"`)===undefined){
            res.json({success:false,error:true,err_msg:"Cusotomer does not exists"});
        }else{
            if(address_details!==undefined && city!==undefined && state!==undefined && pin_code!==undefined){
                     await database.run(`insert into addresses (customer_id,address_details,city,state,pin_code) values ("${id}","${address_details}","${city}","${state}","${pin_code}")`)
                res.json({success:true,error:false,success_msg:"Address added successfully"});
            }else{
                res.json({success:false,error:true,err_msg:"Please fill all the details"});
            }
        }
    }catch(e){
       
        res.json({success:false,error:true,err_msg:e.message});

    }
})

//Get addrsses of specific customer
//GET /api/customers/:id/addresses
app.get("/api/customers/:id/addresses",async(req,res)=>{
    try{
        const exiCus=await database.get(`select * from customer where id="${req.params.id}"`);
        if(exiCus!==undefined){
                const customer_addresses =await database.all(`select * from addresses where customer_id="${req.params.id}"`);
                res.json({success:true,error:false,addresses:customer_addresses});
            }else{
             res.json({success:false,error:true,err_msg:"Customer does not exists."});
        }     
    }catch(e){
        res.json({success:false,error:true,err_msg:e.message});
    }
})


//all addresses
app.get("/addresses",async(req,res)=>{
    res.json(await database.all(`select * from addresses`));
})

//Update specific addresses.
//PUT /api/addresses/:addressId
app.put("/api/addresses/:addressId",async(req,res)=>{
    try{
            const {addressId}=req.params;
            const {customer_id,address_details,city,state,pin_code}=req.body;
            const exiAdd=await database.get(`select * from addresses where id="${addressId}"`);
            if(exiAdd!==undefined){
                if(customer_id!==undefined && await database.get(`select * from customer where id="${customer_id}"`)==undefined){
                    res.json({success:false,error:true,err_msg:"Customer does not eixsts"});
                }else{
                if(customer_id!==undefined){
                    exiAdd.customer_id=customer_id
                }
                if(address_details!==undefined){
                    exiAdd.address_details=address_details
                }
                if(city!==undefined){
                    exiAdd.city=city
                }
                if(state!==undefined){
                    exiAdd.state=state
                }
                if(pin_code!==undefined){
                    exiAdd.pin_code=pin_code
                }
                await database.run(`update addresses set customer_id="${exiAdd.customer_id}",address_details="${exiAdd.address_details}",city="${exiAdd.city}",state="${exiAdd.state}",pin_code="${exiAdd.pin_code}" where id="${addressId}"`)
                res.json({success:true,error:false,success_msg:"Address updated successfully"});
            }
            }else{
                res.json({success:false,error:true,err_msg:"Address not found."});
            }
    }catch(e){
        res.json({success:false,error:true,err_msg:e.message});
    }
})

//DELET specific address
//DELETE /api/addresses/:addressId
app.delete("/api/addresses/:addressId",async(req,res)=>{
    try{
    const {addressId}=req.params;
    const exiAdd=await database.get(`select * from addresses where id="${addressId}"`);
    if(exiAdd!==undefined){
        await database.run(`delete from addresses where id="${addressId}"`);
        res.json({success:true,error:false,err_msg:"Address deleted successfully."});
    }else{
        res.json({success:false,error:true,err_msg:"Address not found."});
    }
    }catch(e){
        res.json({success:false,error:true,err_msg:e.message});
    }
})


app.get("/addresses/:addressId",async(req,res)=>{
    try{    
    const {addressId}=req.params;
    const r=await database.get(`select * from addresses where id="${addressId}"`)
    res.json({success:true,error:false,address:r});
    }catch(e){
         res.json({success:true,error:false,err_msg:e.message});
    }
})