import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const Edit = (props) => {
    let navigate = useNavigate();
    const { state } = useLocation();
    const [semtype, setSemtype] = useState("");
    const [subject, setSubject] = useState("");
   
    const [internal, setInternal] = useState("");
   
    const [subjectOption, setSubjectOption] = useState("");   
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

    const editqp = (e) => {
        e.preventDefault();
        console.log(semtype);
        navigate("/editqp", { state: {academicyear,semtype,subject,internal} });
    };


  return (
    <>
    <div className="container my-3">
           <h3 className="text-center">Edit/Delete Question Paper</h3>
           <form onSubmit={editqp}>
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
              
               <div className="text-center">
             <span><button type="submit" className="btn btn-success round">Submit</button></span>
             
             </div>
           </form>
       </div>
   </>
  )
}
