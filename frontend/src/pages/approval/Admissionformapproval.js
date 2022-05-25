import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admissionformapproval = (props) => {
    let navigate = useNavigate();
    const [collegeDetail, setCollegeDetail] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [admitedstudentList, setAdmitedstudentList] = useState([]);

    useEffect(() => {
        axios.post(`${props.baseURL}/getcollegedetailsbyid`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                setCollegeDetail(response.data[0]);
            });

        axios.post(`${props.baseURL}/getDbAcademicYear`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                setAcademicYear(response.data);
            });

        axios.post(`${props.baseURL}/admittedStudentList`, {
            cid: props.userDetails.cid,
            role: props.role
        })
            .then((response) => {
                if (response.data === -1) {
                    alert("Check your Role...!");
                } else {
                    setAdmitedstudentList(response.data);
                }
            });

    }, [])

    const roleWiseHead = (role) => {
        if (role === "Registrar") {
            return <th>Admission Dean</th>
        } else if (role === "VP admin") {
            return <><th>Admission Dean</th><th>Registrar</th></>
        } else if (role === "Principal") {
            return <><th>Admission Dean</th><th>Registrar</th><th>VP admin</th></>
        }
    }

    const studentType = (type, did, quota, academic_type, year) => {
        if (did === 7 || did === 19 || did === 20 || did === 21 || did === 83 || did === 84 || did === 85) {
            return <><td>PG - First Year - {quota}</td></>
        } else if (type === 'regular') {
            return <><td>UG - First Year - {quota}</td></>
        } else if (type === 'lateral') {
            return <><td>UG - Lateral - {quota}</td></>
        } else {
            return <><td>${academic_type + year} Year Change of College - {quota}</td></>
        }
    }

    const roleWisebody = (role, admission_dean,registrar,vp_admin,principal) => {
        var table = '';
        var table1 = '';
        var table2 = '';
        if (role === "Registrar") {
            if (admission_dean === "approved") {
                table = <td className="text-success font-weight-bold text-center">{admission_dean}</td>
            } else {
                table = <td className="text-danger font-weight-bold text-center">{admission_dean}</td>
            }
        }
        else if(role === "VP admin"){
            if (admission_dean === "approved") {
                table = <td className="text-success font-weight-bold text-center">{admission_dean}</td>;
            } else {
                table = <td className="text-danger font-weight-bold text-center">{admission_dean}</td>;
            }
            if (registrar === "approved") {
                table1 = <td className="text-success font-weight-bold text-center">{registrar}</td>;
            } else{
                table1 = <td className="text-danger font-weight-bold text-center">{registrar}</td>;
            }
        }
        else if(role === "VP admin"){
            if (admission_dean === "approved") {
                table = <td className="text-success font-weight-bold text-center">{admission_dean}</td>;
            } else {
                table = <td className="text-danger font-weight-bold text-center">{admission_dean}</td>;
            }
            if (registrar === "approved") {
                table1 = <td className="text-success font-weight-bold text-center">{registrar}</td>;
            } else{
                table1 = <td className="text-danger font-weight-bold text-center">{registrar}</td>;
            }
        }if (role === "Principal") {
            if (admission_dean === "approved") {
                table = <td className="text-success font-weight-bold text-center">{admission_dean}</td>
            } else {
                table = <td className="text-danger font-weight-bold text-center">{admission_dean}</td>
            }

            if (registrar === "approved") {
                table1 = <td className="text-success font-weight-bold text-center">{registrar}</td>
            } else {
                table1 = <td className="text-danger font-weight-bold text-center">{registrar}</td>
            }

            if (vp_admin === "approved") {
                table2 = <td className="text-success font-weight-bold text-center">{vp_admin}</td>
            } else {
                table2 = <td className="text-danger font-weight-bold text-center">{vp_admin}</td>
            }
        }
        return <>{table} {table1} {table2} </> 
    }

    const view = (e) => {
        e.preventDefault();
        navigate("/approveAdmission", { state: {id: e.target.value,role:props.role} });
    };

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h2 align='center' className="text-uppercase">{collegeDetail.iname}
                        <br />
                        admission List of {academicYear.dbacademicYear}
                    </h2>
                    <table className="table table-bordered dataTable">
                        <thead className="thead-dark text-uppercase">
                            <tr>
                                <th rowSpan="2" className="align-middle">sl no</th>
                                <th rowSpan="2" className="align-middle">name</th>
                                <th rowSpan="2" className="align-middle">admission type</th>
                                <th rowSpan="2" className="align-middle">department</th>
                                {
                                    roleWiseHead(props.role)
                                }
                                <th className="text-center">View Form</th>
                            </tr>
                        </thead>
                        <tbody className="text-uppercase">
                            {
                                admitedstudentList.map((student, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        {
                                            studentType(student.type, student.did, student.quota, student.academic_type, student.year)
                                        }
                                        <td>{student.dept}</td>
                                        {
                                            roleWisebody(props.role, student.admission_dean, student.registrar, student.vp_admin,student.principal)
                                        }
                                        <td><button type="button" className="btn btn-primary btn-sm rounded" onClick={view} value={student.id} id="view">View Form</button></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Admissionformapproval