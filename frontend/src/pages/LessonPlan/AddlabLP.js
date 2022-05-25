import React from 'react'
import {  useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';


export const AddlabLP = (props) => {
    
    const [labLessonPlan, setLabLessonPlan] = useState([{ plndate: '', expno: '', exp: '' }]);
    const { state } = useLocation();
    const [subjectDetails, setSubjectDetails] = useState([]);

    const handleFormChange = (event,i) => {
        let data = [...labLessonPlan];
        data[i][event.target.name] = event.target.value;
        setLabLessonPlan(data);
    }

    const addLessonPlanFields = () => {
       // slno++;
      //  alert("hhh");
      let object = { plndate: '', expno: '', exp: '' };
      setLabLessonPlan([...labLessonPlan, object])
      console.log(labLessonPlan[0].plndate);
  }
  
  const removeLessonPlanFields = (index) => {
      let data = [...labLessonPlan];
      if (index != 0) {
          data.splice(index, 1)
          setLabLessonPlan(data)
      } else {
          swal("Cannot Delete First Row", "", "warning");
      }
  }
 
    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectdetailbyid`, {
            id: state.subject
        })
            .then((response) => {
                setSubjectDetails(response.data[0]);
                console.log(response.data[0])
            });

    }, [])
   
const addlablsnpln = (e) =>{
    e.preventDefault();
    for(let i=0; i<labLessonPlan.length; i++) {
   axios.post(`${props.baseURL}/addlablsnpln`, {
   fid : props.userDetails['id'],
   fname : props.userDetails['name'],
   scode : subjectDetails['scode'],
   sname : subjectDetails['sname'],
   sem : subjectDetails['sem'],
   dv : subjectDetails['dv'],
   batch : subjectDetails['batch'],
   dept : subjectDetails['dept'],
   did : subjectDetails['did'],
   planned_date : labLessonPlan[i].plndate,
   academic_year : state.academicYear,
   exp : labLessonPlan[i].exp,
   expno : labLessonPlan[i].expno,
   status : '',
   class_id : '',   
})
    .then((response) => {
        if (response.data == '1') {
            swal("Record Added","", "success");
          
        }else{
            swal("fail to add","", "warning");
       }
    }); 
}
}
  return (
    <div className="class-container">
        <form onSubmit={addlablsnpln}>
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
                    <th>Experiment No</th>
                    <th>Experiment</th>
                    <th>Add/Delete</th>
                    </tr>
            </thead>
            <tbody>            
              {
                    labLessonPlan.map((deatils,i)=>{
                        return <tr key={i}>
                        <td>{i+1}</td>
                        
                   <td><input type="Date" required className="form-control" id="plndate" name="plndate" onChange={event => handleFormChange(event,i)} /></td>
                   <td><input type="number" required className="form-control" id="expno" name="expno" placeholder="Enter Experiment No" onChange={event => handleFormChange(event,i)} /></td>
                   <td><input type="text" required className="form-control" id="exp" name="exp" placeholder="Enter Experiment" onChange={event => handleFormChange(event,i)} /></td>
                   
                   <td>
                   <i className="fa fa-plus-square mr-2 add_new"  aria-hidden="true" onClick={addLessonPlanFields}></i>
                     <i className="fa fa-minus-square delete" aria-hidden="true" onClick={() => removeLessonPlanFields(i)} ></i>

                   </td>
               </tr>
                    })
                }
            </tbody>
        </table>
       
        </div>
        <div className="card-footer text-center" >
            <button type="submit" className="btn btn-success" id="sub" name="sub"><i className="fa fa-dot-circle-o"></i> Submit</button>
        </div>
</div>
</form>
    </div>
  )
}
