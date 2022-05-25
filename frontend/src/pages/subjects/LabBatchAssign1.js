import React, {useState,useEffect, useRef} from 'react';
import { useLocation ,useParams} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';


const LabBatchAssign1 = (props) => {
    const {state} = useLocation();
    const [studentList, setStudentList] = useState([]); 
    const [cllgDetails, setCllgDetails] = useState("")
    const [studentid, setStudentId] = useState("")

    //const { student_id } = useParams();
   
    //const [tbody, setTbody] = useState("");
//     const getdt=(did,usn,id)=>{
        
        
//         if(did===6 && usn!=''){
//             return(usn)
            
//         }
//         else if(did!=6 && usn!=''){
//             return(usn)
//         }
//         else{

//             return (id)
//                    }
        
// }




    useEffect(() => {
        axios.post(`${props.baseURL}/getdepartmentdetailbyid`, {
            cid : state.cid
        }).then((response) => {
           setCllgDetails(response.data[0]);
        });
    },[])

    const [subjectOption, setSubjectOption] = useState(`<option value="">Select Subjects</option>`)
    const [subject, setSubject] = useState()

    const [batchOption, setBatchOption] = useState(`<option value="">Select Batches</option>`)
    const [btch, setBatch] = useState()

    useEffect(() => {
        axios.post(`${props.baseURL}/getbatchoption`,{
            academic_year : state.academicYear,
            dept: state.department,
            sem : state.sem,
            cid :state.cid.cid,
            //did : state.did,
            dv: state.dv
        }).then((response) => {
            //console.log(response.data);
            setSubjectOption(response.data)
        })
    },[])

    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectwisestudentlist/`, {
            academic_year : state.academicYear,
            dept: state.department,
            sem : state.sem, 
            cid :state.cid.cid,
            did : state.did,
            dv: state.dv
        }).then((response) => {
            setStudentList(response.data)
        })
    },[])

    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectwisebatch`, {
            id : subject,
            academic_year : state.academicYear,
            dept: state.department,
            sem : state.sem, 
            cid :state.cid.cid,
            //did : state.did,
            dv: state.dv,
        }).then((response) => {
            setBatchOption(response.data);
        })
    },[subject])


    // useEffect(() => {
    //     axios.post(`${props.baseURL}/getstudentsid`, {
    //         academic_year : state.academicYear,
    //         dept: state.department,
    //         sem : state.sem, 
    //         cid :state.cid.cid, 
    //     }).then((res) => {
    //         setStudentId(res.data)
    //     })
    // })


        const getdataselect=(e)=>{
            axios.post(`${props.baseURL}/getstudentidbatch`,{
                student_id : e.target.getAttribute('student_id'),
                batch : e.target.value,
                academic_year : state.academicYear,
                did: state.department,
                sem : state.sem, 
                cid :state.cid.cid,
                dv: state.dv,
                scd : subject,

            }).then((res) => {
                if(res.data == 1){
                    //if(e.target.value != btch){
                        swal("batch updated successfully....")
                    } 
                   else {
                        alert("Already assigned with  batch!!")
                    }
                 console.log(res.data)
            })
           // alert(e.target.value+"--"+e.target.getAttribute('student_id'))
        }




  return (
    <div className="card">
    <div className="card-header text-capitalize text-center font-weight-bold">
        <h5>department of {cllgDetails.name}
            <br />
            Semester : {state.sem}
            <br />
            Assign Batch To Students Lab Wise</h5>
    </div>
    <div className="card-body">
        <div className="form-group">
            <label htmlFor="">Subject</label>
            <select className='form-control' id='subject' onChange={e => {setSubject(e.target.value)}} name='lssub'  dangerouslySetInnerHTML={{__html : subjectOption}}>
            
            </select>
        </div>
        <table className='table table-bordered ' style={{width:'100%'}}>
            <thead className="thead-dark text-uppercase">
                <tr className="text-uppercase">
                    <th>sl no</th>
                    <th>Student Id</th>
                    <th>USN</th>
                    <th>Name</th>
                    <th>Batch</th>
                </tr>
            </thead>
            <tbody >
                {
                    studentList.map((user,index) => (
                        
                        <tr className='text-capitalize'>
                            <td>{index + 1}</td>
                            <td>{user.student_id}</td>
                            <td>{user.usn}</td>
                            <td className='text-lowercase'>{user.name}</td>
                            <td>{<select id='btch' student_id={user.student_id}  onChange={(e)=>{getdataselect(e)}} className='form-control ' value={e => {setBatch(e.target.value)}} dangerouslySetInnerHTML={{__html : batchOption}} >
                            </select>}</td>
                        </tr> 
                    ))
                }
                  
            </tbody>
        </table>
        <br />
    </div>
</div>
  )
}

export default LabBatchAssign1
