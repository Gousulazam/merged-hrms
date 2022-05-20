import {  useState } from "react";
import { useNavigate } from "react-router-dom";

export const Headers = () => {
    let navigate = useNavigate();
    const [academicYear, setAcademicYear] = useState("");
const submit = (e) =>{
    e.preventDefault();
    navigate("/addheader", { state: {academicYear} });
}
  return (
    <div>
         <form onSubmit={submit}>
<div className="row">

<div className="col-sm-12">
<div className="card">  
<div className="card-header">
<center><strong className="card-title">ADD HEADER  </strong></center>
</div>
<div className="card-body">

<label>Academic Year:</label>
<select id="acd_year" name="acd_year" className="form-control" required onChange={e =>{ setAcademicYear(e.target.value) }}>
    <option>Select Academic Year</option>
    <option value="2021-2022">2021-2022</option>
    <option value="2020-2021">2020-2021</option>
	<option value="2019-2020">2019-2020</option>	
	</select>
	<br/>

</div>
<div className="card-footer">
<center> <button type="submit" className="btn btn-primary mr-3 rounded" id="subm" name="Subm">Submit</button></center>
</div>

</div>
</div>

</div>
</form>

	

    </div>
  )
}
