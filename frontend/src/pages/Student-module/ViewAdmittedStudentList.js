import React from 'react'
import { useNavigate } from "react-router-dom";


const ViewAdmittedStudentList = (props) => {
    let role = sessionStorage.getItem('role');
    let navigate = useNavigate();
    // console.log(props.data)

    const cehkApproval=(admission_dean)=>
    {
        let cls='';
        if (admission_dean=== "approved") {
            cls="text-success font-weight-bold text-center";
        }else if (admission_dean==="")
        {
            cls = "text-warning font-weight-bold text-center";
            if (admission_dean !== "rejected") {
                admission_dean = "Pending";
            }
        }else{
            cls = "text-danger font-weight-bold text-center";
        }
        return <td className={cls}>{admission_dean}</td>
    }

    const cehkApproval1=(registrar,admission_dean)=>
    {
        let cls='';
        if (registrar=== "approved") {
            cls="text-success font-weight-bold text-center";
        }else if (registrar==="")
        {
            cls = "text-warning font-weight-bold text-center";
            if (admission_dean !== "rejected") {
                registrar = "Pending";
            }
        }else{
            cls = "text-danger font-weight-bold text-center";
        }
        return <td className={cls}>{registrar}</td>
    }

    const cehkApproval2=(registrar,admission_dean,vp_admin)=>
    {
        let cls='';
        if (vp_admin=== "approved") {
            cls="text-success font-weight-bold text-center";
        }else if (vp_admin==="")
        {
            cls = "text-warning font-weight-bold text-center";
            if (registrar !== "rejected" && admission_dean !== "rejected") {
                vp_admin = "Pending";
            }
        }else{
            cls = "text-danger font-weight-bold text-center";
        }
      return <td className={cls}>{vp_admin}</td>
    }


    const cehkApproval3=(registrar,admission_dean,vp_admin,principal)=>
    {
        let cls='';
        if (principal=== "approved") {
            cls="text-success font-weight-bold text-center";
        }else if (principal==="")
        {
            cls = "text-warning font-weight-bold text-center";
            if (registrar !== "rejected" && admission_dean !== "rejected" && vp_admin !== "rejected") {
                principal = "Pending";
            }
        }else{
            cls = "text-danger font-weight-bold text-center";
        }
       return <td className={cls}>{principal}</td>

        
    }

    const view = (e) => {
        e.preventDefault();
        navigate("/viewadmissionform", { state: {id: e.target.value} });
    };

    return (
        <>
            <table className="table table-bordered dataTable">
                <thead className="thead-dark text-uppercase">
                    <tr>
                        <th rowspan="2" className="align-middle">sl no</th>
                        <th rowspan="2" className="align-middle">name</th>
                        <th rowspan="2" className="align-middle">admission type</th>
                        <th rowspan="2" className="align-middle">department</th>
                        <th>Admission Dean</th>
                        <th>Registrar</th>
                        <th>VP Admin</th>
                        <th>Principal</th>
                        {role === "fees head"  ? <th className="text-center">Edit / Delete</th>:''}
                        <th className="text-center">View Form</th></tr>
                            </thead>
                            <tbody className="text-uppercase">
                    {
                        props.data.map((user, index) => (
                             <tr className="text-capitalize" key={index}>
                                <td>{index+1}</td>
                                <td>{user.name}</td>
                                <td>{user.type}</td>
                                <td>{user.dept}</td>
                               {
                                   cehkApproval(user.registrar)
                               }
                               {
                                   cehkApproval1(user.registrar,user.admission_dean)
                               }
                               {
                                   cehkApproval2(user.registrar,user.admission_dean,user.vp_admin)
                               }
                               {
                                   cehkApproval3(user.registrar,user.admission_dean,user.vp_admin,user.principal)
                               }
                               <td>
                               <button type="button" onClick={view} value={user.id} className="btn btn-primary btn-md rounded">View</button>
                               </td>
                                </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

export default ViewAdmittedStudentList
