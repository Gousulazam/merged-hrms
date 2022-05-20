import React, { useEffect } from 'react';
import {useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import Moment from 'moment';

export const Editlsnpln = (props) => {
    const [updatelsnpln, setUpdatelsnpln] = useState([]);
    const { state } = useLocation();
    var [plndate, setPlndate] = useState("");
    var [mdno, setMdno] = useState("");
    var [topic, setTopic] = useState("");
    var [subtop, setSubtop] = useState("");
    var [tmethod, setTmethod] = useState("");
    var [taids, setTaids] = useState("");

  
    useEffect(() => {
        axios.post(`${props.baseURL}/lsnplndetail`, {
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
  if(mdno === ''){
    mdno = updatelsnpln[0].mdno;
  }
  if(topic === ''){
    topic = updatelsnpln[0].topicd;
  }
  if(subtop === ''){
   subtop = updatelsnpln[0].sub_topic;
 }
 if(tmethod === ''){
   tmethod = updatelsnpln[0].teaching_methods;
 }
 if(taids === ''){
  taids = updatelsnpln[0].teaching_aids;
}
   console.log("the data is", [plndate,mdno,topic,subtop,tmethod,taids,state.id]);
  axios.post(`${props.baseURL}/updlsnpln`, {
     planned_date :plndate,
     mdno :mdno,
     topicd :topic,
     sub_topic :subtop,
     tmethod :tmethod, 
     taids : taids,     
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
  <label htmlFor="mdno" className="for-label">Module No</label>
  <input type="number" className="form-control" id="mdno" placeholder={user.mdno} value={mdno} onChange={(e)=>{setMdno(e.target.value)}}/>
</div>
<div className="mb-3">
    
  <label htmlFor="topic" className="form-label">Topic</label>
  <input type="text" className="form-control" id="topic" placeholder={user.topicd}  value={topic} onChange={(e)=>{setTopic(e.target.value)}}/>
</div>
<div className="mb-3">
  <label htmlFor="sub_topic" className="for-label">Sub Topic</label>
  <input type="text" className="form-control" id="subtop" placeholder={user.sub_topic} value={subtop} onChange={(e)=>{setSubtop(e.target.value)}}/>
</div>
<div className="mb-3">
  <label htmlFor="teaching_method" className="for-label">Teaching Methodology</label>
  <select required className="form-control" id="tmethod" name="tmethod" value={tmethod} onChange={e =>{ setTmethod(e.target.value) }}>
                       <option value={user.teaching_methods}>{user.teaching_methods}</option>
                       <option value="LT-Lecture">LT- Lecture</option>
                       <option value="DM-Demo">DM- Demo</option>
                       <option value="Studio">Studio</option></select>
</div>
<div>
<label htmlFor="teaching_aids" className="for-label">Teaching Aids</label>
<select required className="form-control" id="taids" name="taids" value={taids} onChange={e =>{ setTaids(e.target.value) }}>
                       <option value={user.teaching_aids}>{user.teaching_aids}</option>
                       <option value="CB-Chalk Board">CB- Chalk Board</option>
                       <option value="PP-Power Point">PP- Power Point Presentation</option>
                       <option value="MD-Model">MD- Model</option>
                       <option value="VD-Video Film">VD- Video Film</option>
                       <option value="EL-E Learning">EL- E Learning</option>
                       <option value="TT-Technical Tools">TT- Technical Tools</option></select>

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
