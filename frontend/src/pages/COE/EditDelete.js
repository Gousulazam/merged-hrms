import React from 'react'
import {useState} from "react";
import { useNavigate } from "react-router-dom";
//import { useLocation } from 'react-router-dom';
//import axios from "axios";
//import swal from 'sweetalert';
//import ShowEvent from './ShowEvent';


export const EditDelete = (props) => {
    let move = useNavigate();
    const [semtype, setSemtype] = useState("");
    const [academic_year, setAcademic_year] = useState("");
    const [year, setYear] = useState("");
    
    const showevent = (e) => {
        e.preventDefault();
        move("/showevent", { state: {semtype,academic_year,year} });
    };
   
  return (
    <>
     <div className="container my-3">
            <h3 className="text-center">COE Edit Delete</h3>
            <form onSubmit={showevent}>
                <div className="mb-3">
                    <label htmlFor="semtype" className="form-label">Select Sem Type</label>
                    <select className="form-control" id="semtype" required="d" onChange={e =>{ setSemtype(e.target.value) }}>
                        <option value="">Select Sem type</option>
                        <option value="odd">Odd</option>
                        <option value="even">Even</option>
                    </select>
                        
                </div>
                <div className="mb-3">
                    <label htmlFor="semtype" className="form-label">Select Academic Year</label>
                    <select className="form-control" id="academic_year" required="d" onChange={e =>{ setAcademic_year(e.target.value) }}>
                        <option value="">Select academic year</option>
                        <option value="2021-2022">2021-2022</option>
                        <option value="2020-2021">2020-2021</option>
                    </select>
                        
                </div>
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Select Year</label>
                    <select className="form-control" id="year" required="d" onChange={e =>{ setYear(e.target.value) }} >
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
    </> )
}
