import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import StudentEditFeeDetails from "./StudentEditFeeDetails";

export default function EditStudentFeedetails(props) {

    const [academicYearOption, setAcademicYearOption] = useState(`<option value="">Select Academic Year</option>`);
    const [academicYear, setAcademicYear] = useState("");
    const [usn, setUsn] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        axios.post(`${props.baseURL}/getacademicyearoption`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setAcademicYearOption(response.data);
                }
            });
    }, [])

    const fetchTranscations = async (e) => {
        e.preventDefault();
        await axios.post(`${props.baseURL}/getfeedetailsforeditfixation`, {
            cid: props.userDetails.cid,
            academicYear: academicYear,
            usn: usn,
        })
            .then((response) => {
                if (response.data.id !=null) {
                    setResult(<StudentEditFeeDetails transaction={response.data} baseURL={props.baseURL} userDetails={props.userDetails} formatDate={props.formatDate} numberWithCommas={props.numberWithCommas} />)
                } else {
                    swal("No Data found", "", "warning");
                    setResult("");
                }
            });
    }

    return (
        <>
            <div className="card">
                <div className="card-header text-center font-weight-bold">EDIT FEE FIXATION</div>
                <form onSubmit={fetchTranscations}>
                    <div className="card-body">
                        <div className="form-group">
                            <label>Academic Year</label>
                            <select className="form-control" required onChange={e => { setAcademicYear(e.target.value) }} dangerouslySetInnerHTML={{ __html: academicYearOption }}>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>USN/Student Id</label>
                            <input required type="text" className="form-control" onChange={e => { setUsn(e.target.value) }} placeholder="Enter USN/Student Id" />
                        </div>
                    </div>
                    <div className="card-footer">
                        <center><button type="submit" className="btn btn-primary btn-sm rounded mr-2">
                            <i className="fa fa-dot-circle-o"></i> Submit
                        </button>
                            <button type="reset" className="btn btn-danger btn-sm rounded" onClick={() => setResult('')}>
                                <i className="fa fa-ban"></i> Reset
                            </button>
                        </center>
                    </div>
                </form>
            </div>
            {result}
        </>
    )
}
