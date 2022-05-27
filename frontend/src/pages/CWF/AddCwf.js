import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const AddCwf = (props) => {
    const [clgOption, setclgOption] = useState(`<option value=''>Select College</option>`);
    const [cid, setCid] = useState(0);
    const [departmentOption, setdepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [did, setDid] = useState("");
    const [employeeOption, setuserOption] = useState(`<option value="">Select Employee</option>`);
    const [fid, setFid] = useState("");
    const [loan_amt, setLoanAmt] = useState(0);
    const [duration, setDuration] = useState(0);
    const [durationOption, setDurationOption] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
    const [month_dedc, setMonthDedc] = useState("");
    useEffect(() => {
        axios.get(`${props.baseURL}/getcollegeoption`)
            .then((response) => {
                if (response.data.length > 0) {
                    setclgOption(response.data);
                } else {
                    setclgOption(`<option value="">Select Employee</option>`);
                }
            });
    }, [])

    useEffect(() => {
        if (cid != '') {
            axios.post(`${props.baseURL}/getdepartmenteoption`, { cid: cid })
                .then((response) => {
                    if (response.data.length > 0) {
                        setdepartmentOption(response.data);
                    } else {
                        setdepartmentOption(`<option value="">Select Department</option>`);
                    }
                });
        } else {
            setdepartmentOption(`<option value="">Select Department</option>`);
        }
    }, [cid])

    useEffect(() => {
        if (cid != '') {
            axios.post(`${props.baseURL}/getemployeeeoption`, { cid: cid, did: did })
                .then((response) => {
                    if (response.data.length > 0) {
                        setuserOption(response.data);
                    }
                });
        } else {
            setuserOption(`<option value="">Select Employee</option>`);
        }
    }, [did])

    useEffect(() => {
        if(duration != ''){
            setMonthDedc(loan_amt/duration)
        }else{
            setMonthDedc("")
        }
    }, [duration])
    

    return (
        <div className="card font-weight-bold">
            <div className="card-header text-center">
                Add CWF Loan
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-4">
                        <div class="form-group">
                            <label for="">Select Institute</label>
                            <select class="form-control" name="clg" onChange={e => setCid(e.target.value)} id="clg" dangerouslySetInnerHTML={{ __html: clgOption }}>
                            </select>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div class="form-group">
                            <label for="">Select Department</label>
                            <select class="form-control" name="dept" id="dept" onChange={e => setDid(e.target.value)} dangerouslySetInnerHTML={{ __html: departmentOption }}>
                            </select>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div class="form-group">
                            <label for="">Select Employee</label>
                            <select class="form-control" name="fid" id="fid" onChange={e => setFid(e.target.value)} dangerouslySetInnerHTML={{ __html: employeeOption }}>
                            </select>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div class="form-group">
                            <label for="">Loan Amount</label>
                            <input type="text" class="form-control" name="loan_amt" id="loan_amt" aria-describedby="helpId" placeholder="Enter Loan Amount" onChange={e => setLoanAmt(e.target.value)} />
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div class="form-group">
                          <label for="">Duration</label>
                          <select class="form-control" name="duration" id="duration" onChange={e=>setDuration(e.target.value)}>
                            <option value="">Select Duration</option>
                            {
                                durationOption.map((i) =>{
                                    return <option value={i}>{i} Month</option>
                                })
                            }
                          </select>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div class="form-group">
                          <label for="">Monthly Deduction</label>
                          <input type="text" class="form-control" name="month_dedc" id="month_dedc" aria-describedby="helpId" placeholder="Enter Monthly Deduction" value={month_dedc} readOnly/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
