import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from "axios";

const Viewadmissionform = (props) => {

    const { state } = useLocation();
    const [studentDetail, setStudentDetail] = useState('')
    const [collegeDetail, setCollegeDetail] = useState('')
    const [dob, setBob] = useState('')
    const [sslcFrm, setSslcFrm] = useState('')
    const [sslcto, setSslcto] = useState('')
    useEffect(() => {
        axios.post(`${props.baseURL}/getcollegedetailsbyid`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                setCollegeDetail(response.data[0]);
            });
    }, [])

    useEffect(() => {
        axios.post(`${props.baseURL}/getStudentAdmissionFormDetails`, {
            id: state.id,
            cid: props.userDetails.cid
        })
            .then((response) => {
                setStudentDetail(response.data);
                setBob(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', }).format(studentDetail.dob))
                setSslcFrm(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', }).format(studentDetail.sslc_from))
                setSslcto(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', }).format(studentDetail.sslc_to))
            });
    }, [])
    return (
        <div className="card">

            <div className="text-uppercase">
                <h5 align='center'>secab association's</h5>
                <h2 align='center'>{collegeDetail.iname}</h2>

            </div>
            <table className="table table-bordered">

                <tr>
                    <th rowspan="10" className="align-middle text-center">Details of Candidate</th>
                </tr>

                <tr>
                    <td colspan="2">
                        <div className="form-group">
                            <label htmlFor="name" className="font-weight-bold">Name of the Candidate : {studentDetail.name}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">
                        <div className="form-group">
                            <label htmlFor="name" className="font-weight-bold">Quota : {studentDetail.quota}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">
                        <div className="form-group">
                            <label htmlFor="department" className="font-weight-bold">Desired Branch : {studentDetail.dept}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="contactNo" className="font-weight-bold">Contact No : {studentDetail.st_conctac_no}</label>
                        </div>
                    </td>
                    <td>
                        <div className="form-group">
                            <label htmlFor="gender" className="font-weight-bold">Gender : {studentDetail.gender}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="dob" className="font-weight-bold">Date of Birth : {dob}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="placeOfBirth" className="font-weight-bold">Place of Birth : {studentDetail.pob}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="caste" className="font-weight-bold">Religion / Caste : {studentDetail.caste}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="casteCategory" className="font-weight-bold">Caste Category : {studentDetail.category}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="nationality" className="font-weight-bold">Nationality : {studentDetail.nationality}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="bloodGroup" className="font-weight-bold">Blood Group : {studentDetail.blood_group}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="aadharNo" className="font-weight-bold">Aadhar No : {studentDetail.aadhar_no} </label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="email" className="font-weight-bold">E-mail : {studentDetail.email}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="bankName" className="font-weight-bold">Bank Name : {studentDetail.bank_name}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="accountNo" className="font-weight-bold">Account No : {studentDetail.account_no}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="branch" className="font-weight-bold">Branch : {studentDetail.branch}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="ifscCode" className="font-weight-bold">IFSC Code : {studentDetail.ifcs}</label>
                        </div>
                    </td>
                </tr>


                <tr>
                    <th rowspan="6" className="align-middle text-center">Details of Parents / Guardian</th>
                </tr>

                <tr>
                    <td colspan="2">
                        <div className="form-group">
                            <label htmlFor="fatherName" className="font-weight-bold">Name of Father / Guardian : {studentDetail.gaurdian_name}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="occupation" className="font-weight-bold">Occupation : {studentDetail.gaurdian_occupation}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="annualIncome" className="font-weight-bold">Annual Income Rs. : {studentDetail.annual_income}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="parentsContactNo" className="font-weight-bold">Contact No : {studentDetail.gaurdian_contact_no}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="landPhone" className="font-weight-bold">Landphone(Resi) : {studentDetail.gaurdian_landphone}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="parentsContactNo" className="font-weight-bold">Office : {studentDetail.gaurdian_office}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="fatherEmail" className="font-weight-bold">E-mail : {studentDetail.gaurdian_email}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="motherName" className="font-weight-bold">Mother's Name : {studentDetail.mother_name}</label>
                        </div>
                    </td>

                    <td>
                        <div className="form-group">
                            <label htmlFor="gurdianOccupation" className="font-weight-bold">Occupation : {studentDetail.mother_occupation}</label>
                        </div>
                    </td>
                </tr>


                <tr>
                    <th rowspan="2" className="align-middle text-center">Correspondence Address</th>
                </tr>

                <tr>
                    <td>
                        <div className="form-group">
                            <label htmlFor="address" className="font-weight-bold">Address : {studentDetail.address}</label>
                        </div>
                    </td>
                    <td>
                        <div className="form-group">
                            <label htmlFor="pincode" className="font-weight-bold">Pincode : {studentDetail.pincode}</label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <th rowspan="2" className="align-middle text-center">Details of SSLC</th>
                </tr>

                <tr>
                    <td colspan="2">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th colspan="3" className="text-center align-middle">Calender Year</th>
                                    <th rowspan="2" className="align-middle text-center">Name of the Institution</th>
                                    <th rowspan="2" className="align-middle text-center">District</th>
                                    <th rowspan="2" className="align-middle text-center">State</th>
                                    <th rowspan="2" className="align-middle text-center">Class Obtained</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th className="text-center">From</th>
                                    <th className="text-center">To</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>10</td>
                                    <td>{sslcFrm}</td>
                                    <td>{sslcto}</td>
                                    <td>{studentDetail.sslc_inst}</td>
                                    <td>{studentDetail.sslc_district}</td>
                                    <td>{studentDetail.sslc_state}</td>
                                    <td>{studentDetail.sslc_class_obtained}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th rowspan="2" className="align-middle text-center">Details of Qualifying Examination Passed</th>
                </tr>

                <tr>
                    <td colspan="2">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Name of the Institution / College Last Attended</th>
                                    <th>Name Of University / Board</th>
                                    <th>Reg.No.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{studentDetail.puc_inst}</td>
                                    <td>{studentDetail.puc_board}</td>
                                    <td>{studentDetail.puc_reg_no}</td>
                                </tr>
                            </tbody>
                        </table>

                        <br />
                        {
                            studentDetail.type == "regular" ? <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Subject</th>
                                        <th>Maximum Marks</th>
                                        <th>Marks Obtained</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Physics</td>
                                        <td>{studentDetail.phy_max_marks}</td>
                                        <td>{studentDetail.phy_obt_marks}</td>
                                        <td>{studentDetail.phy_per}</td>
                                    </tr>

                                    <tr>
                                        <td>Chemistry / Biology / Comp.Sci</td>
                                        <td>{studentDetail.che_max_marks}</td>
                                        <td>{studentDetail.che_obt_marks}</td>
                                        <td>{studentDetail.che_per}</td>
                                    </tr>

                                    <tr>
                                        <td>Mathematics</td>
                                        <td>{studentDetail.math_max_marks}</td>
                                        <td>{studentDetail.math_obt_marks}</td>
                                        <td>{studentDetail.math_per}</td>
                                    </tr>

                                    <tr>
                                        <th>Aggregate Total Marks</th>
                                        <td>{studentDetail.agg_max_mark}</td>
                                        <td>{studentDetail.agg_obt_mark}</td>
                                        <td>{studentDetail.agg_per}</td>
                                    </tr>
                                </tbody>
                            </table> : <table>
                                <tbody className="thead-dark">
                                    <tr>
                                        <th>Subject</th>
                                        <th>Semester</th>
                                        <th>Maximum Marks</th>
                                        <th>Marks Obtained</th>
                                        <th>Percentage</th>
                                    </tr>
                                    <tr>
                                        <th className="text-left" rowspan="2">Diploma I Year</th>
                                        <th className="text-center">I</th>
                                        <td>{studentDetail.dip_sem1_max}</td>
                                        <td>{studentDetail.dip_sem1_obt}</td>
                                        <td>{studentDetail.dip_sem1_per}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-center">II</th>
                                        <td>{studentDetail.dip_sem2_max}</td>
                                        <td>{studentDetail.dip_sem2_obt}</td>
                                        <td>{studentDetail.dip_sem2_per}</td>
                                    </tr>
                                    <tr>
                                        <th sclassName="text-left" rowspan="2">Diploma II Year</th>
                                        <th className="text-center">III</th>
                                        <td>{studentDetail.dip_sem3_max}</td>
                                        <td>{studentDetail.dip_sem3_obt}</td>
                                        <td>{studentDetail.dip_sem3_per}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-center">IV</th>
                                        <td>{studentDetail.dip_sem4_max}</td>
                                        <td>{studentDetail.dip_sem4_obt}</td>
                                        <td>{studentDetail.dip_sem4_per}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-left" rowspan="2">Diploma III Year</th>
                                        <th className="text-center">V</th>
                                        <td>{studentDetail.dip_sem5_max}</td>
                                        <td>{studentDetail.dip_sem5_obt}</td>
                                        <td>{studentDetail.dip_sem5_per}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-center">VI</th>
                                        <td>{studentDetail.dip_sem6_max}</td>
                                        <td>{studentDetail.dip_sem6_obt}</td>
                                        <td>{studentDetail.dip_sem6_per}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="2">Aggregate Total Marks</th>
                                        <td>{studentDetail.agg_max_mark}</td>
                                        <td>{studentDetail.agg_obt_mark}</td>
                                        <td>{studentDetail.agg_per}</td>
                                    </tr>

                                </tbody>
                            </table>
                        }
                    </td>
                </tr>

                <tr>
                    <th rowspan="2" className="align-middle text-center">Fee Fixation Details</th>
                </tr>

                <tr>
                    <td colspan="2">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Particular</th>
                                    {
                                        studentDetail.type == "regular" ?
                                            <th>First Year</th>
                                            : ''}
                                            <th>Second Year</th>
                                            <th>Third Year</th>
                                            <th>Fourth Year</th>
                                    {
                                        studentDetail.cid == 6 ?
                                            <th>Fifth Year</th> : ''

                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>University Fee</td>
                                    {

                                        studentDetail.type == "regular" ?
                                            <th>{studentDetail.uni_fee_1}</th>
                                            : ''}
                                                <th>{studentDetail.uni_fee_2}</th>
                                                <th>{studentDetail.uni_fee_3}</th>
                                                <th>{studentDetail.uni_fee_4}</th>
                                     {
                                        studentDetail.cid == 6 ?
                                            <th>{studentDetail.uni_fee_5}</th> : ''
                                    }
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Tuition Fee</td>
                                    {

                                        studentDetail.type == "regular" ?
                                            <th>{studentDetail.tut_fee_1}</th>
                                            : ''}
                                                <th>{studentDetail.tut_fee_2}</th>
                                                <th>{studentDetail.tut_fee_3}</th>
                                                <th>{studentDetail.tut_fee_4}</th>
                                      {
                                        studentDetail.cid == 6 ?
                                            <th>{studentDetail.tut_fee_5}</th> : ''
                                    }
                                </tr>
                                <tr className="font-weight-bold">
                                    <td className="text-center" colspan="2">Total</td>
                                    {

                                        studentDetail.type == "regular" ?
                                            <th>{studentDetail.uni_fee_1+studentDetail.tut_fee_1}</th>
                                            :''} 
                                                <th>{studentDetail.uni_fee_2+studentDetail.tut_fee_2}</th>
                                                <th>{studentDetail.uni_fee_3+studentDetail.tut_fee_3}</th>
                                                <th>{studentDetail.uni_fee_4+studentDetail.tut_fee_4}</th>
                                            
                                    {
                                        studentDetail.cid == 6 ?
                                            <th>{studentDetail.uni_fee_5+studentDetail.tut_fee_5}</th> : ''
                                    }

                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

            </table>


        </div>
    )
}

export default Viewadmissionform