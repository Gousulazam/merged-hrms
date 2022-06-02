import React, {useState,useEffect} from 'react';
import axios from 'axios';
import { useLocation  ,TextField} from 'react-router-dom';

const ViewSubjectAssignedToStdt = (props) => {
     const {state}  = useLocation();
    // const [subjectDetails, setSubjectDetails] =useState([])
     const [tbody, setTbody] = useState("");
     const [cllgDetails, setCllgDetails] = useState("")

     useEffect(() => {
         axios.post(`${props.baseURL}/getsubjectlists`, {
            //id : state.academicYear,
             academicYear : state.academicYear,
             did : state.department,
             sem : state.sem,
             dv : state.dv,
             cid : state.cid.cid,
         }) .then((response) => {
            setTbody(response.data);
            //setSubjectDetails(response.data);
         });
     },[])

     useEffect(() => {
         axios.post(`${props.baseURL}/getdepartmentdetailbyid`, {
             cid : state.cid
         }).then((response) => {
            setCllgDetails(response.data[0]);
         });
     },[])

     

    
  return (
    <div className='container'>
        <div className='card'>
            <div className="card-header text-capitalize text-center font-weight-bold">
            <h5>department of {cllgDetails.name}
            <br/>
            Semester : {state.sem}
            <br/>
            subject allotted students list</h5>
            </div>

            

            <div className='card card-body'>
                <table className="table table-bordered dataTable"  style={{bordercollapse: "collapse",width:"100%"}}>
                <thead className="thead-dark">
                <tr>
                <th>Sl No</th>
				<th>USN</th>
				<th>Student Id</th>
				<th>Name</th>
                <th>subject1</th>
                <th>subject2</th>
			    <th>subject3</th>
				<th>subject4</th>
				<th>subject5</th>
				<th>subject6</th>
				<th>subject7</th>
				<th>subject8</th>
				<th>Batch</th> 
                </tr>
            </thead>
                    <tbody dangerouslySetInnerHTML={{__html:tbody}}>
                        
                    </tbody>
                </table>
            </div>
        </div>
    
    </div>
  )
}

export default ViewSubjectAssignedToStdt
