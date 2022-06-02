import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const GenerateSubject = (props) => {
    const {state} = useLocation();

    const [departmentOption , setDepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [department , setDepartment] = useState("")

    const [dv, setDv] = useState("")

    useEffect(() => {
        axios.post(`${props.baseURL}/getdepartmentoption`,{
            cid: props.userDetails.cid,
            id : props.userDetails.did,   
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


       const recordsubmit = () => {
        //alert(dv)
        axios.post(`${props.baseURL}/subjectgenerate`, {
            cid: props.userDetails.cid, 
            academic_year : academicYear,
            did :department,
            sem :sem,
            dv : dv,
        }).then((res) => {
             if(sem == '' || department === '' || academicYear === ''){
                   alert('kindly select all feilds')
                   
              } else {

                if(res.data == '1'){
                    alert('Failed!!! Records are already generated')
                  } else if(res.data == '2'){
                    alert('generated successfully....')
                  } 

              } 
        })
       }
         

  return (
      <div>
    <div className="col-xs-3 col-sm-3"></div>
    <div className="col-xs-6 col-sm-6">
    
        <div className="card">
            <div className="card-header">
                <center><strong>Generate Subject</strong> </center>
            </div>
            <div className="card-body card-block">	
           

                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-addon"><i className="fa fa-th-list"></i></div>
                        <select   className="form-control" onChange={e => { setDepartment(e.target.value)}} id="department" dangerouslySetInnerHTML={{ __html: departmentOption }}>
                            
                            </select>	
                    </div>                                  
                </div>

                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-addon"><i className="fa fa-th-list"></i></div>
                        <select required  className="form-control" id="academic_year" onChange={e => { setAcademicYear(e.target.value)}} dangerouslySetInnerHTML={{ __html: academicYearOption }} >
                        </select>
                    </div>                                  
                </div>
                <div className="form-group">
                    <div className="input-group">
                    
                        <div className="input-group-addon"><i className="fa fa-th-list"></i></div>
                        <select required name="sem" onChange={e => {setSem(e.target.value)}} id="sem" className="form-control" dangerouslySetInnerHTML={{ __html: semOption }}>
                                
                        </select>
                    </div>                                  
                </div>

                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-addon"><i className="fa fa-th-list"></i></div>
                        <select  required className="form-control" id="dv" name="dv" onChange={e => {setDv(e.target.value)}}>
                            <option value=''>Select Subject Division </option>
                            <option value='A'>A</option>
                            <option value='B'>B</option>
                            <option value='C'>C</option>
                            <option value='P1'>P1</option>
                            <option value='P2'>P2</option>
                            <option value='P3'>P3</option>
                            <option value='C1'>C1</option>
                            <option value='C2'>C2</option>
                            <option value='C3'>C3</option>
                        </select>
                    </div>                                  
                </div>
                <div className="card-footer" style={{textalign:'center'}}>
                    <div className="form-group"><center><div className="input-group"><button type="button"  onClick={recordsubmit} className="btn btn-success btn-sm"  name="subvac" style={{textalign:'center'}}>Submit</button>
				</div></center></div>
                </div>
              
            </div>
        </div>
        
    </div>
    </div>
  )
}

export default GenerateSubject
