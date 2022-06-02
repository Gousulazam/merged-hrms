import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const CwfConsolidateReport = (props) => {
    let navigate = useNavigate();
    const [clgOption, setclgOption] = useState(`<option value=''>Select College</option>`);
    const [cid, setCid] = useState(0);
    const [departmentOption, setdepartmentOption] = useState(`<option value="">Select Department</option><option value="all">All Department</option>`);
    const [did, setDid] = useState("");

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
            axios.post(`${props.baseURL}/getdepartmenteoptionforcwf`, { cid: cid })
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

    const fetchLoanDetails = (e) => {
        e.preventDefault();
        navigate("/reportconsolidatecwf", { state: { cid,did} });
    }
    return (
        <form onSubmit={fetchLoanDetails}>
            <div className="card font-weight-bold">
                <div className="card-header text-center">View CWF Loan</div>
                <div className="card-body">
                    <div className="col-sm-12">
                        <div class="form-group">
                            <label for="">Select Institute</label>
                            <select class="form-control" name="clg" onChange={e => setCid(e.target.value)} id="clg" dangerouslySetInnerHTML={{ __html: clgOption }} required>
                            </select>
                        </div>
                    </div>

                    <div className="col-sm-12">
                        <div class="form-group">
                            <label for="">Select Department</label>
                            <select class="form-control" name="dept" id="dept" onChange={e => setDid(e.target.value)} dangerouslySetInnerHTML={{ __html: departmentOption }} required>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-center">
                    <button type="submit" className="btn btn-primary rounded mr-2">Submit</button>
                    <button type="reset" className="btn btn-danger rounded">Reset</button>
                </div>
            </div>
        </form>
    )
}
