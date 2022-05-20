import {  useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
 
export const EditQuestions = (props) => {
let length;
    const [subjectDetails, setSubjectDetails] = useState([]);
    const [qpDetails, setQpDetails] = useState([]);
    const { state } = useLocation();
    //const [ques, setQues] = useState([{question: ''}]);
    const [coOption, setCoOption] = useState(`<option value="">Select Co</option>`);
    const [clOption, setClOption] = useState(`<option value="">Select CL</option>`);

    useEffect(() => {
        axios.post(`${props.baseURL}/getcooption`, {
            fid : props.userDetails.id,
            subject : state.subject,
            academicYear : state.academicyear,
             
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setCoOption(response.data);
                    console.log(response.data)
                }
            });
    }, [])

    useEffect(() => {
        axios.post(`${props.baseURL}/getcloption`, {
            cid : props.userDetails['cid'],         
            
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setClOption(response.data);
                    console.log(response.data)
                }
            });
    }, [])

    let move = useNavigate();
    useEffect(() => {
        axios.post(`${props.baseURL}/getsubjectdetailbyid`, {
            id: state.subject
        })
            .then((response) => {  
                setSubjectDetails(response.data[0]);
                console.log(response.data[0])
            });

    }, [])
   
    useEffect(() => {
        axios.post(`${props.baseURL}/getquesdetails`, {
            fid: props.userDetails.id,
            subject: state.subject,
           // dv : subjectDetails['dv'],
            academic_year: state.academicyear,
            internal : state.internal,
        }) 
        .then((response) => {
            if (response.data.length > 0) { 
                length = response.data.length + 1;             
              setQpDetails(response.data);
              console.log(response.data);
            } else{
                swal("Question Paper not added","", "warning");
                console.log(response.data);
           } 
 
        });
  
    },[])

const edit = () =>{
    alert("hhhhh");
}





  return (
    <>
    <form onSubmit={edit}>
     <div className="card">
 

<table className="maintable teach table table-striped table-bordered table responsive">
        <thead className="thead-dark text-center">
        <tr>
            <th>Question No</th>
            <th>Question</th> 
            <th>Marks</th>
            <th>CO</th>
			<th>CL</th>
			<th>Delete Question Paper</th>
					
        </tr>
        </thead>
        <tbody className="text-center">
		{
              qpDetails.map((user,index) => (
               (user.quest == 'part-a' || user.quest == 'part-b' || user.quest == 'or' || user.quest == 'part-B' || user.quest == 'part-A' || user.quest == 'Part-B' || user.quest == 'Part-A' || user.quest == 'OR')?
               <tr key={index+1}>
            
               <td colSpan='6'>{user.quest}</td>
                
           </tr>  
              
               :
               <tr key={index+1}>
             
            <td>{user.qno}</td>
            <td>
            <CKEditor name="question" id="question" 
                    editor={ ClassicEditor }
                    data={user.quest}
                    
                    onReady={ editor => {
                      //  question = editor;
                        // You can store the "editor" and use when it is needed.
                      
                        console.log( 'Editor is ready to use!', editor );
                    } }
                   
                    onChange={ ( event, editor ) => {                        
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                        //setQues([data]);
                       
                        
                       //const  question = {data}
                    }
                     }
                   //  onChange={editor => handleFormChange(editor.getData(),i)}
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                
                />
                
                
                </td>
            <td>
            <input  type="text" name='maxmarks' id="maxmarks" className='marks form-control' placeholder={user.marks} />
                
                </td> 

                <td>
                                <select  name="co" id="co" className="co form-control"   dangerouslySetInnerHTML={{ __html: coOption }}>
                                {/* <option value={user.co}>{user.co}</option> */}
                                  
                                </select>
                </td>
                <td>
                                <select  name="cl" id="cl" className="cl form-control"   dangerouslySetInnerHTML={{ __html: clOption }}>
                                {/* <option value={user.colevel}>{user.colevel}</option> */}
                                    
                                </select>
                </td>

            {/* <td>{user.co}</td> 
            <td>{user.colevel}</td> */}
           <td></td>
              
        </tr>  
            ))   
         
        
        }

        </tbody>
</table>    
<center className="mt-2">
</center>          
<center className="mt-2">
{/* <button type="submit" className="btn btn-danger round mr-5">DELETE</button> */}
<button type="submit" className="btn btn-success round">Update</button></center>          
</div>

</form>
    </>
  )
}
