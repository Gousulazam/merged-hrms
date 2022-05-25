import logo from './logo.svg';
import './App.css';
import Sidebar from './componets/Sidebar';
import Header from './componets/Header';
import Login from './pages/user/Login';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddCo from './pages/attainment/AddCo';
import MappingCo from './pages/attainment/MappingCo';
import SubjectReport from './pages/reports/SubjectReport';
import ReportSubject from './pages/reports/ReportSubject';
import ViewCo from './pages/attainment/ViewCo';
import CoView from './pages/attainment/CoView';
import ViewQuestionPaper from './pages/attainment/ViewQuestionPaper';
import HandlingSubject from './pages/reports/HandlingSubject';
import AddEresouce from './pages/eresource/AddEresouce';
import Scheme from './pages/scheme/Scheme';
import SubjectReportDetails from './pages/reports/SubjectReportDetails';
import ReportSubjectDetails from './pages/reports/ReportSubjectDetails';
import ViewAttendance from './pages/reports/ViewAttendance';
import AttendanceView from './pages/reports/AttendanceView';
import IaReport from './pages/reports/IaReport';
import ReportIa from './pages/reports/ReportIa';
import Attendance from './pages/attendance/Attendance';
import Addattendance from './pages/attendance/Addattendance';
import LabAttendance from './pages/attendance/LabAttendance';
import AddLabAttendance from './pages/attendance/AddLabAttendance';
import MappingCoPo from './pages/attainment/MappingCoPo';
import CopoMapping from './pages/attainment/CopoMapping';
import AddPso from './pages/attainment/AddPso';
import PsoAdd from './pages/attainment/PsoAdd';
import Admissionform from './pages/Student-module/Admissionform';
import Getviewstudent from './pages/Student-module/Getviewstudent';
import Getstudentlist from './pages/Student-module/Getstudentlist';
import Getupdatestudentlist from './pages/Student-module/Getupdatestudentlist';
import Updatestudentlist from './pages/Student-module/Updatestudentlist';
import Editstudentdetail from './pages/Student-module/Editstudentdetail';
import Getdeletestudent from './pages/Student-module/Getdeletestudent';
import Deletestudentlist from './pages/Student-module/Deletestudentlist';
import Assignsubject from './pages/subject/Assignsubject';
import Assignsubjectlist from './pages/subject/Assignsubjectlist';
import Assingdivison from './pages/Student-module/Assingdivison';
import Studentlistview from './pages/Student-module/Studentlistview';
import DepartmentFeeDetails from './pages/reports/DepartmentFeeDetails';
import FeeDetailsDepartment from './pages/reports/FeeDetailsDepartment';
import ConsolidateDepartmentFeeDetails from './pages/reports/ConsolidateDepartmentFeeDetails';
import ConsolidateDepartment from './pages/reports/ConsolidateDepartment';
import DepartmentConsolidate from './pages/reports/DepartmentConsolidate';
import FeeCollectionDetails from './pages/reports/FeeCollectionDetails';
import CollectionFeeDetails from './pages/reports/CollectionFeeDetails';
import PayUsnWise from './pages/fees/PayUsnWise';
import AfterPayTransaction from './pages/fees/AfterPayTransaction';
import ViewConsolidateFeesDetails from './pages/reports/ViewConsolidateFeesDetails';
import DeleteTransaction from './pages/fees/DeleteTransaction';
import ViewDeleteTranscationStatus from './pages/fees/ViewDeleteTranscationStatus';
import ApproveDeleteTranscations from './pages/fees/ApproveDeleteTranscations';
import DeleteTransactionsDetails from './pages/fees/DeleteTransactionsDetails';
import DeleteStudentFeeDetails from './pages/fees/DeleteStudentFeeDetails';
import DeleteStudentfeeDetailsStatus from './pages/fees/DeleteStudentfeeDetailsStatus';
import ApproveDeleteStudentFeedetails from './pages/fees/ApproveDeleteStudentFeedetails';
import EditStudentFeedetails from './pages/fees/EditStudentFeedetails';
import EditFeeFixationStatus from './pages/fees/EditFeeFixationStatus';
import ApproveEditFeeFixation from './pages/fees/ApproveEditFeeFixation';
import PayDepartmentWise from './pages/fees/PayDepartmentWise';
import DepartmentWisePay from './pages/fees/DepartmentWisePay';
import IaMarksEntry from './pages/attainment/IaMarksEntry';
import MarksEntryIa from './pages/attainment/MarksEntryIa';
import IaAttainmentSheet from './pages/attainment/IaAttainmentSheet';
import SheetAttainmentIa from './pages/attainment/SheetAttainmentIa';
import LabBatchAssign from './pages/subjects/LabBatchAssign';
import LabBatchAssign1 from './pages/subjects/LabBatchAssign1';
import SubjectAdd from './pages/subjects/ViewSubDetails/SubjectAdd';
import StudentInternalR from './pages/subjects/StudentInternalR';
import StudentInternalR1 from './pages/subjects/StudentInternalR1';
import GenerateSubject from './pages/subjects/GenerateSubject';
import EditSubjects from './pages/subjects/EditSubjects';
import ViewSubjectAss from './pages/subjects/ViewSubjectAss';
import ViewSubjectAssignedToStdt from './pages/subjects/ViewSubjectAssignedToStdt';
import SubjectView from './pages/subjects/ViewSubDetails/SubjectView';
import GetSubjectList from './pages/subjects/ViewSubDetails/GetSubjectList';
import { AddCoe } from './pages/COE/AddCoe';
import AddEvent from './pages/COE/AddEvent';
import { ViewCoe } from './pages/COE/Viewcoe';
import CoeView from './pages/COE/CoeView';
import { CoePrint } from './pages/COE/CoePrint';
import { Addevntdetails } from './pages/COE/Addevntdetails';
import { EditDelete } from './pages/COE/EditDelete';
import ShowEvent from './pages/COE/ShowEvent';
import {EditEvent} from './pages/COE/EditEvent';
import {Addlsnpln} from './pages/LessonPlan/addlsnpln';
import {AddLP} from './pages/LessonPlan/AddLP';
import {UpdateLP} from './pages/LessonPlan/UpdateLP';
import {Updatelsnpln} from './pages/LessonPlan/Updatelsnpln';
import {ViewLP} from './pages/LessonPlan/ViewLP';
import {Viewlsnpln} from './pages/LessonPlan/Viewlsnpln';
import {Addlablsnpln} from './pages/LessonPlan/addlablsnpln';
import {Editlsnpln} from './pages/LessonPlan/Editlsnpln';
import {AddlabLP} from './pages/LessonPlan/AddlabLP';
import {Editlablsnpln} from './pages/LessonPlan/Editlablsnpln';
import {UpdatelabLP} from './pages/LessonPlan/UpdatelabLP';
import {Updatelablsnpln} from './pages/LessonPlan/Updatelablsnpln';
import {ViewlabLP} from './pages/LessonPlan/ViewlabLP';
import {Viewlablsnpln} from './pages/LessonPlan/Viewlablsnpln'; 
import {Syllebus} from './pages/LessonPlan/syllebus'; 
import {Viewsyll} from './pages/LessonPlan/Viewsyll'; 
import {Questionpaper} from './pages/Internal_Assessment/Questionpaper'; 
import {Addqp} from './pages/Internal_Assessment/Addqp';
import {Edit} from './pages/Internal_Assessment/Edit'; 
import {EditQuestions} from './pages/Internal_Assessment/EditQuestions'; 
import {Headers} from './pages/Newfees/headers'; 
import {Addheader} from './pages/Newfees/Addheader'; 
import {Editheader} from './pages/Newfees/Editheader'; 
import {Usnwise} from './pages/Newfees/usnwise';
import {Payusnwise} from './pages/Newfees/Payusnwise';
import {Addfee} from './pages/Newfees/Addfee'; 
import {Update} from './pages/Newfees/Update'; 
import {Transaction} from './pages/Newfees/Transaction';
import {EditTransaction} from './pages/Newfees/EditTransaction'; 
import { EditEvent } from './pages/COE/EditEvent';
import { Addlsnpln } from './pages/LessonPlan/addlsnpln';
import { AddLP } from './pages/LessonPlan/AddLP';
import { UpdateLP } from './pages/LessonPlan/UpdateLP';
import { Updatelsnpln } from './pages/LessonPlan/Updatelsnpln';
import { ViewLP } from './pages/LessonPlan/ViewLP';
import { Viewlsnpln } from './pages/LessonPlan/Viewlsnpln';
import { Addlablsnpln } from './pages/LessonPlan/addlablsnpln';
import { Editlsnpln } from './pages/LessonPlan/Editlsnpln';
import { AddlabLP } from './pages/LessonPlan/AddlabLP';
import { Editlablsnpln } from './pages/LessonPlan/Editlablsnpln';
import { UpdatelabLP } from './pages/LessonPlan/UpdatelabLP';
import { Updatelablsnpln } from './pages/LessonPlan/Updatelablsnpln';
import { ViewlabLP } from './pages/LessonPlan/ViewlabLP';
import { Viewlablsnpln } from './pages/LessonPlan/Viewlablsnpln';
import { Syllebus } from './pages/LessonPlan/syllebus';
import { Viewsyll } from './pages/LessonPlan/Viewsyll';
import { Questionpaper } from './pages/Internal_Assessment/Questionpaper';
import { Addqp } from './pages/Internal_Assessment/Addqp';
import { Edit } from './pages/Internal_Assessment/Edit';
import { EditQuestions } from './pages/Internal_Assessment/EditQuestions';
import { Headers } from './pages/Newfee/headers';
import { Addheader } from './pages/Newfee/Addheader';
import { Editheader } from './pages/Newfee/Editheader';
import { Usnwise } from './pages/Newfee/usnwise';
import { Payusnwise } from './pages/Newfee/Payusnwise';
import { Addfee } from './pages/Newfee/Addfee';
import {Update} from './pages/Newfee/Update';
import { Transaction } from './pages/Newfee/Transaction';
import { EditTransaction } from './pages/Newfee/EditTransaction';

