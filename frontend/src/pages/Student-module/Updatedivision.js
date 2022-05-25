import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

const Updatedivision = (props) => {

    const [collegeDetail, setCollegeDetail] = useState('')
    const [did, setDid] = useState(props.userDetails.did)
    const [dv, setDv] = useState('')
    const [studentList, setStudentList] = useState([])
    const [studentId, setStudentId] = useState([])
    const [count, setCount] = useState(0)
    const [semOption, setSemOption] = useState(`<option value="">Select Sem</option>`);
    const [sem, setSem] = useState("")
    const [academicYearOption, setAcademicYearOption] = useState(`<option value="">Select Academic Year</option>`);
    const [academicYear, setAcademicYear] = useState("")
    useEffect(() => {
        axios.post(`${props.baseURL}/getacademicyearoption`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setAcademicYearOption(response.data);
                }
            });

        axios.post(`${props.baseURL}/getsem`, {
            cid: props.userDetails.cid

        })
            .then((response) => {
                if (response.data.length > 0) {
                    setSemOption(response.data);
                }
            });

        axios.post(`${props.baseURL}/getcollegedetailsbyid`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                setCollegeDetail(response.data[0]);
            });
    }, [])

    const getAcademicStudentlis = (e) => {
        e.preventDefault();
        axios.post(`${props.baseURL}/getAcademicStudentlis`, {
            did: did,
            academicYear: academicYear,
            cid: props.userDetails.cid,
            sem: sem
        })
            .then((response) => {
                if (response.data.length <= 0) {
                    alert("No Data Found");
                }
                setStudentList(response.data)
            });
    };

    const updateDivision = (e) => {
        e.preventDefault();
        if (studentId.length <= 0) {
            alert('Please select Atleast one student');
        }
        else {
            axios.post(`${props.baseURL}/updateDivision`, {
                studentId,
                academicYear,
                uid: props.userDetails.id,
                cid: props.userDetails.cid,
                dv
            })
                .then((response) => {
                    if (response.data > 0) {
                        alert('Record Updated Successfully');
                        window.location.reload();
                    }
                    else {
                        alert('No Record Updated');
                    }

                });
        }
    };

    const onchangeInput = (val, index) => {
        let temp = studentId;
        temp[temp.length] = val.target.value;
        setStudentId(temp);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h2 align='center' className="text-uppercase">
                    {collegeDetail.iname}
                    <br /> Assign Division
                </h2>
                <form method="post" onSubmit={getAcademicStudentlis}>
                    <div className="form-group">
                        <label htmlFor="">Academic Year</label>
                        <select className="form-control" name="academic_year" required="" onChange={e => { setAcademicYear(e.target.value) }} id="academic_year" dangerouslySetInnerHTML={{ __html: academicYearOption }}>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Sem</label>
                        <select className="form-control" name="sem" required="" onChange={e => { setSem(e.target.value) }} id="sem" dangerouslySetInnerHTML={{ __html: semOption }}>
                        </select>
                    </div>
                    <center><button type="submit" className="btn btn-primary rounded" id="submit2">Submit</button></center>
                </form>
                <form method="post" onSubmit={updateDivision}>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="">Division</label>
                            <input type="text" className="form-control" name="division" onChange={(e) => setDv(e.target.value)} id="division" aria-describedby="helpId" placeholder="Enter Division" />
                        </div>
                        <br />
                        <table className="table table-bordered">
                            <thead className="thead-dark text-uppercase">
                                <tr>
                                    <th className="align-middle">sl no</th>
                                    <th>
                                        <input type="checkbox" id="chckal" name="chckal" value="" /> Check All
                                    </th>
                                    <th className="align-middle">name</th>
                                </tr>

                            </thead>
                            <tbody className="text-uppercase">
                                {
                                    studentList.map((user, index) => (
                                        <tr className="text-capitalize" key={index}>
                                            <td>{index + 1}</td>
                                            <td className="text-center"><input type='checkbox' key={index + 1} onChange={(val) => { onchangeInput(val, index) }} value={user.id} id='chck' name='chck' /></td>
                                            <td>{user.name}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary rounded" id="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Updatedivision