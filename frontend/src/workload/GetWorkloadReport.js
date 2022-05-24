import React from 'react'
import { useState, useEffect } from 'react';
import Axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

const GetWorkloadReport = (props) => {
    let navigate = useNavigate();

    const [academicYearOption, setAcademicYearOption] = useState(`<option value="">Select Academic Year</option>`);
    const [academicYear, setAcademicYear] = useState("")
    const [departmentOption, setDepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [department, setDepartment] = useState(props.userDetails.did)
    const [semType, setSemType] = useState("")

    useEffect(() => {
        Axios.post(`${props.baseURL}/getacademicyearoption`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setAcademicYearOption(response.data);
                }
            });

        Axios.post(`${props.baseURL}/getacademicdepartmentoption`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setDepartmentOption(response.data);
                }
            });
    }, [])

    const getWorkLoadReport = (e) => {
        e.preventDefault();
        navigate("/WorkLoadReport", { state: { academicYear, department, cid: props.userDetails.cid,semType:semType } });
    };

    return (
        <div className="col-8">
            <div className="card">
                <form onSubmit={getWorkLoadReport} className="form-horizontal">
                    <div className="card-header text-center">
                        <strong>Get Work Load Report</strong>
                    </div>
                    <div className="card-body card-block">
                        {
                            props.role === "Principal" ?
                                <div className="row form-group">
                                    <div className="col col-md-3">
                                        <label htmlFor="hf-password" className=" form-control-label">Select Department</label>
                                    </div>
                                    <div className="col-12 col-md-9">
                                        <select type="text" className="form-control" id="did" name='did' required onChange={e => { setDepartment(e.target.value) }} dangerouslySetInnerHTML={{ __html: departmentOption }}>
                                        </select>
                                    </div>
                                </div>
                                :  ''
                        }
                        <div className="row form-group">
                            <div className="col col-md-3">
                                <label htmlFor="hf-email" className=" form-control-label">Select Sem Type</label>
                            </div>
                            <div className="col-12 col-md-9">
                                <select className='form-control' onChange={e => { setSemType(e.target.value) }} id='sem' name='sem' required>
                                    <option value="">Select Sem Type</option>
                                    <option value="0">Even</option>
                                    <option value="1">Odd</option>
                                </select>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col col-md-3">
                                <label htmlFor="hf-password" className=" form-control-label">Select Academic Year</label>
                            </div>
                            <div className="col-12 col-md-9">
                                <select type="text" className="form-control" id="acdYear" name='acdYear' required onChange={e => { setAcademicYear(e.target.value) }} dangerouslySetInnerHTML={{ __html: academicYearOption }}>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer text-center">
                        <button type="submit" className="btn btn-success rounded btn-sm">
                            <i className="fa fa-dot-circle-o"></i> Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GetWorkloadReport