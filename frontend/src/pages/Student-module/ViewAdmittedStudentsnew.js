import React, { useEffect, useState } from 'react'
import Axios from "axios";
import { useLocation } from 'react-router-dom';
import ViewAdmittedStudentList from './ViewAdmittedStudentList';

const ViewAdmittedStudentsnew = (props) => {

    const [studentInfo, setStudentInfo] = useState()

    const [academicYearOption, setAcademicYearOption] = useState(`<option value="">Select Academic Year</option>`);
    const [academicYear, setAcademicYear] = useState("")
    useEffect(() => {
        Axios.post(`${props.baseURL}/getacademicyearoption`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setAcademicYearOption(response.data);
                }
            });
    }, [])

    const getstudent = (e) => {
        e.preventDefault();
        Axios.post(`${props.baseURL}/getadmittedstudent`, {
            academicYear,
            cid: props.userDetails.cid,
            role: props.role
        })
            .then((response) => {
                setStudentInfo(<ViewAdmittedStudentList data={response.data} baseURL={props.baseURL} userDetails={props.userDetails}/>);
            });
    };

    return (
        <div>
            <div className="animated fadeIn mt-3">
                <div className="table-responsive">
                    <div className="card">
                        <div className="card-header text-center">
                            <h4 className="card-title" align='center'>Admission Student List</h4>
                        </div>
                        <div className="card-body">
                            <form method="post" onSubmit={getstudent} className="form-horizontal">
                                <div className="form-group">
                                    <label htmlFor="exampleInputUsername1" className="card-description text-uppercase">Academic Year</label>
                                    <select className="form-control" name="academic_year" required="" onChange={e => { setAcademicYear(e.target.value) }} id="academic_year" dangerouslySetInnerHTML={{ __html: academicYearOption }}>
                                    </select>
                                </div>
                                <div className="form-group text-center">
                                    <button type="submit" className="btn btn-outline-success mr-2 submit">Submit</button>
                                    <button type="reset" className="btn btn-outline-danger cancel">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <br />
                    {studentInfo}
                </div>
            </div>
        </div>
    )
}

export default ViewAdmittedStudentsnew
