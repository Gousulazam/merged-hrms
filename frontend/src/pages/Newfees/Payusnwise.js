import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';

export const Payusnwise = (props) => {
   // let navigate = useNavigate();
    const { state } = useLocation();
    const [feeDetails, setFeeDetails] = useState([]);

    useEffect(() => {
        axios.post(`${props.baseURL}/getfeedetails`, {
            usn: state.usn,
        })
            .then((response) => {
                    setFeeDetails(response.data); 
                    console.log(response.data);                 
            });

    }, [])

const add=()=>{
  alert("ffff");
}

 

  return (
    <>
     {/* <form>  */}
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
<thead className='text-center'>
<tr>
<th>YEAR </th>
<th>HEADER NAME</th>
<th>FEE FIXED </th>
<th>PAID FEE</th>
<th>BALANCE</th>
<th>PAY</th>
</tr> 
</thead>
{/* <tbody>
  {
    feeDetails.map((user,index) => (
     <tr key={index+1}>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>

     </tr>
     
     
      ))
    
  }
</tbody> */}
<tbody dangerouslySetInnerHTML={{__html:feeDetails}}>
                    </tbody>
                   
</table>  
</div> 
<br/>
 {/* </form>  */}


    </>
  )
}
