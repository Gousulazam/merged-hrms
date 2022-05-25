import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';



export default function AddEvent(props) {
let mystyle={  
    // 'color': red,
};

let content ={
    // 'text-align' : center,
    // 'color':white,
    // 'font-weight':bold,
};



  const { state } = useLocation();
   const [academic_year, setAcademic_Year] = useState([]);
  let sem = state.sem;
  let year = state.year;
 // const{sem} = useParams();
   
   useEffect(() => {
    axios.post(`${props.baseURL}/getcurrentacademicyear`, {
        cid: props.userDetails['cid'],
    })
    .then((response) => {
        setAcademic_Year(response.data[0]);
        console.log(response.data[0])
    });
  }, [])
    // set states of calendar date
    let navigate = useNavigate();
    const add =(newDate) => {
      //calDate.preventDefault();
        // change results based on calendar date click
       
console.log(newDate);
      //alert(calDate);
      let sdate;
      var date = newDate,
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      sdate = [date.getFullYear(), mnth, day].join("-");
      console.log(sdate);
     
     // console.log(sem+year);
      navigate("/addevntdetails", { state: {sdate, sem, year} });    
    }
//console.log(props.role);
    const freeze =(e)=>{
        e.preventDefault();

        axios.post(`${props.baseURL}/chkevents`, {
          sem: state.sem, 
          year: state.year,
          academic_year: academic_year['academic_year'],
          cid : props.userDetails['cid'],
          role: props.role,
          did : props.userDetails['did'],
  
      })
       .then((response) => {
                if (response.data == '1') {
                  swal("Freezed Successfully","", "success");
                } else{
                   swal(response.data, "Not Add", "warning");
                   console.log(response.data);
              }                           
            });

    }
    
    return (
      <>
  
      
      <center>
        <div className="result-calendar">
          <div className="calendar-container">
            <Calendar onChange={add}  />
            </div>
        </div>
        <br/>
        <button className="btn btn-primary" onClick={freeze}>Freeze</button>
        </center>
        </>
    )

}