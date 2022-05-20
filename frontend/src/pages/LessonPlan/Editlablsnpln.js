import React, { useEffect } from 'react';
import {useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import Moment from 'moment';


export const Editlablsnpln = (props) => {
    const [updatelsnpln, setUpdatelsnpln] = useState([]);
    const { state } = useLocation();
    var [plndate, setPlndate] = useState("");
    var [exp, setExp] = useState("");
    

  
    useEffect(() => {
        axios.post(`${props.baseURL}/lablsnplndetail`, {
            id : state.id,         
        })
            .then((response) => {
                  setUpdatelsnpln(response.data);
                  console.log(response.data);
                
            });
    },[])
const updlsnpln = (e) =>{

  e.preventDefault();
 // console.log("the data is", [plndate,mdno,topic,subtop,tmethod,taids,state.id]); 
  if(plndate === ''){
    plndate = updatelsnpln[0].planned_date;
  }
  if(exp === ''){
    exp = updatelsnpln[0].experiment;
  }
  
   console.log("the data is", [plndate,exp,state.id]);
  axios.post(`${props.baseURL}/updlablsnpln`, {
     planned_date :plndate,
     exp :exp,    
     id : state.id,   
 })
     .then((response) => {
         if (response.data == '1') {
           swal("Updated Successfully","", "success");
           console.log(response.data);
         }else{
             swal("Failed to Update","", "warning");
             console.log(response.data);
        }
     }); 


}
  
    
  return (
    <div>
      <form >
{
    updatelsnpln.map((user) => (
<>


    <div className="card">
        <div className="card-body">
<div className="mb-3">
  <label htmlFor="plndate" className="for-label">Planned Date</label>
  {/* Moment("04-20-2022").format('DD-MM-YYYY') */}
  <input type="date" className="form-control" id="plndate" placeholder={user.planned_date} value={plndate} onChange={(e)=>{setPlndate(e.target.value)}}/>
</div>
<div className="mb-3">
  <label htmlFor="exp" className="for-label">Experiment</label>
  <textarea  className="form-control" id="exp" placeholder={user.experiment} value={exp} onChange={(e)=>{setExp(e.target.value)}}></textarea>
</div>




<div className="card-footer text-center">
<button type="submit" className="btn btn-sm btn-info" onClick={updlsnpln}>Update</button>
</div>
</div>
</div>
</>
    ))
}
</form>
    </div>
  )
}
