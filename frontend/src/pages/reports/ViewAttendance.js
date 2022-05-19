import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function ViewAttendance(props) {
    let navigate = useNavigate();
    const [subjectOption, setSubjectOption] = useState(`<option value="">Select Subject</option>`);
    const [academicYearOption, setAcademicYearOption] = useState(`<option value="">Select Academic Year</option>`);

    const [academicYear, setAcademicYear] = useState("")
    const [subject, setSubject] = useState("")
    const [semType, setSemType] = useState("")
    const [fdate, setFdate] = useState("")
    const viewAttendance = (e) => {
        e.preventDefault();
        navigate("/attendanceview", { state: { academicYear, subject, semType, fdate} });
    };

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

    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectoptionbyfidandacademicyear`, {
            fid: props.userDetails.id,
            semType: semType,
            academicYear: academicYear,
            stype: "theory"
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setSubjectOption(response.data);
                }
            });
    }, [semType])


    return (
        <div className="card">
            <div className="card-header text-center font-weight-bold">View Attendance</div>
            <form onSubmit={viewAttendance}>
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="semtype">Academic Year</label>
                        <select className="form-control" name="academic_year" required="" onChange={e => { setAcademicYear(e.target.value) }} id="academic_year" dangerouslySetInnerHTML={{ __html: academicYearOption }}>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="semtype">Sem Type</label>
                        <select required="" id="semtype" name="semtype" className="form-control" onChange={e => { setSemType(e.target.value) }}>
                            <option value="">Select Sem Type</option>
                            <option value="1">Odd</option>
                            <option value="0">Even</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Subjects</label>
                        <select name="subject" id="subject" className="form-control" onChange={e => { setSubject(e.target.value) }} required="" dangerouslySetInnerHTML={{ __html: subjectOption }}>
                        </select>
                    </div>

                    <div class="form-group">
                        <label htmlFor="">Date</label>
                        <input required type="date" class="form-control" name="fdate" id="fdate" onChange={e => { setFdate(e.target.value) }} aria-describedby="helpId" placeholder="" />
                    </div>
                </div>
                <div className="card-footer">
                    <center><button type="submit" className="btn btn-primary btn-sm rounded mr-2">
                        <i className="fa fa-dot-circle-o"></i> Submit
                    </button>
                        <button type="reset" className="btn btn-danger btn-sm rounded">
                            <i className="fa fa-ban"></i> Reset
                        </button>
                    </center>
                </div>
            </form>
        </div>
    )
}
