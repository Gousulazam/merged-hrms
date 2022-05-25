import React ,{useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentInternalR = (props) => {
    let Navigate = useNavigate();

    const [departmentOption , setDepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [department , setDepartment] = useState("")
    const [semOption, setSemOption] = useState(`<option> Select Semester </option> `);
    const [sem, setSem] = useState("")
    const [internalOption , setInternalOption] = useState(`<option> Select Internal</option>`)
    const [ia, setIA] = useState("")
    const [academicOption, setAcademicOption] = useState(`<option value="">Select Academic Year</option> `);
    const [academic_year, setAcademic_year] = useState("");

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

      useEffect(() => {
          //e.preventDefault();
        axios.post(`${props.baseURL}/getinternal`,{
            cid: props.userDetails.cid,  
        })
          .then((response) => {
             if(response.data.length > 0){
                  //console.log(response.data)
                  setInternalOption(response.data);
              }
          });
    },[])

    

    useEffect(() => {
        axios.post(`${props.baseURL}/getDbAcademicYear2`, {
            cid: props.userDetails.cid
        }).then((response) => {
            if(response.data.length > 0){
                //console.log(response.data);
                setAcademicOption(response.data);
            }
        })
    },[])


    const getidetail = (e) => {
        e.preventDefault();
        Navigate("/internalrept1", {state: {department,sem,ia,academic_year} });
    }


  return (
    
     <div className='row'>
<div className="col-xs-3 col-sm-3"></div>
<div className="col-xs-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <center><strong>Student Internal Report</strong> </center>
                            </div>
			       <form  method='post' onSubmit={getidetail}>
                            <div className="card-body card-block">  

				
		                           <div className="form-group">
                                     <div className="input-group">
				      <div className='input-group-addon'><i className='fa fa-th-list'></i></div>
                      <select required   className="form-control" onChange={e => { setDepartment(e.target.value)}} id="department" dangerouslySetInnerHTML={{ __html: departmentOption }}>
                            
                            </select>	                      
                                    </div>                                  
                                </div>
				
				<div className="form-group">
                                     <div className="input-group">
				      <div className='input-group-addon'><i className='fa fa-th-list'></i></div>
                      <select required name="sem" onChange={e => {setSem(e.target.value)}} id="sem" className="form-control" dangerouslySetInnerHTML={{ __html: semOption }}>
                            
                            
                            </select>	                      
                                    </div>                                  
                                </div>

                                <div className="form-group">
                                <div className="input-group">
                                <div className='input-group-addon'><i className='fa fa-th-list'></i></div>
                        <select  name="academic_year" id="academic_year" onChange={e => {setAcademic_year(e.target.value)}} className="form-control" dangerouslySetInnerHTML={{ __html: academicOption}}>
                         
                           
                        </select>
                    </div>
                    </div>
                   
				{/* <div className="form-group" id='dvhide'>
                                     <div className="input-group">
                                       <div className="input-group-addon"><i className="fa fa-th-list" style='color:#6DAB3C'></i></div>
                                       <select className="form-control" id="dv" name="dv">
                                          
                                       <option value=''>Select Division </option>
				       
				
                                       </select>
                                    </div>                                  
                                </div> */}
								<div className='input-group'>
            <div className='input-group-addon' style={{backgroundcolor:'white'}}>
			<i className='fa fa-th' style={{color:'#6DAB3C', ariahidden:'true'}}></i></div>
            <select required  className='form-control' id='ia' name='ia' onChange={e => {setIA(e.target.value)}} dangerouslySetInnerHTML={{__html : internalOption}}>
            
            </select></div>  
                            </div>
			    
<div className="card-footer">
<div className="form-group"><div className="input-group"><button type="submit" className="btn btn-success btn-sm" id="report" name="report">Submit</button>
                         
                        </div></div>
						      </div>
						      </form>
                        </div>
                    </div>
		    </div>
		    
		    
    
  )
}

export default StudentInternalR
