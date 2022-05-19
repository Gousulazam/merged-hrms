import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function EditFeeFixationStatus(props) {
    const [result, setResult] = useState("");
    const test = async () => {
        await axios.post(`${props.baseURL}/getstudenteditfeestatus`, {
            cid: props.userDetails.cid
        })
            .then((response) => {
                setResult(response.data);
            });
    }

    useEffect(() => {
        test();
    }, [])
    return (
        <div className="card">
            <div className="card-body text-uppercase text-center font-weight-bold" dangerouslySetInnerHTML={{ __html: result }}></div>
        </div>
    )
}
