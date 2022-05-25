import { useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
export const Addevntdetails = (props) => {
  let did;
    const { state } = useLocation();
    const [academic_year, setAcademic_Year] = useState([]);
  const[etype, setEtype] = useState("");
  const[title, setTitle] = useState("");
  const[description, setDescription] = useState("");
  const[startDate, setStartDate] = useState(state.sdate);
  const[endDate, setEndDate] = useState("");
  if(props.role == 'Principal'){
    did='all';
  }else{
    did=props.userDetails['did'];
  }
 //console.log(props.userDetails['did']);
    const [eventOption, setEventOption] = useState(`<option value="">Select Event Type</option>`);
//startDate = setStartDate(state.sdate);
useEffect(() => {
  axios.post(`${props.baseURL}/getcurrentacademicyear`, {
      cid: props.userDetails['cid'],
  })
  .then((response) => {
      setAcademic_Year(response.data[0]);
      console.log(response.data[0])
  });
}, [])


    useEffect(() => {
      axios.post(`${props.baseURL}/getevents`, {
        cid: props.userDetails['cid'],
        role: props.role,
    })
          .then((response) => {
              if (response.data.length > 0) {
                  setEventOption(response.data);
                  console.log(response.data)
              }
          });
  }, [])
  
//console.log(state.sem);
  const add = (e) =>{
    e.preventDefault();
    //alert(etype+title+description+startDate+endDate);
   
      axios.post(`${props.baseURL}/addeventdetail`, {
        title: title,
        descp: description,
        start: startDate,
        end: endDate,
        etype:etype,
        sem: state.sem, 
        year: state.year,
        academic_year: academic_year['academic_year'],
        cid : props.userDetails['cid'],
        did: did,
        status: '0',
        user_id: props.userDetails['id']

    })
     .then((response) => {
              if (response.data == '1') {
                swal("Added Successfully","", "success");
              } else{
                 swal("fail to Add","", "warning");
            }                           
          });
  
  }
  
   let i=0;
  return (
    <>
    <form className="forms-sample" onSubmit={add} > 
    
				<label>Event Type</label>
					<select required name="etype" className="form-control" onChange={e =>{ setEtype(e.target.value) }}  dangerouslySetInnerHTML={{ __html: eventOption }}>
					</select>
							
					<br/>
          <label>Event Title</label>
				<input required type="text" className="form-control title" name="title" value={title} onChange={e =>{ setTitle(e.target.value) }} placeholder="Enter Event Title" />
				<br/>
        <label>Event Description</label>
				<input type="text" className="form-control dis" name="dis" value={description} onChange={e =>{ setDescription(e.target.value) }} placeholder="Enter description" />
				<br/>
        <label>Start Date</label>
				<input readOnly className="form-control sdate" name="sdate" value={startDate} placeholder={state.sdate} />
				<br/>
        <label>End Date</label>
				<input className="form-control  edate" name="edate" value={endDate} onChange={e =>{ setEndDate(e.target.value) }} placeholder="Enter To Date"/>
						<br/>						
                   <center>
                    <button type="submit" className="btn btn-outline-success mr-2 rounded">Submit</button>
                    {/* <button className="btn btn-outline-danger rounded" type="reset">Cancel</button> */}
					</center>
                  </form>
                 
    </>
  )
}
