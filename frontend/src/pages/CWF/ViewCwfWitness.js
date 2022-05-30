import axios from 'axios';
import React, { useState } from 'react'

export const ViewCwfWitness = (props) => {
    const [fid, setFid] = useState("");
    const [result, setresult] = useState("")
    const fetchLoanDetails = (e) => {
        e.preventDefault();
        axios.post(`${props.baseURL}/viewwitness`, { fid })
            .then((response) => {
                let loansData = response.data;
                setresult(
                    <div className="card font-weight-bold">
                        <div className="text-center card-header">
                            CWF Loan And Witness Details
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Sl No</th>
                                        <th>Loan Of</th>
                                        <th>Loan Amount</th>
                                        <th>Paid Amount</th>
                                        <th>Balance Amount</th>
                                        <th>Witnesses</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loansData.length > 0 ? loansData.map((data, i) => {
                                            let witness = data.witness.split(",");
                                            return <tr>
                                                <td>{i + 1}</td>
                                                <td>{data.emp_name}</td>
                                                <td>{props.numberWithCommas(data.loan_amt)}</td>
                                                <td>{props.numberWithCommas(data.paid_amt)}</td>
                                                <td>{props.numberWithCommas(data.bal_amt)}</td>
                                                <td>{
                                                    witness.map((wit, i1) => {
                                                        return <><span>{i1 + 1}){wit}</span><br /></>

                                                    })
                                                }
                                                </td>
                                                <td>{data.bal_amt == 0 ? <span className="text-warning font-weight-bold text-center">Close</span> : <span className="text-success font-weight-bold text-center">Active</span>}</td>
                                            </tr>
                                        }) : <tr><td colSpan="7"><center>
                                            <span className="text-danger font-weight-bold">No Data Found</span>
                                        </center></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            });
    }
    return (
        <>
            <div className="card font-weight-bold">
                <div className="text-center card-header">
                    VIEW CWF LOAN WITNESS DETAILS
                </div>
                <form onSubmit={fetchLoanDetails}>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="fid">Witness Name/Employee Id</label>
                            <input type="text" className="form-control" onChange={e => setFid(e.target.value)} name="fid" id="fid" aria-describedby="helpId" placeholder="Enter Name/Employee Id" required />
                        </div>
                    </div>
                    <div className="text-center card-footer">
                        <button type="submit" className="btn btn-primary rounded mr-2">Submit</button>
                        <button type="reset" className="btn btn-danger rounded" onClick={()=>{setresult("")}}>Reset</button>
                    </div>
                </form>
            </div>

            <br />
            {result}
        </>
    )
}
