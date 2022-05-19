import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useLocation } from 'react-router-dom';

export default function CoView(props) {
    const { state } = useLocation();
    const [subjectDetails, setSubjectDetails] = useState([])
    const [tbody, setTbody] = useState([])
    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectdetailbyid`, {
            id: state.subject
        })
            .then((response) => {
                setSubjectDetails(response.data);
            });

        axios.post(`${props.baseURL}/getcoadded`, {
            id: state.subject
        })
            .then((response) => {
                setTbody(response.data);
            });

    }, [])

    const associationStyle = {
        fontSize: "17pt",
        textAlign: "center",
        fontFamily: "Cambria",
        color: "#0047b3",
        lineHeight: "50%",
    }

    const p1style = {
        fontSize: "16pt",
        textAlign: "center",
        fontFamily: "Cambria",
        color: "#0047b3",
        lineHeight: "50%"
    }

    const p2style = {
        fontSize: "14pt",
        textAlign: "center",
        fontFamily: "Cambria",
        color: "#cc0000",
        lineHeight: "50%"
    }

    const hrStyle = {
        borderTop: "1px dashed green"
    }

    const imgStyle = {
        width: "40%",
        height: "80px",
    }


    return (
        <div className="card">
            <div className="card-body table-responsive">
                <p style={associationStyle} className="text-uppercase text-center">SECAB‌ ‌Association’s‌</p>
                <div className="row">
                    <div className="col-md-3">
                        <center><img src="https://hrms.secab.org/images/siet.png" alert="No images" style={imgStyle} /></center>
                    </div>
                    <div className="col-md-7">
                        <p style={p1style} className="text-uppercase">{subjectDetails['iname']},</p>
                        <p style={p1style} className="text-uppercase">VIJAYAPUR-586109</p>
                        <p style={p2style} className="text-uppercase">DEPARTMENT OF {subjectDetails['dept']}</p>
                    </div>

                </div>
                <hr style={hrStyle} />
                <h4 className="mt-2 text-center mb-3">Academic Year {state.academicYear}</h4>
                <table className="table table-bordered ">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <td>{subjectDetails['sname']}</td>
                        </tr>
                        <tr>
                            <th>Course Code</th>
                            <td>{subjectDetails['scode']}</td>
                        </tr>
                        <tr>
                            <th>Sem</th>
                            <td>{subjectDetails['sem']}</td>
                        </tr>
                    </thead>
                </table>
                <h5 className="mb-2"><u>Course Outcomes</u></h5>
                <table className="table table-bordered maintable ">
                    <thead className="thead-dark">
                        <tr>
                            <th rowSpan="2" className='text-center align-middle'>Sl No</th>
                            <th rowSpan="2" className='text-center align-middle'>CO Identification No</th>
                            <th className='text-center'>CO Statement</th>
                        </tr>
                        <tr>
                            <th className='text-center'>At the end of the course, the students will be able to</th>
                        </tr>
                    </thead>
                    <tbody id='atten'>
                        {tbody.map((role, i) => {
                            
                            return  <tr key={i}>
                                <td>{i+1}</td>
                                <td>{role.cos}</td>
                                <td>{role.stmt}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}