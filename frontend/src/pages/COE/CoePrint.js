import React from 'react'
import { useLocation, useParams} from 'react-router-dom';

export const CoePrint = (props) => {
  const { state } = useLocation();
//  let sem = state.sem;
const{sem} = useParams();
const{year} = useParams();
const{academic_year} = useParams();
const{dept} = useParams();
//console.log(sem+year);
  return (
    <>     
     <div>
    <center>
    <p>SIET</p>
		<p>{sem} SEMESTER CALENDAR OF EVENTS FOR {year} YEAR STUDENTS</p>
    </center>
		</div>
    
     <div className="card-body card-block" >
        
		<table className="table table-bordered table-striped" >
					<thead >
					<tr >
					<th rowSpan='2'>Week No.</th>
					<th rowSpan='2' >Month</th>
					<th colSpan='7' >Week days</th>
					<th rowSpan='2' >No of Working days</th>
					<th rowSpan='2' >Events</th>				
					</tr>
					<tr >
					<th>Mon</th>
					<th>Tue</th>
					<th>Wed</th>
					<th>Thu</th>
					<th>Fri</th>				
					<th>Sat</th>	
					<th>Sun</th>	
					</tr>
					</thead>
					<tbody>
					
</tbody>
</table>
<table className="table table-bordered table-striped"  >
  <thead>
<tr><th >Total No. Of Working Days : --</th><th ></th><th>Department should include the following in their calendar of events</th></tr>
<tr><th>No. of Holidays : --</th><th ></th><td>1) Colloquiums</td></tr>
<tr><td></td><td></td><td>2) Industrial Visits</td></tr>
<tr><td>GH-Government Holidays</td><td></td><td>3) Guest Lectures</td></tr>			
<tr><td></td><td></td><td>4)Seminars</td></tr>
<tr><td></td><td></td><td>5) Workshops</td></tr>
<tr><td></td><td></td><td>6) Lab internals, Assignment Submission Date of students.</td></tr>
<tr><th colSpan='3'>NOTE: All faculties  should complete the syllabus within stipulated time.</th></tr></thead>

</table> 
        </div> 
        <div className="card-footer">
				<center><button type="submit" className="btn btn-success">Print</button></center>
            </div>
        
    </>
  )
}
