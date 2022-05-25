import React,{useEffect,useState} from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate} from 'react-router-dom';

 const SubjectAdd = (props) => {
          let Navigate = useNavigate();

    const [departmentOption, setDepartmentOption] = useState(`<option> Select Department </opyion>`);
    const [dept,setDept] = useState('')
    const [cllgDetails, setCllgDetails] = useState("")
    const [academicY, setAcademicY] = useState("")
    const [table, setTable] = useState('');
     

    useEffect(() => {
      axios.post(`${props.baseURL}/getdepartmentoption`, {
          cid: props.userDetails.cid,
          id: props.userDetails.did,
      }).then((res) => {
          if(res.data.length > 0 ){
            setDepartmentOption(res.data);
          }
      })
    },[])

    useEffect(() => {
        axios.post(`${props.baseURL}/getdepartmentdetailbyid`, {
            cid : props.userDetails.cid
        }).then((response) => {
           setCllgDetails(response.data[0]);
        });
    },[])
    

       const [academicOption, setAcademicOption] = useState(`<option value="">Select Academic Year</option> `);
       const [academic_year, setAcademic_year] = useState("");

       useEffect(() => {
           axios.post(`${props.baseURL}/getacademicyearoption`, {
               cid: props.userDetails.cid
           }).then((response) => {
               if(response.data.length > 0){
                   //console.log(response.data);
                   setAcademicOption(response.data);
               }
           })
       },[])

       const [semOption, setSemOption] = useState(`<option> Select Semester </option> `);
     const [sem, setSem] = useState("")

      useEffect(() => {
          axios.post(`${props.baseURL}/getSemNew`,{
              cid: props.userDetails.cid,
              did : dept,
          })
            .then((response) => {
               if(response.data.length > 0){
                    setSemOption(response.data);
                }
            });
      },[dept])

      const [sname, setSname] = useState("")
      const [scode,setScode ] = useState("")
      //const [evenodd, setEvenodd] = useState("")
      const [stype, setStype] = useState("")
      const [academic_type, setAcademic_type] = useState("")
      const [dv , setDv] = useState("")

    
      const submitData = (e) => {
          e.preventDefault();
          axios.post(`${props.baseURL}/addsubjects`,{
            academic_year: academic_year,
              dept: dept,
              sname : sname,
              scode : scode,
              //evenodd : evenodd,
              sem :sem,
              stype: stype,
              academic_type: academic_type,
              dv : dv,
              cid : props.userDetails.cid
          }).then((response) => {
             if(response.data[0].length > 0){ 
                  swal('This subject is already added... ');
             }  else {
                 swal('subject added successfully !!!');
             } 
          });
      }

      
      useEffect(() => {
          axios.post(`${props.baseURL}/getDbAcademicYear`,{
            cid: props.userDetails.cid
          }).then((response) => {
              setAcademicY(response.data[0]);
          })
      },[])


        
      useEffect(() => {
          axios.post(`${props.baseURL}/getsemesterwisesubjtable`,{
            cid: props.userDetails.cid,
            did : props.userDetails.did,
            academic_year : academicY.academicYear,
            //sem : sem,
          }).then((res) => {
              setTable(res.data);
          })
      },[academicY])

     const save = () => {
            alert('All subjects Saved')
     }

      const freeze = () => {
          axios.post(`${props.baseURL}/freezeSubject`,{
            did : props.userDetails.did,
            academic_year : academicY.academicYear,
          }).then((res) => {
              if(res.data.length >= 0){
                  swal('Freezed Successfully')
              } else {
                  alert('Failed...!')
              }
              console.log(res)

          })
      }

      const generate = (e) => {
          e.preventDefault();
          Navigate("/generatesubjects", {state: {sem, academicY, dept, academic_year}});

      }


     const [status, setStatus] = useState(false)
    // console.log(status)
    //setStatus(true)
    
       


  return (
    <div className="row">
    <div className="col-lg-1"></div>
    <div className="col-10">
        <form  method="post" onSubmit={submitData} >
            <div className="card">
                <div className="card-header bg-info text-center" >
                    <strong>Add New Subject </strong>
                </div>
                <div className="card-body card-block">
                    <h3 className="text-center mb-2">Department of {cllgDetails.name} </h3>

                    <div className="form-group">
                        <label htmlFor="academic_year" className="form-control-label font-weight-bold">Select Academic Year</label>
                        <select required name="academic_year" id="academic_year" onChange={e => {setAcademic_year(e.target.value)}} className="form-control" dangerouslySetInnerHTML={{ __html: academicOption}}>
                        </select>
                    </div>
                   
                        <div className="form-group">
                            <label htmlFor="dept" className="form-control-label font-weight-bold">Select Department</label>
                            <select required name="dept" id="dept" onChange={e => {setDept(e.target.value)}} className="form-control" dangerouslySetInnerHTML={{ __html: departmentOption}}>
                            </select>
                        </div>
                   

                    <div className="row form-group">
                        <div className="form-group col col-md-6">
                            <label htmlFor="sname" className="form-control-label font-weight-bold">Subject Name</label>
                            <input required type="text" id="sname" name="sname" placeholder="Enter subject Name" className="form-control" onChange={e => {setSname(e.target.value)}}/>
                        </div>
                        <div className="form-group col col-md-6">
                            <label htmlFor="scode" className="form-control-label font-weight-bold">Subject Code</label>
                            <input required type="text" id="scode" name="scode" placeholder="Enter subject Code" className="form-control"  onChange={e => {setScode(e.target.value)}}/>
                        </div>
                    </div>
                    <div className="row form-group">
                         <div className="form-group col col-md-6" onChange={onclick}  >
                        <label htmlFor="dv" className="form-control-label font-weight-bold">Select Division</label>
                        <select  className="form-control" id="dv" name="dv" onChange={e => {setDv(e.target.value)}}  >
                            <option value=''>Select Division</option>
                            <option value='P1'>P</option>
                            <option value='C'>C</option>
                        </select>
                        </div> 
                        <div className="form-group col col-md-6">
                            <label htmlFor="sem" className="form-control-label font-weight-bold">Select Semester</label>
                            <select required name="sem" id="sem" onChange={e => {setSem(e.target.value)}}  className="form-control" dangerouslySetInnerHTML={{ __html: semOption }}>
                            </select>
                        </div>
                    </div>
                    {/* <div className="row form-group col col-md-4 text-center" id="division">
                    <label htmlFor="evenodd" className="form-control-label font-weight-bold">Select Academic Year (Odd/Even)</label>
                            <select  name="evenodd" id="evenodd" className=" form-control"  onChange={e => {setEvenodd(e.target.value)}}>
                                <option value="">Select Academic Year</option>
                                <option value="1">Odd</option>
                                <option value="0">Even</option>
                            </select>
                    </div> */}
                    <div className="row form-group">
                        <div className="form-group col col-md-6">
                            <label htmlFor="stype" className="form-control-label font-weight-bold">Select Subject Type (Theory/Lab)</label>
                            <select required className="form-control" id="stype" name="stype"  onChange={e => {setStype(e.target.value)}}>
                                <option value="">Select Subject Type</option>
                                <option value="theory">Theory</option>
                                <option value="lab">Lab</option>
                            </select>
                        </div>
                        <div className="form-group col col-md-6">
                            <label htmlFor="academic_type" className="form-control-label font-weight-bold">Select Academic Type (Regular/Parallel)</label>
                            <select required className="form-control" id="academic_type" name="academic_type"  onChange={e => {setAcademic_type(e.target.value)}}  >
                                <option value="">Select Academic Type</option>
                                <option value="regular">Regular</option>
                                <option value="parallel">Parallel</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group col-12 text-center">
                        {/* <div className="col-md-3" id="units">
                        
                            { 
                        status? 
                        <><label for="street" class="form-control-label font-weight-bold">Subject Units</label>
                        <input required type="number"  value="8" id="subjectUnit" name="subjectUnit" placeholder="Enter subject Unit" class="form-control"/></>:null
                            }
                            
                        </div> */}
                    </div>
                    </div>
      
                  <div>

                </div>
                <div className="card-footer text-center">
                    <button type="submit"  className="btn btn-primary btn-sm rounded mr-2" ><i className="fa fa-dot-circle-o"></i> Submit</button>
                    <button type="reset" className="btn btn-danger btn-sm rounded"><i className="fa fa-ban"></i> Reset</button>
                </div>
            </div>
        </form>

        
    </div>
          

    <div className="col-12">
    <form  method="post" >
            <div className="card">
                
            <div className="card-body card-block col-lg-12">
    <h3 className="text-center mb-2">
        Department of  {cllgDetails.name}, Academic Year {academicY.academicYear}
    </h3>
             
              
        <div className="card"  dangerouslySetInnerHTML={{__html : table}}>
            {/* <div className="card-header"> 
                <strong className="card-title" dangerouslySetInnerHTML={{__html : tsm}}> </strong>
            </div>
            <div className="card-body table-responsive">
                <table className="table table-bordered ">
                     <thead className="thead-dark">
                        <tr>
                            <th>Sl No</th>
                            <th>Subject Name</th>
                            <th>Subject Code</th>
                            <th>Subject Type</th>
                            <th>Division</th>
                            <th>Units</th>
                            <th>HOD Status</th>
                            <th>Principal Status</th>
                            <th>Subject Academic Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                             {stdlist.map((user,index) => (
                                 <tr className='text-capitalize'>
                                 <td>{index + 1}</td>
                                 <td>{user.sname}</td>
                                 <td>{user.scode}</td>
                                 <td>{user.stype}</td>
                                 <td>{user.dv}</td>
                                 <td>{user.punit}</td>
                                 <td>{user.hodApprove}</td>
                                 <td>{user.PrincipalApprove}</td>
                                 <td>{user.academic_type}</td>
                                  <td>{user.freeze}</td>
                                 </tr>
                             ))}
                  </tbody> 
                   
                </table>
            </div> */}
        </div>

        <div className="card-footer text-center mb-5">
    <button type="button" className="btn btn-success float-left rounded" onClick={save}><i className="fa fa-dot-circle-o"></i> Save</button>
    <button type="button" className="btn btn-info rounded" onClick={freeze}><i className="fa fa-ban"></i> Freeze</button>
    <button type="button" className="btn btn-primary float-right rounded" onClick={generate} ><i className="fa fa-"></i> Generate</button>
</div>
    
</div>
                    </div>
                    </form>
    </div>
                    
</div> 

           


  )
}



export default SubjectAdd
