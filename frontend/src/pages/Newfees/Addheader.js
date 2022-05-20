import {  useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
export const Addheader = (props) => {
    let move = useNavigate();
    const { state } = useLocation();
    const [perticular, setPerticular] = useState([{ parti: '' }]);
    const [headerDetails, setHeaderDetails] = useState([]);
    

    useEffect(() => {
        axios.post(`${props.baseURL}/getheadersdetails`, {
            cid: props.userDetails['cid']
        })
            .then((response) => {
                if (response.data.length > 0) {               
                    setHeaderDetails(response.data);
                    console.log(response.data);
                  } 
            });

    }, [])

    const handleFormChange = (event,i) => {
        let data = [...perticular];
        data[i][event.target.name] = event.target.value;
        setPerticular(data);
    }
      const addPerticular = () => {
          
        //  alert("hhh");
        let object = { parti: '' };
        setPerticular([...perticular, object])
        console.log(perticular[0]);
    }
    
    const removePerticular = (index) => {
        let data = [...perticular];
        if (index != 0) {
            data.splice(index, 1)
            setPerticular(data)
        } else {
            swal("Cannot Delete First Row", "", "warning");
        }
    }

const submit =(e)=>{
    e.preventDefault();
    console.log(perticular);
    for(let i=0; i<perticular.length; i++) {
        axios.post(`${props.baseURL}/addheaders`, {
        head_name : perticular[i].particular,
        cid : props.userDetails['cid'],
        academic_year : state.academicYear,
        year : '',        
     })     
         .then((response) => {
             if (response.data == '1') {
                 swal("Record Added","", "success");
                 console.log(response.data);
             }else{
                 swal("fail to add","", "warning");
                 console.log(response.data);
            }
         });    
     }
      //window.location.reload();
     }

     const editheader = (e) =>{
       // e.preventDefault();
        let id = e;
       //  alert(id);
        move("/editheader", { state: {id} });
        
     }

     const deleteheader = (id) =>{
        axios.post(`${props.baseURL}/headerdelete`, {
            id : id,         
        })
            .then((response) => {
                if (response.data == '1') {
                    swal("Record Deleted","", "success");
                 } else{
                    swal("fail to Delete","", "warning");
               }               
            });  
     }

  return (
   <>
<div className="text-uppercase">  
<h2 align='center'>secab association's</h2>
</div>

<form onSubmit={submit}>
   
    <table className="table table-bordered mt-2"  id="table1">
	<thead className="text-center">
	<tr>
			
			<th>PARTICULARS</th>
			<th>Add/Delete</th>
	</tr>
	</thead>
	<tbody className="text-center">
    {
                   perticular.map((deatils,i)=>{
                       return <tr key={i}>
           
                <td><input required type="text" className="form-control" name="particular"  placeholder="Enter Particular name" onChange={event => handleFormChange(event,i)}/></td>
				<td>
                <i className="fa fa-plus-square mr-2 add_new" aria-hidden="true" onClick={addPerticular}></i>
                     <i className="fa fa-minus-square delete" aria-hidden="true" onClick={() => removePerticular(i)} ></i>
                     </td>
				</tr>	
            })
               }
	
	</tbody>
	</table>
	<center><button type="submit" className="btn btn-primary rounded">Submit</button></center>
	</form>
	
	<br/>
	
	<table className="table table-bordered mt-2"  id="table1" >
	<thead className="text-center">
	<tr>
	<th>PARTICULARS</th>
	<th>ACTION</th>
	</tr>
	</thead>
	<tbody className="text-center">
    {
              headerDetails.map((user,index) => (
                  <tr key={user.id}>
<td>{user.head_name}</td>
<td>
{/* onClick={() => {editlsnpln(user.id)}}  onClick={() => setEditing(true)}
onClick={() => {dellp(user.id)}} */}
<button type="button" className="btn btn-sm btn-info  mr-3 round" onClick={() => {editheader(user.id)}} >Edit</button>
<button type="button" className="btn btn-sm btn-danger round" onClick={() => {deleteheader(user.id)}} >Delete</button>

</td>
</tr>
))        
}
	</tbody>
	</table>
	
   </>
  )
}
