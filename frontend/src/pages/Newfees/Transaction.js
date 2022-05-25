import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';

export const Transaction = (props) => {
    let move = useNavigate();
    const { state } = useLocation();
    const [transDetails, setTransDetails] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.post(`${props.baseURL}/gettransactiondetails`, {
            usn: state.usn,
        })
            .then((response) => {
                    setTransDetails(response.data); 
                    console.log(response.data);                 
            });

    }, [])

    useEffect(() => {
        axios.post(`${props.baseURL}/gethistory`, {
            usn: state.usn,
        })
            .then((response) => {
                    setHistory(response.data); 
                    console.log(response.data);                 
            });

    }, [])

    let id;
    const edittransaction = (e) => {
      
        id=e;
      //  alert(id);
        move("/edittransaction", { state: {id} });
        }

  return (
    <>
    <form>
<div className="row">
<div className= "col-4">
<label className="font-weight-bold">USN: </label>
<p className="form-control" >{state.usn}</p>
</div>

<div className= "col-4">
<label  className="font-weight-bold">Name: </label>
<p className="form-control"></p>
</div>

<div className= "col-4">
<label  className="font-weight-bold">Student-ID: </label>
<p className="form-control"> {state.usn}  </p>
</div>

</div>
<br/>
<br/>
<div className="row">
	
<table className="table table-bordered mt-2">
<thead>
<tr>
<th>SL NO</th>
<th>YEAR </th>
<th>HEADER NAME</th>
<th>RECEIPT NO </th>
<th>PAID FEE</th>
<th>BALANCE</th>
<th>TOTAL</th>
<th>ACTION</th>
</tr> 
</thead>
<tbody>
  {
     transDetails.map((user,index) => (
      <tr key={index+1}>
        <td>{index+1}</td>
        <td>{user.year}</td>             
        <td>{user.header_name}</td>        
        <td>{user.receipt_no}</td>
        <td>{user.paid_fee}</td>
        <td>{user.total - user.paid_fee}</td>
        <td>{user.total}</td>
        <td><button type="submit" className="btn btn-primary mr-3 rounded" id="subm" name="Subm" onClick={() => {edittransaction(user.id)}}>Update</button></td>
      </tr>
      ))
  }  

</tbody>
 {/* <tbody dangerouslySetInnerHTML={{__html:feeDetails}}>
                    </tbody> */}
</table>  
</div> 
<br/>
</form>

<br/>

<center><strong>UPDATED TRANSACTION</strong></center>
<div className="row">
<table className="table table-bordered mt-2">

<thead>
<tr>
<th>Sl No </th>
<th>YEAR</th>
<th>HEADER NAME </th>
<th>RECEIPT NO </th>
<th>PAID FEE</th>
<th>BALANCE</th>
<th>TOTAL</th>
<th>REMARK</th>

</tr>
</thead>
  
<tbody>
{
  history.map((user,index) => (
   <tr key={index+1}>
        <td>{index+1}</td>
        <td>{user.year}</td>             
        <td>{user.header_name}</td>        
        <td>{user.receipt_no}</td>
        <td>{user.paid_fee}</td>
        <td>{user.total - user.paid_fee}</td>
        <td>{user.total}</td>
        <td>{user.Description}</td>
   </tr>
 ))
}  
</tbody>
</table>
</div>

    </>
  )
}
