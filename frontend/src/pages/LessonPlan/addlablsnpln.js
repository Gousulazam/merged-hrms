import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Addlablsnpln = (props) => {
    let navigate = useNavigate();
    const [semtype, setSemtype] = useState("");
    const [subject, setSubject] = useState("");
    const [subjectOption, setSubjectOption] = useState(`<option value="">Select Subject</option>`);
    const [academicyear, setAcademicYear] = useState([]);

useEffect(() => {
    axios.post(`${props.baseURL}/getcurrentacademicyear`, {
        cid: props.userDetails['cid'],
    })
    .then((response) => {
        setAcademicYear(response.data[0]);
        console.log(response.data[0])
    });
}, [])
let academicYear  = academicyear['academic_year'];
    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectoptionbyfidandacademicyear`, {
            fid: props.userDetails.id,
            semType:semtype,
            academicYear:academicYear,
            stype:"lab"
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setSubjectOption(response.data);
                }
            });
    }, [semtype])

    const lablsnplnAdd = (e) => {
        e.preventDefault();
        navigate("/addlablsnpln", { state: {academicYear,subject,semtype} });
    };


  return (
    <>
    <div className="container my-3">
           <h3 className="text-center">Add Lab Lesson Plan</h3>
           <form onSubmit={lablsnplnAdd}>
               <div className="mb-3">
                   <label htmlFor="semtype" className="form-label">Sem Type</label>
                   <select className="form-control" id="semtype" name="semtype" onChange={e =>{ setSemtype(e.target.value) }}>
                       <option value="">Select Sem type</option>
                       <option value="1">Odd</option>
                       <option value="0">Even</option>
                   </select>
                       
               </div>
               <div className="mb-3">
                   <label htmlFor="year" className="form-label">Subject</label>
                   <select  name="subject" id="subject" className="form-control" onChange={e =>{ setSubject(e.target.value) }} required="" dangerouslySetInnerHTML={{ __html: subjectOption }}>
                        </select>
               </div>
             <button type="submit" className="btn btn-sm btn-success">Submit</button>
           </form>
       </div>
   </>
  )
}
