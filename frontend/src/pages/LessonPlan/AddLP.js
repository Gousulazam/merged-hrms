import React from 'react'
import {  useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';


export const AddLP = (props) => {
    const { state } = useLocation();
    const [subjectDetails, setSubjectDetails] = useState([]);
    const [lessonPlan, setLessonPlan] = useState([{ plndate: '', modno: '', topic: '', subtop: '', tmethod: '', taids: '' }]);
    const current = new Date();
  const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
  let slno = 1;
  const handleFormChange = (event,i) => {
    let data = [...lessonPlan];
    data[i][event.target.name] = event.target.value;
    setLessonPlan(data);
}
  const addLessonPlanFields = () => {
      slno++;
    //  alert("hhh");
    let object = { plndate:'', modno: '', topic: '', subtop: '', tmethod: '', taids: '' };
    setLessonPlan([...lessonPlan, object])
    console.log(lessonPlan[0].plndate);
}

const removeLessonPlanFields = (index) => {
    let data = [...lessonPlan];
    if (index != 0) {
        data.splice(index, 1)
        setLessonPlan(data)
    } else {
        swal("Cannot Delete First Row", "", "warning");
    }
}


  useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectdetailbyid`, {
            id: state.subject
        })
            .then((response) => {
                setSubjectDetails(response.data);
                console.log(response.data)
            });

    }, [])
    const reset = () => {
        window.location.reload();
    }
    
const addlsnpln = (e) =>{
    e.preventDefault();
 // console.log(setLessonPlan);
 
 
 for(let i=0; i<lessonPlan.length; i++) {
   axios.post(`${props.baseURL}/addlsnpln`, {
   fid : props.userDetails['id'],
   fname : props.userDetails['name'],
   scode : subjectDetails['scode'],
   sname : subjectDetails['sname'],
   sem : subjectDetails['sem'],
   dv : subjectDetails['dv'],
   dept : subjectDetails['dept'],
   did : subjectDetails['did'],
   planned_date : lessonPlan[i].plndate,
 
   tdate : '',
   mdno : lessonPlan[i].modno,  
 
   topicd : lessonPlan[i].topic,
  
   sub_topic : lessonPlan[i].subtop,
 
   teaching_methods : lessonPlan[i].tmethod,
 
   teaching_aids : lessonPlan[i].taids,
 
   assignment_tool : '',
   status : '',
   class_id : '',
   hod : '',
   vp : '',
   date : date,
   academic_year : state.academicYear,
})

    .then((response) => {
        if (response.data == '1') {
            swal("Record Added","", "success");
        }else{
            swal("fail to add","", "warning");
       }
    }); 
   
}

    //window.location.reload();
}


  return (
    <div className="class-container">
        <form onSubmit={addlsnpln}>
        <div className="card">
            <div className="card-header">
 <h3 className="text-center">Add Lesson Plan</h3><br/>
 </div>
 <div className="card-body">

        <table className="table table-bordered border-primary text-center">
            <thead>
                <tr>
                    <th>Sl No</th>
                    <th>Planned Date</th>
                    <th>Module No</th>
                    <th>Topic Name</th>
                    <th>Sub-topic Name<br/>(Optional)</th>
                    <th>Teaching Methodology</th>
                    <th>Teaching Aids</th>
                    <th>Add/Delete</th>
                    </tr>
            </thead>
            <tbody>            
               {
                   lessonPlan.map((deatils,i)=>{
                       return <tr key={i}>
                       <td>{i+1}</td>
                       
                    <td><input type="Date" required className="form-control" id="plndate" name="plndate"  onChange={event => handleFormChange(event,i)} /></td>  
                      
                       <td><input type="number" required className="form-control" id="modno" name="modno" placeholder="Enter Module No"  onChange={event => handleFormChange(event,i)} /></td>
                      
                       <td><input type="text" required className="form-control" id="topic" name="topic" placeholder="Enter Topic"  onChange={event => handleFormChange(event,i)} /></td>
                      
                       <td><input type="text" required className="form-control" id="subtop" name="subtop" placeholder="Enter Sub-topic"  onChange={event => handleFormChange(event,i)} /></td>
                       
                     <td><select required className="form-control" id="tmethod" name="tmethod"  onChange={event => handleFormChange(event,i)}>
                           <option>Select Teaching Method</option>
                           <option value="LT-Lecture">LT- Lecture</option>
                           <option value="DM-Demo">DM- Demo</option>
                           <option value="Studio">Studio</option></select></td>
                      
                       <td><select required className="form-control" id="taids" name="taids" onChange={event => handleFormChange(event,i)}>
                           <option>Select Teaching Aids</option>
                           <option value="CB-Chalk Board">CB- Chalk Board</option>
                           <option value="PP-Power Point">PP- Power Point Presentation</option>
                           <option value="MD-Model">MD- Model</option>
                           <option value="VD-Video Film">VD- Video Film</option>
                           <option value="EL-E Learning">EL- E Learning</option>
                           <option value="TT-Technical Tools">TT- Technical Tools</option></select></td>
                       <td>
                       <i className="fa fa-plus-square mr-2 add_new" aria-hidden="true" onClick={addLessonPlanFields}></i>
                     <i className="fa fa-minus-square delete" aria-hidden="true" onClick={() => removeLessonPlanFields(i)} ></i>
    
                       </td>
                   </tr>
                   })
               }
               
            
            </tbody>
        </table>
       
        </div>
        <div className="card-footer text-center" >
            <button type="submit" className="btn btn-primary btn-sm rounded mr-2" id="sub" name="sub"><i className="fa fa-dot-circle-o"></i> Submit</button>
            <button type="reset" className="btn btn-danger btn-sm rounded" onClick={reset}>
                            <i className="fa fa-ban"></i> Reset
                        </button>
        </div>
</div>
</form>
    </div>
  )
}
