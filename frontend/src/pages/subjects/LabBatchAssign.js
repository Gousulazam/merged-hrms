import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const LabBatchAssign = (props) => {
    let Navigate = useNavigate();

    const [departmentOption , setDepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [department , setDepartment] = useState("")
    const [cid, setCid] = useState({cid: props.userDetails.cid})
    const [dv, setDv] = useState('')

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
              cid: props.userDetails.cid,   
          })
            .then((response) => {
               if(response.data.length > 0){
                    //console.log(response)
                    setSemOption(response.data);
                }
            });
      },[])



        const getsubjectsasgn = (e) => {
            e.preventDefault();
            Navigate("/labbasgn1", {state: {academicYear,department, dv,sem, cid} });
        }

  return (
    <div className="col-lg-12">
    <div className="card">
        <div className="card-header text-center">
            <strong className="text-center">View Students</strong>
        </div>
        <form method="post" onSubmit={getsubjectsasgn}  className="form-horizontal">
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
                <div className="row form-group">
                    <div className="col col-md-3"><label htmlFor="hf-password" className=" form-control-label">Division</label></div>
                    <div className="col-12 col-md-9">
                        <select name="division" className="form-control" >
                            <option value="">Select Division</option>
                            <option>A</option>
                            <option>B</option>
                            <option>P1</option>
                            <option>P2</option>
                            <option>C1</option>
                            <option>C2</option>
                            
                        </select>
                    <span className="help-block"></span></div>
                </div>
            
        </div>
        <div className="card-footer">
            <center>
             <button type="submit" className="btn btn-primary btn-sm rounded">
                <i className="fa fa-dot-circle-o"></i> Submit
            </button>
            <button type="reset" className="btn btn-danger btn-sm rounded">
                <i className="fa fa-ban"></i> Reset
            </button>
            </center>
            
        </div>
        </form>
    </div>
 </div>
  )
}

export default LabBatchAssign
