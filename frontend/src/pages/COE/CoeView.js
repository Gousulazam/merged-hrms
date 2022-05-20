import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";



export default function CoeView(props) {
  const { state } = useLocation();
   
  let sem = state.sem;
  let year = state.year;
  let academic_year = state.academicYear;
  let dept = state.dept;
 // const{sem} = useParams();
   
   
    // set states of calendar date
    let navigate = useNavigate();
    

   
    
    return (
      <>
      
        <Link to={`/coeprint/${sem}/${year}/${academic_year}/${dept}`}>Click Here to Take Print</Link>
      
      <center>
        <div className="result-calendar">
          <div className="calendar-container">
            <Calendar  />
            </div>
        </div>
        <br/>
        
        </center>
        </>
    )

}