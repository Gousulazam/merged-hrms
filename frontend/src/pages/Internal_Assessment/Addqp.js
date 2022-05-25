import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export const Addqp = (props) => {
   
    
    let letter = 'a';
    const { state } = useLocation();
    const [subjectDetails, setSubjectDetails] = useState([]);
    const [co, setCo] = useState([]);
    const [ques, setQues] = useState([{question: ''}]);
    const [coOption, setCoOption] = useState(`<option value="">Select Co</option>`);
    const [cl, setCl] = useState([]);
    const [clOption, setClOption] = useState(`<option value="">Select CL</option>`);
    const [subQues, setSubQues] = useState([{maxmarks: '', co: '', cl: '' }]);
    let  sname = subjectDetails['sname'];
    let  scode = subjectDetails['scode'];
    let  dept = subjectDetails['dept'];
    let iname = subjectDetails['iname'];
    let  sem = subjectDetails['sem'];
    let semtypest;
 if(state.semtype === 0){
 semtypest = 'Even';
 }else{
     semtypest = 'Odd';
 }
   
    const handleFormChange = (event,i) => {
        let data = [...subQues];
        data[i][event.target.name] = event.target.value;
        // let que = [...ques];
        // que[i][event.target.name] = event.target.value;
        // setQues(que);
        setSubQues(data);
    }
    
    const addsubques = () => {
        
      //  alert("hhh");
      let object = {maxmarks: '', co: '', cl: '' };
      let obj = {question: ''};
      setSubQues([...subQues, object]);
      setQues([...ques, obj])
      console.log(subQues);
      console.log(ques);
     
  }
 
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

const submit = (e) => {
    e.preventDefault();
    //alert("hhhh");
  //  console.log(ques[0]);
  //  console.log(subQues[0]);
    for(let i=0; i<subQues.length; i++){
    axios.post(`${props.baseURL}/addsque`, {
                            fid : props.userDetails['id'],
                            exm_date :state.examdate,
                            cid : props.userDetails['cid'],
                            did : subjectDetails['did'],
                            dv : subjectDetails['dv'],
                            sem : sem,
                            scode : scode,
                            internal : state.internal,
                            qno: '',
                            quest : ques,
                            marks : subQues[i].maxmarks,
                            max_marks : state.maxmarks,
                            cos : '',
                            co_id : subQues[i].co,
                            colevel : subQues[i].cl,
                            academic_year : state.academicyear,
                            status : '0',                                    
                            
                        })
                            .then((response) => {
                                if (response.data == '1') {
                                    swal("Added Successfully", "", "success");
                                    console.log(response.data);
                                }else{
                                    swal("Fail to Add", "", "warning");
                                    console.log(response.data)
                                }
                            });
                        }
}

  
  
  return (
    <>
    
    <div className="card">
    
    <div className="card-body">
    
        <center><h3 className="text-uppercase text-center">{iname}</h3></center>
      <center>  <h4 className="text-uppercase text-center">department of {dept} </h4></center>
      <center>   <h6 className="text-uppercase text-center">{state.internal} Internal Assessment of {semtypest} Sem of {state.academicyear}</h6></center>
        <div className="table-responsive">
            <table border='1'  className="table table-striped table-bordered  text-center">
                <thead className="thead-dark">
                    <tr className='text-uppercase'>
                        <th>date</th>
                        <th>semester</th>
                        <th>course/course code</th>
                        <th>marks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                       <td>{state.examdate}</td>
                       <td>{sem}</td>
                       <td>{sname}/{scode}</td>
                       <td>{state.maxmarks}</td>
                    </tr>
                </tbody>
            </table>
            
           <br/>
           <form onSubmit={submit}>
              
             <table className="a-part table table-bordered text-center" id="ll">
                    <thead className="thead-dark">
                        <tr className="tc">
                            <th colSpan="8" className="text-center">PART-A</th>
                            {/* <th className="hc">
                                <input type="text" name='questionNo[]' className='questionNo form-control ' value='part-a'/>
                                <input type="text" name='question[]' className='questionNo form-control ' value='part-a'/>
                                <input type="text" name='marks[]' className='questionNo form-control ' value='part-a'/>
                                <input type="text" name='co[]' className='questionNo form-control ' value='part-a'/>
                                <input type="text" name='cl[]' className='questionNo form-control ' value='part-a'/>
                            </th> */}
                        </tr>
                        <tr>
                            <th>Question No</th>
                            <th>Question</th>
                            <th>Marks</th>
                            <th>CO</th>
                            <th>CL</th>
                            <th>Add Sub Question</th>
                            <th>OR</th>
                            <th>Add / Delete</th>
                        </tr>
                    </thead>
                    <tbody id="part-a">
                    {
                        
                   subQues.map((deatils,i)=>{
                       return <tr key={i}>
                       
                            <td><span className="question">1</span>{letter}
                                {/* <input type="text" name='questionNo[]' className='questionNo form-control hc' value='1a'/> */}
                            </td>
                           
                            <td>
                               
                            <CKEditor name="question" id="question" 
                    editor={ ClassicEditor }
                    data="<textarea></textarea>"
                    
                    onReady={ editor => {
                      //  question = editor;
                        // You can store the "editor" and use when it is needed.
                      
                        console.log( 'Editor is ready to use!', editor );
                    } }
                   
                    onChange={ ( event, editor ) => {                        
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                        setQues([data]);
                        
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
                            <td><input required type="text" name='maxmarks' id="maxmarks" className='marks form-control' placeholder="Enter Marks" onChange={event => handleFormChange(event,i)}/></td>
                            <td>
                                <select  name="co" id="co" className="co form-control" onChange={event => handleFormChange(event,i)}  dangerouslySetInnerHTML={{ __html: coOption }}>
                                   
                                  
                                </select>
                            </td>
                            <td>
                                <select  name="cl" id="cl" className="cl form-control" onChange={event => handleFormChange(event,i)} required dangerouslySetInnerHTML={{ __html: clOption }}>
                                   
                                    
                                </select>
                            </td>
                            <td>
                                <center className='mt-3'>
                                <i className="fa fa-plus-square mr-2 add_new" aria-hidden="true" onClick={addsubques}></i>
                                </center>
                            </td>
                            <td>
                            
                                <button  className="btn btn-sm btn-outline-primary or orhide mt-3" type="button">OR</button>
                                <button  className="btn btn-sm btn-outline-success phide part mt-3"  type="button">Part</button>
                            </td>
                            <td>
                                <center className='mt-3'>
                                    <button  className="btn btn-outline-success btn-sm rounded add_question hide mr-2"><i className="fa fa-plus" aria-hidden="true"></i></button>
                                    <button  className="btn btn-outline-danger btn-sm rounded delete delhide"><i className="fa fa-times" aria-hidden="true"></i></button>
                                </center>
                            </td>
                        </tr>
                         })
                        }
                        
                    </tbody>
                </table>
              
                <center>
            
            <button className="btn btn-outline-success rounded gr" type="submit">Submit</button>
        </center>
        
                </form> 
                
                </div>
                </div>
                </div>


           
            
            
           
    
    
    </>
  )
}