import Updatedivision from './pages/Student-module/Updatedivision';
import Admissionformapproval from './pages/approval/Admissionformapproval';
import ApproveAdmission from './pages/approval/ApproveAdmission';
import ViewAdmittedStudentsnew from './pages/Student-module/ViewAdmittedStudentsnew';
import Viewadmissionform from './pages/Student-module/Viewadmissionform';
import AssingWorkload from './workload/AssingWorkload';
import GetWorkloadReport from './workload/GetWorkloadReport';
import WorkLoadReport from './workload/WorkLoadReport';


function App() {
  const Dashboard = () => {
    return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  }

  const formatDate = (type, date22) => {
    var today = new Date(date22);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    if (type == 'db') {
      return `${yyyy}-${mm}-${dd}`;
    } else {
      return `${dd}-${mm}-${yyyy}`;
    }
  }

  const wordify = (num) => {
    const single = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const double = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const formatTenth = (digit, prev) => {
      return 0 == digit ? "" : " " + (1 == digit ? double[prev] : tens[digit])
    };
    const formatOther = (digit, next, denom) => {
      return (0 != digit && 1 != next ? " " + single[digit] : "") + (0 != next || digit > 0 ? " " + denom : "")
    };
    let res = "";
    let index = 0;
    let digit = 0;
    let next = 0;
    let words = [];
    if (num += "", isNaN(parseInt(num))) {
      res = "";
    }
    else if (parseInt(num) > 0 && num.length <= 10) {
      for (index = num.length - 1; index >= 0; index--) switch (digit = num[index] - 0, next = index > 0 ? num[index - 1] - 0 : 0, num.length - index - 1) {
        case 0:
          words.push(formatOther(digit, next, ""));
          break;
        case 1:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 2:
          words.push(0 != digit ? " " + single[digit] + " Hundred" + (0 != num[index + 1] && 0 != num[index + 2] ? " and" : "") : "");
          break;
        case 3:
          words.push(formatOther(digit, next, "Thousand"));
          break;
        case 4:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 5:
          words.push(formatOther(digit, next, "Lakh"));
          break;
        case 6:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 7:
          words.push(formatOther(digit, next, "Crore"));
          break;
        case 8:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 9:
          words.push(0 != digit ? " " + single[digit] + " Hundred" + (0 != num[index + 1] || 0 != num[index + 2] ? " and" : " Crore") : "")
      };
      res = words.reverse().join("")
      res = res + " rupees"
    } else res = "";
    return res
  };

  const numberWithCommas = (x) => {
    return x.toString().split('.')[0].length > 3 ? x.toString().substring(0, x.toString().split('.')[0].length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length - 3) : x.toString();
  }

  const [login, setLogin] = useState(sessionStorage.getItem('login'))
  const [userDetails, setUserDetails] = useState(JSON.parse(sessionStorage.getItem('userDetails')));
  const [role, setRole] = useState(sessionStorage.getItem('role'))

  if (userDetails == null) {
    setUserDetails({
      name: "",
      id: "",
      roles: "",
    })
  }
  const baseURL = `http://localhost:5000`;
  const loader = () => { return `<center><img width="80%" height="500px" src='/assets/loader/Vanilla-1s-280px.svg' /></center>`; }
  return (
    <>
      {login && <Sidebar userDetails={userDetails} setRole={setRole} role={role} baseURL={baseURL} />}
      <div id="right-panel" className="right-panel">
        {login && <Header userDetails={userDetails} setRole={setRole} setLogin={setLogin} baseURL={baseURL} setUserDetails={setUserDetails} />}
        <div className="content mt-3">
          <BrowserRouter>
            <Routes>
              {/* Gous Module Start */}
              <Route path="/" element={<Login setLogin={setLogin} baseURL={baseURL} setUserDetails={setUserDetails} setRole={setRole} />} />
              <Route path="/dashboard" element={<Dashboard />} force='refresh' />
              <Route path="/addco" element={<AddCo baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/mappingco" element={<MappingCo baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/viewco" element={<ViewCo baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/coview" element={<CoView baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/subjectreport" element={<SubjectReport baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/reportSubject" element={<ReportSubject baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} loader={loader} />} />
              <Route path="/viewquestionpaper" element={<ViewQuestionPaper baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/handlingsubject" element={<HandlingSubject baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/eresource" element={<AddEresouce baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/uploadscheme" element={<Scheme baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/subjectreportdetails" element={<SubjectReportDetails baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/reportsubjectdetails" element={<ReportSubjectDetails baseURL={baseURL} userDetails={userDetails} loader={loader} />} />
              <Route path="/viewattendance" element={<ViewAttendance baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/attendanceview" element={<AttendanceView baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/iareport" element={<IaReport baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/reportia" element={<ReportIa baseURL={baseURL} userDetails={userDetails} />} />
              {/* Gous Moudule End */}
              {/* Sohail Moudule Start */}
              <Route path="/admissionform" element={<Admissionform baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/getviewstudent" element={<Getviewstudent baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/getstudentlist" element={<Getstudentlist baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/getupdatestudentlist" element={<Getupdatestudentlist baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/Updatestudentlist" element={<Updatestudentlist baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/editstudentdetail" element={<Editstudentdetail baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/getdeletestudent" element={<Getdeletestudent baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/deletestudentlist" element={<Deletestudentlist baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/updatedivision" element={<Updatedivision baseURL={baseURL} userDetails={userDetails}/>} />
              <Route path="/admissionformapproval" element={<Admissionformapproval baseURL={baseURL} role={role} userDetails={userDetails}/>} />
              <Route path="/approveAdmission" element={<ApproveAdmission baseURL={baseURL} role={role} userDetails={userDetails}/>} />
              <Route path="/viewAdmittedStudentsnew" element={<ViewAdmittedStudentsnew baseURL={baseURL} role={role} userDetails={userDetails}/>} />
              <Route path="/Viewadmissionform" element={<Viewadmissionform baseURL={baseURL} role={role} userDetails={userDetails}/>} />
              <Route path="/AssingWorkload" element={<AssingWorkload baseURL={baseURL} role={role} userDetails={userDetails}/>} />
              <Route path="/GetWorkloadReport" element={<GetWorkloadReport baseURL={baseURL} role={role} userDetails={userDetails}/>} />
              <Route path="/WorkLoadReport" element={<WorkLoadReport baseURL={baseURL} role={role} userDetails={userDetails}/>} />
              {/* Sohail Moudule End */}
              {/* Gous Moudule Start */}
              <Route path="/attendance" element={<Attendance baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/addattendance" element={<Addattendance baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/labattendance" element={<LabAttendance baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/addlabattendance" element={<AddLabAttendance baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/copomapping" element={<CopoMapping baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/mappingcopo" element={<MappingCoPo baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/addpso" element={<AddPso baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/psoadd" element={<PsoAdd baseURL={baseURL} userDetails={userDetails} />} />
              {/* Gous Moudule End */}
              {/* Sohail Moudule Start */}
              <Route path="/assignsubject" element={<Assignsubject baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/assignsubjectlist" element={<Assignsubjectlist baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/assingdivison" element={<Assingdivison baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/studentlistview" element={<Studentlistview baseURL={baseURL} userDetails={userDetails} />} />
              {/* Sohail Moudule End */}
              {/* Gous Moudule Start */}
              <Route path="/departmentfeeDetails" element={<DepartmentFeeDetails baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/feeDetailsdepartment" element={<FeeDetailsDepartment baseURL={baseURL} userDetails={userDetails} loader={loader} />} />
              <Route path="/consolidatedepartmentfeeDetails" element={<ConsolidateDepartmentFeeDetails baseURL={baseURL} userDetails={userDetails} loader={loader} />} />
              <Route path="/consolidatedepartment" element={<ConsolidateDepartment baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/departmentconsolidate" element={<DepartmentConsolidate baseURL={baseURL} userDetails={userDetails} loader={loader} />} />
              <Route path="/feecollectiondetails" element={<FeeCollectionDetails baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/collectionfeedetails" element={<CollectionFeeDetails baseURL={baseURL} userDetails={userDetails} loader={loader} />} />
              <Route path="/payusnwise" element={<PayUsnWise baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/afterpaytransaction" element={<AfterPayTransaction baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/viewconsolidatefeesdetails" element={<ViewConsolidateFeesDetails baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} loader={loader} />} />
              <Route path="/deletetransaction" element={<DeleteTransaction baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/viewdeletetranscationstatus" element={<ViewDeleteTranscationStatus baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/approvedeletetranscations" element={<ApproveDeleteTranscations baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/deletestudentfeedetails" element={<DeleteStudentFeeDetails baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/deletestudentfeedetailsstatus" element={<DeleteStudentfeeDetailsStatus baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/approvedeletestudentfeedetails" element={<ApproveDeleteStudentFeedetails baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/editstudentfeedetails" element={<EditStudentFeedetails baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/editfeefixationstatus" element={<EditFeeFixationStatus baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/approveeditfeefixation" element={<ApproveEditFeeFixation baseURL={baseURL} userDetails={userDetails} formatDate={formatDate} numberWithCommas={numberWithCommas} />} />
              <Route path="/paydepartmentwise" element={<PayDepartmentWise baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/departmentwisepay" element={<DepartmentWisePay baseURL={baseURL} userDetails={userDetails} numberWithCommas={numberWithCommas} />} />
              <Route path="/iamarksentry" element={<IaMarksEntry baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/marksentryia" element={<MarksEntryIa baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/iaattainmentsheet" element={<IaAttainmentSheet baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/sheetattainmentia" element={<SheetAttainmentIa baseURL={baseURL} userDetails={userDetails} loader={loader} />} />
              <Route path="/labbasgn" element={<LabBatchAssign baseURL={baseURL} userDetails={userDetails} /> } />
              <Route path="/labbasgn1" element={<LabBatchAssign1 baseURL={baseURL} userDetails={userDetails} /> } />
              <Route path="/subaddandview" element={<SubjectAdd baseURL={baseURL} userDetails={userDetails} /> } /> 
              <Route path="/internalrept" element={<StudentInternalR baseURL={baseURL} userDetails={userDetails} /> } /> 
              <Route path="/internalrept1" element={<StudentInternalR1 baseURL={baseURL} userDetails={userDetails} /> } /> 
              <Route path="/generatesubjects" element={<GenerateSubject baseURL={baseURL} userDetails={userDetails} /> } />
              <Route path="/editsubjects" element={<EditSubjects baseURL={baseURL} userDetails={userDetails} /> } />
              <Route path="/viewsubjectassign" element={<ViewSubjectAss baseURL={baseURL} userDetails={userDetails} /> } />
              <Route path="/viewsubstdass" element={<ViewSubjectAssignedToStdt baseURL={baseURL}/>} />
              <Route path="/subjectview" element={<SubjectView baseURL={baseURL} userDetails={userDetails} /> } />
              <Route path="/getsubjectlist" element={<GetSubjectList baseURL={baseURL} userDetails={userDetails} /> } />
              {/* Gous Moudule End */}
              {/* Humera Modules Start */}
              <Route path="/coe" element={<AddCoe />} />
              <Route path="/event" element={<AddEvent baseURL={baseURL} userDetails={userDetails} role={role} />} />
              <Route path="/addevntdetails" element={<Addevntdetails baseURL={baseURL} userDetails={userDetails} role={role} />} />
              <Route path="/viewcoe" element={<ViewCoe baseURL={baseURL} userDetails={userDetails} role={role} />} />
              <Route path="/coeview" element={<CoeView baseURL={baseURL} userDetails={userDetails} role={role} />} />
              <Route path="/coeprint/:sem/:year/:academic_year/:dept" element={<CoePrint baseURL={baseURL} userDetails={userDetails} role={role} />} />
              <Route path="/edit" element={<EditDelete baseURL={baseURL} />} />
              <Route path="/showevent" element={<ShowEvent baseURL={baseURL} />} />
              <Route path="/editevent" element={<EditEvent baseURL={baseURL} />} />

              <Route path="/lsnpln" element={<Addlsnpln baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/addlsnpln" element={<AddLP baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/uplsnpln" element={<UpdateLP baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/updatelsnpln" element={<Updatelsnpln baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/viewlp" element={<ViewLP baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/viewlsnpln" element={<Viewlsnpln baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/editlsnpln" element={<Editlsnpln baseURL={baseURL} />} />

              <Route path="/lablsnpln" element={<Addlablsnpln baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/addlablsnpln" element={<AddlabLP baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/uplablsnpln" element={<UpdatelabLP baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/updatelablsnpln" element={<Updatelablsnpln baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/viewlablp" element={<ViewlabLP baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/viewlablsnpln" element={<Viewlablsnpln baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/editlablsnpln" element={<Editlablsnpln baseURL={baseURL} />} />

              <Route path="/syllebus" element={<Syllebus baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/viewsyl" element={<Viewsyll baseURL={baseURL} userDetails={userDetails} />} />

              <Route path="/questionpaper" element={<Questionpaper baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/addqp" element={<Addqp baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/editdltqp" element={<Edit baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/editqp" element={<EditQuestions baseURL={baseURL} userDetails={userDetails} />} />

              <Route path="/headers" element={<Headers />} />
              <Route path="/addheader" element={<Addheader baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/editheader" element={<Editheader baseURL={baseURL} userDetails={userDetails} />} />

              <Route path="/pay" element={<Usnwise />} />
              <Route path="/payusnwise" element={<Payusnwise baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/addfee" element={<Addfee baseURL={baseURL} userDetails={userDetails} />} />

              <Route path="/update" element={<Update />} />
              <Route path="/transaction" element={<Transaction baseURL={baseURL} userDetails={userDetails} />} />
              <Route path="/edittransaction" element={<EditTransaction baseURL={baseURL} userDetails={userDetails} />} />
              {/* Humera Module End */}

            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;
