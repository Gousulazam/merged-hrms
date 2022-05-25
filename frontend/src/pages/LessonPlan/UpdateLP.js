import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const UpdateLP = (props) => {
    let navigate = useNavigate();
    const { state } = useLocation();
    const [semtype, setSemtype] = useState("");
    const [subject, setSubject] = useState("");
    const [module, setModule] = useState("");
    const [subjectOption, setSubjectOption] = useState(`<option value="">Select Subject</option>`);
    const [moduleOption, setModuleOption] = useState(`<option value="">Select Module No</option>`);
    const [academicyear, setAcademicYear] = useState([]);
    const [subjectDetails, setSubjectDetails] = useState([]);

useEffect(() => {
    axios.post(`${props.baseURL}/getcurrentacademicyear`, {
        cid: props.userDetails['cid'],
    })
    .then((response) => {
        setAcademicYear(response.data[0]);
        console.log(response.data[0])
    });
}, [])


    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectoptionbyfidandacademicyear`, {
            fid : props.userDetails.id,
            semType : semtype,
            academicYear : academicyear['academic_year'],
            stype : "theory"
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setSubjectOption(response.data);
                    console.log(response.data)
                }
            });
    }, [semtype])

    useEffect(() => {
        axios.post(`${props.baseURL}/getmoduleoption`, {
            fid : props.userDetails.id,
            subject : subject,
            academicYear : academicyear['academic_year'],
            
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setModuleOption(response.data);
                    console.log(response.data)
                }
            });
    }, [subject])

    const updatelsnpln = (e) => {
        e.preventDefault();
        let academicYear = academicyear['academic_year'];
        navigate("/updatelsnpln", { state: {academicYear,subject,module} });
    };


  return (
    <>
    <div className="container my-3">
           <h3 className="text-center">Update Lesson Plan</h3>
           <form onSubmit={updatelsnpln}>
               <div className="mb-3">
                   <label htmlFor="semtype" className="form-label">Sem Type</label>
                   <select required className="form-control" id="semtype" name="semtype" onChange={e =>{ setSemtype(e.target.value) }}>
                       <option value="">Select Sem type</option>
                       <option value="1">Odd</option>
                       <option value="0">Even</option>
                   </select>
                       
               </div>
               <div className="mb-3">
                   <label htmlFor="subject" className="form-label">Subject</label>
                   <select name="subject" id="subject" className="form-control" onChange={e =>{ setSubject(e.target.value) }} required dangerouslySetInnerHTML={{ __html: subjectOption }}>
                        </select>
               </div>
               <div className="mb-3">
                   <label htmlFor="module" className="form-label">Module</label>
                   <select name="module" id="module" className="form-control" onChange={e =>{ setModule(e.target.value) }} required dangerouslySetInnerHTML={{ __html: moduleOption }}>
                        </select>
               </div>
               <div className="text-center">
             <button type="submit" className="btn btn-success">Submit</button>
             </div>
           </form>
       </div>
   </>
  )
}
