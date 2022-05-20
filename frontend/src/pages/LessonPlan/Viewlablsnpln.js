import {  useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';

export const Viewlablsnpln = (props) => {
    let pstyle = {
        fontsize : '17pt',
        textalign : 'center',
        fontfamily : 'Cambria',
        color : '#0047b3',
        lineheight : '50%',
    }
    
        const [subjectDetails, setSubjectDetails] = useState([]);
        const [lsnplnDetails, setLsnplnDetails] = useState([]);
        
       
        const { state } = useLocation();
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
            axios.post(`${props.baseURL}/getlablsnplndetails`, {
                fid: props.userDetails.id,
                subject: state.subject,
                academic_year: state.academic_year,
            })  
            .then((response) => {
                if (response.data.length > 0) {               
                  setLsnplnDetails(response.data);
                  console.log(response.data);    
                } else{
                    swal("Lesson Plan not added","", "warning");
                    console.log(response.data);
               } 
    
            });
      
        },[])

        let sem;
    if(subjectDetails['dv'] === ''){
        sem =  subjectDetails['sem'];
        }else{
        sem =  '${subjectDetails.sem}(${subjectDetails.dv})';
        }
  return (
    <>
    
    <div className="card" id="printableArea">
    <div className="">

	<div className="row">
	<div className='col-md-3'>
	
	</div>
	<div className="col-md-7">

    <center>	<p style={pstyle}>{subjectDetails['iname']}</p></center>
<center>	<p style={pstyle}>VIJAYAPUR-586109</p></center>
<center><p style={pstyle}>DEPARTMENT OF	{subjectDetails['dept']}</p> </center>
	</div>
	</div>
	{/* // <hr style='border-top: 1px dashed green;'>     */}
	</div> 
	 
	 <table className="" >
	<tr>
	<td><span>Course:</span>
	<span>{subjectDetails['sname']}</span></td>
	<td><span>Course Owner:</span>
	<span>{props.userDetails['name']}</span></td>
	<td><span>Semester:</span>
	<span>{sem}</span></td>
	</tr>
	<tr>
	</tr>
	
</table>   
	 
       
<table className="table table-hover table table-hover table-bordered">
<tr style={pstyle}>
<th>Unit/<br/>Modul e</th>
<th>Lectur<br/> e <br/>No</th>
<th>Planned</th>
<th>Delivered</th>
<th>Remarks</th>
<th>Lesson Plan</th>
<th>TM</th>
<th>TA</th>
<th>AT</th>
<th>CO</th>
<th>PO</th>
</tr>
	<tbody>
    {
              lsnplnDetails.map((user,index) => (
               
        <tr key={user.id}>
             <td>{user.exp_no}</td>
            <td>{index+1}</td>
            <td>{new Date(user.planned_date).toDateString()}</td>
            <td>{user.Delivered_date}</td>
            <td></td>
            <td>{user.experiment}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>

            
        </tr>
            ))
        
        
        }
        
        </tbody>	
            
</table>         
      
        
		<br/><br/>
		
	<div className="row">
	<div className="m-3"><center>Course Owner: <br/>{props.userDetails['name']}</center></div>
	<div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
    <div className="m-3"></div>
	<div className="m-3"><center>Head, <br/>{subjectDetails['dept']}</center></div>
	</div>
           
</div>

    </>
  )
}
