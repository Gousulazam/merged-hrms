import React from 'react'
import { useState, useEffect } from 'react';
import Axios from "axios";

const AssingWorkload = (props) => {
    const [academicYearOption, setAcademicYearOption] = useState(`<option value="">Select Academic Year</option>`);
    const [academicYear, setAcademicYear] = useState("")
    const [departmentOption, setDepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [department, setDepartment] = useState("")
    const [facultyOption, setFacultyOption] = useState(`<option value="">Select Faculty</option>`);
    const [facultyOption1, setFacultyOption1] = useState(`<option value="">Select Faculty</option>`);
    const [fid, setFid] = useState("")
    const [deptfacOption, setDeptfacOption] = useState(`<option value="">Select Department</option>`);
    const [deptfac, setDeptfac] = useState("")
    const [sem, setSem] = useState("")
    const [subjectOption, setSubjectOption] = useState(`<option value="">Select Department</option>`);
    const [subject, setSubject] = useState("")
    const [deptPortfolioOption, setDeptPortfolioOption] = useState(`<option value="">Select Department Portfolio</option>`);
    const [deptPortfolio, setDeptPortfolio] = useState("")
    const [centeralPortfolioOption, setCenteralPortfolioOption] = useState(`<option value="">Select Centeral portfolio</option>`);
    const [centeralPortfolio, setCenteralPortfolio] = useState("")
    const [tutorialSubjectOption, setTutorialSubjectOption] = useState(`<option value="">Select Subject</option>`);
    const [tutorialSubject, setTutorialSubject] = useState("")
    const [institutesOption, setInstitutesOption] = useState(`<option value="">Select Sister College</option>`);
    const [sisid, setSisid] = useState("")
    const [sisClgSubOption, setSisClgSubOption] = useState(`<option value="">Select Subject </option>`);
    const [sisSubid, setSisSubid] = useState("")

    useEffect(() => {
        Axios.post(`${props.baseURL}/getacademicyearoption`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setAcademicYearOption(response.data);
                }
            });

        Axios.post(`${props.baseURL}/getdeptfacultyoption`, {
            did: props.userDetails.did
        })
            .then((response) => {
                setFacultyOption(response.data)
            });

        Axios.post(`${props.baseURL}/getacademicdepartmentoption`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setDeptfacOption(response.data);
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

        Axios.post(`${props.baseURL}/getDeptPortfolio`, {
            did: props.userDetails.did,
            cid: props.userDetails.cid,
        })
            .then((response) => {
                setDeptPortfolioOption(response.data)
            });

        Axios.post(`${props.baseURL}/getCenteralPortfolio`, {
            did: props.userDetails.did,
            cid: props.userDetails.cid,
        })
            .then((response) => {
                setCenteralPortfolioOption(response.data)
            });

        Axios.post(`${props.baseURL}/getInstitutesOption`)
            .then((response) => {
                setInstitutesOption(response.data)
            });

    }, [])

    useEffect(() => {
        if (deptfac !== '') {
            Axios.post(`${props.baseURL}/getdeptfacultyoption`, {
                did: deptfac
            })
                .then((response) => {
                    if (response.data.length > 0) {
                        setFacultyOption1(response.data);
                    }
                });
        }
    }, [deptfac])

    useEffect(() => {
        Axios.post(`${props.baseURL}/getWorkloadSubjectList`, {
            academicYear: academicYear,
            did: department,
            sem: sem,
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setSubjectOption(response.data);
                }
            });

        Axios.post(`${props.baseURL}/getTutorialSubject`, {
            academicYear: academicYear,
            did: department,
            sem: sem,
            cid: props.userDetails.cid
        })
            .then((response) => {
                setTutorialSubjectOption(response.data)
            });
    }, [sem])

    useEffect(() => {
        if (academicYear !== '') {
            Axios.post(`${props.baseURL}/getSisClgSub`, {
                academicYear: academicYear,
                sem: sem,
                cid: props.userDetails.cid
            })
                .then((response) => {
                    setSisClgSubOption(response.data);
                });
        }
    }, [sisid])

    return (
        <div>
            <div className='row'>
                <div className="col-xs-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <center><strong>Assign Workload</strong> </center>
                        </div>
                        <form method='post'>
                            <div className="card-body card-block">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon"><i className="fa fa-th-list"></i> WorkLoad</div>
                                        <select className='form-control ' id='evenodd' name='evenodd' required>
                                            <option value="">WorkLoad of</option>
                                            <option value="even">Even</option>
                                            <option value="odd">Odd</option>
                                        </select>
                                    </div>
                                </div>

                                {props.role === "VP admin" || props.role === "VP academic" || props.role === "Developer" ?
                                    <><div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Department</div>
                                            <select className='form-control' id='deptfac' name='deptfac' required onChange={e => { setDeptfac(e.target.value) }} dangerouslySetInnerHTML={{ __html: deptfacOption }}>
                                            </select>
                                        </div>
                                    </div>

                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon"><i className="fa fa-th-list"></i> Faculty</div>
                                                <select className='form-control ' id='fname' name='fname' required onChange={e => { setFid(e.target.value) }} dangerouslySetInnerHTML={{ __html: facultyOption1 }}>
                                                </select>
                                            </div>
                                        </div></>

                                    : <> <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Faculty</div>
                                            <select className='form-control ' id='fname' name='fname' required onChange={e => { setFid(e.target.value) }} dangerouslySetInnerHTML={{ __html: facultyOption }}>
                                            </select>
                                        </div>
                                    </div></>
                                }
                                <div className="form-group">

                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Academic Year</div>
                                            <select type="text" className="form-control" id="acdYear" name='acdYear' required onChange={e => { setAcademicYear(e.target.value) }} dangerouslySetInnerHTML={{ __html: academicYearOption }}>

                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Subject</div>
                                            <select className='form-control dept' id='dept' name='dept' required onChange={e => { setDepartment(e.target.value) }} dangerouslySetInnerHTML={{ __html: departmentOption }}>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Sem</div>
                                            <select required className='form-control' onChange={e => { setSem(e.target.value) }} id='sem' name='sem'>
                                                <option value="">Select Subject's Semester</option>
                                                <option value="1">Odd</option>
                                                <option value="0">Even</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Subject</div>
                                            
                                            <select className='form-control scd standardSelect' id='scd' name='scd[]' onChange={e => { setSubject(e.target.value) }} multiple dangerouslySetInnerHTML={{ __html: subjectOption }}>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="gous">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon"><i className="fa fa-th-list"></i> Department</div>
                                                
                                                <select data-placeholder="Departmental Portfolio" id="deptpot" name="deptpot[]" multiple onChange={e => { setDeptPortfolio(e.target.value) }} dangerouslySetInnerHTML={{ __html: deptPortfolioOption }} className="standardSelect12 form-control deptpot" >
                                                </select> 
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon"><i className="fa fa-th-list"></i> Central</div>
                                                <select className='form-control centpot standardSelect' id='centpot' onChange={e => { setCenteralPortfolio(e.target.value) }} dangerouslySetInnerHTML={{ __html: centeralPortfolioOption }} name='centpot[]' multiple>
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                    <div id="gresult" className="form-group">
                                        <h6 className="text-uppercase text-underline">portfolios with Units</h6>
                                        <ol id="bkl">
                                        </ol>

                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i>Tutorial(Parallel) <br />Subject
                                            </div>
                                            <select className='form-control tutorial standardSelecttut' id='tutorial' name='scd[]' onChange={e => { setTutorialSubject(e.target.value) }} dangerouslySetInnerHTML={{ __html: tutorialSubjectOption }} multiple>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Total Unit</div>
                                            <input type="text" id="tunit" placeholder="Centeral Portfolio" className="form-control" value="0" readOnly />
                                        </div>
                                    </div>

                                    <div className="card-header">
                                        <center><strong>Sister College Subjects</strong> </center>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i> Sister College</div>
                                            <select className='form-control dept' id='sisclg' name='sisclg' onChange={e => { setSisid(e.target.value) }} dangerouslySetInnerHTML={{ __html: institutesOption }}>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-th-list"></i>Sister College Subject</div>
                                            <select className='form-control sisub' id='sisub' name='scd[]' onChange={e => { setSisSubid(e.target.value) }} dangerouslySetInnerHTML={{ __html: sisClgSubOption }}>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer" >
                                    <div className="form-group text-center">
                                        <div className="input-group iteam-center"><button type="submit" className="btn btn-success btn-sm" id="subvac" name="subvac" >Submit</button></div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssingWorkload