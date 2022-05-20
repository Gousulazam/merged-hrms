import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import {useState} from "react";
import axios from "axios";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
//import {Link} from 'react-router-dom'

export default function ShowEvent(props) {
    let move = useNavigate();
    const { state } = useLocation();
   const [event, setEvent]=useState([]);
   let id;
const editevent = (e) => {
// console.log("the id is", e);
// alert("hh");
//alert(e);
id=e;
move("/editevent", { state: {id} });
}

    useEffect(() => {
        axios.post(`${props.baseURL}/eventList`, {
            semtype :state.semtype,
            academic_year :state.academic_year,
            year :state.year         
        })
            .then((response) => {
                if (response.data.length > 0) {
                   
                  setEvent(response.data);
                  console.log(response.data);
                }else{
                    swal("Events not added","", "warning");
               }
            });
    },[]);

    const delevent = (e) =>{
       // alert('hhhhh');
       // console.log(e);
        confirmAlert({
            title: 'Delete',
            message: 'Are you sure to delete.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => del(e) 
              },
              {
                label: 'Cancel',
                onClick: () => window.location.reload()
              }
            ]
          });
         }

         const del = (e)=>{
            axios.post(`${props.baseURL}/deleteevent`, {
                   id: e,
               }) 
               .then((response) => {
                   if (response.data == '1') {               
                       swal("Deleted Successfully","", "succsess");
                       
                   } else{
                       swal("Fail to Delete","", "warning");
                      
                  } 
           
               });
               window.location.reload();
         }


  return (
     
    <div className="container my-3">
         <h3 className="text-center">COE Edit Delete</h3><br/>
        <table className="table table-bordered border-primary text-center">
            <thead className="thead-dark">
                <tr>
                    <th>Sl No</th>
                    <th>Title</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Department</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    </tr>
            </thead>
            <tbody>            
                 {
                     
                    event.map((user,index) => (
                        (user.dept !== 'all')?
                <tr key={user.id}>
                     
                    <td>{index+1}</td>
                    <td>{user.title}</td>
                    <td>{user.start}</td>
                    <td>{user.end}</td>
                    <td>{user.did}</td>
                     <td><button type="button" className="btn btn-sm btn-info" onClick={() => {editevent(user.id)}}>Edit</button></td>
                    <td><button type="button" className="btn btn-sm btn-danger" onClick={() => {delevent(user.id)}}>Delete</button></td> 
                </tr>:<tr key={user.id}>
                     
                     <td>{index+1}</td>
                     <td>{user.title}</td>
                     <td>{user.start}</td>
                     <td>{user.end}</td>
                     <td>{user.dept}</td>
                      <td><button type="button" className="btn btn-sm btn-secondary" onClick={() => {editevent(user.id)}}>Edit</button></td>
                     <td><button type="button" className="btn btn-sm btn-danger" onClick={() => {delevent(user.id)}}>Delete</button></td> 
                 </tr>
                    ))
               } 
            
            </tbody>
        </table>
    </div>
    
  )
}
