import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WorkloadReport = (props) => {
    const { state } = useLocation();

    const [workloadTable, setWorkloadTable] = useState("")

    useEffect(() => {
        axios.post(`${props.baseURL}/getWorkLoadReport`, {
            academicYear: state.academicYear,
            department: state.department,
            semType: state.semType,
            cid: state.cid
        })
            .then((response) => {
                setWorkloadTable(response.data);
            });
    }, [])

    return (
        <div>
            <div className="col-lg-12">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <a className="nav-item nav-link active show mx-3" id="custom-nav-home-tab" data-toggle="tab" href="#custom-nav-home" role="tab" aria-controls="custom-nav-home" aria-selected="true">Faculty Wise</a>
                        <a className="nav-item nav-link" id="custom-nav-profile-tab" data-toggle="tab" href="#custom-nav-profile" role="tab" aria-controls="custom-nav-profile" aria-selected="false">Semester Wise</a>
                    </div>
                </nav>
                <div className="card">
                    <div className="card-body">
                        <div className="tab-content pl-3 pt-2" id="nav-tabContent">
                            <div className="tab-pane fade active show" id="custom-nav-home" role="tabpanel" aria-labelledby="custom-nav-home-tab">
                            <div dangerouslySetInnerHTML={{ __html: workloadTable }}></div>
                            </div>
                            <div className="tab-pane fade" id="custom-nav-profile" role="tabpanel" aria-labelledby="custom-nav-profile-tab">
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkloadReport
