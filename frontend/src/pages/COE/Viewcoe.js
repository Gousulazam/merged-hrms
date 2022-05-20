import { useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';



export const ViewCoe = (props) => {
    let navigate = useNavigate();
    const[dept, setDept]= useState("");
    const[sem, setSem]= useState("");
    const[year, setYear]= useState("");
    const[academicYear, setAcademicYear]= useState("");
const[deptOption, setDeptOption]= useState(`<option value="">Select Department</option>`);
    useEffect(() => {
        axios.post(`${props.baseURL}/departmentoption`, {
            cid: props.userDetails['cid'],
            did: props.userDetails['did'],
            role: props.role,
        })
        .then((response) => {
            setDeptOption(response.data);
            console.log(response.data);
        });
      }, [])

    const submit = (e)=>{
        e.preventDefault();
        navigate("/coeview", { state: {dept, sem, year, academicYear} });
    }
  return (
    <>
     <div className="container my-3">
            <h3 className="text-center">COE</h3>
            <form onSubmit={submit}>
            <div className="mb-3">
            <label>Department</label>
					<select required name="etype" className="form-control" onChange={e =>{ setDept(e.target.value) }}  dangerouslySetInnerHTML={{ __html: deptOption }}>
					</select>
                        
                </div>
                <div className="mb-3">
                    <label htmlFor="semtype" className="form-label">Select Sem Type</label>
                    <select className="form-control" onChange={e =>{ setSem(e.target.value) }}>
                        <option value="">Select Sem type</option>
                        <option value="odd">Odd</option>
                        <option value="even">Even</option>
                    </select>
                        
                </div>

                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Select Academic Year</label>
                    <select className="form-control" onChange={e =>{ setAcademicYear(e.target.value) }}>
                        <option value="">Select Academic Year</option>
                        <option value="2021-2022">2021-2022</option>
                        <option value="2020-2021">2020-2021</option>
                        <option value="2019-2021">2019-2020</option>
                       
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Select Year</label>
                    <select className="form-control" onChange={e =>{ setYear(e.target.value) }}>
                        <option value="">Select Year</option>
                        <option value="1">Basic Science</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>
               
               <button type="submit" className="btn btn-sm btn-success">Submit</button>
            </form>
        </div>
    </>
  )
}
