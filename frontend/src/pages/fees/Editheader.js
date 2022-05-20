import {  useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";

export const Editheader = (props) => {
    const { state } = useLocation();
    const [updateHeader, setUpdateHeader] = useState([]);
    const [perticular, setPerticular] = useState("");
let id = state.id;
//console.log(id);
useEffect(() => {
    axios.post(`${props.baseURL}/headerdetail`, {
        id : id,         
    })
        .then((response) => {
              setUpdateHeader(response.data);
              console.log(response.data);                
        });
      }, [])  
const update = (e) =>{
  e.preventDefault();
  axios.post(`${props.baseURL}/updateheader`, {
    id : state.id,         
    perticular : perticular,
})
    .then((response) => {
      if(response.data == '1'){
        swal("Record Updated","", "success");
      } else{
         swal("fail to Delete","", "warning");
    }                           
    });  
}
  return (
    <>
<form onSubmit={update}>
   
   <table className="table table-bordered mt-2"  id="table1">
   <thead className="text-center">
   <tr>
           
           <th> UPDATE PARTICULARS</th>
           
   </tr>
   </thead>
   <tbody className="text-center">
   {
                 updateHeader.map((details,i)=>{
                      return <tr key={i}>
          
               <td><input required type="text" placeholder={details.head_name} className="form-control" name="particular"   onChange={e =>{ setPerticular(e.target.value) }}/></td>
              
               </tr>	
           })
              }
   
   </tbody>
   </table>
   <center><button type="submit" className="btn btn-primary rounded">Update</button></center>
   </form>

    </>
  )
}
