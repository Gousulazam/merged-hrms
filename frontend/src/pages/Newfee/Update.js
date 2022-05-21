import {  useState } from "react";
import { useNavigate } from "react-router-dom";

export const Update = () => {
    let navigate = useNavigate();
    const [usn, setUsn] = useState("");
const submit = (e) =>{
    e.preventDefault();
    navigate("/transaction", { state: {usn} });
}
  return (
    <div>
         <form onSubmit={submit}>
<div className="row">

<div className="col-sm-12">
<div className="card">  
<div className="card-header">
<center><strong className="card-title">PAY FEE  </strong></center>
</div>
<div className="card-body">

<label>USN</label>
<input type="text" className="form-control" name="usn" id="usn" onChange={e =>{ setUsn(e.target.value) }}/>
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
