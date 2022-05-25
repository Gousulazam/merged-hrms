import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubjectView = (props) => {
    let Navigate = useNavigate();

    const [departmentOption , setDepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [department , setDepartment] = useState("")
    const [cid, setCid] = useState({cid: props.userDetails.cid})
    

    useEffect(() => {
        axios.post(`${props.baseURL}/getdepartmentoption`,{
            cid: props.userDetails.cid
            
        })
        .then((response) => {
            if(response.data.length > 0) {
                setDepartmentOption(response.data);
            }
        });

    },[])

     const [academicYearOption, setAcademicYearOption] = useState(`<option value ="">Select Acadmeic year</option>`);
     const [academicYear, setAcademicYear] = useState("");

     useEffect(() => {
         axios.post(`${props.baseURL}/getacademicyearoption`, {
             cid: props.userDetails.cid
        }).then((response) => {
            if(response.data.length > 0) {
                 //console.log(response);
                setAcademicYearOption(response.data);
           }
         });

     },[])

     const [semOption, setSemOption] = useState(`<option> Select Semester </option> `);
     const [sem, setSem] = useState("")

      useEffect(() => {
          axios.post(`${props.baseURL}/getsem`,{
              cid: props.userDetails.cid
          })
            .then((response) => {
               if(response.data.length > 0){
                    //console.log(response)
                    setSemOption(response.data);
                }
            });
      },[])



        const getsubjectlists = (e) => {
            e.preventDefault();
            Navigate("/getsubjectlist", {state: {academicYear,department,sem, cid} });
        }

  return (
    <div className="col-lg-12">
    <div className="card">
        <div className="card-header text-center">
            <strong className="text-center">View Subjects</strong>
        </div>
        <form method="post" onSubmit={getsubjectlists}  className="form-horizontal">
        <div className="card-body card-block">
            
            
            <div className="row form-group">
                    <div className="col col-md-3"><label htmlFor="department" className=" form-control-label">Department</label></div>
                    <div className="col-12 col-md-9">
                        <select required   className="form-control" onChange={e => { setDepartment(e.target.value)}} id="department" dangerouslySetInnerHTML={{ __html: departmentOption }}>
                            
                        </select>
                        <span className="help-block"></span></div>
                </div>
             
                 <div className="row form-group">
                    <div className="col col-md-3"><label htmlFor="academic_year" className=" form-control-label">Academic Year</label></div>
                    <div className="col-12 col-md-9">
                        <select required  className="form-control" id="academic_year" onChange={e => { setAcademicYear(e.target.value)}} dangerouslySetInnerHTML={{ __html: academicYearOption }} >
                        </select>
                    <span className="help-block"></span></div>
                </div> 
                 <div className="row form-group">
                    <div className="col col-md-3"><label htmlFor="hf-password" className=" form-control-label">Sem</label></div>
                    <div className="col-12 col-md-9">
                        <select required name="sem" onChange={e => {setSem(e.target.value)}} id="sem" className="form-control" dangerouslySetInnerHTML={{ __html: semOption }}>
                            
                            
                        </select>
                    <span className="help-block"></span></div>
                </div> 
               
            
        </div>
        <div className="card-footer">
            <center>
             <button type="submit" className="btn btn-primary btn-sm rounded">
                <i className="fa fa-dot-circle-o"></i> Submit
            </button>
           
            </center>
            
        </div>
        </form>
    </div>
 </div>
  )
}

export default SubjectView
