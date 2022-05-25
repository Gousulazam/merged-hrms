import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GetSubjectList = (props) => {
     const {state} = useLocation();
    //const [getSubDetails, setGetSubDetails] = useState([]);
    const [cllgDetails, setCllgDetails] = useState("")
    const [table ,setTable] = useState('')

    useEffect(() => {
        axios.post(`${props.baseURL}/getdepartmentdetailbyid`, {
            cid : state.cid
        }).then((response) => {
           setCllgDetails(response.data[0]);
        });
    },[])

    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjdetaillists`, {
            academicYear : state.academicYear,
            did : state.department,
            //dv : state.dv,
            cid : state.cid.cid,
            sem : state.sem,
           
        }) .then((response) => {
           
           setTable(response.data);
        });
    },[])

    // let ListTemplate;
    //     if(getSubDetails.batch) {
    //         ListTemplate = getSubDetails.map((user,index) => {
    //             <td>{user.sname}</td>
    //         }); 
    //     } else {
    //        {ListTemplate }
    //     }

  return ( 
    <div className='container'>
        <div className='card'>
            <div className="card-header text-capitalize text-center font-weight-bold">
            <h5>department of {cllgDetails.name}
            <br/>
            Semester : {state.sem}
            </h5>
            </div>

            <div className='card card-body'>
                <table className="table table-bordered dataTable"  style={{bordercollapse: "collapse",width:"100%"}} dangerouslySetInnerHTML={{__html : table}}>
                {/* <thead className="thead-dark">
                <tr>
                <th>Sl No</th>
				<th>Subject Name</th>
				<th>Scode</th>
				<th>Faculty</th>   
				<th>Division</th>
				
                </tr>
            </thead>

                    <tbody>
                        
                        
                        {
                           getSubDetails.map((user,index) => (
                               user.batch ?
                                <tr className='text-capitalize'>
                                    <td>{index+1}</td>
                                  <td>{user.sname}  ({user.batch})</td>
                                    <td>{user.scode}</td>
                                    <td>{user.fname}</td>
                                    <td>{user.dv}</td>
                                     
                                </tr> :
                                <tr className='text-capitalize'>
                                <td>{index+1}</td>
                              <td>{user.sname}</td>
                                <td>{user.scode}</td>
                                <td>{user.fname}</td>
                                <td>{user.dv}</td>
                                 
                            </tr>
                            ))
                        }
                        

                    </tbody> */}
                </table>
            </div>
        </div>
    
    </div>
  )
}

export default GetSubjectList





// onClick={e => { setMessageList([...messageList,{ id: messageList.length + 1, message: message }]);
//     setMessage(""); 
//   }}

 