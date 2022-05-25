import {  useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

export const Viewsyll = (props) => {
    let cardstyle={
        width:'100%',
        margin: 'auto'
    }
    let tablestyle ={
        width : '100vh',
      //  height : '100vh',
       // bordercollapse: 'collapse',
    }
    let trstyle = {
        texttransform : 'uppercase',
    }
    const [subjectDetails, setSubjectDetails] = useState([]);
    const [lsnplnDetails, setLsnplnDetails] = useState([]);
    const { state } = useLocation();
    let move = useNavigate();
    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectdetailbyid`, {
            id: state.subject
        })
            .then((response) => {  
                setSubjectDetails(response.data[0]);
                console.log(response.data[0])
            });

    }, [])
   
    useEffect(() => {
        axios.post(`${props.baseURL}/getcovsyl`, {
            fid: props.userDetails.id,
            subject: state.subject,
            academic_year: state.academicYear,
        
        }) 
        .then((response) => {
            if (response.data.length > 0) {               
              setLsnplnDetails(response.data);
              console.log(response.data);
            } else{
                swal("Still Nothing Completed","", "warning");
                console.log(response.data);
           } 

        });
  
    },[])



  return (
      <>
    <div className="card" style={cardstyle}>
 <div className="card-header">
                    <center><strong>Lesson Plan Update</strong> </center><br/>
				
	<table id='' border='1'  className="maintable teach table table-striped table-bordered">
     <tbody>
	 <tr>
	 <td><strong>Subject Name: {subjectDetails['sname']} </strong></td>
	 <td><strong>Subject Code: {subjectDetails['scode']}</strong></td>
	 <td><strong>Sem : {subjectDetails['sem']} </strong></td>
     
	 </tr> 
        </tbody> 
</table>
					
                    </div>


<table id='' border='1'  className="maintable teach table table-striped table-bordered table responsive">
        <thead className="thead-dark">
        <tr style={trstyle}>
            <th>SlNo</th>
            <th>Planned Date</th>
            <th>Delivered Date</th>
            <th>Module No</th>
            <th>Topic</th>
			<th>Sub Topic</th>
			<th>Teaching Methods</th>
			<th>Teaching Aids</th>
					
        </tr>
        </thead>
        <tbody>
		{
              lsnplnDetails.map((user,index) => (
               
        <tr key={user.id}>
             
            <td>{index+1}</td>
            <td>{user.planned_date.split(" ")[0]}</td>
            <td>{user.delivered_date}</td>
            <td>{user.mdno}</td>
            <td>{user.topicd}</td> 
            <td>{user.sub_topic}</td>
            <td>{user.teaching_methods}</td>
            <td>{user.teaching_aids}</td>
        </tr>
            ))
        
        
        }
        </tbody>
</table>

 
               

</div>
</>
  )
}
