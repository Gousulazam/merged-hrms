import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';

export const EditTransaction = (props) => {
  let move = useNavigate();
  const { state } = useLocation();
  const [transaction, setTransaction] = useState([]);
 // const [updation, setUpdation] = useState([]);
  var [payf, setPayf] = useState("");
  var [remark, setRemark] = useState("");

  useEffect(() => {
    axios.post(`${props.baseURL}/gettransaction`, {
        id: state.id,
    })
        .then((response) => {
                setTransaction(response.data); 
                console.log(response.data);                 
        });

}, [])

const update = (e) => {
  e.preventDefault();
//alert(remark);
  //alert(transaction[0].paid_fee);
  if(payf == ''){
    payf = transaction[0].paid_fee;
  }

  axios.post(`${props.baseURL}/updatetransaction`, {
    id: state.id,
    payf : payf,
    cid : transaction[0].cid,
    did : transaction[0].did,
    student_id : transaction[0].student_id,
    receipt_no : transaction[0].receipt_no,
    header_name : transaction[0].header_name,
    old_payf : transaction[0].paid_fee,
    total : transaction[0].total,
    year : transaction[0].year,
    date : transaction[0].date,
    description : remark,
    update_status : '1',

})
    .then((response) => {
      if(response.data == '1'){
        swal("Updated Successfully","", "success");
        console.log(response.data);
      }else{
        swal("Failed to Update","", "warning");
             console.log(response.data);
      }                
    });
}

  return (
    <>
    
<form onSubmit={update}>
<table className="table table-bordered">
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
<th>ACTION</th>
</tr>
</thead>
<tbody>
{
     transaction.map((user,index) => (
        <tr key={index+1}>
  <td>{index+1}</td>
  <td>{user.year}</td>
  <td>{user.header_name}</td>
  <td>{user.receipt_no}</td>
  <td><input type='number' id='payf' name='payf' className="form-control" placeholder={user.paid_fee} value={payf} onChange={(e)=>{setPayf(e.target.value)}}/></td>
  <td>{user.total - user.paid_fee}</td>
  <td>{user.total}</td>
  <td><input type='text' id='remark' name='remark' className="form-control" value={remark} onChange={(e)=>{setRemark(e.target.value)}}/></td>
  <td><button type='submit' className='btn btn-primary rounded sub'  id='sub' name='sub'>Submit</button></td>
</tr>
 ))
}  
</tbody>
</table>
</form>







    </>
  )
}
