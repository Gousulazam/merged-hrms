import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const Questionpaper = (props) => {
    let navigate = useNavigate();
    const { state } = useLocation();
    const [semtype, setSemtype] = useState("");
    const [subject, setSubject] = useState("");
    const [maxmarks, setMaxmarks] = useState("");
    const [internal, setInternal] = useState("");
    const [examdate, setExamdate] = useState("");
    const [subjectOption, setSubjectOption] = useState(`<option value="">Select Subject</option>`);   
    const [academicyear, setAcademicYear] = useState([]);
    





    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectoptionbyfidandacademicyear`, {
            fid : props.userDetails.id,
            semType : semtype,
            academicYear : academicyear,
            stype : "theory"
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setSubjectOption(response.data);
                    console.log(response.data)
                }
            });
    }, [semtype])

   

   

    const addqp = (e) => {
        e.preventDefault();
        console.log(semtype);
        navigate("/addqp", { state: {academicyear,semtype,subject,internal,maxmarks,examdate} });
    };


  return (
    <>
    <div className="container my-3">
           <h3 className="text-center">Add Question Paper</h3>
           <form onSubmit={addqp}>
           <div className="mb-3">
                   <label htmlFor="academic_year" className="form-label">Academic Year</label>
                   <select required className="form-control" id="academic_year" name="academic_year" onChange={e =>{ setAcademicYear(e.target.value) }}>
                       <option value="">Select Academic Year</option>
                       <option value="2021-2022">2021-2022</option>
                       <option value="2020-2021">2020-2021</option>
                   </select>
                       
               </div>
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
                   <label htmlFor="internal" className="form-label">Internal</label>
                   <select name="internal" id="internal" className="form-control" onChange={e =>{ setInternal(e.target.value) }} required >
                   <option value="">Select Internal</option>
                       <option value="I">I</option>
                       <option value="II">II</option>
                       <option value="III">III</option>
                        </select>
               </div>
               <div className="mb-3">
                   <label htmlFor="maxmarks" className="form-label">Maximum Marks</label>
                   <input type="number" name="maxmarks" id="maxmarks" className="form-control" onChange={e =>{ setMaxmarks(e.target.value) }} required />
             </div>
             <div className="mb-3">
                   <label htmlFor="examdate" className="form-label">Exam Date</label>
                   <input type="date" name="examdate" id="examdate" className="form-control" onChange={e =>{ setExamdate(e.target.value) }} required />
             </div>
               <div className="text-center">
             <span><button type="submit" className="btn btn-success round">Submit</button></span>
             
             </div>
           </form>
       </div>
   </>
  )
}
