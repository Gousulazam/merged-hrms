import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';

export const AddCwf = (props) => {
    const [clgOption, setclgOption] = useState(`<option value=''>Select College</option>`);
    const [cid, setCid] = useState(0);
    const [departmentOption, setdepartmentOption] = useState(`<option value="">Select Department</option>`);
    const [did, setDid] = useState("");
    const [employeeOption, setuserOption] = useState(`<option value="">Select Employee</option>`);
    const [fid, setFid] = useState("");
    const [loan_amt, setLoanAmt] = useState(0);
    const [duration, setDuration] = useState(0);
    const [durationOption, setDurationOption] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    const [month_dedc, setMonthDedc] = useState("");
    const [wclg1, setWclg1] = useState(0);
    const [wclg2, setWclg2] = useState(0);
    const [wclg3, setWclg3] = useState(0);
    const [wdept1, setWdept1] = useState(0);
    const [wdeptOption1, setwdeptOption1] = useState(`<option value="">Select Department</option>`);
    const [wdept2, setWdept2] = useState(0);
    const [wdeptOption2, setwdeptOption2] = useState(`<option value="">Select Department</option>`);
    const [wdept3, setWdept3] = useState(0);
    const [wdeptOption3, setwdeptOption3] = useState(`<option value="">Select Department</option>`);
    const [witness1, setWitness1] = useState(0);
    const [witness1Option1, setwitness1Option1] = useState(`<option value="">Select Employee</option>`);
    const [witness2, setWitness2] = useState(0);
    const [witness1Option2, setwitness1Option2] = useState(`<option value="">Select Employee</option>`);
    const [witness3, setWitness3] = useState(0);
    const [witness1Option3, setwitness1Option3] = useState(`<option value="">Select Employee</option>`);

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
        if (duration != '') {
            setMonthDedc(Math.round(loan_amt / duration))
        } else {
            setMonthDedc("")
        }
    }, [duration])

    useEffect(() => {
        if (wclg1 != '') {
            axios.post(`${props.baseURL}/getdepartmenteoption`, { cid: wclg1 })
                .then((response) => {
                    if (response.data.length > 0) {
                        setwdeptOption1(response.data);
                    } else {
                        setwdeptOption1(`<option value="">Select Department</option>`);
                    }
                });
        } else {
            setwdeptOption1(`<option value="">Select Department</option>`);
        }
    }, [wclg1])

    useEffect(() => {
        if (wclg1 != '') {
            axios.post(`${props.baseURL}/getemployeeeoption`, { cid: wclg1, did: wdept1 })
                .then((response) => {
                    if (response.data.length > 0) {
                        setwitness1Option1(response.data);
                    }
                });
        } else {
            setwitness1Option1(`<option value="">Select Employee</option>`);
        }
    }, [wdept1])

    useEffect(() => {
        if (wclg2 != '') {
            axios.post(`${props.baseURL}/getdepartmenteoption`, { cid: wclg2 })
                .then((response) => {
                    if (response.data.length > 0) {
                        setwdeptOption2(response.data);
                    } else {
                        setwdeptOption2(`<option value="">Select Department</option>`);
                    }
                });
        } else {
            setwdeptOption2(`<option value="">Select Department</option>`);
        }
    }, [wclg2])

    useEffect(() => {
        if (wclg2 != '') {
            axios.post(`${props.baseURL}/getemployeeeoptionforcwfwitness2`, { cid: wclg2, did: wdept2, id: witness1 })
                .then((response) => {
                    if (response.data.length > 0) {
                        setwitness1Option2(response.data);
                    }
                });
        } else {
            setwitness1Option2(`<option value="">Select Employee</option>`);
        }
    }, [wdept2])

    useEffect(() => {
        if (wclg2 != '') {
            axios.post(`${props.baseURL}/getdepartmenteoption`, { cid: wclg2 })
                .then((response) => {
                    if (response.data.length > 0) {
                        setwdeptOption3(response.data);
                    } else {
                        setwdeptOption3(`<option value="">Select Department</option>`);
                    }
                });
        } else {
            setwdeptOption3(`<option value="">Select Department</option>`);
        }
    }, [wclg3])

    useEffect(() => {
        if (wclg2 != '') {
            axios.post(`${props.baseURL}/getemployeeeoptionforcwfwitness3`, { cid: wclg2, did: wdept2, id1: witness1, id2: witness2 })
                .then((response) => {
                    if (response.data.length > 0) {
                        setwitness1Option3(response.data);
                    }
                });
        } else {
            setwitness1Option3(`<option value="">Select Employee</option>`);
        }
    }, [wdept3])

    const addCwfDetails = (e) => {
        e.preventDefault();
        axios.post(`${props.baseURL}/addcwfdetails`, { clg:cid,did:did,empid:fid,wdept1:wdept1,wdept2:wdept2,wdept3:wdept3,witness1_id:witness1,witness2_id:witness2,witness3_id:witness3,loan_amt:loan_amt,duration:duration,month_dedc:month_dedc,aid:props.userDetails.id })
                .then((response) => {
                    console.log(response.data);
                    swal(response.data[0],"",response.data[1]);
                });
    }

    return (
        <form onSubmit={addCwfDetails}>
            <div className="card font-weight-bold">
                <div className="card-header text-center">
                    Add CWF Loan
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Select Institute</label>
                                <select class="form-control" name="clg" onChange={e => setCid(e.target.value)} id="clg" dangerouslySetInnerHTML={{ __html: clgOption }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Select Department</label>
                                <select class="form-control" name="dept" id="dept" onChange={e => setDid(e.target.value)} dangerouslySetInnerHTML={{ __html: departmentOption }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Select Employee</label>
                                <select class="form-control" name="fid" id="fid" onChange={e => setFid(e.target.value)} dangerouslySetInnerHTML={{ __html: employeeOption }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Loan Amount</label>
                                <input type="text" class="form-control" name="loan_amt" id="loan_amt" aria-describedby="helpId" placeholder="Enter Loan Amount" onChange={e => setLoanAmt(e.target.value)} required />
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Duration</label>
                                <select class="form-control" name="duration" id="duration" onChange={e => setDuration(e.target.value)} required>
                                    <option value="">Select Duration</option>
                                    {
                                        durationOption.map((i) => {
                                            return <option value={i}>{i} Month</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Monthly Deduction</label>
                                <input type="text" class="form-control" name="month_dedc" id="month_dedc" aria-describedby="helpId" placeholder="Enter Monthly Deduction" value={month_dedc} readOnly required />
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Institute of Witness1</label>
                                <select class="form-control" name="wclg1" id="wclg1" onChange={e => setWclg1(e.target.value)} dangerouslySetInnerHTML={{ __html: clgOption }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Department of Witness1</label>
                                <select class="form-control" name="dept" id="dept" onChange={e => setWdept1(e.target.value)} dangerouslySetInnerHTML={{ __html: wdeptOption1 }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Witness 1</label>
                                <select class="form-control" name="dept" id="dept" onChange={e => setWitness1(e.target.value)} dangerouslySetInnerHTML={{ __html: witness1Option1 }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Institute of Witness2</label>
                                <select class="form-control" name="wclg1" id="wclg1" onChange={e => setWclg2(e.target.value)} dangerouslySetInnerHTML={{ __html: clgOption }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Department of Witness2</label>
                                <select class="form-control" name="dept" id="dept" onChange={e => setWdept2(e.target.value)} dangerouslySetInnerHTML={{ __html: wdeptOption2 }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Witness 3</label>
                                <select class="form-control" name="dept" id="dept" onChange={e => setWitness2(e.target.value)} dangerouslySetInnerHTML={{ __html: witness1Option2 }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Institute of Witness3</label>
                                <select class="form-control" name="wclg1" id="wclg1" onChange={e => setWclg3(e.target.value)} dangerouslySetInnerHTML={{ __html: clgOption }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Department of Witness3</label>
                                <select class="form-control" name="dept" id="dept" onChange={e => setWdept3(e.target.value)} dangerouslySetInnerHTML={{ __html: wdeptOption3 }} required>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div class="form-group">
                                <label for="">Witness 3</label>
                                <select class="form-control" name="dept" id="dept" onChange={e => setWitness3(e.target.value)} dangerouslySetInnerHTML={{ __html: witness1Option3 }} required>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="card-footer text-center">
                    <button type="submit" className="btn btn-primary rounded mr-2">Submit</button>
                    <button type="reset" className="btn btn-danger rounded">Reset</button>
                </div>
            </div>
        </form>
    );
}
