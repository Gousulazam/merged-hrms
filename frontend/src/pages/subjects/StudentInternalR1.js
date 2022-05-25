import React, {useEffect,useState} from 'react';
import { useLocation ,useParams} from 'react-router-dom';
import axios from 'axios';

const StudentInternalR1 = (props) => {
    const {state} = useLocation();
    const [cllgDetails, setCllgDetails] = useState("")
    const [table, setTable] = useState('');

    useEffect(() => {
        axios.post(`${props.baseURL}/getdepartmentdetailbyid`, {
            //cid : state.cid
            cid: props.userDetails.cid
        }).then((response) => {
           setCllgDetails(response.data[0]);
        });
    },[])

    useEffect(() => {
        axios.post(`${props.baseURL}/getstudentlist3`, {
            academic_year : state.academic_year,
            did: state.department,
            sem : state.sem, 
            ia :  state.ia,
        }).then((response) => {
            //console.log(response.data)
            setTable(response.data)
        });
    },[])

    

    

  return (
    <>
     
<div className="card">
    <div className="card-header text-center">
        <center>
        <strong className="card-title">
        <br/> Department of  {cllgDetails.name}
        <br/> Semester : {state.sem}
        <br/> Internal : {state.ia}
        <br />Academic Year : {state.academic_year}
        </strong></center>
    </div>
    <div className="card-body">
        <table className="table table-bordered table-dataTable"  style={{border:'1', cellspacing:"0"}} dangerouslySetInnerHTML={{__html : table}} >
            
        </table>
    </div>
</div>
</>

    
  )
}

export default StudentInternalR1
