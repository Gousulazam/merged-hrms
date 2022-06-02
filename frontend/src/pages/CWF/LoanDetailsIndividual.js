import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';

export const LoanDetailsIndividual = (props) => {
    const { state } = useLocation();
    const [result, setResult] = useState(props.loader())
    useEffect(() => {
        axios.post(`${props.baseURL}/loandetailsindividual`, {
            cid:state.cid,did:state.did,fid:state.fid
        })
            .then((response) => {
                setResult(response.data);
                // console.log(response.data)
            });

    }, [])
  return (
    <div dangerouslySetInnerHTML={{__html:result}}></div>
  )
}
