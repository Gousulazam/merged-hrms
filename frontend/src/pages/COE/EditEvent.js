import React, { useEffect } from 'react';
import {useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';

export const EditEvent = (props) => {
    const [updateevent, setUpdateEvent] = useState([]);
  //  console.log(updateevent[0]);
    const [event, setEvent]=useState("");
    const { state } = useLocation();
     var [title, setTitle] = useState("");
    var [desc, setDesc] = useState("");
    var [start, setStart] = useState("");
    var [end, setEnd] = useState("");
    var [etype, setEtype] = useState("");

  
    useEffect(() => {
        axios.post(`${props.baseURL}/eventdetail`, {
            id : state.id,         
        })
            .then((response) => {
                  setUpdateEvent(response.data);
                  console.log(response.data);
                
            });
    },[])

    const updatevent = (e) =>{
      e.preventDefault();
    
     if(title === ''){
       title = updateevent[0].title;
     }
     if(desc === ''){
       desc = updateevent[0].descp;
     }
     if(start === ''){
       start = updateevent[0].start;
     }
     if(end === ''){
      end = updateevent[0].end;
    }
    if(etype === ''){
      etype = updateevent[0].etype;
    }
      console.log("the data is", [title,desc,start,end,etype,state.id]);
     axios.post(`${props.baseURL}/update`, {
        title :title,
        desc :desc,
        start :start,
        end :end,
        etype :etype,      
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
      <form onSubmit={updatevent}>
{
    updateevent.map((user) => (
<>

    <div className="card" >
        <div className="card-body">
<div className="mb-3">
  <label htmlFor="title" className="for-label">Title</label>
  <input type="text" className="form-control" id="title" placeholder={user.title} value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
 
</div>
<div className="mb-3">
  <label htmlFor="description" className="for-label">Description</label>
  <input type="text" className="form-control" id="desc"  placeholder={user.descp} value={desc} onChange={(e)=>{setDesc(e.target.value)}}/>
</div>
<div className="mb-3">
  <label htmlFor="start" className="form-label">Start</label>
  <input type="text" className="form-control" id="start" placeholder={user.start}  value={start} onChange={(e)=>{setStart(e.target.value)}}/>
</div>
<div className="mb-3">
  <label htmlFor="end" className="for-label">End</label>
  <input type="text" className="form-control" id="end" placeholder={user.end} value={end} onChange={(e)=>{setEnd(e.target.value)}}/>
</div>
<div className="mb-3">
  <label htmlFor="etype" className="for-label">Event Type</label>
  <input type="text" className="form-control" id="etype" placeholder={user.etype} value={etype}  onChange={(e)=>{setEtype(e.target.value)}}/>
</div>
</div>
<div className="card-footer text-center">
<button type="submit" className="btn btn-sm btn-info">Update</button>
</div>
</div>

</>
    ))
}
</form>
    </div>
  )
}
