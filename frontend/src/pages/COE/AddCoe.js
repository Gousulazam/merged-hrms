import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddCoe = () => {
    let navigate = useNavigate();
    const[sem, setSem]= useState("");
    const[year, setYear]= useState("");

    const submit = (e)=>{
        e.preventDefault();
        navigate("/event", { state: {sem, year} });
    }
  return (
    <>
     <div className="container my-3">
            <h3 className="text-center">COE</h3>
            <form onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="semtype" className="form-label">Select Sem Type</label>
                    <select className="form-control" onChange={e =>{ setSem(e.target.value) }}>
                        <option value="">Select Sem type</option>
                        <option value="odd">Odd</option>
                        <option value="even">Even</option>
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
