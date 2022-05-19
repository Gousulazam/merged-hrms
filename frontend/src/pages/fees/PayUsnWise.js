import React,{ useState } from "react";
import axios from "axios";
import PayFeeDetails from "./PayFeeDetails";

export default function PayUsnWise(props) {
    const [result, setResult] = useState();
    const [usn, setUsn] = useState("");

    const fetchDetails = async (e) => {
        e.preventDefault();
        await axios.post(`${props.baseURL}/getpayfeedetails`, {
            usn: usn,
            cid: props.userDetails.cid
        }).then((response) => {
            if (response.data.length > 0) {
                setResult(<PayFeeDetails data={response.data} baseURL={props.baseURL} userDetails={props.userDetails} />);
            } else {
                setResult(<h6 className="text-danger font-weight-bold">No Data Found</h6>);
            }
        });
    };

    return (
        <>
            <div className="card">
                <div className="card-header text-center font-weight-bold">PAY USN WISE FEES</div>
                <form onSubmit={fetchDetails}>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="semtype">USN/Student Id</label>
                            <input type="text" className="form-control" id="usn" name="usn" onChange={e => setUsn(e.target.value)} placeholder="Enter USN/Student Id" />
                        </div>
                    </div>
                    <div className="card-footer">
                        <center><button type="submit" className="btn btn-primary btn-sm rounded mr-2">
                            <i className="fa fa-dot-circle-o"></i> Submit
                        </button>
                            <button type="reset" className="btn btn-danger btn-sm rounded" onClick={() => { setResult("") }}>
                                <i className="fa fa-ban"></i> Reset
                            </button>
                        </center>
                    </div>
                </form>
            </div>
            {result}
        </>
    )
}
