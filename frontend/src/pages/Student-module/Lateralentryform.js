import React from 'react'
import { useState, useEffect } from 'react';
import Axios from "axios";

const Lateralentryform = (props) => {

  let styles = { border: "25px solid #82B74B" }
  let span = { color: "red" }

  const [academicYearOption, setAcademicYearOption] = useState(`<option value="">Select Academic Year</option>`);
  const [academicYear, setAcademicYear] = useState("")
  useEffect(() => {
    Axios.post(`${props.baseURL}/getacademicyearoption`, {
      cid: props.userDetails.cid
    })
      .then((response) => {
        if (response.data.length > 0) {
          setAcademicYearOption(response.data);
        }
      });
  }, [])

  const [departmentOption, setDepartmentOption] = useState(`<option value="">Select Department</option>`);
  const [department, setDepartment] = useState("")
  useEffect(() => {
    Axios.post(`${props.baseURL}/getacademicdepartmentoption`, {
      cid: props.userDetails.cid
    })
      .then((response) => {
        if (response.data.length > 0) {
          setDepartmentOption(response.data);
        }
      });
  }, [])

  const [quotaOption, setQuotaOption] = useState(`<option value="">Select Quota</option>`);
  const [quota, setQuota] = useState("")
  useEffect(() => {
    Axios.post(`${props.baseURL}/getquotaoption`, {
      cid: props.userDetails.cid
    })
      .then((response) => {
        if (response.data.length > 0) {
          setQuotaOption(response.data);
        }
      });
  }, [])

  const [categoryOption, setCategoryOption] = useState(`<option value="">Select Caste Category</option>`);
  const [category, setCategory] = useState("")
  useEffect(() => {
    Axios.post(`${props.baseURL}/getcategoriesoption`, {
      cid: props.userDetails.cid
    })
      .then((response) => {
        if (response.data.length > 0) {
          setCategoryOption(response.data);
        }
      });
  }, [])

  const [name, setName] = useState("")
  const [studentMobile, setStudentMobile] = useState("")
  const [gender, setGender] = useState("")
  const [date, setDate] = useState("")
  const [placeOfBirth, setPlaceOfBirth] = useState("")
  const [caste, setCaste] = useState("")
  const [nationality, setNationality] = useState("")
  const [bgrp, setBgrp] = useState("")
  const [aadharNo, setAadharNo] = useState("")
  const [mail, setMail] = useState("")
  const [accNo, setAccNo] = useState("")
  const [bankName, setBankName] = useState("")
  const [branch, setBranch] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [annualIncome, setAnnualIncome] = useState("")
  const [parentMobile, setParentMobile] = useState("")
  const [office, setOffice] = useState("")
  const [parentMail, setParentMail] = useState("")
  const [landphone, setLandphone] = useState("")
  const [mothersName, setMothersName] = useState("")
  const [motherOccupation, setMotherOccupation] = useState("")
  const [address, setAddress] = useState("")
  const [pincode, setPincode] = useState("")
  const [sslcFrom, setSslcFrom] = useState("")
  const [sslcTo, setSslcTo] = useState("")
  const [sslcInstitute, setSslcInstitute] = useState("")
  const [sslcDistrict, setSslcDistrict] = useState("")
  const [sslcState, setSslcState] = useState("")
  const [sslcClassObtained, setSslcClassObtained] = useState("")
  const [lastAttendedCOllegeName, setLastAttendedCOllegeName] = useState("")
  const [collegeBoardName, setCollegeBoardName] = useState("")
  const [collegeRegisterNumber, setCollegeRegisterNumber] = useState("")
  const [sem1max, setSem1max] = useState("")
  const [sem1obt, setSem1obt] = useState("")
  const [sem1per, setSem1per] = useState("")
  const [sem2max, setSem2max] = useState("")
  const [sem2obt, setSem2obt] = useState("")
  const [sem2per, setSem2per] = useState("")
  const [sem3max, setSem3max] = useState("")
  const [sem3obt, setSem3obt] = useState("")
  const [sem3per, setSem3per] = useState("")
  const [sem4max, setSem4max] = useState("")
  const [sem4obt, setSem4obt] = useState("")
  const [sem4per, setSem4per] = useState("")
  const [sem5max, setSem5max] = useState("")
  const [sem5obt, setSem5obt] = useState("")
  const [sem5per, setSem5per] = useState("")
  const [sem6max, setSem6max] = useState("")
  const [sem6obt, setSem6obt] = useState("")
  const [sem6per, setSem6per] = useState("")
  const [avgmax, setAvgmax] = useState("")
  const [avgobt, setAvgobt] = useState("")
  const [avgper, setAvgper] = useState("")
  const [university2ndYear, setUniversity2ndYear] = useState("")
  const [university3rdYear, setUniversity3rdYear] = useState("")
  const [university4thYear, setUniversity4thYear] = useState("")
  const [tuition2ndYear, setTuition2ndYear] = useState("")
  const [tuition3rdYear, setTuition3rdYear] = useState("")
  const [tuition4thYear, setTuition4thYear] = useState("")
  const [total2, setTotal2] = useState(0)
  const [total3, setTotal3] = useState(0)
  const [total4, setTotal4] = useState(0)

  const latformsubmit = (e) => {
    e.preventDefault();

    Axios.post(`${props.baseURL}/AddStudent`, {
      name,
      type: "lateral",
      cid: props.userDetails.cid,
      studentMobile,
      gender,
      department,
      category,
      date,
      sem: 3,
      academicYear,
      placeOfBirth,
      caste,
      nationality,
      bgrp,
      aadharNo,
      mail,
      quota,
      accNo,
      bankName,
      branch,
      ifscCode,
      fatherName,
      occupation,
      annualIncome,
      parentMobile,
      office,
      parentMail,
      landphone,
      mothersName,
      motherOccupation,
      address,
      pincode,
      sslcFrom,
      sslcTo,
      sslcInstitute,
      sslcDistrict,
      sslcState,
      sslcClassObtained,
      lastAttendedCOllegeName,
      collegeBoardName,
      collegeRegisterNumber,
      sem1max,
      sem1obt,
      sem1per,
      sem2max,
      sem2obt,
      sem2per,
      sem3max,
      sem3obt,
      sem3per,
      sem4max,
      sem4obt,
      sem4per,
      sem5max,
      sem5obt,
      sem5per,
      sem6max,
      sem6obt,
      sem6per,
      avgmax,
      avgobt,
      avgper,
      university2ndYear,
      university3rdYear,
      university4thYear,
      tuition2ndYear,
      tuition3rdYear,
      tuition4thYear,
    })
      .then((response) => {
        if (response.data.affectedRows > 0) {
          alert("Record Added Successfully");
          document.getElementById("latForm").reset();
        }
        else {
          alert("failed to Add");
          document.getElementById("latForm").reset();
        }
      });

  };

  return (
    <div style={styles}>
      <div className="text-uppercase">
        <h5 align='center'>secab association's</h5>
        <h2 align='center'>{props.iname} </h2>
      </div>
      <form onSubmit={latformsubmit} id="latForm" method="post">
        <table className="table table-bordered mt-2">
          <tr>
            <th rowSpan="11" className="align-middle text-center">Details of Candidate</th>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="form-group">
                <label htmlhtmlFor="name" className="font-weight-bold">Academic Year<span style={span}>*</span></label>
                <select className="form-control" name="academic_year" required onChange={e => { setAcademicYear(e.target.value) }} id="academic_year" dangerouslySetInnerHTML={{ __html: academicYearOption }}>
                </select>
              </div>
              <div className="form-group"> 
                <label htmlhtmlFor="name" className="font-weight-bold">Name of the Candidate(In Block Letters as per 10+2/P.U.C marks card)<span style={span}>*</span></label>
                <input required type="text" onChange={e => { setName(e.target.value) }} className="form-control" name="name" id="name" placeholder="Enter Name" />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="form-group">
                <label htmlhtmlFor="name" className="font-weight-bold">Quota<span style={span}>*</span></label>
                <select className="form-control" name="Quota" required="" onChange={e => { setQuota(e.target.value) }} id="Quota" dangerouslySetInnerHTML={{ __html: quotaOption }}>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="form-group">
                <label htmlhtmlFor="department" className="font-weight-bold">Desired Branch<span style={span}>*</span></label>
                <select className="form-control" name="department" required="" onChange={e => { setDepartment(e.target.value) }} id="department" dangerouslySetInnerHTML={{ __html: departmentOption }}>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="contactNo" className="font-weight-bold">Contact No<span >*</span></label>
                <input required type="number" onChange={e => { setStudentMobile(e.target.value) }} className="form-control" name="contactNo" id="contactNo" placeholder="Enter Contact Number" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="gender" className="font-weight-bold">Gender<span style={span}>*</span></label>
                <select required className="form-control" onChange={e => { setGender(e.target.value) }} name="gender" id="gender">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="dob" className="font-weight-bold">Date of Birth<span style={span}>*</span></label>
                <input required type="date" onChange={e => { setDate(e.target.value) }} className="form-control" name="dob" id="dob" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="placeOfBirth" className="font-weight-bold">Place of Birth</label>
                <input type="text" className="form-control" onChange={e => { setPlaceOfBirth(e.target.value) }} name="placeOfBirth" id="placeOfBirth" placeholder="Enter Place of Birth" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="caste" className="font-weight-bold">Religion / Caste<span style={span}>*</span></label>
                <input required type="text" className="form-control" onChange={e => { setCaste(e.target.value) }} name="caste" id="caste" placeholder="Enter Religion / Caste" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="casteCategory" className="font-weight-bold">Caste Category<span style={span}>*</span></label>
                <select className="form-control" name="department" required="" onChange={e => { setCategory(e.target.value) }} id="department" dangerouslySetInnerHTML={{ __html: categoryOption }}>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="nationality" className="font-weight-bold">Nationality<span style={span}>*</span></label>
                <input required type="text" className="form-control" onChange={e => { setNationality(e.target.value) }} name="nationality" id="nationality" placeholder="Enter Nationality" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="bloodGroup" className="font-weight-bold">Blood Group</label>
                <input type="text" className="form-control" onChange={e => { setBgrp(e.target.value) }} name="bloodGroup" id="bloodGroup" placeholder="Enter Blood Group" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="aadharNo" className="font-weight-bold">Aadhar No<span style={span}>*</span></label>
                <input required type="text" className="form-control" onChange={e => { setAadharNo(e.target.value) }} name="aadharNo" id="aadharNo" placeholder="Enter Aadhar No" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="email" className="font-weight-bold">E-mail</label>
                <input type="email" className="form-control" onChange={e => { setMail(e.target.value) }} name="email" id="email" placeholder="Enter E-mail" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="bankName" className="font-weight-bold">Bank Name</label>
                <input type="text" className="form-control" onChange={e => { setBankName(e.target.value) }} name="bankName" id="bankName" placeholder="Enter Bank Name" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="accountNo" className="font-weight-bold">Account No</label>
                <input type="number" className="form-control" onChange={e => { setAccNo(e.target.value) }} name="accountNo" id="accountNo" placeholder="Enter Account No" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="branch" className="font-weight-bold">Branch</label>
                <input type="text" className="form-control" onChange={e => { setBranch(e.target.value) }} name="branch" id="branch" placeholder="Enter Branch" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="ifscCode" className="font-weight-bold">IFSC Code</label>
                <input type="text" className="form-control" onChange={e => { setIfscCode(e.target.value) }} name="ifscCode" id="ifscCode" placeholder="Enter IFSC Code" />
              </div>
            </td>
          </tr>
          <tr>
            <th rowSpan="6" className="align-middle text-center">Details of Parents / Guardian</th>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="form-group">
                <label htmlhtmlFor="fatherName" className="font-weight-bold">Name of Father / Guardian<span style={span}>*</span></label>
                <input required type="text" className="form-control" onChange={e => { setFatherName(e.target.value) }} name="fatherName" id="fatherName" placeholder="Enter Father / Guardian Name" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="occupation" className="font-weight-bold">Occupation<span style={span}>*</span></label>
                <input required type="text" className="form-control" onChange={e => { setOccupation(e.target.value) }} name="occupation" id="occupation" placeholder="Enter Occupation" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="annualIncome" className="font-weight-bold">Annual Income Rs.<span style={span}>*</span></label>
                <input required type="number" className="form-control" onChange={e => { setAnnualIncome(e.target.value) }} name="annualIncome" id="annualIncome" placeholder="Enter Annual Income Rs." />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="parentsContactNo" className="font-weight-bold">Contact No<span style={span}>*</span></label>
                <input required type="number" className="form-control" onChange={e => { setParentMobile(e.target.value) }} name="parentsContactNo" id="parentsContactNo" placeholder="Enter Father / Guardian Contact No" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="landPhone" className="font-weight-bold">Landphone(Resi)</label>
                <input type="number" className="form-control" onChange={e => { setLandphone(e.target.value) }} name="landPhone" id="landPhone" placeholder="Enter Landphone(Resi)" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="parentsContactNo" className="font-weight-bold">Office</label>
                <input type="number" className="form-control" onChange={e => { setOffice(e.target.value) }} name="parentsOfficeNo" id="parentsOfficeNo" placeholder="Enter Office No" />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="fatherEmail" className="font-weight-bold">E-mail</label>
                <input type="email" className="form-control" onChange={e => { setParentMail(e.target.value) }} name="fatherEmail" id="fatherEmail" placeholder="Enter E-mail" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="motherName" className="font-weight-bold">Mothers Name<span style={span}>*</span></label>
                <input required type="text" className="form-control" onChange={e => { setMothersName(e.target.value) }} name="motherName" id="motherName" placeholder="Enter Mother's Name" />
              </div>
            </td>

            <td>
              <div className="form-group">
                <label htmlhtmlFor="gurdianOccupation" className="font-weight-bold">Occupation<span style={span}>*</span></label>
                <input required type="text" className="form-control" onChange={e => { setMotherOccupation(e.target.value) }} name="gurdianOccupation" id="gurdianOccupation" placeholder="Enter Occupation" />
              </div>
            </td>
          </tr>

          {/* //Parents / Guardian End

        //address */}
          <tr>
            <th rowSpan="2" className="align-middle text-center">Correspondence Address</th>
          </tr>

          <tr>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="address" className="font-weight-bold">Address<span style={span}>*</span></label>
                <textarea required className="form-control" onChange={e => { setAddress(e.target.value) }} name="address" id="address" rows="4" placeholder="Enter Address"></textarea>
              </div>
            </td>
            <td>
              <div className="form-group">
                <label htmlhtmlFor="pincode" className="font-weight-bold">Pincode<span style={span}>*</span></label>
                <input required type="number" className="form-control" onChange={e => { setPincode(e.target.value) }} name="pincode" id="pincode" placeholder="Enter Pincode" />
              </div>
            </td>
          </tr>
          {/* //end address

        //details of sslc */}
          <tr>
            <th rowSpan="2" className="align-middle text-center">Details of SSLC</th>
          </tr>

          <tr>
            <td colSpan="2">
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th colSpan="3" className="text-center align-middle">Calender Year</th>
                    <th rowSpan="2" className="align-middle text-center">Name of the Institution<span style={span}>*</span></th>
                    <th rowSpan="2" className="align-middle text-center">District<span style={span}>*</span></th>
                    <th rowSpan="2" className="align-middle text-center">State<span style={span}>*</span></th>
                    <th rowSpan="2" className="align-middle text-center">Class Obtained<span style={span}>*</span></th>
                  </tr>
                  <tr>
                    <th></th>
                    <th className="text-center">From<span style={span}>*</span></th>
                    <th className="text-center">To<span style={span}>*</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10th</td>
                    <td><input required type="date" onChange={e => { setSslcFrom(e.target.value) }} name="sslcFrom" id="sslcFrom" className="form-control" /></td>
                    <td><input required type="date" onChange={e => { setSslcTo(e.target.value) }} name="sslcTo" id="sslcTo" className="form-control" /></td>
                    <td><input required type="text" onChange={e => { setSslcInstitute(e.target.value) }} name="sslcInstitute" className="form-control" placeholder="Enter Name of the Institution" /></td>
                    <td><input required type="text" onChange={e => { setSslcDistrict(e.target.value) }} name="sslcDistrict" className="form-control" placeholder="Enter Name of District" /></td>
                    <td><input required type="text" onChange={e => { setSslcState(e.target.value) }} name="sslcState" className="form-control" placeholder="Enter Name of State" /></td>
                    <td><input required type="text" onChange={e => { setSslcClassObtained(e.target.value) }} name="sslcClassObtained" className="form-control" placeholder="Enter Class Obtained" /></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* //details of sslc end

        //Details of Qualifying Examination Passed */}
          <tr>
            <th rowSpan="2" className="align-middle text-center">Details of Qualifying Examination Passed</th>
          </tr>

          <tr>
            <td colSpan="2">
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Name of the Institution / College Last Attended<span style={span}>*</span></th>
                    <th>Name Of University / Board<span style={span}>*</span></th>
                    <th>Reg.No.<span style={span}>*</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input required type="text" onChange={e => { setLastAttendedCOllegeName(e.target.value) }} name="lastAttendedCOllegeName" id="lastAttendedCOllegeName" className="form-control" placeholder="Enter Institution / College" /></td>
                    <td><input required type="text" onChange={e => { setCollegeBoardName(e.target.value) }} name="collegeBoardName" id="collegeBoardName" className="form-control" placeholder="Enter University / Board" /></td>
                    <td><input required type="text" onChange={e => { setCollegeRegisterNumber(e.target.value) }} name="collegeRegisterNumber" id="collegeRegisterNumber" className="form-control" placeholder="Enter Reg.No." /></td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table>
                <tbody className="font-weight-bold">
                  <tr>All Field are Required<span style={span}>*</span></tr>
                  <tr>
                    <th>Subject</th>
                    <th>Semester</th>
                    <th>Maximum Marks<span style={span}>*</span></th>
                    <th>Marks Obtained<span style={span}>*</span></th>
                    <th>Percentage<span style={span}>*</span></th>
                  </tr>
                  <tr>
                    <th className="text-left" rowspan="2">Diploma I Year<span style={span}>*</span></th>
                    <th className="text-center">I</th>
                    <td><input required type="text" className="form-control" name="lat_sem1_max" onChange={e => { setSem1max(e.target.value) }} id="lat_sem1_max" placeholder="Enter Physics Maximum Marks" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem1_obt" onChange={e => { setSem1obt(e.target.value) }} id="lat_sem1_obt" placeholder="Enter Physics Marks Obtained" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem1_per" onChange={e => { setSem1per(e.target.value) }} id="lat_sem1_per" placeholder="Enter Physics Percentage" /></td>
                  </tr>
                  <tr>
                    <th className="text-center">II</th>
                    <td><input required type="text" className="form-control" name="lat_sem2_max" onChange={e => { setSem2max(e.target.value) }} id="lat_sem2_max" placeholder="Enter Physics Maximum Marks" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem2_obt" onChange={e => { setSem2obt(e.target.value) }} id="lat_sem2_obt" placeholder="Enter Physics Marks Obtained" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem2_per" onChange={e => { setSem2per(e.target.value) }} id="lat_sem2_per" placeholder="Enter Physics Percentage" /></td>
                  </tr>
                  <tr>
                    <th className="text-left" rowspan="2">Diploma II Year<span style={span}>*</span></th>
                    <th className="text-center">III</th>
                    <td><input required type="text" className="form-control" name="lat_sem3_max" onChange={e => { setSem3max(e.target.value) }} id="lat_sem3_max" placeholder="Enter Maximum Marks" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem3_obt" onChange={e => { setSem3obt(e.target.value) }} id="lat_sem3_obt" placeholder="Enter Marks Obtained" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem3_per" onChange={e => { setSem3per(e.target.value) }} id="lat_sem3_per" placeholder="Enter Percentage" /></td>
                  </tr>
                  <tr>
                    <th className="text-center">IV</th>
                    <td><input required type="text" className="form-control" name="lat_sem4_max" onChange={e => { setSem4max(e.target.value) }} id="lat_sem4_max" placeholder="Enter Physics Maximum Marks" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem4_obt" onChange={e => { setSem4obt(e.target.value) }} id="lat_sem4_obt" placeholder="Enter Physics Marks Obtained" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem4_per" onChange={e => { setSem4per(e.target.value) }} id="lat_sem4_per" placeholder="Enter Physics Percentage" /></td>
                  </tr>
                  <tr>
                    <th className="text-left" rowspan="2">Diploma III Year<span style={span}>*</span></th>
                    <th className="text-center">V</th>
                    <td><input required type="text" className="form-control" name="lat_sem5_max" onChange={e => { setSem5max(e.target.value) }} id="lat_sem5_max" placeholder="Enter Mathematics Maximum Marks" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem5_obt" onChange={e => { setSem5obt(e.target.value) }} id="lat_sem5_obt" placeholder="Enter Mathematics Marks Obtained" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem5_per" onChange={e => { setSem5per(e.target.value) }} id="lat_sem5_per" placeholder="Enter Mathematics Percentage" /></td>
                  </tr>
                  <tr>
                    <th className="text-center">VI</th>
                    <td><input required type="text" className="form-control" name="lat_sem6_max" onChange={e => { setSem6max(e.target.value) }} id="lat_sem6_max" placeholder="Enter Physics Maximum Marks" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem6_obt" onChange={e => { setSem6obt(e.target.value) }} id="lat_sem6_obt" placeholder="Enter Physics Marks Obtained" /></td>
                    <td><input required type="text" className="form-control" name="lat_sem6_per" onChange={e => { setSem6per(e.target.value) }} id="lat_sem6_per" placeholder="Enter Physics Percentage" /></td>
                  </tr>
                  <tr>
                    <td colspan="2">Aggregate Total Marks<span style={span}>*</span></td>
                    <td><input required type="text" onChange={e => { setAvgmax(e.target.value) }} name="aggregateMaximumMarks" id="aggregateMaximumMarks" className="form-control" placeholder="Enter Maximum Marks" /></td>
                    <td><input required type="text" onChange={e => { setAvgobt(e.target.value) }} name="aggregateMarksObtained" id="aggregateMarksObtained" className="form-control" placeholder="Enter Marks Obtained" /></td>
                    <td><input required type="text" onChange={e => { setAvgper(e.target.value) }} name="aggregatePecentage" id="aggregatePecentage" className="form-control" placeholder="Enter Percentage" /></td>
                  </tr>
                </tbody>
              </table>
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
                    <th>Second Year<span style={span}>*</span></th>
                    <th>Third Year<span style={span}>*</span></th>
                    <th>Fourth Year<span style={span}>*</span></th>
                  </tr>
                </thead>
                <tbody className="font-weight-bold">
                  <tr>
                    <td>1</td>
                    <td>University Fee<span style={span}>*</span></td>
                    <td><input required type="number" onChange={e => { setUniversity2ndYear(e.target.value) }} name="university2ndYear" id="university2ndYear" className="form-control" placeholder="Enter Second Year University Fee" /></td>
                    <td><input required type="number" onChange={e => { setUniversity3rdYear(e.target.value) }} name="university3rdYear" id="university3rdYear" className="form-control" placeholder="Enter Third Year University Fee" /></td>
                    <td><input required type="number" onChange={e => { setUniversity4thYear(e.target.value) }} name="university4thYear" id="university4thYear" className="form-control" placeholder="Enter Fourth Year University Fee" /></td>


                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Tuition Fee<span style={span}>*</span></td>
                    <td><input required type="number" onChange={e => { setTuition2ndYear(e.target.value) }} name="tuition2ndYear" id="tuition2ndYear" className="form-control" placeholder="Enter Second Year Tuition Fee" /></td>
                    <td><input required type="number" onChange={e => { setTuition3rdYear(e.target.value) }} name="tuition3rdYear" id="tuition3rdYear" className="form-control" placeholder="Enter Third Year Tuition Fee" /></td>
                    <td><input required type="number" onChange={e => { setTuition4thYear(e.target.value) }} name="tuition4thYear" id="tuition4thYear" className="form-control" placeholder="Enter Fourth Year Tuition Fee" /></td>

                  </tr>



                  <tr>
                    <td colSpan="2">Total</td>
                    <td><input type="number" onChange={e => { setTotal2(e.target.value) }} className="form-control" name="total2" id="total2" value="0" readOnly /></td>
                    <td><input type="number" onChange={e => { setTotal3(e.target.value) }} className="form-control" name="total3" id="total3" value="0" readOnly /></td>
                    <td><input type="number" onChange={e => { setTotal4(e.target.value) }} className="form-control" name="total4" id="total4" value="0" readOnly /></td>

                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
        <center>
          <button className="btn btn-primary rounded mb-3" type="submit">Submit</button>
        </center>
      </form>

    </div>
  )
}

export default Lateralentryform
