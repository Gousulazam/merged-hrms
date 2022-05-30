const QueryBuilder = require('node-querybuilder');
const express = require('express');
const mysql = require('mysql');
const mysql2 = require('mysql2');
const fileupload = require("express-fileupload");
const bodyparser = require('body-parser');
const cors = require('cors');
var app = express();
//Configuring express server
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'semes',
    multipleStatements: true
});

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'semes',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});


const settings = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "semes",
    "pool_size": 50
};

const pool1 = new QueryBuilder(settings, 'mysql', 'pool');
var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "semes",
    multipleStatements: true
})

const pool2 = new QueryBuilder(settings, 'mysql', 'pool');
let db = '';
const dbConnect = async () => db = await pool2.get_connection();
const dbDisconnect = async () => await db.release();
const runQuery = async (query) => {
    await dbConnect();
    let run = db.query(query)
    await dbDisconnect();
    return run;
}


const promisePool = pool.promise();

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));

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

const getHeadWisePaidAmount = async (cid, feesId, feeType) => {
    let feeDetails = await runQuery(`SELECT sum(paid_amt) AS paidAmount FROM fee_transactions WHERE cid='${cid}' AND fee_id='${feesId}' AND fee_type='${feeType}'`);
    if (feeDetails[0]['paidAmount'] == null) {
        return 0;
    }
    return feeDetails[0]['paidAmount'];
}

let getTransactionId = async (cid, did) => {
    let transcationTableId = await runQuery("SELECT MAX(id)+1 AS maxId FROM `fee_transactions` ORDER BY id DESC");
    return `${cid + did + "T" + transcationTableId[0]['maxId']}`;
};

app.post('/checkuser', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT id,title,name,cid,did,role,photo,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE (email='${data.email}' OR mobile='${data.email}') AND pass='${data.password}'`)
    res.send(rows);
    // mysqlConnection.query('SELECT id,title,name,cid,did,role,photo,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM `admin` a WHERE (email=? OR mobile=?) AND pass=?', [data.email, data.email, data.password], (err, rows, fields) => {
    //     if (!err)
    //         res.send(rows);
    //     else
    //         console.log(err);
    // })
});

app.post('/masterlogin', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT id,title,name,cid,did,role,photo,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE id='${req.body.fid}'`);
    res.send(rows);
    // mysqlConnection.query(`SELECT id,title,name,cid,did,role,photo,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE id='${req.body.fid}'`, (err, rows, fields) => {
    //     if (!err)
    //         res.send(rows);
    //     else
    //         console.log(err);
    // })
});

app.post('/getacademicyearoption', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT academic_year FROM academic_year WHERE cid='${data.cid}' ORDER BY academic_year DESC`)
    let option = `<option value="">Select Academic Year</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].academic_year}">${rows[index].academic_year}</option>`
    }
    res.send(option);
    // mysqlConnection.query('SELECT academic_year FROM `academic_year` WHERE cid=? ORDER BY academic_year DESC', [data.cid], (err, rows, fields) => {
    //     if (!err) {

    //         let option = `<option value="">Select Academic Year</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             option += `<option value="${rows[index].academic_year}">${rows[index].academic_year}</option>`
    //         }
    //         res.send(option);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getsubjectoptionbyfidandacademicyear', async (req, res) => {
    let data = req.body;
    var option = `<option value="">Select Subject</option>`;
    if (data.semType != '') {
        let rows = await runQuery(`SELECT id,sname,scode,dv,sem,batch FROM subject WHERE fid='${data.fid}' AND sem%2='${data.semType}' AND stype='${data.stype}' AND academic_year='${data.academicYear}' ORDER BY sem,scode ASC,stype DESC`)
        for (let index = 0; index < rows.length; index++) {
            if (rows[index].dv != '') {
                if (rows[index].batch != '') {
                    option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`;
                } else {
                    option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})</option>`
                }
            } else {
                if (rows[index].batch != '') {
                    option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`
                } else {
                    option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})</option>`
                }
            }
        }
        res.send(option);
        // mysqlConnection.query('SELECT id,sname,scode,dv,sem,batch FROM `subject` WHERE fid=? AND sem%2=? AND stype=? AND academic_year=? ORDER BY sem,scode ASC,stype DESC', [data.fid, data.semType, data.stype, data.academicYear], (err, rows, fields) => {
        //     if (!err) {
        //         for (let index = 0; index < rows.length; index++) {
        //             if (rows[index].dv != '') {
        //                 if (rows[index].batch != '') {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`;
        //                 } else {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})</option>`
        //                 }
        //             } else {
        //                 if (rows[index].batch != '') {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`
        //                 } else {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})</option>`
        //                 }
        //             }
        //         }
        //         res.send(option);
        //     } else {
        //         console.log(err);
        //     }
        // })
    } else {
        res.send(option);
    }
});

app.post('/getsubjectdetailbyid', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT sname,scode,sem,cid,dept,academic_year,fid,did,dv,(SELECT iname FROM college WHERE id=s.cid) as iname,(SELECT sname FROM dept WHERE id=s.did) AS dsname FROM subject s WHERE id='${data.id}'`);
    // console.log(rows[0]);
    res.send(rows[0]);

    // mysqlConnection.query('SELECT sname,scode,sem,cid,dept,academic_year,(SELECT iname FROM `college` WHERE id=s.cid) as iname FROM `subject` s WHERE id=?', [data.id], (err, rows, fields) => {
    //     if (!err) {
    //         res.send(rows);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getsubjectreport', async (req, res) => {
    let data = req.body;
    let rows1 = await runQuery(`SELECT sname,scode,sem,cid,did,dv,academic_year,dept,(SELECT iname FROM college WHERE id=s.cid) AS iname FROM subject s WHERE id='${data.id}'`);
    let subjectDetails = rows1[0];
    let rows = await runQuery(`SELECT  sa.student_id,si.usn,si.name,(SELECT COUNT(id) FROM class WHERE scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND acd_year='${subjectDetails.academic_year}' AND date BETWEEN '${data.fdate}' AND '${data.tdate}') AS class_conducted,(SELECT COUNT(id) FROM attend WHERE student_id=sa.student_id AND scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}' AND date BETWEEN '${data.fdate}' AND '${data.tdate}') AS class_attended FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`);
    let tbody = `<div class="card-header">
        <center><img src="https://hrms.secab.org/images/slo2.png" alert="no Image" /> </center>
        <br />
        <center>
            <strong>
                ${subjectDetails['iname']} <br />
                Department Of ${subjectDetails['dept']} <br />
                Semester - ${subjectDetails['sem']}<br />subject - ${subjectDetails['sname']} (${subjectDetails['scode']})<br />
                REPORT FROM ${formatDate('', data.fdate)} TO ${formatDate('', data.tdate)}</strong>
        </center>
    </div>`;
    tbody += `<div class="card-body">
    <table class="table table-bordered">
        <thead class="thead-dark">
            <tr>
                <th colSpan="5" class="text-center">Classes Conducted : ${rows[0].class_conducted}</th>
            </tr>
            <tr>
                <th>sl no</th>
                <th>usn</th>
                <th>name</th>
                <th>attended</th>
                <th>percentage</th>
            </tr>
        </thead>
        <tbody>`;
    let percentage = 0;
    for (let index = 0; index < rows.length; index++) {
        if (rows[index].class_conducted != 0) {
            percentage = rows[index].class_attended / rows[index].class_conducted * 100;
            percentage = percentage.toString().substring(0, 4)
        } else {
            percentage = 0;
        }
        tbody += `<tr>
            <td>${index + 1}</td>
            <td>${rows[index].usn}</td>
            <td>${rows[index].name}</td>
            <td>${rows[index].class_attended}</td>
            <td>${percentage}%</td>
        </tr>`;

    }
    tbody += ` </tbody>
    </table>
</div>`;
    res.send(tbody)
    // mysqlConnection.query('SELECT scode,sem,cid,did,dv,academic_year FROM `subject` s WHERE id=?', [data.id], (err, rows, fields) => {
    //     if (!err) {
    //         let subjectDetails = rows[0];
    //         mysqlConnection.query(`SELECT  sa.student_id,si.usn,si.name,(SELECT COUNT(id) FROM class WHERE scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND acd_year='${subjectDetails.academic_year}' AND date BETWEEN '${data.fdate}' AND '${data.tdate}') AS class_conducted,(SELECT COUNT(id) FROM attend WHERE student_id=sa.student_id AND scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}' AND date BETWEEN '${data.fdate}' AND '${data.tdate}') AS class_attended FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`, (err, rows, fields) => {
    //             if (!err) {
    //                 let tbody = ``;
    //                 let percentage = 0;
    //                 for (let index = 0; index < rows.length; index++) {
    //                     if (rows[index].class_conducted != 0) {
    //                         percentage = rows[index].class_attended / rows[index].class_conducted * 100;
    //                         percentage = percentage.toString().substring(0, 4)
    //                     } else {
    //                         percentage = 0;
    //                     }
    //                     tbody += `<tr>
    //                     <td>${index + 1}</td>
    //                     <td>${rows[index].usn}</td>
    //                     <td>${rows[index].name}</td>
    //                     <td>${rows[index].class_attended}</td>
    //                     <td>${percentage}%</td>
    //                 </tr>`;

    //                 }
    //                 res.send([tbody, rows[0].class_conducted])
    //             } else {
    //                 console.log(err);
    //             }
    //         })
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getcoadded', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT scode,sem,cid,did,dv,academic_year FROM subject s WHERE id='${data.id}'`);
    let subjectDetails = rows[0];
    let rows1 = await runQuery(`SELECT stmt,cos FROM nba_co WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}'`);
    // console.log(rows1)
    res.send(rows1);
    // mysqlConnection.query('SELECT scode,sem,cid,did,dv,academic_year FROM `subject` s WHERE id=?', [data.id], (err, rows, fields) => {
    //     if (!err) {
    //         let subjectDetails = rows[0];
    //         mysqlConnection.query(`SELECT stmt,cos FROM nba_co WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}'`, (err, rows, fields) => {
    //             if (!err) {
    //                 res.send(rows);
    //             } else {
    //                 console.log(err);
    //             }
    //         })
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getquestionpaper', async (req, res) => {
    let data = req.body;
    let internal = '';

    function diff(start, end) {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);

        // If using time pickers with 24 hours format, add the below line get exact hours
        if (hours < 0)
            hours = hours + 24;

        return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }

    if (data.internal == 'i') {
        internal += 'first internal assessment';
    } else if (data.internal == 'ii') {
        internal += 'second internal assessment';
    } else if (data.internal == 'iii') {
        internal += 'third internal assessment';
    }

    if (data.subject != '' && data.internal != '') {
        let rows = await runQuery(`SELECT sname,scode,sem,cid,dv,dept,did,academic_year,(SELECT iname FROM college WHERE id=s.cid) as iname,(SELECT exam_date FROM cie_timetable WHERE cid=s.cid AND did=s.did AND scode=s.scode AND dv=s.dv AND internal='${data.internal}' AND academic_year=s.academic_year ) AS exam_date,(SELECT start_time FROM cie_timetable WHERE cid=s.cid AND did=s.did AND scode=s.scode AND dv=s.dv AND internal='${data.internal}' AND academic_year=s.academic_year ) AS start_time,(SELECT end_time FROM cie_timetable WHERE cid=s.cid AND did=s.did AND scode=s.scode AND dv=s.dv AND internal='${data.internal}' AND academic_year=s.academic_year ) AS end_time FROM subject s WHERE id='${data.subject}'`);
        let subjectDetails = rows[0];
        let exam_date = formatDate("", subjectDetails.exam_date);
        let duration = diff(Date(subjectDetails.start_time), Date(subjectDetails.end_time)).split(":");
        let result = `<div class="card" id="print">
                <div class="card-body"><table border="1" style="border-collapse:collapse;width:100%;" class="table table-bordered text-uppercase font-weight-bold">
                <tbody>
                    <tr>
                        <td>
                            <center>
                                <img src="https://hrms.secab.org/images/siet.png" alert="No images" style="width:40%;height:80px;">
                            </center>
                        </td>
                        <td colspan="2" class="align-middle">${subjectDetails.iname}<br><br> Department of ${subjectDetails.dept}
                        </td>
                        <td class="align-middle">Date : ${exam_date}</td>
                    </tr>
                    <tr>
                        <td>subject: ${subjectDetails.sname}</td>
                        <td colspan="2">subject code: ${subjectDetails.scode} </td>
                        <td>Duration : ${duration[0]} Hours ${duration[1]} Minutes</td>
                    </tr>
                    <tr>
                        <td>sem: ${subjectDetails.sem}</td>
                        <td colspan="2">${internal}</td>
                        <td>max marks : 30</td>
                    </tr>
                </tbody>
            </table>`;
        let rows2 = await runQuery(`SELECT qno,quest,marks,co_id,(SELECT cos FROM nba_co WHERE id=n.co_id) as co,(SELECT colevel FROM nba_co_level WHERE id=n.colevel) as cl FROM nba_question n WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND internal='${data.internal}' AND academic_year='${subjectDetails.academic_year}' ORDER BY id ASC`);
        result += `<p><b>Instruction: Answer any one full question from each part.</b></p>
                        <table border="1" style="border-collapse:collapse;width:100%;" class="table table-bordered text-center font-weight-bold">
            <thead class="thead-dark">
                <tr>
                    <th>Question No</th>
                    <th>Question</th>
                    <th>Marks</th>
                    <th>CO</th>
                    <th>CL</th>
                </tr>
            </thead>
            <tbody>`;
        for (let index = 0; index < rows2.length; index++) {
            const element = rows2[index];
            if (element.co_id == 0) {
                result += `<tr>
                                    <td colspan='5' class='text-center'>${element.qno}</td>
                                </tr>`;
            } else {
                result += `<tr>
                                <td>${element.qno}</td>
                                <td>${element.quest}</td>
                                <td>${element.marks}</td>
                                <td>${element.co}</td>
                                <td>${element.cl}</td>
                            </tr>`
            }

        }
        result += `</tbody></table></div></div>`;
        res.send(result);

        // mysqlConnection.query(`SELECT sname,scode,sem,cid,dv,dept,did,academic_year,(SELECT iname FROM college WHERE id=s.cid) as iname,(SELECT exam_date FROM cie_timetable WHERE cid=s.cid AND did=s.did AND scode=s.scode AND dv=s.dv AND internal='${data.internal}' AND academic_year=s.academic_year ) AS exam_date,(SELECT start_time FROM cie_timetable WHERE cid=s.cid AND did=s.did AND scode=s.scode AND dv=s.dv AND internal='${data.internal}' AND academic_year=s.academic_year ) AS start_time,(SELECT end_time FROM cie_timetable WHERE cid=s.cid AND did=s.did AND scode=s.scode AND dv=s.dv AND internal='${data.internal}' AND academic_year=s.academic_year ) AS end_time FROM subject s WHERE id='${data.subject}'`, (err, rows, fields) => {
        //     if (!err) {
        //         let subjectDetails = rows[0];
        //         var today = new Date(subjectDetails.exam_date);
        //         var dd = String(today.getDate()).padStart(2, '0');
        //         var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        //         var yyyy = today.getFullYear();
        //         let exam_date = `${dd}-${mm}-${yyyy}`;
        //         let duration = diff(subjectDetails.start_time, subjectDetails.end_time).split(":");
        //         let result = `<div class="card" id="print">
        //         <div class="card-body"><table border="1" style="border-collapse:collapse;width:100%;" class="table table-bordered text-uppercase font-weight-bold">
        //         <tbody>
        //             <tr>
        //                 <td>
        //                     <center>
        //                         <img src="https://hrms.secab.org/images/siet.png" alert="No images" style="width:40%;height:80px;">
        //                     </center>
        //                 </td>
        //                 <td colspan="2" class="align-middle">${subjectDetails.iname}<br><br> Department of ${subjectDetails.dept}
        //                 </td>
        //                 <td class="align-middle">Date : ${exam_date}</td>
        //             </tr>
        //             <tr>
        //                 <td>subject: ${subjectDetails.sname}</td>
        //                 <td colspan="2">subject code: ${subjectDetails.scode} </td>
        //                 <td>Duration : ${duration[0]} Hours ${duration[1]} Minutes</td>
        //             </tr>
        //             <tr>
        //                 <td>sem: ${subjectDetails.sem}</td>
        //                 <td colspan="2">${internal}</td>
        //                 <td>max marks : 30</td>
        //             </tr>
        //         </tbody>
        //     </table>`
        //         mysqlConnection.query(`SELECT qno,quest,marks,co_id,(SELECT cos FROM nba_co WHERE id=n.co_id) as co,(SELECT colevel FROM nba_co_level WHERE id=n.colevel) as cl FROM nba_question n WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND internal='${data.internal}' AND academic_year='${subjectDetails.academic_year}' ORDER BY id ASC`, (err, rows2, fields) => {
        //             if (!err) {
        //                 result += `<p><b>Instruction: Answer any one full question from each part.</b></p>
        //                 <table border="1" style="border-collapse:collapse;width:100%;" class="table table-bordered text-center font-weight-bold">
        //     <thead class="thead-dark">
        //         <tr>
        //             <th>Question No</th>
        //             <th>Question</th>
        //             <th>Marks</th>
        //             <th>CO</th>
        //             <th>CL</th>
        //         </tr>
        //     </thead>
        //     <tbody>`;
        //                 for (let index = 0; index < rows2.length; index++) {
        //                     const element = rows2[index];
        //                     if (element.co_id == 0) {
        //                         result += `<tr>
        //                             <td colspan='5' class='text-center'>${element.qno}</td>
        //                         </tr>`;
        //                     } else {
        //                         result += `<tr>
        //                         <td>${element.qno}</td>
        //                         <td>${element.quest}</td>
        //                         <td>${element.marks}</td>
        //                         <td>${element.co}</td>
        //                         <td>${element.cl}</td>
        //                     </tr>`
        //                     }

        //                 }
        //                 result += `</tbody></table></div></div>`;
        //                 res.send(result);
        //             } else {
        //                 console.log(err);
        //             }
        //         })
        //         // res.send(rows);
        //     } else {
        //         console.log(err);
        //     }
        // })
    }

});

app.post('/getfacultyhandlingsubject', async (req, res) => {
    let data = req.body;

    if (data.semType != '') {
        let rows = await runQuery(`SELECT id,sname,scode,dv,sem,fname,dept,batch FROM subject WHERE fid='${data.fid}' AND sem%2='${data.semType}' AND academic_year='${data.academicYear}' ORDER BY sem,scode ASC,stype DESC`);
        var result = `<div class="card text-uppercase">
                <div class="card-header text-center font-weight-bold">Currently Handling Subjects & Faculty's Subjects List Of ${rows[0].dept} Department Faculty Name: ${rows[0].fname}</div>
    <div class="card-body">
    <table class="table table-bordered">
        <thead class="thead-dark">
            <tr>
                <th>sl no</th>
                <th>subject</th>
                <th>semester</th>
                <th>division</th>
                <th>batch</th>
            </tr>
        </thead>
        <tbody>`;
        for (let index = 0; index < rows.length; index++) {
            let element = rows[index];
            let sl = index + 1;
            let dv = "-";
            let batch = "-";
            if (element.dv != '') {
                dv = element.dv;
            }

            if (element.batch != '') {
                batch = element.batch;
            }
            result += `<tr>
                        <td>${sl}</td>
                        <td>${element.sname} (${element.scode})</td>
                        <td>${element.sem}</td>
                        <td>${dv}</td>
                        <td>${batch}</td>
                    </tr>`;
        }
        result += `</tbody>
                </table>
                </div>
                </div>`;
        res.send(result);
        //     mysqlConnection.query(`SELECT id,sname,scode,dv,sem,fname,dept,batch FROM subject WHERE fid='${data.fid}' AND sem%2='${data.semType}' AND academic_year='${data.academicYear}' ORDER BY sem,scode ASC,stype DESC`, (err, rows, fields) => {
        //         if (!err) {
        //             var result = `<div class="card text-uppercase">
        //             <div class="card-header text-center font-weight-bold">Currently Handling Subjects & Faculty's Subjects List Of ${rows[0].dept} Department Faculty Name: ${rows[0].fname}</div>
        // <div class="card-body">
        // <table class="table table-bordered">
        //     <thead class="thead-dark">
        //         <tr>
        //             <th>sl no</th>
        //             <th>subject</th>
        //             <th>semester</th>
        //             <th>division</th>
        //             <th>batch</th>
        //         </tr>
        //     </thead>
        //     <tbody>`;
        //             for (let index = 0; index < rows.length; index++) {
        //                 let element = rows[index];
        //                 let sl = index + 1;
        //                 let dv = "-";
        //                 let batch = "-";
        //                 if (element.dv != '') {
        //                     dv = element.dv;
        //                 }

        //                 if (element.batch != '') {
        //                     batch = element.batch;
        //                 }
        //                 result += `<tr>
        //                     <td>${sl}</td>
        //                     <td>${element.sname} (${element.scode})</td>
        //                     <td>${element.sem}</td>
        //                     <td>${dv}</td>
        //                     <td>${batch}</td>
        //                 </tr>`;
        //             }
        //             result += `</tbody>
        //             </table>
        //             </div>
        //             </div>`;
        //             res.send(result);
        //         } else {
        //             console.log(err);
        //         }
        //     })
    } else {
        res.send(option);
    }
});

app.post('/getMenuRoleWise', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT path FROM user_menu WHERE cid='${data.userDetails.cid}' AND post='${data.role}' AND status='1'`);
    let menu = `<li style="font-size:16px;font-weight:bold;color:white;" class="navbar-brand">${data.userDetails.name}<br />Employee ID:${data.userDetails.id}</span></a>
        </li><li>
        <a href="/dashboard"> <i class="menu-icon fa fa-dashboard"></i>Dashboard </a>
    </li>`;
    for (let index = 0; index < rows.length; index++) {
        menu += rows[index].path;
    }
    res.send(menu);

    // mysqlConnection.query('SELECT path FROM `user_menu` WHERE cid=? AND post=? AND status=?', [data.userDetails.cid, data.role, 1], (err, rows, fields) => {
    //     if (!err) {
    //         let menu = `<li style="font-size:16px;font-weight:bold;color:white;" class="navbar-brand">${data.userDetails.name}<br />Employee ID:${data.userDetails.id}</span></a>
    //     </li><li>
    //     <a href="/dashboard"> <i class="menu-icon fa fa-dashboard"></i>Dashboard </a>
    // </li>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             menu += rows[index].path;
    //         }
    //         res.send(menu);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getpreviousyeareresource', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT subject,scode,sem,dv,title,utp,path FROM esrc WHERE fid='${data.fid}' AND academic_year='${data.academicYear}'`);
    let tbody = ``;
    for (let index = 0; index < rows.length; index++) {
        let slno = index + 1;
        let element = rows[index];
        let sem = element.sem;
        let download = ``;
        if (element.dv != '') {
            sem = `${element.sem} (${element.dv})`;
        }

        if (element.utp == "LINK") {
            download = `<a href="${element.path}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link" aria-hidden="true"></i>${element.path}</a>`;
        } else {
            download = `<a href="${element.path}" target="_blank" rel="noopener noreferrer" class='btn btn-info rounded'><i class="fa fa-download" aria-hidden="true"></i> Download</a>`;
        }
        tbody += `<tr>
                    <td>${slno}</td>
                    <td>${element.subject}</td>
                    <td>${element.scode}</td>
                    <td>${sem}</td>
                    <td>${element.title}</td>
                    <td>${element.utp}</td>
                    <td>${download}</td>
                </tr>`;
    }
    res.send(tbody);
    // mysqlConnection.query(`SELECT subject,scode,sem,dv,title,utp,path FROM esrc WHERE fid='${data.fid}' AND academic_year='${data.academicYear}'`, (err, rows, fields) => {
    //     if (!err) {
    //         let tbody = ``;
    //         for (let index = 0; index < rows.length; index++) {
    //             let slno = index + 1;
    //             let element = rows[index];
    //             let sem = element.sem;
    //             let download = ``;
    //             if (element.dv != '') {
    //                 sem = `${element.sem} (${element.dv})`;
    //             }

    //             if (element.utp == "LINK") {
    //                 download = `<a href="${element.path}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link" aria-hidden="true"></i>${element.path}</a>`;
    //             } else {
    //                 download = `<a href="${element.path}" target="_blank" rel="noopener noreferrer" class='btn btn-info rounded'><i class="fa fa-download" aria-hidden="true"></i> Download</a>`;
    //             }
    //             tbody += `<tr>
    //                 <td>${slno}</td>
    //                 <td>${element.subject}</td>
    //                 <td>${element.scode}</td>
    //                 <td>${sem}</td>
    //                 <td>${element.title}</td>
    //                 <td>${element.utp}</td>
    //                 <td>${download}</td>
    //             </tr>`;
    //         }
    //         res.send(tbody);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getcurrentyeareresource', async (req, res) => {
    let data = req.body;
    let rows1 = await runQuery(`SELECT id,subject,scode,sem,dv,title,utp,path FROM esrc WHERE fid='${data.fid}' AND academic_year=(SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}')`);
    res.send(rows1);
    // mysqlConnection.query(`SELECT id,subject,scode,sem,dv,title,utp,path FROM esrc WHERE fid='${data.fid}' AND academic_year=(SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}')`, (err, rows1, fields) => {
    //     if (!err) {
    //         res.send(rows1);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/adderesource', async (req, res) => {
    let data = req.body;
    let rows1 = await runQuery(`SELECT sname,scode,fid,fname,dept,did,dv,sem,academic_year,(SELECT MAX(id)+1 FROM esrc) as max_id FROM subject s WHERE id='${data.subject}'`);
    let subjectDetails = rows1[0];
    let path = '';
    let oldPath = '';
    let h = [];
    if (data.ftype == 'LINK') {
        path = data.link;
        oldPath = data.link;
        sql = `INSERT INTO esrc(subject, scode, fid, fname, dept, did, dv, sem, title, utp, path, path_old, academic_year) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.fid}','${subjectDetails.fname}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.dv}','${subjectDetails.sem}','${data.title}','${data.ftype}','${path}','${oldPath}','${subjectDetails.academic_year}')`;
        let rows2 = await runQuery(sql);
        res.send([rows2.insertId]);
        // mysqlConnection.query(sql, (err, rows2, fields) => {
        //     if (!err) {
        //         res.send(rows2);
        //     } else {
        //         console.log(err);
        //     }
        // })
    } else {
        const newpath = __dirname + "/upload/resource/";
        const file = req.files.file;
        oldPath = file.name;
        file.name = `${subjectDetails['max_id']}_${subjectDetails['scode']}_${subjectDetails['fname']}.` + file.name.split('.')[1];
        const filename = file.name;
        path = `${newpath}${filename}`;

        file.mv(`${newpath}${filename}`, async (err) => {
            if (err) {
                res.send([0]);
            }

            sql = `INSERT INTO esrc(subject, scode, fid, fname, dept, did, dv, sem, title, utp, path, path_old, academic_year) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.fid}','${subjectDetails.fname}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.dv}','${subjectDetails.sem}','${data.title}','${data.ftype}','${path}','${oldPath}','${subjectDetails.academic_year}')`;
            rows2 = await runQuery(sql);
            console.log(rows2.insertId)
            res.send([rows2.insertId]);
            // mysqlConnection.query(sql, (err, rows2, fields) => {
            //     if (!err) {
            //         res.send(rows2);
            //     } else {
            //         console.log(err);
            //     }
            // })
        });

    }
    // mysqlConnection.query(`SELECT sname,scode,fid,fname,dept,did,dv,sem,academic_year,(SELECT MAX(id)+1 FROM esrc) as max_id FROM subject s WHERE id='${data.subject}'`, (err, rows1, fields) => {
    //     if (!err) {
    //         let subjectDetails = rows1[0];
    //         let path = '';
    //         let oldPath = '';
    //         if (data.ftype == 'LINK') {
    //             path = data.link;
    //             oldPath = data.link;
    //             sql = `INSERT INTO esrc(subject, scode, fid, fname, dept, did, dv, sem, title, utp, path, path_old, academic_year) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.fid}','${subjectDetails.fname}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.dv}','${subjectDetails.sem}','${data.title}','${data.ftype}','${path}','${oldPath}','${subjectDetails.academic_year}')`;
    //             mysqlConnection.query(sql, (err, rows2, fields) => {
    //                 if (!err) {
    //                     res.send(rows2);
    //                 } else {
    //                     console.log(err);
    //                 }
    //             })
    //         } else {
    //             const newpath = __dirname + "/upload/resource/";
    //             const file = req.files.file;
    //             oldPath = file.name;
    //             file.name = `${subjectDetails['max_id']}_${subjectDetails['scode']}_${subjectDetails['fname']}.` + file.name.split('.')[1];
    //             const filename = file.name;
    //             path = `${newpath}${filename}`;

    //             file.mv(`${newpath}${filename}`, (err) => {
    //                 if (err) {
    //                     let h = [];
    //                     h['insertId'] = 0
    //                     res.send(h);
    //                 }

    //                 sql = `INSERT INTO esrc(subject, scode, fid, fname, dept, did, dv, sem, title, utp, path, path_old, academic_year) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.fid}','${subjectDetails.fname}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.dv}','${subjectDetails.sem}','${data.title}','${data.ftype}','${path}','${oldPath}','${subjectDetails.academic_year}')`;
    //                 mysqlConnection.query(sql, (err, rows2, fields) => {
    //                     if (!err) {
    //                         res.send(rows2);
    //                     } else {
    //                         console.log(err);
    //                     }
    //                 })
    //             });

    //         }
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.delete('/deleteresource/:id', async (req, res) => {
    let data = req.params;
    const fs = require('fs')
    let path = __dirname + "/upload/resource/";
    let rows = await runQuery(`SELECT path,utp FROM esrc  WHERE id='${data.id}'`);
    if (rows[0].path != '') {
        let file = rows[0].path.split("/");
        let filename = file[file.length - 1];
        path += filename;
    }
    let rows1 = await runQuery(`DELETE FROM esrc  WHERE id='${data.id}'`);
    if (rows1.affectedRows > 0) {
        if (rows[0].utp != "LINK") {
            fs.unlinkSync(path)
        }
        res.send([1])
    } else {
        res.send([0])
    }

    // mysqlConnection.query(`SELECT path,utp FROM esrc  WHERE id='${data.id}'`, (err, rows, fields) => {
    //     if (!err) {
    //         let file = rows[0].path.split("/");
    //         let filename = file[file.length - 1];
    //         path += filename;
    //         mysqlConnection.query(`DELETE FROM esrc  WHERE id='${data.id}'`, (err, rows1, fields) => {
    //             if (!err) {
    //                 if (rows[0].utp != "LINK") {
    //                     fs.unlinkSync(path)
    //                 }
    //                 res.send([1])
    //             } else {
    //                 res.send([0])
    //                 console.log(err);
    //             }
    //         })
    //     } else {
    //         console.log(err);
    //     }
    // })
    // console.log();
});

app.get('/getcollegeoption', async (req, res) => {
    let data = req.body;
    let option = `<option value="">Select College</option>`;
    let rows = await runQuery(`SELECT id,name FROM college WHERE prt=1`);
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        option += `<option value="${element.id}">${element.name}</option>`;
    }
    res.send(option);
    // mysqlConnection.query(`SELECT id,name FROM college WHERE prt=1`, (err, rows, fields) => {
    //     if (!err) {
    //         let option = `<option value="">Select College</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             const element = rows[index];
    //             option += `<option value="${element.id}">${element.name}</option>`;
    //         }

    //         res.send(option);
    //     }
    //     else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getdepartmenteoption', async (req, res) => {
    let data = req.body;
    let option = `<option value="">Select Department</option>`;
    let rows = await runQuery(`SELECT id,name FROM dept WHERE cid='${data.cid}'`)
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        option += `<option value="${element.id}">${element.name}</option>`;
    }

    res.send(option);
    // mysqlConnection.query(`SELECT id,name FROM dept WHERE cid='${data.cid}'`, (err, rows, fields) => {
    //     if (!err) {
    //         let option = `<option value="">Select Department</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             const element = rows[index];
    //             option += `<option value="${element.id}">${element.name}</option>`;
    //         }

    //         res.send(option);
    //     }
    //     else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getemployeeeoption', async (req, res) => {
    let data = req.body;
    let option = `<option value="">Select Employee</option>`;
    let rows = await runQuery(`SELECT id,name,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE cid='${data.cid}' AND did='${data.did}' AND status='approved'  ORDER BY name ASC`);
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        option += `<option value="${element.id}">${element.name} (${element.roles})</option>`;
    }

    res.send(option);
    // mysqlConnection.query(`SELECT id,name,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE cid='${data.cid}' AND did='${data.did}' AND status='approved'  ORDER BY name ASC`, (err, rows, fields) => {
    //     if (!err) {
    //         let option = `<option value="">Select Employee</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             const element = rows[index];
    //             option += `<option value="${element.id}">${element.name} (${element.roles})</option>`;
    //         }

    //         res.send(option);
    //     }
    //     else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getcurrentfacultysubjectsoption', async (req, res) => {
    let data = req.body;
    var option = `<option value="">Select Subject</option>`;
    if (data.semType != '') {
        let rows = await runQuery(`SELECT id,sname,scode,dv,sem,batch FROM subject s WHERE fid='${data.fid}' AND academic_year=(SELECT MAX(academic_year) FROM academic_year WHERE cid=s.cid) ORDER BY sem,scode ASC,stype DESC`);
        // console.log(rows)
        for (let index = 0; index < rows.length; index++) {
            if (rows[index].dv != '') {
                if (rows[index].batch != '') {
                    option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`;
                } else {
                    option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})</option>`
                }
            } else {
                if (rows[index].batch != '') {
                    option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`
                } else {
                    option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})</option>`
                }
            }
        }
        res.send(option);
        // mysqlConnection.query(`SELECT id,sname,scode,dv,sem,batch FROM subject s WHERE fid='${data.fid}' AND academic_year=(SELECT MAX(academic_year) FROM academic_year WHERE cid=s.cid) ORDER BY sem,scode ASC,stype DESC`, (err, rows, fields) => {
        //     if (!err) {
        //         for (let index = 0; index < rows.length; index++) {
        //             if (rows[index].dv != '') {
        //                 if (rows[index].batch != '') {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`;
        //                 } else {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}(${rows[index].dv})-${rows[index].sname}(${rows[index].scode})</option>`
        //                 }
        //             } else {
        //                 if (rows[index].batch != '') {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})-${rows[index].batch}</option>`
        //                 } else {
        //                     option += `<option value="${rows[index].id}">${rows[index].sem}-${rows[index].sname}(${rows[index].scode})</option>`
        //                 }
        //             }
        //         }
        //         res.send(option);
        //     } else {
        //         console.log(err);
        //     }
        // })
    } else {
        res.send(option);
    }
});

app.post('/addscheme', async (req, res) => {
    let data = req.body;
    let rows1 = await runQuery(`SELECT sname,scode,fid,fname,dept,did,dv,sem,academic_year,(SELECT MAX(id)+1 FROM intu) as max_id FROM subject s WHERE id='${data.subject}'`);
    let subjectDetails = rows1[0];
    let path = '';
    let oldPath = '';
    const newpath = __dirname + "/upload/scheme/";
    const file = req.files.file;
    if (subjectDetails['dv'] != '') {
        file.name = `S_${subjectDetails['max_id']}_${subjectDetails['scode']}_${subjectDetails['dv']}.` + file.name.split('.')[1];
    } else {
        file.name = `S_${subjectDetails['max_id']}_${subjectDetails['scode']}.` + file.name.split('.')[1];
    }

    const filename = file.name;
    oldPath = file.name;
    path = `${newpath}${filename}`;

    file.mv(`${newpath}${filename}`, async (err) => {
        if (err) {
            let h = [];
            h['insertId'] = 0
            res.send(h);
        }

        sql = `INSERT INTO intu(subject,scode, fid, fname, cid, did, dept, dv, sem, utype, itype, date, path, path_old,academic_year) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.fid}','${subjectDetails.fname}','${subjectDetails.cid}','${subjectDetails.did}','${subjectDetails.dept}','${subjectDetails.dv}','${subjectDetails.sem}','Scheme','${data.internal}','${data.date}','${path}','${oldPath}','${subjectDetails.academic_year}')`;
        let rows2 = await runQuery(sql);
        res.send(rows2);
        // mysqlConnection.query(`SELECT sname,scode,fid,fname,dept,did,dv,sem,academic_year,(SELECT MAX(id)+1 FROM intu) as max_id FROM subject s WHERE id='${data.subject}'`, (err, rows1, fields) => {
        //     if (!err) {
        //         let subjectDetails = rows1[0];
        //         let path = '';
        //         let oldPath = '';
        //         const newpath = __dirname + "/upload/scheme/";
        //         const file = req.files.file;
        //         if (subjectDetails['dv'] != '') {
        //             file.name = `S_${subjectDetails['max_id']}_${subjectDetails['scode']}_${subjectDetails['dv']}.` + file.name.split('.')[1];
        //         } else {
        //             file.name = `S_${subjectDetails['max_id']}_${subjectDetails['scode']}.` + file.name.split('.')[1];
        //         }

        //         const filename = file.name;
        //         oldPath = file.name;
        //         path = `${newpath}${filename}`;

        //         file.mv(`${newpath}${filename}`, (err) => {
        //             if (err) {
        //                 let h = [];
        //                 h['insertId'] = 0
        //                 res.send(h);
        //             }

        //             sql = `INSERT INTO intu(subject,scode, fid, fname, cid, did, dept, dv, sem, utype, itype, date, path, path_old,academic_year) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.fid}','${subjectDetails.fname}','${subjectDetails.cid}','${subjectDetails.did}','${subjectDetails.dept}','${subjectDetails.dv}','${subjectDetails.sem}','Scheme','${data.internal}','${data.date}','${path}','${oldPath}','${subjectDetails.academic_year}')`;
        //             mysqlConnection.query(sql, (err, rows2, fields) => {
        //                 if (!err) {
        //                     res.send(rows2);
        //                 } else {
        //                     console.log(err);
        //                 }
        //             })
        //         });
        //     } else {
        //         console.log(err);
        //     }
    })
});

app.post('/getcurrentyearscheme', async (req, res) => {
    let data = req.body;
    let rows1 = await runQuery(`SELECT id,subject,scode,sem,dv,utype,itype,path FROM intu WHERE fid='${data.fid}' AND academic_year=(SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}') ORDER BY sem,scode,itype ASC`);
    res.send(rows1);
    // mysqlConnection.query(`SELECT id,subject,scode,sem,dv,utype,itype,path FROM intu WHERE fid='${data.fid}' AND academic_year=(SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}') ORDER BY sem,scode,itype ASC`, (err, rows1, fields) => {
    //     if (!err) {
    //         res.send(rows1);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.delete('/deletescheme/:id', async (req, res) => {
    let data = req.params;
    const fs = require('fs')
    let path = __dirname + "/upload/scheme/";
    let rows = await runQuery(`SELECT path FROM intu  WHERE id='${data.id}'`);
    let file = rows[0].path.split("/");
    let filename = file[file.length - 1];
    path += filename;
    let del = await runQuery(`DELETE FROM intu  WHERE id='${data.id}'`);
    if (del.affectedRows > 0) {
        fs.unlinkSync(path);
        res.send([1]);
    } else {
        res.send([0]);
    }
    // mysqlConnection.query(`SELECT path FROM intu  WHERE id='${data.id}'`, (err, rows, fields) => {
    //     if (!err) {
    //         let file = rows[0].path.split("/");
    //         let filename = file[file.length - 1];
    //         path += filename;
    //         mysqlConnection.query(`DELETE FROM intu  WHERE id='${data.id}'`, (err, rows1, fields) => {
    //             if (!err) {
    //                 fs.unlinkSync(path)
    //                 res.send([1]);
    //             } else {
    //                 res.send([0]);
    //                 console.log(err);
    //             }
    //         })
    //     } else {
    //         console.log(err);
    //     }
    // })
    // console.log();
});

app.post('/getpreviousyearscheme', async (req, res) => {
    let data = req.body;
    let tbody = ``;
    let rows = await runQuery(`SELECT id,subject,scode,sem,dv,utype,itype,path FROM intu WHERE fid='${data.fid}' AND academic_year='${data.academicYear}'`);
    for (let index = 0; index < rows.length; index++) {
        let slno = index + 1;
        let element = rows[index];
        let sem = element.sem;
        let download = ``;

        if (element.dv != '') {
            sem = `${element.sem} (${element.dv})`;
        }

        download = `<a href="${element.path}" target="_blank" rel="noopener noreferrer" class='btn btn-info rounded'><i class="fa fa-download" aria-hidden="true"></i> Download</a>`;

        tbody += `<tr>
                    <td>${slno}</td>
                    <td>${element.subject}</td>
                    <td>${element.scode}</td>
                    <td>${sem}</td>
                    <td>${element.utype}</td>
                    <td>${element.itype}</td>
                    <td>${download}</td>
                </tr>`;
    }
    res.send(tbody);
    // mysqlConnection.query(`SELECT id,subject,scode,sem,dv,utype,itype,path FROM intu WHERE fid='${data.fid}' AND academic_year='${data.academicYear}'`, (err, rows, fields) => {
    //     if (!err) {
    //         let tbody = ``;
    //         for (let index = 0; index < rows.length; index++) {
    //             let slno = index + 1;
    //             let element = rows[index];
    //             let sem = element.sem;
    //             let download = ``;

    //             if (element.dv != '') {
    //                 sem = `${element.sem} (${element.dv})`;
    //             }

    //             download = `<a href="${element.path}" target="_blank" rel="noopener noreferrer" class='btn btn-info rounded'><i class="fa fa-download" aria-hidden="true"></i> Download</a>`;

    //             tbody += `<tr>
    //                 <td>${slno}</td>
    //                 <td>${element.subject}</td>
    //                 <td>${element.scode}</td>
    //                 <td>${sem}</td>
    //                 <td>${element.utype}</td>
    //                 <td>${element.itype}</td>
    //                 <td>${download}</td>
    //             </tr>`;
    //         }
    //         res.send(tbody);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/test', async (req, res) => {
    // const res1 = await qb.query('SELECT * FROM academic_year WHERE cid=1');
    // // await qb.disconnect();
    // const res2 = await qb.query('SELECT * FROM academic_year WHERE cid=1');
    // res.send([res1,res2])
    let rows = await runQuery(`DELETE FROM academic_year WHERE cid=4 AND academic_year='2020-2021'`);
    console.log(rows.affectedRows)


});

app.post('/getsubjectreportdetails', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT sname,scode,sem,cid,did,dv,academic_year,dept,(SELECT iname FROM college WHERE id=s.cid) AS iname FROM subject s WHERE id='${data.id}'`);
    let subjectDetails = rows[0];
    let classTaken = await runQuery(`SELECT date FROM class WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND acd_year='${subjectDetails.academic_year}' AND date BETWEEN '${data.fdate}' AND '${data.tdate}'`)
    let studentList = await runQuery(`SELECT  sa.student_id,si.usn,si.name FROM sub_info sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND scd='${subjectDetails.scode}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`)
    let tbody = ``;
    let dateTr = ``;
    let countTr = ``;
    let percentage = 0;
    for (let i = 0; i < studentList.length; i++) {
        const studentDetails = studentList[i];
        tbody += `<tr>
                <td>${i + 1}</td>
                <td>${studentDetails['usn']}</td>
                <td>${studentDetails['name']}</td>`;
        let classAttended = 0;
        for (let j = 0; j < classTaken.length; j++) {
            let date = formatDate('db', classTaken[j]['date']);
            let status = ``;
            let checkAttendance = await runQuery(`SELECT atn FROM attend WHERE student_id='${studentDetails['student_id']}' AND scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}' AND date='${date}'`)
            if (checkAttendance.length > 0) {
                if (checkAttendance[0].atn > 0) {
                    classAttended++;
                    status = `<span class="text-success font-weight-bold text-center">P</span>`;
                } else {
                    status = `<span class="text-danger font-weight-bold text-center">A</span>`;
                }
            } else {
                status = `<span class="text-danger font-weight-bold text-center">A</span>`;
            }
            tbody += `<td>${status}</td>`;
            if (i == 0) {
                dateTr += `<th>${formatDate('', date)}</th>`;
                countTr += `<th>${j + 1}</th>`;
            }
        }
        if (classTaken.length != 0) {
            percentage = classAttended / classTaken.length * 100;
            percentage = percentage.toString().substring(0, 4);
        } else {
            percentage = 0;
        }
        tbody += `<td>${classAttended}</td> <td>${percentage}</td> </tr>`;
    }
    let table = `<div class="card-header">
    <center><img src="https://hrms.secab.org/images/slo2.png" alert="no Image" /> </center>
    <br />
    <center>
        <strong>
            ${subjectDetails['iname']} <br />
            Department Of ${subjectDetails['dept']} <br />
            Semester - ${subjectDetails['sem']}<br />subject - ${subjectDetails['sname']} (  ${subjectDetails['scode']} )<br />
            REPORT FROM ${formatDate('', data.fdate)} TO ${formatDate('', data.tdate)}</strong>
    </center>
</div>
<card class='card-body'>
<table class="table table-bordered text-center">
            <thead class="thead-dark">
                <tr>
				    <th colspan="${classTaken.length + 5}" class="text-capitalize text-center">classes conducted ${classTaken.length}</th>
                </tr>
                <tr class="text-uppercase">
                    <th rowspan="3">sl no</th>
                    <th rowspan="3">usn</th>
                    <th rowspan="3">name</th>
				
                    <th colspan="${classTaken.length}">attended</th>	
                    <th rowspan="3">Total</th>						
                    <th rowspan="3">percentage</th>	
                </tr>
                <tr>
                ${countTr}
                </tr>
                <tr>
                ${dateTr}
                </tr>
            </thead>
            <tbody>
            ${tbody}
            </tbody>
        </table></div>`;
    res.send(table);
    // mysqlConnection.query(`SELECT scode,sem,cid,did,dv,academic_year FROM subject s WHERE id='${data.id}'`, async (err, rows, fields) => {
    //     if (!err) {
    //         let subjectDetails = rows[0];
    //         let classTaken = await promisePool.query(`SELECT date FROM class WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND acd_year='${subjectDetails.academic_year}' AND date BETWEEN '${data.fdate}' AND '${data.tdate}'`)
    //         let studentList = await promisePool.query(`SELECT  sa.student_id,si.usn,si.name FROM sub_info sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND scd='${subjectDetails.scode}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`)
    //         let tbody = ``;
    //         let dateTr = ``;
    //         let countTr = ``;
    //         let percentage = 0;
    //         for (let i = 0; i < studentList[0].length; i++) {
    //             const studentDetails = studentList[0][i];
    //             tbody += `<tr>
    //             <td>${i + 1}</td>
    //             <td>${studentDetails['usn']}</td>
    //             <td>${studentDetails['name']}</td>`;
    //             let classAttended = 0;
    //             for (let j = 0; j < classTaken[0].length; j++) {
    //                 const today = new Date(classTaken[0][j]['date']);
    //                 var dd = String(today.getDate()).padStart(2, '0');
    //                 var mm = String(today.getMonth() + 1).padStart(2, '0');
    //                 var yyyy = today.getFullYear();

    //                 let date = `${yyyy}-${mm}-${dd}`;
    //                 let status = ``;
    //                 let checkAttendance = await promisePool.query(`SELECT atn FROM attend WHERE student_id='${studentDetails['student_id']}' AND scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}' AND date='${date}'`)
    //                 if (checkAttendance[0].length > 0) {
    //                     if (checkAttendance[0][0].atn > 0) {
    //                         classAttended++;
    //                         status = `<span class="text-success font-weight-bold text-center">P</span>`;
    //                     } else {
    //                         status = `<span class="text-danger font-weight-bold text-center">A</span>`;
    //                     }
    //                 } else {
    //                     status = `<span class="text-danger font-weight-bold text-center">A</span>`;
    //                 }
    //                 tbody += `<td>${status}</td>`;
    //                 if (i == 0) {
    //                     dateTr += `<th>${date}</th>`;
    //                     countTr += `<th>${j + 1}</th>`;
    //                 }
    //             }
    //             if (classTaken[0].length != 0) {
    //                 percentage = classAttended / classTaken[0].length * 100;
    //                 percentage = percentage.toString().substring(0, 4);
    //             } else {
    //                 percentage = 0;
    //             }
    //             tbody += `<td>${classAttended}</td> <td>${percentage}</td> </tr>`;
    //         }
    //         let table = `<table class="table table-bordered text-center">
    //         <thead class="thead-dark">
    //             <tr>
    // 			    <th colspan="${classTaken[0].length + 5}" class="text-capitalize text-center">classes conducted ${classTaken[0].length}</th>
    //             </tr>
    //             <tr class="text-uppercase">
    //                 <th rowspan="3">sl no</th>
    //                 <th rowspan="3">usn</th>
    //                 <th rowspan="3">name</th>

    //                 <th colspan="${classTaken[0].length}">attended</th>	
    //                 <th rowspan="3">Total</th>						
    //                 <th rowspan="3">percentage</th>	
    //             </tr>
    //             <tr>
    //             ${countTr}
    //             </tr>
    //             <tr>
    //             ${dateTr}
    //             </tr>
    //         </thead>
    //         <tbody>
    //         ${tbody}
    //         </tbody>
    //     </table>`;
    //         res.send(table);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/viewattendance', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT scode,sem,cid,did,dv,academic_year FROM subject s WHERE id='${data.id}'`);
    let subjectDetails = rows[0];
    let classTaken = await runQuery(`SELECT id,stim,etim,(SELECT topicd FROM tlsnpln WHERE id=c.lp_id) AS topic FROM class c WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND acd_year='${subjectDetails.academic_year}' AND date='${data.fdate}'`)
    let table = ``;
    if (classTaken.length > 0) {
        for (let i = 0; i < classTaken.length; i++) {
            const classDetails = classTaken[i];
            table += `<table style="text-align:center" class="table table-bordered table-striped table1 text-uppercase" id="hide">
                <thead class="thead-dark">
                    <tr>
                    <th colspan="2">Topic:  ${classDetails.topic}</th>
                    <th colspan="2">  <br>Start Time: ${classDetails.stim}   End Time: ${classDetails.etim}</th></tr>
                    <tr>
                        <th>Sl No</th>
                         <th>USN</th>
                         <th>Name</th>                          
                        <th>Status</th>    
                    </tr>
                </thead>
                <tbody>`;
            // console.log(`SELECT  sa.student_id,si.usn,si.name FROM attend sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE class_id='${classDetails.id}' ORDER BY si.usn ASC`)
            let studentList = await runQuery(`SELECT  sa.student_id,si.usn,si.name,sa.atn FROM attend sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE class_id='${classDetails.id}' ORDER BY si.usn ASC`);
            for (let j = 0; j < studentList.length; j++) {
                const studentDetails = studentList[j];
                let status = ``;
                if (studentDetails.atn > 0) {
                    status = `Present`
                } else {
                    status = `Absent`
                }
                table += `<tr>
                        <td>${j + 1}</td>
                        <td>${studentDetails.usn}</td>
                        <td>${studentDetails.name}</td>
                        <td>${status}</td>
                    </tr>`;

            }
            table += `</tbody>
                </table>`;
        }
    } else {
        table = "<span class='text-danger font-weight-bold'>Attendance Not Taken</span>";
    }
    res.send(table);
    // mysqlConnection.query(`SELECT scode,sem,cid,did,dv,academic_year FROM subject s WHERE id='${data.id}'`, async (err, rows, fields) => {
    //     if (!err) {
    //         let subjectDetails = rows[0];
    //         let classTaken = await promisePool.query(`SELECT id,stim,etim,(SELECT topicd FROM tlsnpln WHERE id=c.lp_id) AS topic FROM class c WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND acd_year='${subjectDetails.academic_year}' AND date='${data.fdate}'`)
    //         let table = ``;
    //         if (classTaken[0].length > 0) {
    //             for (let i = 0; i < classTaken[0].length; i++) {
    //                 const classDetails = classTaken[0][i];
    //                 table += `<table style="text-align:center" class="table table-bordered table-striped table1 text-uppercase" id="hide">
    //             <thead class="thead-dark">
    //                 <tr>
    //                 <th colspan="2">Topic:  ${classDetails.topic}</th>
    //                 <th colspan="2">  <br>Start Time: ${classDetails.stim}   End Time: ${classDetails.etim}</th></tr>
    //                 <tr>
    //                     <th>Sl No</th>
    //                      <th>USN</th>
    //                      <th>Name</th>                          
    //                     <th>Status</th>    
    //                 </tr>
    //             </thead>
    //             <tbody>`;
    //                 console.log(`SELECT  sa.student_id,si.usn,si.name FROM attend sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE class_id='${classDetails.id}' ORDER BY si.usn ASC`)
    //                 let studentList = await promisePool.query(`SELECT  sa.student_id,si.usn,si.name,sa.atn FROM attend sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE class_id='${classDetails.id}' ORDER BY si.usn ASC`);
    //                 for (let j = 0; j < studentList[0].length; j++) {
    //                     const studentDetails = studentList[0][j];
    //                     let status = ``;
    //                     if (studentDetails.atn > 0) {
    //                         status = `Present`
    //                     } else {
    //                         status = `Absent`
    //                     }
    //                     table += `<tr>
    //                     <td>${j + 1}</td>
    //                     <td>${studentDetails.usn}</td>
    //                     <td>${studentDetails.name}</td>
    //                     <td>${status}</td>
    //                 </tr>`;

    //                 }
    //                 table += `</tbody>
    //             </table>`;
    //             }
    //         } else {
    //             table = "<span class='text-danger font-weight-bold'>Attendance Not Taken</span>";
    //         }
    //         res.send(table);
    //     } else {
    //         console.log(err);
    //     }
    // })
});


app.post('/getiareport', async (req, res) => {
    let data = req.body;
    let getIaMarks = async (studentId, scode, did, dv, academicYear, internal, fid) => {
        let a = 0;
        let b = 0;
        let parts = new Array(2);
        for (var n = 0; n < parts.length; n++) {
            parts[n] = new Array(2);
        }

        let qp = await runQuery(`SELECT qno FROM nba_question WHERE fid='${fid}' AND scode='${scode}' AND internal='${internal}' AND dv='${dv}' AND did='${did}' AND academic_year='${academicYear}' ORDER BY id ASC`);
        for (let k = 0; k < qp.length; k++) {
            const element = qp[k];
            if (element['qno'].includes('part')) {
                if (element['qno'] == 'part-a') {
                } else {
                    a++; //parts array  index Incrementor
                    b = 0; // question index of new part
                }
            } else {
                if (element['qno'].includes('or')) {
                    parts[a][b] = element['qno'];
                } else {
                    answerSheet1 = await runQuery(`SELECT marks FROM nba_marks WHERE student_id='${studentId}' AND scode='${scode}' AND marks_type='internal' AND  internal='${internal}' AND qno='${element['qno']}'  AND academic_year='${academicYear}'`)
                    if (answerSheet1.length > 0) {
                        if (answerSheet1[0]['marks'] == 'NA' || answerSheet1[0]['marks'] == 'na') {
                            parts[a][b] = 0
                        } else {
                            parts[a][b] = parseInt(answerSheet1[0]['marks'])
                        }
                    } else {
                        parts[a][b] = 0;
                    }
                }
                b++;
            }
        }

        let count = parts.length;
        let partsMaxMarks = [];
        for (let l = 0; l < count; l++) {
            let implode = parts[l].join(' ');
            let explode = implode.split('or');
            let marks = [];
            let f = 0;
            for (let m = 0; m < explode.length; m++) {
                let explode3 = explode[m].split(' ').filter(e => { return e != '' });
                marks[f] = explode3.reduce((a, b) => parseInt(a) + parseInt(b), 0);
                f++;
            }
            partsMaxMarks[l] = marks.reduce(function (a, b) {
                return Math.max(a, b);
            });
        }
        return partsMaxMarks.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    let rows = await runQuery(`SELECT fid,scode,sem,cid,did,dv,academic_year FROM subject s WHERE id='${data.id}'`)
    let subjectDetails = rows[0]

    let tbody = ``;
    let studentList = await runQuery(`SELECT  sa.student_id,si.usn,si.name FROM sub_info sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND scd='${subjectDetails.scode}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`)
    for (let index = 0; index < studentList.length; index++) {
        const element = studentList[index];
        let ia1 = await getIaMarks(element.student_id, subjectDetails.scode, subjectDetails.did, subjectDetails.dv, subjectDetails.academic_year, "i", subjectDetails.fid);
        let ia2 = await getIaMarks(element.student_id, subjectDetails.scode, subjectDetails.did, subjectDetails.dv, subjectDetails.academic_year, "ii", subjectDetails.fid);
        let ia3 = await getIaMarks(element.student_id, subjectDetails.scode, subjectDetails.did, subjectDetails.dv, subjectDetails.academic_year, "iii", subjectDetails.fid);
        let marks = await runQuery(`SELECT marks FROM el_assignment_marks WHERE scd='${subjectDetails.scode}' and student_id='${element.student_id}' AND academic_year='${subjectDetails.academic_year}'`)
        let average = Math.round(ia1) + Math.round(ia2) + Math.round(ia3) / 3;
        average = average.toString().substring(0, 4);
        let assignmentsMarks = 0;
        if (marks.length != 0) {
            assignmentsMarks = parseInt(marks[0]);
        }
        let total = parseInt(average) + assignmentsMarks;
        tbody += `<tr>
                    <td>${index + 1}</td>
                    <td>${element.usn}</td>
                    <td>${element.name}</td>`;
        tbody += `
                    <td>${ia1}</td>
                    <td>${ia2}</td>
                    <td>${ia3}</td>
                    <td>${average}</td>
                    <td>${assignmentsMarks}</td>
                    <td>${total}</td>
                    <td></td>
                </tr>`;

    }
    res.send(tbody)
    // mysqlConnection.query('SELECT fid,scode,sem,cid,did,dv,academic_year FROM `subject` s WHERE id=?', [data.id], async (err, rows, fields) => {
    //     if (!err) {
    //         let subjectDetails = rows[0]

    //         let tbody = ``;
    //         let studentList = await promisePool.query(`SELECT  sa.student_id,si.usn,si.name FROM sub_info sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND scd='${subjectDetails.scode}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`)
    //         for (let index = 0; index < studentList[0].length; index++) {
    //             const element = studentList[0][index];
    //             let ia1 = await getIaMarks(element.student_id, subjectDetails.scode, subjectDetails.did, subjectDetails.dv, subjectDetails.academic_year, "i", subjectDetails.fid);
    //             let ia2 = await getIaMarks(element.student_id, subjectDetails.scode, subjectDetails.did, subjectDetails.dv, subjectDetails.academic_year, "ii", subjectDetails.fid);
    //             let ia3 = await getIaMarks(element.student_id, subjectDetails.scode, subjectDetails.did, subjectDetails.dv, subjectDetails.academic_year, "iii", subjectDetails.fid);
    //             let marks = await promisePool.query(`SELECT marks FROM el_assignment_marks WHERE scd='${subjectDetails.scode}' and student_id='${element.student_id}' AND academic_year='${subjectDetails.academic_year}'`)
    //             let average = Math.round(ia1) + Math.round(ia2) + Math.round(ia3) / 3;
    //             average = average.toString().substring(0, 4);
    //             let assignmentsMarks = 0;
    //             if (marks[0].length != 0) {
    //                 assignmentsMarks = parseInt(marks[0][0]);
    //             }
    //             let total = parseInt(average) + assignmentsMarks;
    //             tbody += `<tr>
    //                 <td>${index + 1}</td>
    //                 <td>${element.usn}</td>
    //                 <td>${element.name}</td>`;
    //             tbody += `
    //                 <td>${ia1}</td>
    //                 <td>${ia2}</td>
    //                 <td>${ia3}</td>
    //                 <td>${average}</td>
    //                 <td>${assignmentsMarks}</td>
    //                 <td>${total}</td>
    //                 <td></td>
    //             </tr>`;

    //         }
    //         res.send(tbody)

    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getlessonplantopic', async (req, res) => {
    let data = req.body;
    if (data.id != '') {
        let rows = await runQuery(`SELECT sname,scode,sem,dv,cid,did,dept,fid,fname,academic_year FROM subject s WHERE id='${data.id}'`);
        let subjectDetails = rows[0];
        let lessonPlan = await runQuery(`SELECT id,topicd FROM tlsnpln WHERE scode='${subjectDetails.scode}' AND sname='${subjectDetails.sname}' AND (fname='${subjectDetails.fname}' || fid='${subjectDetails.fid}') AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND dept='${subjectDetails.dept}' AND did='${subjectDetails.did}' AND planned_date!='0000-00-00' AND (status='' or status='Not Complete') AND academic_year='${subjectDetails.academic_year}'`)
        let option = `<option value="">Select Topic</option>`;
        for (let i = 0; i < lessonPlan.length; i++) {
            const element = lessonPlan[i];
            option += `<option value="${element.id}">${element.topicd}</option>`;
        }
        res.send(option);
        // mysqlConnection.query(`SELECT sname,scode,sem,dv,cid,did,dept,fid,fname,academic_year FROM subject s WHERE id='${data.id}'`, async (err, rows, fields) => {
        //     if (!err) {
        //         let subjectDetails = rows[0];
        //         let lessonPlan = await promisePool.query(`SELECT id,topicd FROM tlsnpln WHERE scode='${subjectDetails.scode}' AND sname='${subjectDetails.sname}' AND (fname='${subjectDetails.fname}' || fid='${subjectDetails.fid}') AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND dept='${subjectDetails.dept}' AND did='${subjectDetails.did}' AND planned_date!='0000-00-00' AND (status='' or status='Not Complete') AND academic_year='${subjectDetails.academic_year}'`)
        //         let option = `<option value="">Select Topic</option>`;
        //         for (let i = 0; i < lessonPlan[0].length; i++) {
        //             const element = lessonPlan[0][i];
        //             option += `<option value="${element.id}">${element.topicd}</option>`;
        //         }
        //         res.send(option);
        //     } else {
        //         console.log(err);
        //     }
        // })
    }

});

app.post('/getlablessonplantopic', async (req, res) => {
    let data = req.body;
    if (data.id != '') {
        let rows = await runQuery(`SELECT scode,sem,dv,batch,academic_year FROM subject s WHERE id='${data.id}'`)
        let subjectDetails = rows[0];
        let lessonPlan = await runQuery(`SELECT id,experiment FROM tlsnpln_lab WHERE scode='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND batch='${subjectDetails.batch}' AND (status='' or status='Not Complete') AND academic_year='${subjectDetails.academic_year}'`)
        let option = `<option value="">Select Experiment</option>`;
        for (let i = 0; i < lessonPlan.length; i++) {
            const element = lessonPlan[i];
            option += `<option value="${element.id}">${element.experiment}</option>`;
        }
        res.send(option);
        // mysqlConnection.query(`SELECT scode,sem,dv,batch,academic_year FROM subject s WHERE id='${data.id}'`, async (err, rows, fields) => {
        //     if (!err) {
        //         let subjectDetails = rows[0];
        //         let lessonPlan = await promisePool.query(`SELECT id,experiment FROM tlsnpln_lab WHERE scode='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND batch='${subjectDetails.batch}' AND (status='' or status='Not Complete') AND academic_year='${subjectDetails.academic_year}'`)
        //         let option = `<option value="">Select Experiment</option>`;
        //         for (let i = 0; i < lessonPlan[0].length; i++) {
        //             const element = lessonPlan[0][i];
        //             option += `<option value="${element.id}">${element.experiment}</option>`;
        //         }
        //         res.send(option);
        //     } else {
        //         console.log(err);
        //     }
        // })
    }

});

app.post('/getattendancelist', async (req, res) => {
    let data = req.body;
    if (data.id != '') {
        let rows = await runQuery(`SELECT sname,scode,sem,cid,did,dv,academic_year FROM subject s WHERE id='${data.id}'`);
        let subjectDetails = rows[0];
        let studentList = await runQuery(`SELECT  sa.student_id,sa.scd,si.usn,si.name FROM sub_info sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND sa.academic_year='${subjectDetails.academic_year}' AND scd='${subjectDetails.scode}' ORDER BY si.usn ASC`);
        res.send(studentList);
    }
});

app.post('/attendanceAdded', async (req, res) => {
    let data = req.body;
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(data.date);
    let day = weekday[d.getDay()];
    if (data.id != '') {
        let date = formatDate('db', data.date);
        let rows = await runQuery(`SELECT sname,scode,sem,cid,college,dept,did,dv,stype,academic_year,fname,batch,fid,(SELECT period FROM sal_ttable WHERE scode='s.scode' AND sem='s.sem' AND dv='s.dv' AND fid='s.fid' AND day='${day}') AS period FROM subject s WHERE id='${data.id}'`);
        let subjectDetails = rows[0];
        let lpId = '';
        let status = '';
        for (let index = 0; index < data.lessonPlan.length; index++) {
            const element = data.lessonPlan[index];
            if (element.subTopic != '') {
                lpId += `${element.subTopic},`;
            } else {
                lpId += `${element.topic},`;
            }
            status += `${element.status},`;
        }
        let classInsert = await runQuery(`INSERT INTO class(sname, scd, stype, dept, did, college, cid, sem, dv, fname, fid, date, period, stim, etim,batch, lp_id, acd_year, status) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.stype}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${subjectDetails.fname}','${subjectDetails.fid}','${date}','${subjectDetails.period}','${data.startTime}','${data.endTime}','${subjectDetails.batch}','${lpId}','${subjectDetails.academic_year}','${status}')`);
        let upcheck = 0;
        if (classInsert.insertId > 0) {
            for (let j = 0; j < data.lessonPlan.length; j++) {
                const element1 = data.lessonPlan[j];
                let id = 0;
                if (element1.subTopic != '') {
                    id = element1.subTopic;
                } else {
                    id = element1.topic;
                }
                if (element1.status == "completed") {
                    let updateLessonPlan = await runQuery(`UPDATE tlsnpln SET status='${element1.status}',class_id='${classInsert.insertId}'  WHERE id='${id}'`);
                    if (updateLessonPlan.affectedRows > 0) {
                        upcheck++;
                    }
                } else {
                    upcheck++;
                }

            }
            if (upcheck > 0) {
                let attendanceSubmited = 0;
                for (let k = 0; k < data.attendnaceData.length; k++) {
                    const element3 = data.attendnaceData[k];
                    attendance = await runQuery(`INSERT INTO attend(class_id,student_id,dept,did,college,cid,sem,dv,scd,atn,academic_year,date) VALUES ('${classInsert.insertId}','${element3.student_id}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${element3.scode}','${element3.classes}','${subjectDetails.academic_year}','${date}')`);
                    if (attendance.insertId > 0) {
                        attendanceSubmited++;
                    }
                }
                if (attendanceSubmited > 0) {
                    res.send([{ msg: "Attendance Submitted", icon: "success" }]);
                } else {
                    res.send([{ msg: "Class Added But Attendance Not Added", icon: "danger" }]);
                }
            }
        } else {
            res.send([{ msg: "Class Not Added", icon: "danger" }]);
        }
        // mysqlConnection.query(`SELECT sname,scode,sem,cid,college,dept,did,dv,stype,academic_year,fname,batch,fid,(SELECT period FROM sal_ttable WHERE scode='s.scode' AND sem='s.sem' AND dv='s.dv' AND fid='s.fid' AND day='${day}') AS period FROM subject s WHERE id=?`, [data.id], async (err, rows, fields) => {
        //     if (!err) {
        //         let subjectDetails = rows[0];
        //         let lpId = '';
        //         let status = '';
        //         for (let index = 0; index < data.lessonPlan.length; index++) {
        //             const element = data.lessonPlan[index];
        //             if (element.subTopic != '') {
        //                 lpId += `${element.subTopic},`;
        //             } else {
        //                 lpId += `${element.topic},`;
        //             }
        //             status += `${element.status},`;
        //         }
        //         let classInsert = await promisePool.query(`INSERT INTO class(sname, scd, stype, dept, did, college, cid, sem, dv, fname, fid, date, period, stim, etim,batch, lp_id, acd_year, status) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.stype}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${subjectDetails.fname}','${subjectDetails.fid}','${date}','${subjectDetails.period}','${data.startTime}','${data.endTime}','${subjectDetails.batch}','${lpId}','${subjectDetails.academic_year}','${status}')`);
        //         let upcheck = 0;
        //         if (classInsert[0].insertId > 0) {
        //             for (let j = 0; j < data.lessonPlan.length; j++) {
        //                 const element1 = data.lessonPlan[j];
        //                 let id = 0;
        //                 if (element1.subTopic != '') {
        //                     id = element1.subTopic;
        //                 } else {
        //                     id = element1.topic;
        //                 }
        //                 if (element1.status == "completed") {
        //                     let updateLessonPlan = await promisePool.query(`UPDATE tlsnpln SET status='${element1.status}',class_id='${classInsert[0].insertId}'  WHERE id='${id}'`);
        //                     if (updateLessonPlan[0].affectedRows > 0) {
        //                         upcheck++;
        //                     }
        //                 } else {
        //                     upcheck++;
        //                 }

        //             }
        //             if (upcheck > 0) {
        //                 let attendanceSubmited = 0;
        //                 for (let k = 0; k < data.attendnaceData.length; k++) {
        //                     const element3 = data.attendnaceData[k];
        //                     attendance = await promisePool.query(`INSERT INTO attend(class_id,student_id,dept,did,college,cid,sem,dv,scd,atn,academic_year,date) VALUES ('${classInsert[0].insertId}','${element3.student_id}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${element3.scode}','${element3.classes}','${subjectDetails.academic_year}','${date}')`);
        //                     if (attendance[0].insertId > 0) {
        //                         attendanceSubmited++;
        //                     }
        //                 }
        //                 if (attendanceSubmited > 0) {
        //                     res.send([{ msg: "Attendance Submitted", icon: "success" }]);
        //                 } else {
        //                     res.send([{ msg: "Class Added But Attendance Not Added", icon: "danger" }]);
        //                 }
        //             }
        //         } else {
        //             res.send([{ msg: "Class Not Added", icon: "danger" }]);
        //         }
        //     } else {
        //         console.log(err);
        //     }
        // })
    }
});

app.post('/labattendanceAdded', async (req, res) => {
    let data = req.body;
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(data.date);
    let day = weekday[d.getDay()];
    if (data.id != '') {
        let date = formatDate('db', data.date);
        let rows = await runQuery(`SELECT sname,scode,sem,cid,college,dept,did,dv,stype,academic_year,fname,fid,batch,(SELECT period FROM sal_ttable WHERE scode='s.scode' AND sem='s.sem' AND dv='s.dv' AND fid='s.fid' AND day='${day}') AS period FROM subject s WHERE id='${data.id}'`);
        let subjectDetails = rows[0];
        let lpId = '';
        let status = '';
        for (let index = 0; index < data.lessonPlan.length; index++) {
            const element = data.lessonPlan[index];
            lpId += `${element.topic},`;
            status += `${element.status},`;
        }
        let classInsert = await runQuery(`INSERT INTO class(sname, scd, stype, dept, did, college, cid, sem, dv, fname, fid, date, period, stim, etim,batch, lp_id, acd_year, status) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.stype}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${subjectDetails.fname}','${subjectDetails.fid}','${date}','${subjectDetails.period}','${data.startTime}','${data.endTime}','${subjectDetails.batch}','${lpId}','${subjectDetails.academic_year}','${status}')`);
        let upcheck = 0;
        if (classInsert.insertId > 0) {
            for (let j = 0; j < data.lessonPlan.length; j++) {
                const element1 = data.lessonPlan[j];
                let id = element1.topic;
                if (element1.status == "completed") {
                    let updateLessonPlan = await runQuery(`UPDATE tlsnpln_lab SET status='${element1.status}',class_id='${classInsert.insertId}'  WHERE id='${id}'`);
                    if (updateLessonPlan.affectedRows > 0) {
                        upcheck++;
                    }
                } else {
                    upcheck++;
                }

            }
            if (upcheck > 0) {
                let attendanceSubmited = 0;
                for (let k = 0; k < data.attendnaceData.length; k++) {
                    const element3 = data.attendnaceData[k];
                    attendance = await promisePool.query(`INSERT INTO lab_attend(class_id,student_id,dept,did,college,cid,sem,dv,scd,atn,academic_year,date) VALUES ('${classInsert.insertId}','${element3.student_id}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${element3.scode}','${element3.classes}','${subjectDetails.academic_year}','${date}')`);
                    if (attendance.insertId > 0) {
                        attendanceSubmited++;
                    }
                }
                if (attendanceSubmited > 0) {
                    res.send([{ msg: "Attendance Submitted", icon: "success" }]);
                }
            }
        } else {
            res.send([{ msg: "Class Not Added", icon: "danger" }]);
        }
        // mysqlConnection.query(`SELECT sname,scode,sem,cid,college,dept,did,dv,stype,academic_year,fname,fid,batch,(SELECT period FROM sal_ttable WHERE scode='s.scode' AND sem='s.sem' AND dv='s.dv' AND fid='s.fid' AND day='${day}') AS period FROM subject s WHERE id=?`, [data.id], async (err, rows, fields) => {
        //     if (!err) {
        //         let subjectDetails = rows[0];
        //         let lpId = '';
        //         let status = '';
        //         for (let index = 0; index < data.lessonPlan.length; index++) {
        //             const element = data.lessonPlan[index];
        //             lpId += `${element.topic},`;
        //             status += `${element.status},`;
        //         }
        //         let classInsert = await promisePool.query(`INSERT INTO class(sname, scd, stype, dept, did, college, cid, sem, dv, fname, fid, date, period, stim, etim,batch, lp_id, acd_year, status) VALUES ('${subjectDetails.sname}','${subjectDetails.scode}','${subjectDetails.stype}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${subjectDetails.fname}','${subjectDetails.fid}','${date}','${subjectDetails.period}','${data.startTime}','${data.endTime}','${subjectDetails.batch}','${lpId}','${subjectDetails.academic_year}','${status}')`);
        //         let upcheck = 0;
        //         if (classInsert[0].insertId > 0) {
        //             for (let j = 0; j < data.lessonPlan.length; j++) {
        //                 const element1 = data.lessonPlan[j];
        //                 let id = element1.topic;
        //                 if (element1.status == "completed") {
        //                     let updateLessonPlan = await promisePool.query(`UPDATE tlsnpln_lab SET status='${element1.status}',class_id='${classInsert[0].insertId}'  WHERE id='${id}'`);
        //                     if (updateLessonPlan[0].affectedRows > 0) {
        //                         upcheck++;
        //                     }
        //                 } else {
        //                     upcheck++;
        //                 }

        //             }
        //             if (upcheck > 0) {
        //                 let attendanceSubmited = 0;
        //                 for (let k = 0; k < data.attendnaceData.length; k++) {
        //                     const element3 = data.attendnaceData[k];
        //                     attendance = await promisePool.query(`INSERT INTO lab_attend(class_id,student_id,dept,did,college,cid,sem,dv,scd,atn,academic_year,date) VALUES ('${classInsert[0].insertId}','${element3.student_id}','${subjectDetails.dept}','${subjectDetails.did}','${subjectDetails.college}','${subjectDetails.cid}','${subjectDetails.sem}','${subjectDetails.dv}','${element3.scode}','${element3.classes}','${subjectDetails.academic_year}','${date}')`);
        //                     if (attendance[0].insertId > 0) {
        //                         attendanceSubmited++;
        //                     }
        //                 }
        //                 if (attendanceSubmited > 0) {
        //                     res.send([{ msg: "Attendance Submitted", icon: "success" }]);
        //                 }
        //             }
        //         } else {
        //             res.send([{ msg: "Class Not Added", icon: "danger" }]);
        //         }
        //     } else {
        //         console.log(err);
        //     }
        // })
    }
});

app.post('/getcos', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT cid,did,scode,dv,academic_year FROM subject s WHERE id='${data.id}'`);
    let subjectDetails = rows[0];

    // console.log(subjectDetails);
    let rows2 = await runQuery(`SELECT id,cos FROM nba_co WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}'`);
    res.send(rows2);
});

app.post('/addpo', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT fid,cid,did,scode,dv,academic_year  FROM subject s WHERE id='${data.id}'`);
    let subjectDetails = rows[0];
    let checkRecord = await runQuery(`SELECT id FROM nba_po WHERE scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}' AND pos='${data.pos}' AND co_id='${data.co_id}'`);
    // console.log(checkRecord[0].length)
    if (checkRecord.length > 0) {
        let insert = await runQuery(`UPDATE nba_po SET po='${data.po}' WHERE id='${checkRecord[0].id}'`);
        res.send([insert.affectedRows]);
    } else {
        let insert = await runQuery(`INSERT INTO nba_po(fid, cid, did, scode, dv, co_id, pos, po,academic_year)VALUES ('${subjectDetails.fid}','${subjectDetails.cid}','${subjectDetails.did}','${subjectDetails.scode}','${subjectDetails.dv}','${data.co_id}','${data.pos}','${data.po}','${subjectDetails.academic_year}')`);
        res.send([insert.insertId]);
    }
});

app.post('/getdepartmentdetails', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT name,(SELECT iname FROM college WHERE id=d.cid) AS iname FROM dept d WHERE id='${data.did}'`);
    res.send(rows[0])
});

app.post('/psoadded', async (req, res) => {
    let data = req.body;
    let insertCheck = 0;

    for (let i = 0; i < data.psoData.length; i++) {
        const element = data.psoData[i];

        let checkRecord = await runQuery(`SELECT id FROM nba_pso WHERE did='${data.did}' AND pso='${element.pso}' AND academic_year='${data.academic_year}'`);
        if (checkRecord.length > 0) {
            let insert = await runQuery(`UPDATE nba_pso SET stmt='${element.stmt}' WHERE id='${checkRecord[0].id}'`);
            if (insert.affectedRows > 0) {
                insertCheck++;
            }
        } else {
            let insert = await runQuery(`INSERT INTO nba_pso(fid, cid, did,pso,stmt,academic_year) VALUES ('${data.fid}','${data.cid}','${data.did}','${element.pso}','${element.stmt}','${data.academic_year}')`);
            if (insert.insertId > 0) {
                insertCheck++;
            }
        }
    }
    res.send([insertCheck])
});

app.post('/getpso', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT pso,stmt,id FROM nba_pso WHERE did='${data.did}' AND academic_year='${data.academic_year}'`);
    res.send(rows)
});

app.delete('/deletepso/:id', async (req, res) => {
    let data = req.params;
    let rows = await runQuery(`DELETE FROM nba_pso WHERE id='${data.id}'`);
    res.send([rows.affectedRows]);
});

app.post('/getdepartmentdetailsbyid', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT * FROM dept WHERE id='${data.id}'`);
    res.send(rows);
    // mysqlConnection.query('SELECT * FROM `dept` WHERE id=?', [data.did], (err, rows, fields) => {
    //     if (!err) {
    //         res.send(rows);
    //     } else {
    //         console.log(err);
    //     }
    // })

});

app.post('/getstudentdetail', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT si.*,sa.rno FROM student_info si RIGHT JOIN student_academic sa ON si.student_id=sa.student_id WHERE sa.id='${data.studentId}'`);
    res.send(rows);
    // mysqlConnection.query('SELECT si.*,sa.rno FROM student_info si RIGHT JOIN student_academic sa ON si.student_id=sa.student_id WHERE sa.id=? ', [data.studentId], (err, rows, fields) => {
    //     if (!err) {
    //         res.send(rows);
    //     } else {
    //         console.log(err);
    //     }
    // })

});

app.post('/updatestudent', (req, res) => {
    let data = req.body;
    mysqlConnection.query('UPDATE `student_info` SET usn=?,name=?,user_name=?,did=?,mobile=?,email=?,academic_type=? WHERE student_id in (SELECT student_id FROM `student_academic` WHERE id=?)', [data.usn, data.name, data.usn, data.department, data.mobile, data.email, data.academicType, data.studentId], (err, rows, fields) => {
        if (!err) {
            mysqlConnection.query('UPDATE `student_academic` SET rno=?,did=?,sem=?,dv=? WHERE id=?', [data.rno, data.department, data.sem, data.dv, data.studentId], (err, rows, fields) => {
                if (!err) {
                    res.send(rows);
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })

});

app.post('/deleteStudent', (req, res) => {
    let data = req.body;
    mysqlConnection.query('DELETE FROM `sub_info` WHERE student_id in (SELECT student_id FROM `student_academic` WHERE id=?) AND sem=? AND academic_year=? AND dv=?', [data.studentId, data.sem, data.academicYear, data.dv], (err, rows, fields) => {
        if (!err) {
            mysqlConnection.query('DELETE FROM `student_academic` WHERE id=?', [data.studentId], (err, rows, fields) => {
                if (!err) {
                    res.send(rows);
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })

});

app.post('/getSubjectList', (req, res) => {
    let data = req.body;
    let query = '';
    if (data.did == 6) {
        query = `SELECT DISTINCT scode,sname FROM subject WHERE sem='${data.sem}' AND did='${data.did}' AND dv='${data.dv}' AND cid='${data.cid}' AND academic_year='${data.academicYear}' AND stype!='lab' ORDER BY substr(scode,-1) ASC`;
    } else if (data.did == 7) {
        query = `SELECT DISTINCT scode,sname FROM subject WHERE sem='${data.sem}' AND did='${data.did}' AND cid='${data.cid}' AND  academic_year='${data.academicYear}' AND stype!='lab' ORDER BY id ASC`;
    } else {
        if (data.cid == 8 || data.cid == 9 || data.cid == 34) {
            let facultyDid = 0;
            let langId = 0;
            if (data.cid == 8) {
                facultyDid = 55;
                langId = 67;
            } else {
                facultyDid = $did;
                langId = 68;
            }
            query = `SELECT DISTINCT scode,sname FROM subject_pre WHERE cid='${data.cid}' AND did IN('${data.did}','${langId}') and sem='${data.sem}' ORDER BY scode ASC`;
        }
        else if (data.cid == 4) {
            query = `SELECT DISTINCT scode,sname FROM subject_pre WHERE cid='${data.cid}' AND did IN('${data.did}') AND sem='${data.sem}' AND academic_year='${data.academicYear}'  ORDER BY scode ASC`;
        } else {
            query = `SELECT DISTINCT scode,sname FROM subject WHERE sem='${data.sem}' AND did='${data.did}' AND dv='${data.dv}' AND cid='${data.cid}' AND academic_year='${data.academicYear}' AND stype!='lab' ORDER BY if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) ASC`;
        }
    }
    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            let option = `<option value="">Select Subject</option>`;
            for (let index = 0; index < rows.length; index++) {
                option += `<option value="${rows[index].scode}">${rows[index].sname + " (" + rows[index].scode + ")"}</option>`
            }
            res.send(option);
        } else {
            console.log(err);
        }
    })
});

app.post('/getacademicdepartmentoption', (req, res) => {
    let data = req.body;
    mysqlConnection.query('SELECT name,id FROM `dept` WHERE cid=? AND academic=? ORDER BY id ASC', [data.cid, '1'], (err, rows, fields) => {
        if (!err) {

            let option = `<option value="">Select Department</option>`;
            for (let index = 0; index < rows.length; index++) {
                option += `<option value="${rows[index].id}">${rows[index].name}</option>`
            }
            res.send(option);
        } else {
            console.log(err);
        }
    })
});

app.post('/getquotaoption', (req, res) => {
    let data = req.body;
    mysqlConnection.query('SELECT name,v_name FROM `fee_quota` WHERE cid=? AND status=? ORDER BY id ASC', [data.cid, '1'], (err, rows, fields) => {
        if (!err) {

            let option = `<option value="">Select Quota</option>`;
            for (let index = 0; index < rows.length; index++) {
                option += `<option value="${rows[index].v_name}">${rows[index].name}</option>`
            }
            res.send(option);
        } else {
            console.log(err);
        }
    })
});

app.post('/getcategoriesoption', (req, res) => {
    let data = req.body;
    mysqlConnection.query('SELECT name FROM `fee_categories` WHERE cid=? AND status=? ORDER BY id ASC', [data.cid, '1'], (err, rows, fields) => {
        if (!err) {

            let option = `<option value="">Select Quota</option>`;
            for (let index = 0; index < rows.length; index++) {
                option += `<option value="${rows[index].name}">${rows[index].name}</option>`
            }
            res.send(option);
        } else {
            console.log(err);
        }
    })
});

app.post('/getsem', (req, res) => {
    let data = req.body;

    let option = `<option value="">Select Sem</option>`;
    for (let index = 1; index <= 10; index++) {
        option += `<option value="${index}">${index}</option>`
    }
    res.send(option);

});

app.post('/getstudentlist', (req, res) => {
    let data = req.body;
    mysqlConnection.query('SELECT sa.*,si.usn,sa.id AS sid, si.scheme,si.name as studentname,si.mobile FROM `student_academic` sa INNER JOIN `student_info` si ON sa.student_id = si.student_id WHERE sem=? AND sa.did IN(?) AND dv=? AND sa.cid=? AND sa.academic_year=? ORDER BY rno', [data.sem, data.department, data.dv, data.cid, data.academicYear], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

app.post('/getStudentList2', (req, res) => {
    let data = req.body;
    let query = '';
    if (data.did == 6) {
        query = `SELECT sa.*,si.usn,si.name,sa.id AS sid FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${data.sem}' AND sa.did IN('${data.did}') AND dv='${data.dv}' AND sa.cid='${data.cid}' AND sa.academic_year='${data.academicYear}' ORDER BY rno`;
    } else {
        query = `SELECT  sa.*,si.usn,si.name,sa.id AS sid FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${data.sem}' AND sa.did='${data.did}' AND dv='${data.dv}' AND sa.cid='${data.cid}' AND sa.academic_year='${data.academicYear}' ORDER BY si.usn ASC`;
    }

    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

app.post('/addSubject', async (req, res) => {
    var addedCount23 = 0;
    let data = req.body;
    let studentId = data.studentId;

    for (let index = 0; index < studentId.length; index++) {
        if (studentId[index] != null) {
            let rows = await db.query(`SELECT *,(SELECT rno FROM student_academic WHERE student_id=si.student_id and academic_year=si.academic_year and promote=0) as rno FROM student_info si WHERE student_id='${studentId[index]}'`)
            let studentDetails = rows[0];
            let rows1 = await db.query(`INSERT INTO sub_info(student_id, usn, name, cid, did, sem, dv, scd, academic_year) VALUES ('${studentId[index]}', '${studentDetails.usn}', '${studentDetails.name}', '${data.cid}', '${data.did}', '${data.sem}', '${data.dv}', '${data.scd}', '${data.academicYear}')`)
            if (rows1.affectedRows > 0) {
                addedCount23++;
            }
        }
    }
    res.send(`${addedCount23}`);
});

app.post('/getcollegedetailsbyid', async (req, res) => {
    let data = req.body;
    let rows = await db.query(`SELECT * FROM college WHERE id='${data.cid}'`)
    res.send(rows);
});

app.post('/getstudentlis', async (req, res) => {
    let data = req.body;

    if (data.did == 6) {
        let rows = await db.query(`SELECT * FROM student_details WHERE cid='${data.cid}' AND sem='${data.sen}' AND status=1 AND student_id='' AND did < '6' AND academic_year='${data.academicYear}'`)
        res.send(rows);
    } else {
        let rows = await db.query(`SELECT * FROM student_details WHERE cid='${data.cid}' AND sem='${data.sem}' AND status=1 AND student_id='' AND did='${data.did}' AND academic_year='${data.academicYear}'`)
        res.send(rows);
    }

});

app.post('/getfeedepartmentoption', async (req, res) => {
    let data = req.body;
    let query = ''
    if (data.role == 'Clerk') {
        query += `SELECT name,id FROM dept WHERE cid='${data.cid}' AND academic='1' AND id='${data.did}' ORDER BY name ASC`
    } else {
        query += `SELECT name,id FROM dept WHERE cid='${data.cid}' AND academic='1' ORDER BY name ASC`
    }
    let rows = await runQuery(query);
    let option = `<option value="">Select Department</option><option value="All">All</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    }
    res.send(option);
});

app.post('/getfeeyearoption', async (req, res) => {
    let data = req.body;
    let year = 0;

    if (data.cid == 1) {
        year = 4;
    } else if (data.cid == 3 || data.cid == 4 || data.cid == 5) {
        year = 3;
    } else if (data.cid == 6) {
        year = 5;
    } else if (data.cid == 8 || data.cid == 9 || data.cid == 34) {
        year = 2;
    }
    let option = `<option value="">Select Year</option><option value="All">All</option>`;
    for (let index = 1; index <= year; index++) {
        option += `<option value="${index}">${index}</option>`
    }
    res.send(option);
});

app.post('/getdepartmentfeereport', async (req, res) => {
    let data = req.body;
    let usn = '';
    let query = '';
    let body = '';
    let row = '';
    if (data.did != 'All') {
        row = await runQuery(`SELECT name,(SELECT iname FROM college WHERE id=d.cid) AS iname FROM dept d WHERE id='${data.did}'`);
    } else {
        row = await runQuery(`SELECT iname,("All") AS name FROM college WHERE id='${data.cid}'`);
    }
    let year = "All";
    if (data.year == 1) {
        year = `1st`

    } else if (data.year == 2) {
        year = `2nd`

    } else if (data.year == 3) {
        year = `3rd`

    } else if (data.year == 4) {
        year = `4th`

    } else if (data.year == 5) {
        year = `5th`

    }
    body += `<h3 align="center">${row[0].iname}</h3>
           <h4 class="card-title" align="center">Fee Details of ${year} Year ${row[0].name} Department For Academic Year ${data.academic_year}</h4>
           <table class="table table-bordered">
           <thead class="thead-dark">
           <tr>
               <th>sl no</th>
               <th>usn</th>
               <th>name</th>
               <th>category</th>
               <th>quota</th>
               <th>year</th>
               <th>fee fixed</th>
               <th>paid fee</th>
               <th>balance fee</th>
               <th>scholarship</th>
               <th>loan</th>
               <th>other</th>
               <th>percentage</th>
           </tr>
           </thead>
           <tbody>`;
    if (data.cid == 1) {
        if (data.did != 6) {
            if (data.did == 1) {
                usn = "CS";
            } else if (data.did == 2) {
                usn = "CV";
            } else if (data.did == 3) {
                usn = 'EE';
            } else if (data.did == 4) {
                usn = 'EC';
            } else if (data.did == 5) {
                usn = "ME";
            } else if (data.did == 7) {
                usn = "MBA";
            } else if (data.did == 19) { // pg department of CS Engg
                usn = "SCN";
            } else if (data.did == 84) { // pg department of E&C engg
                usn = "LDE";
            } else if (data.did == 20) { // pg department of mechanicl engg
                usn = "MMD";
            } else if (data.did == 21) { // pg department of civil engg
                usn = "CSE";
            }
        } else {
            usn = "";
        }
    }
    let feeHeads = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }

    if (data.did == "All" && data.year == "All") {
        query = `SELECT usn,year,(SELECT name FROM fee_quota WHERE id=f.quota) AS quota,(SELECT name FROM fee_categories WHERE id=f.cat) AS category,(SELECT ${feeHeads} FROM fee_details WHERE cid=f.cid AND id=f.id) AS fee_fixed,(SELECT sum(paid_amt) FROM fee_transactions WHERE cid=f.cid AND fee_id=f.id AND fee_type NOT IN('0','-1')) AS paid_fee,(SELECT name FROM student_info WHERE student_id=f.student_id) AS name ,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Scholarship') as Scholarship,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Loan') as Loan,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Other') as Other FROM fee_details f  WHERE cid='${data.cid}' AND acd_year='${data.academic_year}' AND fee_drpot='0' ORDER BY year,usn ASC`
    } else if (data.did == "All" && data.year != "") {
        query = `SELECT usn,year,(SELECT name FROM fee_quota WHERE id=f.quota) AS quota,(SELECT name FROM fee_categories WHERE id=f.cat) AS category,(SELECT ${feeHeads} FROM fee_details WHERE cid=f.cid AND id=f.id) AS fee_fixed,(SELECT sum(paid_amt) FROM fee_transactions WHERE cid=f.cid AND fee_id=f.id AND fee_type NOT IN('0','-1')) AS paid_fee,(SELECT name FROM student_info WHERE student_id=f.student_id) AS name ,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Scholarship') as Scholarship,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Loan') as Loan,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Other') as Other FROM fee_details f  WHERE cid='${data.cid}' AND year='${data.year}' AND acd_year='${data.academic_year}' AND fee_drpot='0' ORDER BY year,usn ASC`
    } else if (data.year == "All" && data.did != "") {
        query = `SELECT usn,year,(SELECT name FROM fee_quota WHERE id=f.quota) AS quota,(SELECT name FROM fee_categories WHERE id=f.cat) AS category,(SELECT ${feeHeads} FROM fee_details WHERE cid=f.cid AND id=f.id) AS fee_fixed,(SELECT sum(paid_amt) FROM fee_transactions WHERE cid=f.cid AND fee_id=f.id AND fee_type NOT IN('0','-1')) AS paid_fee,(SELECT name FROM student_info WHERE student_id=f.student_id) AS name ,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Scholarship') as Scholarship,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Loan') as Loan,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Other') as Other FROM fee_details f  WHERE cid='${data.cid}' AND did='${data.did}' AND acd_year='${data.academic_year}' AND fee_drpot='0' ORDER BY year,usn ASC`
    } else if (data.year != "" && data.did != "") {
        query = `SELECT usn,year,(SELECT name FROM fee_quota WHERE id=f.quota) AS quota,(SELECT name FROM fee_categories WHERE id=f.cat) AS category,(SELECT ${feeHeads} FROM fee_details WHERE cid=f.cid AND id=f.id) AS fee_fixed,(SELECT sum(paid_amt) FROM fee_transactions WHERE cid=f.cid AND fee_id=f.id AND fee_type NOT IN('0','-1')) AS paid_fee,(SELECT name FROM student_info WHERE student_id=f.student_id) AS name ,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Scholarship') as Scholarship,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Loan') as Loan,(SELECT amt FROM std_fund WHERE usn=f.usn AND type='Other') as Other FROM fee_details f  WHERE cid='${data.cid}' AND did='${data.did}' AND year='${data.year}' AND acd_year='${data.academic_year}' AND fee_drpot='0' ORDER BY year,usn ASC`
    }

    let feeDetails = await runQuery(query);
    let gfee_fixed = 0;
    let gpaid_fee = 0;
    let gScholarship = 0;
    let gLoan = 0;
    let gOther = 0;
    for (let i = 0; i < feeDetails.length; i++) {
        const element = feeDetails[i];
        let fee_fixed = element.fee_fixed;
        if (fee_fixed == null) {
            fee_fixed = 0;
        }
        gfee_fixed += fee_fixed;
        let paid_fee = element.paid_fee;
        if (paid_fee == null) {
            paid_fee = 0;
        }
        gpaid_fee += paid_fee;
        let Scholarship = element.Scholarship;
        if (Scholarship == null) {
            Scholarship = 0;
        }
        gScholarship += Scholarship;
        let Loan = element.Loan;
        if (Loan == null) {
            Loan = 0;
        }
        gLoan += Loan;
        let Other = element.Other;
        if (Other == null) {
            Other = 0;
        }
        gOther += Other;
        let balance = fee_fixed - paid_fee;
        let percentage = (paid_fee / fee_fixed) * 100;
        percentage = percentage.toString().substring(0, 4);
        body += `<tr>
            <td>${i + 1}</td>
            <td>${element.usn}</td>
            <td>${element.name}</td>
            <td>${element.category}</td>
            <td>${element.quota}</td>
            <td>${element.year}</td>
            <td>${numberWithCommas(fee_fixed)}</td>
            <td>${numberWithCommas(paid_fee)}</td>
            <td>${numberWithCommas(balance)}</td>
            <td>${numberWithCommas(Scholarship)}</td>
            <td>${numberWithCommas(Loan)}</td>
            <td>${numberWithCommas(Other)}</td>
            <td>${percentage}%</td>
        </tr>`;

    }
    let gpercentage = (gpaid_fee / gfee_fixed) * 100;
    gpercentage = gpercentage.toString().substring(0, 4);
    body += `
    <tr>
        <th colspan="6" class="text-center">Total</th>
        <th>${numberWithCommas(gfee_fixed)} <br> ${wordify(gfee_fixed)}</th>
        <th>${numberWithCommas(gpaid_fee)} <br> ${wordify(gpaid_fee)}</th>
        <th>${numberWithCommas(gfee_fixed - gpaid_fee)} <br> ${wordify(gfee_fixed - gpaid_fee)}</th>
        <th>${numberWithCommas(gScholarship)}</th>
        <th>${numberWithCommas(gLoan)}</th>
        <th>${numberWithCommas(gOther)}</th>
        <th>${gpercentage}%</th>
    </tr>
    </tbody>
    </table>`;
    res.send(body)
});

app.post('/getconsolidatedepartmentdetails', async (req, res) => {
    let data = req.body;
    let departments = await runQuery(`SELECT id,name,(SELECT iname FROM college WHERE id=d.cid) AS iname FROM dept d WHERE cid='${data.cid}' AND academic=1 ORDER BY id`);
    let feeHeads = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }

    let body = `<h3 align="center">${departments[0].iname}</h3>
    <h4 align="center">Fees Details For Academic Year ${data.academic_year}</h4>
    <table class="table table-bordered table-striped" border="1" style="width:100%;border-collapse:collapse;">
                    <thead class="thead-dark">
                        <tr>
                            <th>Sl No</th>
                            <th>Department</th>
                            <th>Fee Fixed</th>
                            <th>Fee Paid</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>`;
    let gfee_fixed = 0;
    let gpaid_fee = 0;
    for (let i = 0; i < departments.length; i++) {
        const element = departments[i];
        let departmentFeeDetails = await runQuery(`SELECT ${feeHeads} AS fee_fixed,
                        (SELECT SUM(paid_amt) FROM fee_transactions WHERE acd_year=f.acd_year AND did=f.did AND fee_type NOT IN('0','-1')) AS paid_amt
                        FROM fee_details  f WHERE acd_year='${data.academic_year}' AND did='${element.id}'`)
        let fee_fixed = departmentFeeDetails[0].fee_fixed;
        if (fee_fixed == null) {
            fee_fixed = 0;
        }
        gfee_fixed += fee_fixed;
        let paid_fee = departmentFeeDetails[0].paid_amt;
        if (paid_fee == null) {
            paid_fee = 0;
        }
        gpaid_fee += paid_fee;
        let balance = fee_fixed - paid_fee;
        body += `<tr>
                            <td>${i + 1}</td>
                            <td>${element.name}</td>
                            <td>${numberWithCommas(fee_fixed)}</td>
                            <td>${numberWithCommas(paid_fee)}</td>
                            <td>${numberWithCommas(balance)}</td>
                        </tr>`;
    }
    body += `<tr style="font-weight:bold;">
            <td colspan="2" style="text-align:center;">Total</td>
            <td>${numberWithCommas(gfee_fixed)} <br> ${wordify(gfee_fixed)}</td>
            <td>${numberWithCommas(gpaid_fee)} <br> ${wordify(gpaid_fee)}</td>
            <td>${numberWithCommas(gfee_fixed - gpaid_fee)} <br> ${wordify(gfee_fixed - gpaid_fee)}</td>
            </tr>
        </tbody>
        </table>`;

    res.send(body)

});

app.post('/departmentconsolidate', async (req, res) => {
    let data = req.body;
    let departments = await runQuery(`SELECT id,name,(SELECT iname FROM college WHERE id=d.cid) AS iname FROM dept d WHERE cid='${data.cid}' AND academic=1 ORDER BY id`);
    let feeHeads = '';
    let title = '';
    let fdate = formatDate('', data.fromDate);
    let tdate = formatDate('', data.toDate);
    let currentPaid = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }

    if (data.type == 'daily') {
        title = `Fee Collection on ${fdate}`;
    } else if (data.type == 'monthly') {
        let split = fdate.split('-');
        let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let i = parseInt(split[1].replace(/^0+/, '')) - 1;
        title = `Fee Collection of ${month[i]}-${split[2]}`;
    } else if (data.type == 'custom') {
        title = `Fee Collection From ${fdate} To ${tdate}`;
    }

    let body = `<h3 align="center">${departments[0].iname}</h3>
    <h4 align="center">${title}</h4>
    <table class="table table-bordered table-striped" border="1" style="width:100%;border-collapse:collapse;">
                    <thead class="thead-dark">
                        <tr>
                            <th>Sl No</th>
                            <th>Department</th>
                            <th>Fee Fixed</th>
                            <th>Current Fee Paid</th>
                            <th>Previous Fee Paid</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>`;
    let gfee_fixed = 0;
    let gpaid_fee = 0;
    let gcurrent_fee = 0;
    for (let i = 0; i < departments.length; i++) {
        const element = departments[i];
        let departmentFeeDetails = await runQuery(`SELECT ${feeHeads} AS fee_fixed,
                        (SELECT SUM(paid_amt) FROM fee_transactions WHERE acd_year=f.acd_year AND did=f.did AND fee_type NOT IN('0','-1')) AS paid_amt
                        FROM fee_details  f WHERE acd_year='${data.academic_year}' AND did='${element.id}'`);

        if (data.type == 'daily') {
            currentPaid = await runQuery(`SELECT SUM(paid_amt) AS feePaid  FROM fee_transactions WHERE cid='${data.cid}' AND did='${element.id}' AND acd_year='${data.academic_year}' AND fee_type NOT IN('0','-1') AND paid_date='${data.fromDate}'`);
        } else if (data.type == 'monthly') {
            currentPaid = await runQuery(`SELECT SUM(paid_amt) AS feePaid  FROM fee_transactions WHERE cid='${data.cid}' AND did='${element.id}' AND acd_year='${data.academic_year}' AND fee_type NOT IN('0','-1') AND MONTH(paid_date)=MONTH('${data.fromDate}') AND YEAR(paid_date)=YEAR('${data.fromDate}')`);
        } else if (data.type == 'custom') {
            currentPaid = await runQuery(`SELECT SUM(paid_amt) AS feePaid  FROM fee_transactions WHERE cid='${data.cid}' AND did='${element.id}' AND acd_year='${data.academic_year}' AND fee_type NOT IN('0','-1') AND paid_date BETWEEN '${data.fromDate}' AND '${data.toDate}'`);
        }

        let fee_fixed = departmentFeeDetails[0].fee_fixed;
        if (fee_fixed == null) {
            fee_fixed = 0;
        }
        gfee_fixed += fee_fixed;
        let paid_fee = departmentFeeDetails[0].paid_amt;
        if (paid_fee == null) {
            paid_fee = 0;
        }
        gpaid_fee += paid_fee;
        let currentPaid1 = currentPaid[0].feePaid;
        if (currentPaid1 == null) {
            currentPaid1 = 0;
        }
        gcurrent_fee += currentPaid1;
        let balance = fee_fixed - currentPaid1 - paid_fee;
        body += `<tr>
                            <td>${i + 1}</td>
                            <td>${element.name}</td>
                            <td>${numberWithCommas(fee_fixed)}</td>
                            <td>${numberWithCommas(currentPaid1)}</td>
                            <td>${numberWithCommas(paid_fee)}</td>
                            <td>${numberWithCommas(balance)}</td>
                        </tr>`;
    }
    let gbalanace = gfee_fixed - gcurrent_fee - gpaid_fee;
    body += `<tr style="font-weight:bold;">
            <td colspan="2" style="text-align:center;">Total</td>
            <td>${numberWithCommas(gfee_fixed)} <br> ${wordify(gfee_fixed)}</td>
            <td>${numberWithCommas(gcurrent_fee)} <br> ${wordify(gcurrent_fee)}</td>
            <td>${numberWithCommas(gpaid_fee)} <br> ${wordify(gpaid_fee)}</td>
            <td>${numberWithCommas(gbalanace)} <br> ${wordify(gbalanace)}</td>
            </tr>
        </tbody>
        </table>`;

    res.send(body)

});

app.post('/feecollectiondetails', async (req, res) => {
    let data = req.body;
    let body = ``;
    let title = ``;
    let query = ``;
    let colspan = ``;
    let fdate = formatDate('', data.fromDate);
    let tdate = formatDate('', data.toDate);
    if (data.did == "All") {
        if (data.type == 'daily') {
            title = `Fee Collection on ${fdate} of academic year ${data.academic_year}`;
            query = `SELECT DISTINCT trans_id FROM fee_transactions WHERE cid='${data.cid}' AND fee_type NOT IN('0','-1')  AND paid_date='${data.fromDate}' AND acd_year='${data.academic_year}'`;
            colspan = 5;
        } else if (data.type == 'monthly') {
            let split = fdate.split('-');
            let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let i = parseInt(split[1].replace(/^0+/, '')) - 1;
            title = `Fee Collection of ${month[i]}-${split[2]} of academic year ${data.academic_year}`;
            colspan = 5;
            query = `SELECT DISTINCT trans_id FROM fee_transactions WHERE cid='${data.cid}' AND fee_type NOT IN('0','-1')  AND MONTH(paid_date)=MONTH('${data.fromDate}') AND YEAR(paid_date)=YEAR('${data.fromDate}') AND acd_year='${data.academic_year}'`;
        } else if (data.type == 'custom') {
            title = `Fee Collection From ${fdate} To ${tdate} of academic year ${data.academic_year}`;
            query = `SELECT DISTINCT trans_id FROM fee_transactions WHERE cid='${data.cid}' AND fee_type NOT IN('0','-1')  AND paid_date BETWEEN '${data.fromDate}' AND '${data.toDate}' AND acd_year='${data.academic_year}'`;
            colspan = 6;
        }
    } else {
        if (data.type == 'daily') {
            title = `Fee Collection on ${fdate} of academic year ${data.academic_year}`;
            query = `SELECT DISTINCT trans_id FROM fee_transactions WHERE cid='${data.cid}' AND  did='${data.did}' AND fee_type NOT IN('0','-1')  AND paid_date='${data.fromDate}' AND acd_year='${data.academic_year}'`;
            colspan = 5;
        } else if (data.type == 'monthly') {
            let split = fdate.split('-');
            let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let i = parseInt(split[1].replace(/^0+/, '')) - 1;
            title = `Fee Collection of ${month[i]}-${split[2]} of academic year ${data.academic_year}`;
            colspan = 5;
            query = `SELECT DISTINCT trans_id FROM fee_transactions WHERE cid='${data.cid}' AND  did='${data.did}' AND fee_type NOT IN('0','-1')  AND MONTH(paid_date)=MONTH('${data.fromDate}') AND YEAR(paid_date)=YEAR('${data.fromDate}') AND acd_year='${data.academic_year}'`;
        } else if (data.type == 'custom') {
            title = `Fee Collection From ${fdate} To ${tdate} of academic year ${data.academic_year}`;
            query = `SELECT DISTINCT trans_id FROM fee_transactions WHERE cid='${data.cid}' AND  did='${data.did}' AND fee_type NOT IN('0','-1')  AND paid_date BETWEEN '${data.fromDate}' AND '${data.toDate}' AND acd_year='${data.academic_year}'`;
            colspan = 6;
        }
    }
    let collegeDetails = await runQuery(`SELECT iname FROM college WHERE id='${data.cid}'`);
    let transactionList = await runQuery(query);
    body += `<h1 align="center" class="text-uppercase">${collegeDetails[0].iname}</h1>
    <h2 align="center" class="text-uppercase">${title}</h2>
    <table class="table table-bordered">
    <thead class="thead-dark">
    <tr>
        <th>sl no</th>
        <th>usn</th>
        <th>name</th>
        <th>department</th>`;
    if (data.type == 'custom') {
        body += `<th>date</th>`;
    }
    body += `<th>scroll</th>
        <th>paid amount</th>
    </tr>
    </thead>
    <tbody>`;
    let gtotal = 0;
    for (let i = 0; i < transactionList.length; i++) {
        const element = transactionList[i];
        let transctionDetails = await runQuery(`SELECT (SELECT name FROM student_info WHERE student_id=f.student_id) AS name,(SELECT name FROM dept WHERE id=f.did) as dept,SUM(paid_amt) AS paid_amt,usn,scr_no,did,paid_date FROM fee_transactions f WHERE trans_id='${element.trans_id}'`);
        body += `<tr>
            <td>${i + 1}</td>
            <td>${transctionDetails[0].usn}</td>
            <td>${transctionDetails[0].name}</td>
            <td>${transctionDetails[0].dept}</td>`;
        if (data.type == 'custom') {
            body += `<td>${formatDate("", transctionDetails[0].paid_date)}</td>`;
        }
        body += `<td>${transctionDetails[0].scr_no}</td>
            <td>${numberWithCommas(transctionDetails[0].paid_amt)}</td>
        </tr>`;
        gtotal += transctionDetails[0].paid_amt;
    }
    body += `<tr class="font-weight-bold">
    <td class="text-center" colspan="${colspan}" >Total</td>
    <td class="text-center" >${numberWithCommas(gtotal)}</td>
    </tr> 
    </tbody>
    </table>`;
    res.send(body);
});

app.post('/getpayfeedetails', async (req, res) => {
    let data = req.body;
    let feeHeads = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }

    let feeDetails = await runQuery(`SELECT ${feeHeads} AS fee_fixed,paid_fee,year,usn,student_id,id,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_details f WHERE student_id=(SELECT student_id FROM student_info WHERE cid='${data.cid}' AND usn='${data.usn}' LIMIT 1) AND verify='1' AND fee_drpot='0' GROUP BY year`);
    res.send(feeDetails);
});

app.post('/payfees', async (req, res) => {
    let data = req.body;
    let feeHeads = ``;

    let getStudentFeeDetails = async (id) => {
        let feeDetails = await runQuery(`SELECT id,student_id,usn,cid,did,year,acd_year,uni_fee,tut_fee,bal FROM fee_details WHERE id='${id}' ORDER BY id DESC`);
        return feeDetails[0];
    };

    let student_feeDetails = await getStudentFeeDetails(data.feeId);
    let universityFeePaid = await getHeadWisePaidAmount(student_feeDetails.cid, student_feeDetails.id, student_feeDetails.cid == 1 ? 1 : 7);
    let universityFeeBalance = parseFloat(student_feeDetails['uni_fee'] - universityFeePaid);
    let tuitionFeePaid = await getHeadWisePaidAmount(student_feeDetails.cid, student_feeDetails.id, student_feeDetails.cid == 1 ? 3 : 8);
    let tuitionFeeBalance = parseFloat(student_feeDetails['tut_fee'] - tuitionFeePaid);
    let remainingPaidAmount = 0;
    let paidAmount = parseFloat(data.paidAmt);


    if (student_feeDetails.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }

    // let check = await promisePool.query(`SELECT id FROM fee_transactions WHERE fee_id='${student_feeDetails['id']}' AND acd_year='${student_feeDetails['acd_year']}' AND delete_sts=1`);

    // if (check[0].length > 0) {
    let query = `INSERT INTO fee_transactions(trans_id, fee_id, student_id, usn, cid, did, year,acd_year,scr_no, paid_date,uid,fee_type,paid_amt,bal)VALUES ('${await getTransactionId(student_feeDetails.cid, student_feeDetails.did)}','${student_feeDetails.id}','${student_feeDetails.student_id}','${student_feeDetails.usn}','${student_feeDetails.cid}','${student_feeDetails.did}','${student_feeDetails.year}','${student_feeDetails.acd_year}','${data.scrollNo}','${formatDate('db', data.pdate)}','${data.id}'`;
    let query2 = ``;

    if (universityFeeBalance > 0) {
        query2 += `,'1'`;
        if (paidAmount > universityFeeBalance) {
            let details = await getStudentFeeDetails(data.feeId);
            let bal = details.bal - universityFeeBalance;
            query2 += `,'${universityFeeBalance}',${bal})`;
            remainingPaidAmount = paidAmount - universityFeeBalance;
            let isInsert = await runQuery(`${query + query2}`);
            if (isInsert.insertId > 0) {
                let feeDetails = await runQuery(`SELECT sum(paid_amt) AS paidAmount,(SELECT ${feeHeads} FROM fee_details WHERE id='${student_feeDetails.id}') AS fee_fixed FROM fee_transactions WHERE cid='${student_feeDetails.cid}' AND fee_id='${student_feeDetails.id}' AND fee_type NOT IN(0,-1)`);
                if (feeDetails[0].paidAmount == null) {
                    feeDetails[0].paidAmount = 0;
                }
                let balance = feeDetails[0].fee_fixed - feeDetails[0].paidAmount;

                let uquery = ``;

                if (balance == 0) {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}',fee_clear=1 WHERE id='${student_feeDetails.id}'`;
                } else {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}' WHERE id='${student_feeDetails.id}'`;
                }

                let update = await runQuery(uquery);
                if (update.affectedRows) {
                    // res.send(["Record Added","success"]);
                    if (remainingPaidAmount > 0) {
                        if (tuitionFeeBalance > 0) {
                            query2 = ``;
                            query2 += `,'3'`;
                            if (remainingPaidAmount > tuitionFeeBalance) {
                                let details = await getStudentFeeDetails(data.feeId);
                                let bal = details.bal - tuitionFeeBalance;
                                query2 += `,'${tuitionFeeBalance}',${bal})`;
                                let isInsert = await runQuery(`${query + query2}`);
                                if (isInsert.insertId > 0) {
                                    let feeDetails = await runQuery(`SELECT sum(paid_amt) AS paidAmount,(SELECT ${feeHeads} FROM fee_details WHERE id='${student_feeDetails.id}') AS fee_fixed FROM fee_transactions WHERE cid='${student_feeDetails.cid}' AND fee_id='${student_feeDetails.id}' AND fee_type NOT IN(0,-1)`);
                                    if (feeDetails[0].paidAmount == null) {
                                        feeDetails[0].paidAmount = 0;
                                    }
                                    let balance = feeDetails[0].fee_fixed - feeDetails[0].paidAmount;

                                    let uquery = ``;

                                    if (balance == 0) {
                                        uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}',fee_clear=1 WHERE id='${student_feeDetails.id}'`;
                                    } else {
                                        uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}' WHERE id='${student_feeDetails.id}'`;
                                    }

                                    let update = await runQuery(uquery);
                                    if (update.affectedRows) {
                                        res.send(["Record Added", "success"]);
                                    } else {
                                        res.send(["Record Added But Balance Fee and Paid Fee Not Updated", "warning"]);
                                    }
                                } else {
                                    res.send("Record Not Added", "", "error");
                                }
                            } else {
                                let details = await getStudentFeeDetails(data.feeId);
                                let bal = details.bal - remainingPaidAmount;
                                query2 += `,'${remainingPaidAmount}',${bal})`;

                                let isInsert = await runQuery(`${query + query2}`);
                                if (isInsert.insertId > 0) {
                                    let feeDetails = await runQuery(`SELECT sum(paid_amt) AS paidAmount,(SELECT ${feeHeads} FROM fee_details WHERE id='${student_feeDetails.id}') AS fee_fixed FROM fee_transactions WHERE cid='${student_feeDetails.cid}' AND fee_id='${student_feeDetails.id}' AND fee_type NOT IN(0,-1)`);
                                    if (feeDetails[0].paidAmount == null) {
                                        feeDetails[0].paidAmount = 0;
                                    }
                                    let balance = feeDetails[0].fee_fixed - feeDetails[0].paidAmount;

                                    let uquery = ``;

                                    if (balance == 0) {
                                        uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}',fee_clear=1 WHERE id='${student_feeDetails.id}'`;
                                    } else {
                                        uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}' WHERE id='${student_feeDetails.id}'`;
                                    }

                                    let update = await runQuery(uquery);
                                    if (update.affectedRows) {
                                        res.send(["Record Added", "success"]);
                                    } else {
                                        res.send(["Record Added But Balance Fee and Paid Fee Not Updated", "warning"]);
                                    }
                                } else {
                                    res.send("Record Not Added", "", "error");
                                }
                            }
                        }
                    }
                } else {
                    res.send(["Record Added But Balance Fee and Paid Fee Not Updated", "warning"]);
                }
            } else {
                res.send("Record Not Added", "", "error");
            }

        } else {
            let details = await getStudentFeeDetails(data.feeId);
            let bal = details.bal - paidAmount;
            query2 += `,'${paidAmount}',${bal})`;

            let isInsert = await runQuery(`${query + query2}`);
            if (isInsert.insertId > 0) {
                let feeDetails = await runQuery(`SELECT sum(paid_amt) AS paidAmount,(SELECT ${feeHeads} FROM fee_details WHERE id='${student_feeDetails.id}') AS fee_fixed FROM fee_transactions WHERE cid='${student_feeDetails.cid}' AND fee_id='${student_feeDetails.id}' AND fee_type NOT IN(0,-1)`);
                if (feeDetails[0].paidAmount == null) {
                    feeDetails[0].paidAmount = 0;
                }
                let balance = feeDetails[0].fee_fixed - feeDetails[0].paidAmount;

                let uquery = ``;

                if (balance == 0) {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}',fee_clear=1 WHERE id='${student_feeDetails.id}'`;
                } else {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}' WHERE id='${student_feeDetails.id}'`;
                }

                let update = await runQuery(uquery);
                if (update.affectedRows) {
                    res.send(["Record Added", "success"]);
                } else {
                    res.send(["Record Added But Balance Fee and Paid Fee Not Updated", "warning"]);
                }
            } else {
                res.send("Record Not Added", "", "error");
            }

        }
    } else if (tuitionFeeBalance > 0) {
        query2 += `,'3'`;
        if (paidAmount > tuitionFeeBalance) {
            let details = await getStudentFeeDetails(data.feeId);
            let bal = details.bal - tuitionFeeBalance;
            query2 += `,'${tuitionFeeBalance}',${bal})`;
            remainingPaidAmount = paidAmount - universityFeeBalance;
            let isInsert = await runQuery(`${query + query2}`);
            if (isInsert.insertId > 0) {
                let feeDetails = await runQuery(`SELECT sum(paid_amt) AS paidAmount,(SELECT ${feeHeads} FROM fee_details WHERE id='${student_feeDetails.id}') AS fee_fixed FROM fee_transactions WHERE cid='${student_feeDetails.cid}' AND fee_id='${student_feeDetails.id}' AND fee_type NOT IN(0,-1)`);
                if (feeDetails[0].paidAmount == null) {
                    feeDetails[0].paidAmount = 0;
                }
                let balance = feeDetails[0].fee_fixed - feeDetails[0].paidAmount;

                let uquery = ``;

                if (balance == 0) {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}',fee_clear=1 WHERE id='${student_feeDetails.id}'`;
                } else {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}' WHERE id='${student_feeDetails.id}'`;
                }

                let update = await runQuery(uquery);
                if (update.affectedRows) {
                    res.send(["Record Added", "success"]);
                } else {
                    res.send(["Record Added But Balance Fee and Paid Fee Not Updated", "warning"]);
                }
            } else {
                res.send("Record Not Added", "", "error");
            }
        } else {
            let details = await getStudentFeeDetails(data.feeId);
            let bal = details.bal - paidAmount;
            query2 += `,'${paidAmount}',${bal})`;

            let isInsert = await runQuery(`${query + query2}`);
            if (isInsert.insertId > 0) {
                let feeDetails = await runQuery(`SELECT sum(paid_amt) AS paidAmount,(SELECT ${feeHeads} FROM fee_details WHERE id='${student_feeDetails.id}') AS fee_fixed FROM fee_transactions WHERE cid='${student_feeDetails.cid}' AND fee_id='${student_feeDetails.id}' AND fee_type NOT IN(0,-1)`);
                if (feeDetails[0].paidAmount == null) {
                    feeDetails[0].paidAmount = 0;
                }
                let balance = feeDetails[0].fee_fixed - feeDetails[0].paidAmount;

                let uquery = ``;

                if (balance == 0) {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}',fee_clear=1 WHERE id='${student_feeDetails.id}'`;
                } else {
                    uquery = `UPDATE fee_details SET paid_fee='${feeDetails[0].paidAmount}',bal='${balance}' WHERE id='${student_feeDetails.id}'`;
                }

                let update = await runQuery(uquery);
                if (update.affectedRows) {
                    res.send(["Record Added", "success"]);
                } else {
                    res.send(["Record Added But Balance Fee and Paid Fee Not Updated", "warning"]);
                }
            } else {
                res.send("Record Not Added", "", "error");
            }

        }
    }
    // } else {
    //     res.send([`Please Clear The Delete Transcation`, "warning"]);
    // }

});

app.post('/getfeetransactions', async (req, res) => {
    let data = req.body;
    let feeDetails = await runQuery(`SELECT student_id,trans_id,usn,paid_date,paid_amt,bal,scr_no,year,(SELECT name FROM fee_type WHERE id=f.fee_type) AS fee_type,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE fee_id='${data.feeId}'  AND fee_type NOT IN('0','-1') `);
    res.send(feeDetails);
});

app.post('/getconsolidatefeesdetails', async (req, res) => {
    let data = req.body;
    const printTransactionYearWise = (transaction) => {
        let totalPaidAmt = 0;
        let bal = 0;
        let table = `
        <table style="border-collapse:collapse;width:100%;" border="1" class="mt-4 table table-bordered table-striped">
    <thead class="thead-dark">
        <tr>
            <th>Sl No</th>
            <th>USN</th>
			<th>Transaction id</th>
            <th>Fee Type</th>
            <th>Paid Date</th>
            <th>Scroll No</th>
            <th>Paid Amount</th>
            <th>Balance</th>
        </tr>
    </thead>
    <tbody>`;
        if (transaction.length == 0) {
            table += `<tr><td style="text-align:center" colspan="9">No Data Found</td></tr>`
        } else {

            for (let j = 0; j < transaction.length; j++) {
                const element = transaction[j];
                totalPaidAmt += parseFloat(element.paid_amt);
                bal = element.bal;
                table += `
            <tr>
                <td>${j + 1}</td>
                <td>${element.usn}</td>
                <td>${element.trans_id}</td>
                <td>${element.fee_type}</td>
                <td>${formatDate("", element.paid_date)}</td>
                <td>${element.scr_no}</td>
                <td>${numberWithCommas(element.paid_amt)}</td>
                <td>${numberWithCommas(element.bal)}</td>
            </tr>
            `;
            }
        }

        table += `
    <tr>
        <td colspan="6" class="text-center">Total</td>
        <td>${numberWithCommas(totalPaidAmt)}</td>
        <td>${numberWithCommas(bal)}</td>
    </tr>
    </tbody>
    </table>`;
        return table;
    }

    let studentDetails = await runQuery(`SELECT student_id,usn,name,(SELECT iname FROM college WHERE id=s.cid) AS iname,(SELECT type FROM student_details WHERE student_id=s.student_id) AS type,(SELECT academic_year FROM student_details WHERE student_id=s.student_id) AS ad_year FROM student_info s WHERE cid='${data.cid}' AND (usn='${data.usn}' OR student_id='${data.usn}')`);
    let feeDetails = await runQuery(`SELECT * FROM fee_details f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1)`);
    let year1Transaction = await runQuery(`SELECT student_id,trans_id,usn,paid_date,paid_amt,bal,scr_no,year,(SELECT name FROM fee_type WHERE id=f.fee_type) AS fee_type FROM fee_transactions f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND year=1  AND fee_type NOT IN('0','-1') `);
    let year2Transaction = await runQuery(`SELECT student_id,trans_id,usn,paid_date,paid_amt,bal,scr_no,year,(SELECT name FROM fee_type WHERE id=f.fee_type) AS fee_type FROM fee_transactions f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND year=2  AND fee_type NOT IN('0','-1') `);
    let year3Transaction = await runQuery(`SELECT student_id,trans_id,usn,paid_date,paid_amt,bal,scr_no,year,(SELECT name FROM fee_type WHERE id=f.fee_type) AS fee_type FROM fee_transactions f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND year=3  AND fee_type NOT IN('0','-1') `);
    let year4Transaction = await runQuery(`SELECT student_id,trans_id,usn,paid_date,paid_amt,bal,scr_no,year,(SELECT name FROM fee_type WHERE id=f.fee_type) AS fee_type FROM fee_transactions f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND year=4  AND fee_type NOT IN('0','-1') `);
    let year5Transaction = await runQuery(`SELECT student_id,trans_id,usn,paid_date,paid_amt,bal,scr_no,year,(SELECT name FROM fee_type WHERE id=f.fee_type) AS fee_type FROM fee_transactions f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND year=3  AND fee_type NOT IN('0','-1') `);

    let body = `<div class="card font-weight-bold text-uppercase">
    <div class="card-body">
    <h2 style="text-align: center;" class="mb-3">${studentDetails[0].iname}</h2>
    <div class="row">
            <div class="col-sm-3 font-weight-bold">Name: ${studentDetails[0].name}</div>
            <div class="col-sm-2 font-weight-bold">USN: ${studentDetails[0].usn}</div>
            <div class="col-sm-3 font-weight-bold">Student Id: ${studentDetails[0].student_id}</div>
            <div class="col-sm-2 font-weight-bold">Admission Year: ${studentDetails[0].ad_year} </div>
            <div class="col-sm-2 font-weight-bold">Student Type: ${studentDetails[0].type}</div>

            <h4 class="mt-3" style="text-align:center;">Fee Fixation From 1<sup>st</sup> to ${data.cid == 1 ? '4<sup>th</sup>' : '5<sup>th</sup>'} Year</h4>
            <table class="table table-bordered table-striped" style="border-collapse:collapse;width:100%;" border="1">
                <thead class="thead-dark">
                    <tr>
                        <th rowspan="2">Year</th>
                        <th rowspan="2">Academic Year</th>
                        <th style="text-align: center;" colspan="5">Fee Fixed</th>
                        <th style="text-align: center;" colspan="5">Paid Fee</th>
                        <th style="text-align: center;" colspan="5">Balance</th>
                    </tr>
                    <tr>
                        <th>University</th>
                        <th>Tuition</th>
                        ${data.cid == 1 ? '<th>Institute</th>' : '<th>Nasa</th>'}
                        ${data.cid == 1 ? '<th>Old Balance</th>' : '<th>Library</th>'}
                        <th>Total</th>
                        
                        <th>University</th>
                        <th>Tuition</th>
                        ${data.cid == 1 ? '<th>Institute</th>' : '<th>Nasa</th>'}
                        ${data.cid == 1 ? '<th>Old Balance</th>' : '<th>Library</th>'}
                        <th>Total</th>
                        
                        <th>University</th>
                        <th>Tuition</th>
                        ${data.cid == 1 ? '<th>Institute</th>' : '<th>Nasa</th>'}
                        ${data.cid == 1 ? '<th>Old Balance</th>' : '<th>Library</th>'}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>`;
    let gFeeFixed = 0;
    let gFeePaid = 0;
    let gBalance = 0;
    for (let i = 0; i < feeDetails.length; i++) {
        const element = feeDetails[i];
        let universityFeePaid = 0;
        let instituteFeePaid = 0;
        let tuitionFeePaid = 0;
        let oldBalanceFeePaid = 0;
        let totalFeeFixed = 0;
        let totalFeePaid = 0;
        let nasaFeePaid = 0;
        let libryFeePaid = 0;

        let balance = 0;
        if (element.cid == 1) {
            universityFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 1);
            instituteFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 2);
            tuitionFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 3);
            oldBalanceFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 6);
            totalFeeFixed = element.uni_fee + element.inst_fee + element.tut_fee + element.old_bal;
            gFeeFixed += totalFeeFixed
            totalFeePaid = universityFeePaid + instituteFeePaid + tuitionFeePaid + oldBalanceFeePaid;
            gFeePaid += totalFeePaid
            balance = totalFeeFixed - totalFeePaid;
            gBalance += balance
        } else if (element.cid == 6) {
            universityFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 7);
            tuitionFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 8);
            nasaFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 9);
            libryFeePaid = await getHeadWisePaidAmount(element.cid, element.id, 10);
            totalFeeFixed = element.uni_fee + element.nasa_fee + element.tut_fee + element.libry_fee;
            gFeeFixed += totalFeeFixed
            totalFeePaid = universityFeePaid + nasaFeePaid + tuitionFeePaid + libryFeePaid;
            gFeePaid += totalFeePaid
            balance = totalFeeFixed - totalFeePaid;
            gBalance += balance
        }
        body += `<tr>
                        <td>${element.year}</td>
                        <td>${element.acd_year}</td>
                        <td>${numberWithCommas(element.uni_fee)}</td>
                        <td>${numberWithCommas(element.tut_fee)}</td>
                        <td>${element.cid == 1 ? numberWithCommas(element.inst_fee) : numberWithCommas(element.nasa_fee)}</td>
                        <td>${element.cid == 1 ? numberWithCommas(element.old_bal) : numberWithCommas(element.libry_fee)}</td>
                        <td>${numberWithCommas(totalFeeFixed)}</td>
                        <td>${numberWithCommas(universityFeePaid)}</td>
                        <td>${numberWithCommas(tuitionFeePaid)}</td>
                        <td>${element.cid == 1 ? numberWithCommas(instituteFeePaid) : numberWithCommas(nasaFeePaid)}</td>
                        <td>${element.cid == 1 ? numberWithCommas(oldBalanceFeePaid) : numberWithCommas(libryFeePaid)}</td>
                        <td>${numberWithCommas(totalFeePaid)}</td>
                        <td>${numberWithCommas(element.uni_fee - universityFeePaid)}</td>
                        <td>${numberWithCommas(element.tut_fee - tuitionFeePaid)}</td>
                        <td>${element.cid == 1 ? numberWithCommas(element.inst_fee - instituteFeePaid) : numberWithCommas(element.nasa_fee - nasaFeePaid)}</td>
                        <td>${element.cid == 1 ? numberWithCommas(element.old_bal - oldBalanceFeePaid) : numberWithCommas(element.libry_fee - libryFeePaid)}</td>
                        <td>${numberWithCommas(balance)}</td>
                    </tr>
                    `;
    }
    body += `
    <tr>
        <td colspan='6' class='text-center'>Grand Total Fee Fixed</td>
        <td>${numberWithCommas(gFeeFixed)}</td>
        <td colspan='4' class='text-center'>Grand Total Paid</td>
        <td>${numberWithCommas(gFeePaid)}</td>
        <td colspan='4' class='text-center'>Grand Total Balance</td>
        <td>${numberWithCommas(gBalance)}</td>
    </tr>
    </tbody>
    </table>
    <h4 style="text-align:center;">1st Year Fee Transactions</h4>
    ${printTransactionYearWise(year1Transaction)}
    <h4 style="text-align:center;">2nd Year Fee Transactions</h4>
    ${printTransactionYearWise(year2Transaction)}
    <h4 style="text-align:center;">3rd Year Fee Transactions</h4>
    ${printTransactionYearWise(year3Transaction)}
    <h4 style="text-align:center;">4th Year Fee Transactions</h4>
    ${printTransactionYearWise(year4Transaction)}
    </div>
    </div>
    </div>`;
    res.send(body);
});

app.post('/getfeetranscationsfordelete', async (req, res) => {
    let data = req.body;
    let transactions = await runQuery(`SELECT DISTINCT(trans_id),SUM(paid_amt) AS pait_amt,bal,paid_date,scr_no,id,usn,student_id,delete_sts,(SELECT name FROM student_info WHERE student_id=f.student_id limit 1) AS name FROM fee_transactions f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND acd_year='${data.academicYear}' AND fee_type NOT IN('0','-1') GROUP BY trans_id`);
    res.send(transactions);
});

app.post('/deletestudenttranscationstatus', async (req, res) => {
    let data = req.body;
    let transactions = await runQuery(`SELECT (SELECT name FROM student_info WHERE student_id=f.student_id) AS name,SUM(paid_amt) AS paid_amt,usn,trans_id,paid_date,scr_no,admin1,admin2 FROM fee_transactions f WHERE cid='${data.cid}' AND delete_sts=1 GROUP BY trans_id;`);
    let table = `<table class="table table-bordered">
    <thead class="thead-dark">
    <tr>
        <th>sl no</th>
        <th>usn</th>
        <th>name</th>
        <th>transaction id</th>
        <th>paid date</th>
        <th>scroll no</th>
        <th>paid amount</th>`;
    if (data.cid == 1) {
        table += `<th>Registrar</th>
            <th>VP Admin</th>`;
    } else {
        table += `<th>HOD</th>`;
    }
    table += `</tr>
    </thead>
    <tbody>`;
    for (let i = 0; i < transactions.length; i++) {
        const element = transactions[i];
        let admin1Status = ``;
        let admin2Status = ``;

        if (element.admin1 == '') {
            admin1Status = `<span class='text-warning font-weight-bold'>Pending</span>`;
        } else if (element.admin1.toString().toLowerCase() != 'rejected') {
            admin1Status = `<span class='text-success font-weight-bold'>Approved</span>`;
        } else {
            admin1Status = `<span class='text-danger font-weight-bold'>Rejected</span>`;
        }

        if (element.admin2 == '') {
            admin2Status = `<span class='text-warning font-weight-bold'>Pending</span>`;
        } else if (element.admin2.toString().toLowerCase() != 'rejected') {
            admin2Status = `<span class='text-success font-weight-bold'>Approved</span>`;
        } else {
            admin2Status = `<span class='text-danger font-weight-bold'>Rejected</span>`;
        }
        table += `<tr>
            <td>${i + 1}</td>
            <td>${element.usn}</td>
            <td>${element.name}</td>
            <td>${element.trans_id}</td>
            <td>${formatDate('db', element.paid_date)}</td>
            <td>${element.scr_no}</td>
            <td>${numberWithCommas(element.paid_amt)}</td>`
        if (data.cid == 1) {
            table += `<td>${admin1Status}</td>
                <td>${admin2Status}</td>`;
        } else {
            table += `<td>${admin1Status}</td>`;
        }
        table += `</tr>`;

    }
    table += `</tbody>
    </table>`;
    res.send(table);
});

app.post('/adddeletetranscation', async (req, res) => {
    let data = req.body;
    let transactions = await runQuery(`SELECT trans_id FROM fee_transactions f WHERE id='${data.id}'`);
    let update = await runQuery(`UPDATE fee_transactions SET delete_sts=1  WHERE trans_id='${transactions[0].trans_id}'`);
    if (update.affectedRows > 0) {
        res.send(["Record Submitted For Approval", "success"]);
    } else {
        res.send(["Record Not Submitted", "error"]);
    }
});

app.post('/approvedeletetransaction', async (req, res) => {
    let data = req.body;
    let approvalDetails = await runQuery(`SELECT admin,(SELECT name FROM admin WHERE id=f.fid) AS name FROM fee_approvals f WHERE cid='${data.cid}' AND fid='${data.fid}' AND type='editTransction'`);

    let query = '';
    if (data.cid == 1) {
        if (approvalDetails[0].admin == 1) {
            query = `SELECT DISTINCT(trans_id),SUM(paid_amt) AS pait_amt,bal,paid_date,scr_no,id,usn,student_id,delete_sts,id,(SELECT name FROM student_info WHERE student_id=f.student_id limit 1) AS name,admin1,admin2 FROM fee_transactions f WHERE delete_sts=1 AND fee_type NOT IN('0','-1') AND admin1='' AND admin1!='rejected' GROUP BY trans_id`;
        } else if (approvalDetails[0].admin == 2) {
            query = `SELECT DISTINCT(trans_id),SUM(paid_amt) AS pait_amt,bal,paid_date,scr_no,id,usn,student_id,delete_sts,id,(SELECT name FROM student_info WHERE student_id=f.student_id limit 1) AS name,admin1,admin2 FROM fee_transactions f WHERE delete_sts=1 AND fee_type NOT IN('0','-1') AND admin1!='' AND admin1!='rejected' AND admin2='' AND admin2!='rejected' GROUP BY trans_id`;
        }
    } else if (data.cid == 6) {
        query = `SELECT DISTINCT(trans_id),SUM(paid_amt) AS pait_amt,bal,paid_date,scr_no,id,usn,student_id,delete_sts,id,(SELECT name FROM student_info WHERE student_id=f.student_id limit 1) AS name,admin1,admin2 FROM fee_transactions f WHERE delete_sts=1 AND fee_type NOT IN('0','-1') AND admin1='' AND admin1!='rejected' GROUP BY trans_id`;
    }
    let transactions = await runQuery(query);
    res.send([transactions, approvalDetails[0]]);
});

app.post('/deletetranscationupdate', async (req, res) => {
    let data = req.body;
    let query = '';
    let feeFixed = 0;
    if (data.cid == 1) {
        if (data.admin == 1) {
            query = `UPDATE fee_transactions SET admin1='${data.sign}' WHERE trans_id='${data.trans_id}'`
            let transactions = await runQuery(query);
            if (transactions.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    res.send(["Approved", "success"]);
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        } else if (data.admin == 2) {
            let transaction2 = await runQuery(`UPDATE fee_transactions SET admin2='${data.sign}' WHERE trans_id='${data.trans_id}'`);
            if (transaction2.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    let trDetails = await runQuery(`SELECT SUM(paid_amt) AS pait_amt,fee_id FROM fee_transactions f WHERE trans_id='${data.trans_id}'`);
                    let feeDetails = await runQuery(`SELECT old_bal,paid_fee,bal,id,uni_fee,tut_fee,inst_fee,othr_fee,nasa_fee,libry_fee FROM fee_details WHERE id='${trDetails[0].fee_id}'`);
                    if (data.cid == 1) {
                        feeFixed = feeDetails[0].old_bal + feeDetails[0].uni_fee + feeDetails[0].inst_fee + feeDetails[0].tut_fee;
                    } else {
                        feeFixed = feeDetails[0].uni_fee + feeDetails[0].tut_fee + feeDetails[0].nasa_fee + feeDetails[0].libry_fee;
                    }
                    let paid_amt = feeDetails[0].paid_fee - trDetails[0].pait_amt;
                    let bal_amt = feeDetails[0].bal + trDetails[0].pait_amt;
                    let transaction2 = await runQuery(`UPDATE fee_details SET paid_fee='${paid_amt}',bal='${bal_amt}' WHERE id='${feeDetails[0].id}'`);
                    if (transaction2.affectedRows > 0) {
                        let transaction3 = await runQuery(`DELETE FROM  fee_transactions WHERE trans_id='${data.trans_id}'`);
                        if (transaction3.affectedRows > 0) {
                            let getAllTransactions = await runQuery(`SELECT paid_amt,id  FROM fee_transactions f WHERE fee_id='${feeDetails[0].id}' AND fee_type NOT IN('0','-1') ORDER BY id ASC`);
                            if (getAllTransactions.length > 0) {
                                let insert = 0;
                                for (let i = 0; i < getAllTransactions.length; i++) {
                                    const element = getAllTransactions[i];
                                    let bal = feeFixed - element.paid_amt;
                                    feeFixed -= element.paid_amt;
                                    let transaction4 = await runQuery(`UPDATE  fee_transactions set bal='${bal}' WHERE id='${element.id}'`);
                                    if (transaction4.affectedRows > 0) {
                                        insert++;
                                    }
                                }
                                if (insert > 0) {
                                    if (data.sign == 'rejected') {
                                        res.send(["Rejected", "success"]);
                                    } else {
                                        res.send(["Approved", "success"]);
                                    }
                                } else {
                                    res.send(["Delete Transactions Approved And  paid fee and balance fee updated AND fee transction deleted but all transaction balance not updated", "error"]);
                                }
                            } else {
                                if (data.sign == 'rejected') {
                                    res.send(["Rejected", "success"]);
                                } else {
                                    res.send(["Approved", "success"]);
                                }
                            }
                        } else {
                            res.send(["Delete Transactions Approved And  paid fee and balance fee updated but fee transction not deleted", "error"]);
                        }
                    } else {
                        res.send(["Delete Transactions Approved but paid fee and balance fee not update", "error"]);
                    }
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        }
    } else if (data.cid == 6) {
        if (data.admin == 1) {
            let transaction2 = await runQuery(`UPDATE fee_transactions SET admin1='${data.sign}' WHERE trans_id='${data.trans_id}'`);
            if (transaction2.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    let trDetails = await runQuery(`SELECT SUM(paid_amt) AS pait_amt,fee_id FROM fee_transactions f WHERE trans_id='${data.trans_id}'`);
                    let feeDetails = await runQuery(`SELECT paid_fee,bal,id,uni_fee,tut_fee,inst_fee,othr_fee,nasa_fee,libry_fee FROM fee_details WHERE id='${trDetails[0].fee_id}'`);
                    if (data.cid == 1) {
                        feeFixed = feeDetails[0].old_bal + feeDetails[0].uni_fee + feeDetails[0].inst_fee + feeDetails[0].tut_fee;
                    } else {
                        feeFixed = feeDetails[0].uni_fee + feeDetails[0].tut_fee + feeDetails[0].nasa_fee + feeDetails[0].libry_fee;
                    }
                    let paid_amt = feeDetails[0].paid_fee - trDetails[0].pait_amt;
                    let bal_amt = feeDetails[0].bal + trDetails[0].pait_amt;
                    let transaction2 = await runQuery(`UPDATE fee_details SET paid_fee='${paid_amt}',bal='${bal_amt}' WHERE id='${feeDetails[0].id}'`);
                    if (transaction2.affectedRows > 0) {
                        let transaction3 = await runQuery(`DELETE FROM  fee_transactions WHERE trans_id='${data.trans_id}'`);
                        if (transaction3.affectedRows > 0) {
                            let getAllTransactions = await runQuery(`SELECT paid_amt,id  FROM fee_transactions f WHERE fee_id='${feeDetails[0].id}' AND fee_type NOT IN('0','-1') ORDER BY id ASC`);
                            let insert = 0;
                            for (let i = 0; i < getAllTransactions[0].length; i++) {
                                const element = getAllTransactions[0][i];
                                feeFixed -= paid_amt;
                                bal = feeFixed - paid_amt;
                                let transaction4 = await runQuery(`UPDATE  fee_transactions set bal='${bal}' WHERE id='${element.id}'`);
                                if (transaction4.affectedRows > 0) {
                                    insert++;
                                }
                            }
                            if (insert > 0) {
                                if (data.sign == 'rejected') {
                                    res.send(["Rejected", "success"]);
                                } else {
                                    res.send(["Approved", "success"]);
                                }
                            } else {
                                res.send(["Delete Transactions Approved And  paid fee and balance fee updated AND fee transction deleted but all transaction balance not updated", "error"]);
                            }
                        } else {
                            res.send(["Delete Transactions Approved And  paid fee and balance fee updated but fee transction not deleted", "error"]);
                        }
                    } else {
                        res.send(["Delete Transactions Approved but paid fee and balance fee not update", "error"]);
                    }
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        }
    }


});

app.post('/getfeedetailsfordelete', async (req, res) => {
    let data = req.body;
    let feeHeads = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }
    let transactions = await runQuery(`SELECT ${feeHeads} AS fee_fixed,(SELECT name FROM student_info WHERE student_id=f.student_id limit 1) AS name,year,acd_year,paid_fee,id FROM fee_details f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND acd_year='${data.academicYear}'`);
    res.send(transactions);
});

app.post('/addfeedetailsdeletetranscation', async (req, res) => {
    let data = req.body;
    let feeHeads = '';

    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }

    if (data.paidFee == 0) {
        let deletes = await runQuery(`DELETE FROM fee_details WHERE id='${data.id}'`);
        if (deletes.affectedRows > 0) {
            res.send(["Record Deleted", "success"]);
        } else {
            res.send(["Record Not Added", "error"]);
        }
    } else {
        let feeDetails = await runQuery(`SELECT ${feeHeads} AS fee_fixed,(SELECT sum(paid_amt)  FROM fee_transactions WHERE cid=f.cid AND fee_id=f.id AND fee_type NOT IN('0','-1')) AS paid_fee,student_id,usn,cid,did,year,acd_year,id FROM fee_details f WHERE id='${data.id}'`);
        let details = feeDetails[0];
        //in delete student data storing fixation in balance
        let query = `INSERT INTO fee_transactions(trans_id, fee_id, student_id, usn, cid, did, year, acd_year, fee_type, scr_no, paid_date, paid_amt,remark, bal, uid, delete_sts) 
        VALUES ('${await getTransactionId(details.cid, details.did)}','${details.id}','${details.student_id}','${details.usn}','${details.cid}','${details.did}','${details.year}','${details.acd_year}','-1','Delete Student','${formatDate('db', Date())}','${details.paid_fee}','${data.remarks}','${details.fee_fixed}','${data.uid}','2')`;
        let isInsert = await runQuery(query);
        if (isInsert.insertId > 0) {
            res.send(["Record Submitted For Approval", "success"]);
        } else {
            res.send(["Record Not Added", "error"]);
        }
    }
});

app.post('/getstudentdeletestatus', async (req, res) => {
    let data = req.body;
    let iname = '';
    let deleteStudentDetailsTransactions = await runQuery(`SELECT student_id,usn,year,acd_year,bal,paid_amt,remark,admin1,admin2,(SELECT iname FROM college WHERE id=f.cid ) AS iname,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE cid='${data.cid}' AND delete_sts=2`)
    if (deleteStudentDetailsTransactions.length > 0) {
        iname = deleteStudentDetailsTransactions[0].iname;
    }
    let table = `<h2 class="mt-2 mb-4">${iname}</h2>
    <table class="table table-bordered dataTable">
        <thead class="thead-dark">
            <tr>
                <th>sl no</th>
                <th>usn</th>
                <th>name</th>
                <th>year</th>
                <th>academic year</th>
                <th>fee fixed</th>
                <th>paid fee</th>
                <th>balance</th>
                <th>remark</th>`;
    if (data.cid == 1) {
        table += '<th>Registrar</th><th>VP Admin</th>';
    } else {
        table += '<th>HOD</th>';
    }
    table += `</tr></thead><tbody>`;
    for (let i = 0; i < deleteStudentDetailsTransactions.length; i++) {
        const element = deleteStudentDetailsTransactions[i];
        let admin1 = '';
        let admin2 = '';

        if (element.admin1 == '') {
            admin1 = `<span class='text-warning'>Pending</span>`;
        } else if (element.admin1.toLowerCase() == 'rejected') {
            admin1 = `<span class='text-danger'>Rejected</span>`;
        } else {
            admin1 = `<span class='text-success'>Approved</span>`;
        }

        if (element.admin2 == '') {
            admin2 = `<span class='text-warning'>Pending</span>`;
        } else if (element.admin2.toLowerCase() == 'rejected') {
            admin2 = `<span class='text-danger'>Rejected</span>`;
        } else {
            admin2 = `<span class='text-success'>Approved</span>`;
        }

        table += `<tr>
            <td>${i + 1}</td>
            <td>${element.usn}</td>
            <td>${element.name}</td>
            <td>${element.year}</td>
            <td>${element.acd_year}</td>
            <td>${numberWithCommas(element.bal)}</td>
            <td>${numberWithCommas(element.paid_amt)}</td>
            <td>${numberWithCommas(element.bal - element.paid_amt)}</td>
            <td>${element.remark}</td>`;
        if (data.cid == 1) {
            table += `<td>${admin1}</td><td>${admin2}</th>`;
        } else {
            table += `<td>${admin1}</td>`;
        }
        table += `</tr>`;

    }
    table += `</tbody></table>`;
    res.send(table)
});

app.post('/approvedeletestudentfeedetails', async (req, res) => {
    let data = req.body;
    let approvalDetails = await runQuery(`SELECT admin,(SELECT iname FROM college WHERE id=f.cid) AS iname FROM fee_approvals f WHERE cid='${data.cid}' AND fid='${data.fid}' AND type='feeFixationChange'`);

    let query = '';
    if (data.cid == 1) {
        if (approvalDetails[0].admin == 1) {
            query = `SELECT id,usn,year,acd_year,bal,paid_amt,remark,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE delete_sts=2 AND admin1='' AND admin1!='rejected'`;
        } else if (approvalDetails[0].admin == 2) {
            query = `SELECT id,usn,year,acd_year,bal,paid_amt,remark,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE delete_sts=2 AND admin1!='' AND admin1!='rejected' AND admin2='' AND admin2!='rejected'`;
        }
    } else if (data.cid == 6) {
        query = `SELECT id,usn,year,acd_year,bal,paid_amt,remark,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE delete_sts=2 AND admin1='' AND admin1!='rejected'`;
    }

    let transactions = await runQuery(query);
    res.send([transactions, approvalDetails[0]]);
});

app.post('/deletefeedetailsupdate', async (req, res) => {
    let data = req.body;
    let query = '';
    if (data.cid == 1) {
        if (data.admin == 1) {
            query = `UPDATE fee_transactions SET admin1='${data.sign}' WHERE id='${data.id}'`
            let transactions = await runQuery(query);
            if (transactions.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    res.send(["Approved", "success"]);
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        } else if (data.admin == 2) {
            let transaction2 = await runQuery(`UPDATE fee_transactions SET admin2='${data.sign}' WHERE id='${data.id}'`);
            let deleteTrDtls = await runQuery(`SELECT fee_id FROM fee_transactions  WHERE id='${data.id}'`);

            if (transaction2.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    let deleteTrns = await runQuery(`DELETE FROM fee_transactions  WHERE fee_id='${deleteTrDtls[0].fee_id}' AND delete_sts!=2`);
                    if (deleteTrns.affectedRows > 0) {
                        let deleteFeeDtls = await runQuery(`DELETE FROM fee_details  WHERE id='${deleteTrDtls[0].fee_id}'`);
                        if (deleteFeeDtls.affectedRows > 0) {
                            res.send(["Approved", "success"]);
                        } else {
                            res.send(["Transction Approved and fee transaction Deleted but fee details not deleted", "error"])
                        }
                    } else {
                        res.send(["Transction Approved But fee transaction and fee details not deleted", "error"])
                    }
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        }
    } else if (data.cid == 6) {
        if (data.admin == 1) {
            let transaction2 = await promisePool.query(`UPDATE fee_transactions SET admin1='${data.sign}' WHERE id='${data.id}'`);
            if (transaction2[0].affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    let deleteTrns = await promisePool.query(`DELETE FROM fee_transactions  WHERE fee_id='${data.id}' AND delete_sts!=2`);
                    if (deleteTrns[0].affectedRows > 0) {
                        let deleteFeeDtls = await promisePool.query(`DELETE FROM fee_details  WHERE id='${data.id}'`);
                        if (deleteFeeDtls[0].affectedRows > 0) {
                            res.send(["Approved", "success"]);
                        } else {
                            res.send(["Transction Approved and fee transaction Deleted but fee details not deleted", "error"])
                        }
                    } else {
                        res.send(["Transction Approved But fee transaction and fee details not deleted", "error"])
                    }
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        }
    }


});

app.post('/getfeedetailsforeditfixation', async (req, res) => {
    let data = req.body;
    let feeHeads = '';
    let heads = ``;
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
        heads = `old_bal,uni_fee,inst_fee,tut_fee`;
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
        heads = `uni_fee,tut_fee,nasa_fee,libry_fee`;
    }
    let transactions = await runQuery(`SELECT ${feeHeads} AS fee_fixed,${heads},(SELECT name FROM student_info WHERE student_id=f.student_id limit 1) AS name,year,acd_year,paid_fee,id,usn,student_id FROM fee_details f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND acd_year='${data.academicYear}'`);
    res.send(transactions[0]);
});

app.post('/addfeedetailsedittranscation', async (req, res) => {
    let data = req.body;
    let feeDetails = await runQuery(`SELECT id,student_id,usn,cid,did,year,acd_year,paid_fee FROM fee_details WHERE id='${data.id}'`);
    let paidAmount = `${data.uni_fee}|${data.tut_fee}`;
    let totalFee = parseInt(data.uni_fee) + parseInt(data.tut_fee);
    let query = `INSERT INTO fee_transactions(trans_id,fee_id,student_id,usn,cid,did,year,acd_year,fee_type,scr_no,paid_date,paid_amt,remark,bal,uid) VALUES ('${await getTransactionId(feeDetails[0].cid, feeDetails[0].did)}','${feeDetails[0].id}','${feeDetails[0].student_id}','${feeDetails[0].usn}','${feeDetails[0].cid}','${feeDetails[0].did}','${feeDetails[0].year}','${feeDetails[0].acd_year}','0','Fee Changed','${formatDate('db', Date())}','${paidAmount}','${data.remarks}','${totalFee}','${data.uid}')`;
    let isInsert = await runQuery(query);
    if (isInsert.insertId > 0) {
        res.send(["Record Submitted For Approval", "success"]);
    } else {
        res.send(["Record Not Added", "error"]);
    }
});

app.post('/getstudenteditfeestatus', async (req, res) => {
    let data = req.body;
    let iname = '';
    let feeHeads = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }
    let deleteStudentDetailsTransactions = await runQuery(`SELECT student_id,usn,year,acd_year,bal,remark,admin1,admin2,(SELECT iname FROM college WHERE id=f.cid ) AS iname,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name,(SELECT ${feeHeads} FROM fee_details WHERE id=f.fee_id) AS fee_fixed FROM fee_transactions f WHERE cid='${data.cid}' AND fee_type=0`);
    if (deleteStudentDetailsTransactions.length > 0) {
        iname = deleteStudentDetailsTransactions[0].iname;
    }
    let table = `<h2 class="mt-2 mb-4">${iname}</h2>
    <table class="table table-bordered dataTable">
        <thead class="thead-dark">
            <tr>
                <th>sl no</th>
                <th>usn</th>
                <th>name</th>
                <th>year</th>
                <th>academic year</th>
                <th>old fee fixed</th>
                <th>new fee fixed</th>
                <th>remark</th>`;
    if (data.cid == 1) {
        table += '<th>Registrar</th><th>VP Admin</th>';
    } else {
        table += '<th>HOD</th>';
    }
    table += `</tr></thead><tbody>`;
    for (let i = 0; i < deleteStudentDetailsTransactions.length; i++) {
        const element = deleteStudentDetailsTransactions[i];
        let admin1 = '';
        let admin2 = '';

        if (element.admin1 == '') {
            admin1 = `<span class='text-warning'>Pending</span>`;
        } else if (element.admin1.toLowerCase() == 'rejected') {
            admin1 = `<span class='text-danger'>Rejected</span>`;
        } else {
            admin1 = `<span class='text-success'>Approved</span>`;
        }

        if (element.admin2 == '') {
            admin2 = `<span class='text-warning'>Pending</span>`;
        } else if (element.admin2.toLowerCase() == 'rejected') {
            admin2 = `<span class='text-danger'>Rejected</span>`;
        } else {
            admin2 = `<span class='text-success'>Approved</span>`;
        }

        table += `<tr>
            <td>${i + 1}</td>
            <td>${element.usn}</td>
            <td>${element.name}</td>
            <td>${element.year}</td>
            <td>${element.acd_year}</td>
            <td>${numberWithCommas(element.fee_fixed)}</td>
            <td>${numberWithCommas(element.bal)}</td>
            <td>${element.remark}</td>`;
        if (data.cid == 1) {
            table += `<td>${admin1}</td><td>${admin2}</th>`;
        } else {
            table += `<td>${admin1}</td>`;
        }
        table += `</tr>`;

    }
    table += `</tbody></table>`;
    res.send(table)
});

app.post('/approveeditstudentfeedetails', async (req, res) => {
    let data = req.body;

    let feeHeads = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }

    let approvalDetails = await runQuery(`SELECT admin,(SELECT iname FROM college WHERE id=f.cid) AS iname FROM fee_approvals f WHERE cid='${data.cid}' AND fid='${data.fid}' AND type='feeFixationChange'`);

    let query = '';
    if (data.cid == 1) {
        if (approvalDetails[0].admin == 1) {
            query = `SELECT id,usn,year,acd_year,bal,paid_amt,remark,(SELECT ${feeHeads} FROM fee_details WHERE id=f.fee_id) AS fee_fixed,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE fee_type=0 AND admin1='' AND admin1!='rejected'`;
        } else if (approvalDetails[0].admin == 2) {
            query = `SELECT id,usn,year,acd_year,bal,paid_amt,remark,admin1,(SELECT ${feeHeads} FROM fee_details WHERE id=f.fee_id) AS fee_fixed,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE fee_type=0 AND admin1!='' AND admin1!='rejected' AND admin2='' AND admin2!='rejected'`;
        }
    } else if (data.cid == 6) {
        query = `SELECT id,usn,year,acd_year,bal,paid_amt,remark,(SELECT ${feeHeads} FROM fee_details WHERE id=f.fee_id) AS fee_fixed,(SELECT name FROM student_info WHERE student_id=f.student_id LIMIT 1) AS name FROM fee_transactions f WHERE fee_type=0 AND admin1='' AND admin1!='rejected'`;
    }

    let transactions = await runQuery(query);
    res.send([transactions, approvalDetails[0]]);
});

app.post('/editfeedetailsupdate', async (req, res) => {
    let data = req.body;
    let query = '';
    let feeHeads = '';
    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }
    if (data.cid == 1) {
        if (data.admin == 1) {
            query = `UPDATE fee_transactions SET admin1='${data.sign}' WHERE id='${data.id}'`
            let transactions = await runQuery(query);
            if (transactions.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    res.send(["Approved", "success"]);
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        } else if (data.admin == 2) {
            let transaction2 = await runQuery(`UPDATE fee_transactions SET admin2='${data.sign}' WHERE id='${data.id}'`);

            if (transaction2.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    let oldFeeDetails = await runQuery(`SELECT * FROM fee_details WHERE id=(SELECT fee_id FROM fee_transactions WHERE id='${data.id}')`);
                    let changeFeeDetails = await runQuery(`SELECT * FROM fee_transactions WHERE id='${data.id}'`);
                    let old_fee_fixed = '';

                    if (data.cid == 1) {
                        old_fee_fixed = oldFeeDetails[0].old_bal + oldFeeDetails[0].uni_fee + oldFeeDetails[0].inst_fee + oldFeeDetails[0].tut_fee;
                    } else {
                        old_fee_fixed = oldFeeDetails[0].uni_fee + oldFeeDetails[0].tut_fee + oldFeeDetails[0].nasa_fee + oldFeeDetails[0].libry_fee;
                    }

                    let headWiseChangedFeeAmount = changeFeeDetails[0]['paid_amt'].split("|");
                    let uni_fee = parseFloat(headWiseChangedFeeAmount[0]);
                    let tut_fee = parseFloat(headWiseChangedFeeAmount[1]);
                    let new_fee_fixed = uni_fee + tut_fee;
                    let balance = new_fee_fixed;
                    let totalPaidAmont = 0;
                    let oldTransactions = await runQuery(`SELECT id,paid_amt,bal,fee_id FROM fee_transactions f WHERE  fee_id = '${oldFeeDetails[0].id}'  AND fee_type NOT IN('0','-1') `);
                    let trUpdate = 0;
                    for (let i = 0; i < oldTransactions.length; i++) {
                        const element = oldTransactions[i];
                        balance -= parseFloat(element.paid_amt);
                        totalPaidAmont += parseFloat(element.paid_amt);
                        let updateTr1 = await runQuery(`UPDATE fee_transactions SET old_bal='${element.bal}',bal='${balance}',remark='old fee fixed ${old_fee_fixed} AND new fee fixed ${new_fee_fixed}' WHERE id='${element.id}'`);
                        if (updateTr1.affectedRows > 0) {
                            let updateTr2 = await runQuery(`UPDATE fee_details SET paid_fee='${totalPaidAmont}',bal='${balance}'  WHERE id='${element.fee_id}'`)
                            if (updateTr2.affectedRows > 0) {
                                trUpdate++;
                            }
                        }
                    }
                    if (trUpdate > 0) {
                        let updateTr3 = await runQuery(`UPDATE fee_details SET uni_fee='${uni_fee}',tut_fee='${tut_fee}'  WHERE id='${oldFeeDetails[0].id}'`);
                        if (updateTr3.affectedRows > 0) {
                            res.send(["Approved", "success"]);
                        } else {
                            res.send(["Transction Approved and old transaction balance updated but fee fixation not changed", "error"])
                        }
                    } else {
                        res.send(["Transction Approved but old transaction balance not update and fee fixation not changed", "error"])
                    }
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        }
    } else if (data.cid == 6) {
        if (data.admin == 1) {
            let transaction2 = await runQuery(`UPDATE fee_transactions SET admin1='${data.sign}' WHERE id='${data.id}'`);

            if (transaction2.affectedRows > 0) {
                if (data.sign == 'rejected') {
                    res.send(["Rejected", "success"]);
                } else {
                    let oldFeeDetails = await runQuery(`SELECT * FROM fee_details WHERE id=(SELECT fee_id FROM fee_transactions WHERE id='${data.id}')`);
                    let changeFeeDetails = await runQuery(`SELECT * FROM fee_transactions WHERE id='${data.id}'`);
                    let old_fee_fixed = '';

                    if (data.cid == 1) {
                        old_fee_fixed = oldFeeDetails[0].old_bal + oldFeeDetails[0].uni_fee + oldFeeDetails[0].inst_fee + oldFeeDetails[0].tut_fee;
                    } else {
                        old_fee_fixed = oldFeeDetails[0].uni_fee + oldFeeDetails[0].tut_fee + oldFeeDetails[0].nasa_fee + oldFeeDetails[0].libry_fee;
                    }

                    let headWiseChangedFeeAmount = changeFeeDetails[0]['paid_amt'].split("|");
                    let uni_fee = parseFloat(headWiseChangedFeeAmount[0]);
                    let tut_fee = parseFloat(headWiseChangedFeeAmount[1]);
                    let new_fee_fixed = uni_fee + tut_fee;
                    let balance = new_fee_fixed;
                    let totalPaidAmont = 0;
                    let oldTransactions = await runQuery(`SELECT id,paid_amt,bal,fee_id FROM fee_transactions f WHERE student_id=(SELECT student_id FROM student_info WHERE usn='${data.usn}' OR student_id='${data.usn}' LIMIT 1) AND fee_id = '${oldFeeDetails[0].id}'  AND fee_type NOT IN('0','-1') `);
                    let trUpdate = 0;

                    for (let i = 0; i < oldTransactions.length; i++) {
                        const element = oldTransactions[i];
                        balance -= element.paid_amt;
                        totalPaidAmont += element.paid_amt;
                        let updateTr1 = await runQuery(`UPDATE fee_transactions SET old_bal='${element.bal}',bal='${balance}' remark='old fee fixed ${old_fee_fixed} AND new fee fixed ${new_fee_fixed}' WHERE id='${element.id}'`);
                        if (updateTr1.affectedRows > 0) {
                            let updateTr2 = await runQuery(`UPDATE fee_transactions SET paid_fee='${totalPaidAmont}',bal='${balance}'  WHERE id='${element.fee_id}'`)
                            if (updateTr2.affectedRows > 0) {
                                trUpdate++;
                            }
                        }
                    }
                    if (trUpdate > 0) {
                        let updateTr3 = await runQuery(`UPDATE fee_transactions SET uni_fee='${uni_fee}',tut_fee='${tut_fee}'  WHERE id='${oldFeeDetails[0].id}'`);
                        if (updateTr3.affectedRows > 0) {
                            res.send(["Approved", "success"]);
                        } else {
                            res.send(["Transction Approved and old transaction balance updated but fee fixation not changed", "error"])
                        }
                    } else {
                        res.send(["Transction Approved but old transaction balance not update and fee fixation not changed", "error"])
                    }
                }
            } else {
                res.send(["Not Approved", "error"]);
            }
        }
    }


});

app.post('/getstudentfeelist', async (req, res) => {
    let data = req.body;
    let query = '';
    let feeHeads = '';

    if (data.cid == 1) {
        feeHeads = 'SUM(old_bal+uni_fee+inst_fee+tut_fee)';
    } else {
        feeHeads = 'SUM(uni_fee+tut_fee+nasa_fee+libry_fee)';
    }
    if (data.did == 'All' && data.year == 'All') {
        query = `SELECT  si.usn,si.name,si.student_id,${feeHeads} AS fee_fixed,sa.paid_fee,sa.id,(SELECT iname FROM college WHERE id=sa.cid) AS iname FROM fee_details sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sa.cid='${data.cid}' AND sa.acd_year='${data.academicYear}' GROUP BY sa.student_id ORDER BY si.usn ASC`;
    } else if (data.did != '' && data.year == 'All') {
        query = `SELECT  si.usn,si.name,si.student_id,${feeHeads} AS fee_fixed,sa.paid_fee,sa.id,(SELECT iname FROM college WHERE id=sa.cid) AS iname FROM fee_details sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sa.cid='${data.cid}' AND  sa.did='${data.did}' AND sa.acd_year='${data.academicYear}' GROUP BY sa.student_id ORDER BY si.usn ASC`;
    } else if (data.did == 'All' && data.year != '') {
        query = `SELECT  si.usn,si.name,si.student_id,${feeHeads} AS fee_fixed,sa.paid_fee,sa.id,(SELECT iname FROM college WHERE id=sa.cid) AS iname FROM fee_details sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sa.cid='${data.cid}' AND  sa.year='${data.year}' AND sa.acd_year='${data.academicYear}' GROUP BY sa.student_id ORDER BY si.usn ASC`;
    } else if (data.did != '' && data.year != '') {
        query = `SELECT  si.usn,si.name,si.student_id,${feeHeads} AS fee_fixed,sa.paid_fee,sa.id,(SELECT iname FROM college WHERE id=sa.cid) AS iname FROM fee_details sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sa.cid='${data.cid}' AND sa.did='${data.did}' AND  sa.year='${data.year}' AND sa.acd_year='${data.academicYear}' GROUP BY sa.student_id ORDER BY si.usn ASC`;
    }

    // console.log(query)

    let studentList = await runQuery(query);
    res.send(studentList);
});

app.post('/getiamarksentry', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT scode,sem,dv,cid,did,dv,academic_year,fid FROM subject s WHERE id='${data.id}'`);
    let subjectDetails = rows[0];
    let list = await runQuery(`SELECT  sa.student_id,si.usn,si.name FROM sub_info sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`);
    let qpDetails = await runQuery(`SELECT qno,marks,(SELECT cos FROM nba_co WHERE id=n.co_id) as cos FROM nba_question n WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}' AND internal='${data.internal}' AND qno NOT IN('part-a','part-B','or')`);
    res.send([list, qpDetails]);
});

app.post('/addiamarks', async (req, res) => {
    let data = req.body;
    let insert = {
        fid: data.fid,
        name: data.name,
        usn: data.usn,
        student_id: data.studentId,
        scode: data.scode,
        marks_type: data.marksType,
        max_marks: data.max_marks,
        qno: data.qno,
        marks: parseFloat(data.marks),
        internal: data.internal,
        cid: data.cid,
        did: data.did,
        sem: data.sem,
        dv: data.dv,
        academic_year: data.academicYear,
        admin: data.uid,
    }
    // console.log(insert)
    await dbConnect();
    let checkRecord = await db.query(`SELECT id FROM nba_marks WHERE cid='${insert.cid}' AND scode='${insert.scode}' AND dv='${insert.dv}' AND internal='${insert.internal}' AND qno='${insert.qno}' AND academic_year='${insert.academic_year}' AND student_id='${insert.student_id}'`);
    // console.log(checkRecord)
    if (checkRecord.length == 0) {
        let isInsert = await db.insert('nba_marks', insert);
        await dbDisconnect();
        res.send([isInsert.insertId]);
    } else {
        let isInsert = await db.update('nba_marks', insert, { id: checkRecord[0].id });
        await dbDisconnect();
        res.send([isInsert.affectedRows]);
    }
});

app.post('/getattainmentsheetia', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT sname,scode,sem,dv,cid,did,dv,academic_year,fid,(SELECT sname FROM dept WHERE id=s.did) AS dsname,(select iname FROM college WHERE id=s.cid) AS iname FROM subject s WHERE id='${data.subject}'`);
    let subjectDetails = rows[0];

    let table = `
    <p style="font-size:17pt;text-align:center;font-family:Cambria;color:#0047b3;line-height: 50%;" class="text-uppercase text-center">SECAB&zwnj; &zwnj;Association’s&zwnj;</p>
    <div class="row">
        <div class="col-md-3">
            <center><img src="http://hrms.secab.org/images/siet.png" alert="No images" style="width:40%;height:80px;"></center>
        </div>
        <div class="col-md-7">
            <p style="font-size:16pt;text-align:center;font-family:Cambria;color:#0047b3;line-height: 50%;" class="text-uppercase">${subjectDetails.iname}</p>
            <p style="font-size:16pt;text-align:center;font-family:Cambria;color:#0047b3;line-height: 50%;" class="text-uppercase">VIJAYAPUR-586109</p>
            <p style="font-size:14pt;text-align:center;font-family:Cambria;color:#cc0000;line-height: 50%;" class="text-uppercase">DEPARTMENT OF ${subjectDetails.dept} Engineering</p>
            <p style="font-size:16pt;text-align:center;font-family:Cambria;color:#0047b3;line-height: 50%;" class="text-uppercase">COURSE OUTCOME ATTAINMENT THROUGH INTERNAL EVALUATION (CIE)</p>
        </div>

        <table class="table table-bordered text-uppercase">
            <thead class="thead-dark">
                <tr>
                    <th>Subject name : ${subjectDetails.sname}</th>
                    <th>Branch : ${subjectDetails.dsname}</th>
                </tr>
                <tr>
                    <th>Subject code : ${subjectDetails.scode} </th>
                    <th>div : ${subjectDetails.dv}</th>
                </tr>
                <tr>
                    <th>course id : </th>
                    <th>IA : ${data.internal}</th>
                </tr>
            </thead>
        </table>`;
    let qpDetails = await runQuery(`SELECT qno,marks,co_id,(SELECT cos FROM nba_co WHERE id=n.co_id) as cos FROM nba_question n WHERE cid='${subjectDetails.cid}' AND did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}' AND internal='${data.internal}' AND qno NOT IN('part-a','part-B','or')`);
    let studentList = await runQuery(`SELECT  sa.student_id,si.usn,si.name FROM sub_info sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE scd='${subjectDetails.scode}' AND sem='${subjectDetails.sem}' AND sa.did='${subjectDetails.did}' AND dv='${subjectDetails.dv}' AND sa.cid='${subjectDetails.cid}' AND sa.academic_year='${subjectDetails.academic_year}' ORDER BY si.usn ASC`);

    table += `<table class="table table-bordered text-uppercase text-center" id="table-freeze">
    <thead class="thead-dark"><tr><th colspan="3" class="text-center">qno</th>`;
    qpDetails.map((data, i) => {
        table += `<th key=${i}>${data.qno}</th>`;
    });
    table += `</tr><tr> 
    <th colspan="3" class="text-center">co</th>`;
    qpDetails.map((data, i) => {
        table += `<th key=${i}>${data.cos}</th>`;
    });
    table += `</tr><tr>
    <th rowSpan="2" class="align-middle">sl no</th>
    <th rowSpan="2" class="align-middle">usn</th>
    <th rowSpan="2" class="align-middle">name</th>
    <th colSpan=${qpDetails.length} class="text-center">max marks</th>
    </tr>
    <tr>`;
    qpDetails.map((data, i) => {
        table += `<th key=${i}>${data.marks}</th>`;
    })
    table += `</tr><tbody>`;
    let benchMarkTd = '';
    let attainmentPercentageTd = '';
    let attainmentValueTd = '';
    const getAttainmentLevel = ($range) => {

        $al = '';
        if ($range < 60) {
            $al = "0";
        }
        if ($range >= 60 && $range < 70) {
            $al = "1";
        } else if ($range >= 70 && $range < 80) {
            $al = "2";
        } else if ($range >= 80 && $range <= 100) {
            $al = "3";
        }

        return $al;
    }
    let attainmentLevelArray = [];
    let a = 0;
    for (let index = 0; index < studentList.length; index++) {
        const data1 = studentList[index];
        table += `<tr key=${index}>
            <td>${index + 1}</td>
            <td>${data1.usn}</td>
            <td>${data1.name}</td>`;
        for (let j = 0; j < qpDetails.length; j++) {
            const element = qpDetails[j];
            let row2 = await runQuery(`SELECT marks FROM nba_marks WHERE student_id='${data1.student_id}' AND qno='${element.qno}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND academic_year='${subjectDetails.academic_year}'`);
            table += `<td>${row2.length == 0 ? '-' : row2[0].marks}</td>`;
            let marks = 0;
            row2.length != 0 ? marks = row2[0].marks : ''
            if (index == (studentList.length - 1)) {
                let percentage = data.benchMarks / 100;
                let targetValue = element.marks * percentage;
                let attainmentMarks = await runQuery(`SELECT count(marks) AS marks FROM nba_marks WHERE did='${subjectDetails.did}' AND scode='${subjectDetails.scode}' AND internal='${data.internal}' AND qno='${element.qno}' AND marks >='${targetValue}' AND academic_year='${subjectDetails.academic_year}'`)
                benchMarkTd += `<td>${targetValue}</td>`;
                attainmentPercentageTd += `<td>${attainmentMarks.length > 0 ? ((attainmentMarks[0].marks / studentList.length) * 100).toString().substring(0, 4) : "0"}</td>`;
                attainmentValueTd += `<td>${getAttainmentLevel(attainmentMarks.length > 0 ? ((attainmentMarks[0].marks / studentList.length) * 100).toString().substring(0, 4) : "0")}</td>`;
                attainmentLevelArray[a] = getAttainmentLevel(attainmentMarks.length > 0 ? ((attainmentMarks[0].marks / studentList.length) * 100).toString().substring(0, 4) : "0");
                a++;
            }

        }
        table += `</tr>`;
    }
    table += `<tr>
        <td colspan="3">TARGET VALUE (${data.benchMarks}% OPTIMUM MARKS)</td>
        ${benchMarkTd}
    </tr>
    <tr>
        <td colspan="3">ATTAINMENT PERCENTAGE</td>
        ${attainmentPercentageTd}
    </tr>
    <tr>
        <td colspan="3">ATTAINMENT Value</td>
        ${attainmentValueTd}
    </tr>`;
    let cos = await runQuery(`SELECT cos,co,id,hod,stmt,fid,scode,did,dv,academic_year FROM nba_co WHERE fid='${subjectDetails.fid}' AND scode='${subjectDetails.scode}' AND academic_year='${subjectDetails.academic_year}' AND dv='${subjectDetails.dv}'`)
    table += `</tbody></table>
    <div class="col-sm-12">
                        <h6 align="center" class="mb-2 mt-2">CO ATTAINMENT (Direct attainment of CO)</h6>
                        <table class="table table-bordered text-uppercase text-center">
                            <thead class="thead-dark">
                                <tr>
                                    <th rowspan="3" class="align-middle">
                                        co
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="${qpDetails.length + 2}" class="text-center">
                                        Question No
                                    </th>
                                </tr>
                                <tr>`;

    qpDetails.map((data, i) => {
        table += `<th>${data.qno}</th>`
    })

    table += `<th>TOTAL</th>
                                <th>CO ATTAINMENT</th></tr>
                            </thead>
                            <tbody>`;
    for (let i = 0; i < cos.length; i++) {
        const element = cos[i];
        table += `
                                <tr>
                                <td>${element.cos}</td>`;
        let coAttainment = [];
        let c = 0;
        for (let j = 0; j < qpDetails.length; j++) {
            const element1 = qpDetails[j];
            if (element.id == element1.co_id) {
                table += `<td>${attainmentLevelArray[j]}</td>`
                coAttainment[c] = attainmentLevelArray[j];
                c++;
            } else {
                table += `<td>-</td>`
            }
        }
        let total = coAttainment.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        let coAttained = 0;
        if (coAttainment.length != 0) {
            coAttained = total / coAttainment.length;
        }
        table += `<td>${total}</td><td>${coAttained}</td>`;
        table += `</tr>`;

    }
    table += `</tbody>
                        </table>
                    </div>`;
    res.send(table);
});

app.post('/addco', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT scode,fid,cid,did,dv,academic_year FROM subject s WHERE id='${data.id}'`)
    let subjectDetails = rows[0];
    let inserted = 0;

    for (let i = 0; i < data.coData.length; i++) {
        const element = data.coData[i];
        if (element.id == '') {
            let insert = {
                fid: subjectDetails.fid,
                cid: subjectDetails.cid,
                did: subjectDetails.did,
                scode: subjectDetails.scode,
                dv: subjectDetails.dv,
                co: element.co,
                cos: element.cos,
                stmt: element.stmt,
                academic_year: element.academic_year,
            };

            await dbConnect();
            let isInsert = await db.insert('nba_co', insert);
            await dbDisconnect();
            if (isInsert.insertId > 0) {
                inserted++;
            }
        } else {
            let insert = {
                fid: subjectDetails.fid,
                cid: subjectDetails.cid,
                did: subjectDetails.did,
                scode: subjectDetails.scode,
                dv: subjectDetails.dv,
                co: element.co,
                cos: element.cos,
                stmt: element.stmt,
                academic_year: element.academic_year,
            };

            await dbConnect();
            let isInsert = await db.update('nba_co', insert, { id: element.id });
            await dbDisconnect();
            if (isInsert.insertId > 0) {
                inserted++;
            }
        }

    }

    if (inserted > 0) {
        res.send(["Record Added", "success"]);
    } else {
        res.send(["Record Not Added", "error"]);
    }
});

app.post('/getDbAcademicYear2', (req, res) => {
    let data = req.body;
    mysqlConnection.query('SELECT MAX(academic_year) AS academicYear FROM `academic_year` WHERE cid=?', [data.cid], (err, rows) => {
        if (!err) {
            let option = `<option value="">Select Academic Year</option>`;
            for (let index = 0; index < rows.length; index++) {
                option += `<option value="${rows[index].academicYear}">${rows[index].academicYear}</option>`
            }
            res.send(option);
        } else {
            console.log(err);
        }
    })
});

app.post('/getdepartmentoption', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT  name,id from dept where cid='${data.cid}' and academic='1' ORDER BY id ASC`)
    let option = `<option value= "" >Select Department</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    }
    res.send(option);

    // mysqlConnection.query('SELECT  name,id from dept where cid=? and academic=? ORDER BY id ASC', [data.cid,'1'], (err, rows, fields) => {
    //     if (!err) {
    //         let option = `<option value= "" >Select Department</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    //         }
    //         res.send(option);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getdepartmentoptionbyid', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT  name from dept where cid='${data.cid}' and academic='1'  and id='${data.did}' ORDER BY id ASC`)
    let option = `<option value= "" >Select Department</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    }
    res.send(option);

    // mysqlConnection.query('SELECT  name from dept where cid=? and academic=?  and id=? ORDER BY id ASC', [data.cid,'1', data.id], (err, rows, fields) => {
    //     if (!err) {
    //         let option = `<option value= "" >Select Department</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    //         }
    //         res.send(option);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getsubjectlists', (req, res) => {
    let data = req.body;

    mysqlConnection.query('SELECT *, (SELECT DISTINCT(usn) FROM `sub_info` WHERE student_id=s.student_id and academic_year=s.academic_year and usn!=0) as usn FROM `student_academic` s WHERE s.academic_year=? and s.sem=? and s.dv=? and s.did=? ORDER BY `usn` ASC', [data.academicYear, data.sem, data.dv, data.did], async (err, rows, fields) => {
        if (!err) {
            let orderBy = ``;
            let studentDetails = rows[0];
            if (studentDetails['did'] == 6) {
                orderBy = `ORDER BY substr(scd,-1) ASC`;
            } else if (studentDetails['did'] == 7) {
                orderBy = `ORDER BY id ASC`;
            } else {
                orderBy = `GROUP BY si.student_id `;
            }

            // let studentList = await promisePool.query(`SELECT student_id,usn, name IN(select name from sub_info where  sem='${studentDetails.sem}' and academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}') ,sem,did,(select scd from sub_info where AND sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}'  GROUP BY  scd  limit 0,1) as scd1, (select scd from sub_info where sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY scd limit 1 ,1 ) as scd2 , (select scd from sub_info where sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY  scd asc limit 2,1) as scd3 ,(select scd from sub_info where  sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY  scd asc limit 3,1) as scd4, (select scd from sub_info where  sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY  scd asc limit 4,1) as scd5, (select scd from sub_info where  sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY  scd asc limit 5,1) as scd6, (select scd from sub_info where  sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY  scd asc limit 6,1) as scd7, (select scd from sub_info where  sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY  scd asc limit 7,1) as scd8, (select scd from sub_info where  sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' AND did='${studentDetails.did}' GROUP BY  scd asc limit 8,1) as scd9, batch FROM sub_info WHERE cid='${studentDetails.cid}' AND did='${studentDetails.did}' AND sem='${studentDetails.sem}' AND academic_year='${studentDetails.academic_year}' GROUP BY student_id ASC`)
            let studentList = await promisePool.query(`SELECT DISTINCT si.usn,p.student_id ,si.name, (select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 0 ) as scd1 ,(select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 1 ) as scd2 ,(select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 2 ) as scd3 ,(select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 3 ) as scd4 ,(select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 4 ) as scd5 ,(select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 5 ) as scd6 ,(select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 6 ) as scd7 ,(select scd from sub_info where student_id=p.student_id AND academic_year=p.academic_year AND dv=p.dv AND sem=p.sem AND did=p.did order by scd asc limit 1 offset 7 ) as scd8, batch  FROM sub_info p INNER JOIN student_info si ON p.student_id=si.student_id where p.did='${studentDetails.did}' AND p.academic_year='${studentDetails.academic_year}' AND  sem='${studentDetails.sem}' ${orderBy}`)
            let tbody = ``;
            for (let i = 0; i < studentList[0].length; i++) {
                const stdDetails = studentList[0][i];

                tbody += `<tr style="font-weight:normal">
                        <td>${i + 1}</td>
                       <td>${stdDetails['usn']}</td>
                       <td>${stdDetails['student_id']}</td>
                       <td class='text-lowercase'>${stdDetails['name']}</td>
                       <td>${stdDetails['scd1']}</td>
                       <td>${stdDetails['scd2']}</td>
                       <td>${stdDetails['scd3']}</td>
                       <td>${stdDetails['scd4']}</td>
                       <td>${stdDetails['scd5']}</td>
                       <td>${stdDetails['scd6']}</td>
                       <td>${stdDetails['scd7']}</td>
                       <td>${stdDetails['scd8']}</td>`;

                let batchlist = await promisePool.query(`select * from sub_info where  student_id='${stdDetails['student_id']}' and  batch!='' AND dv='${studentDetails.dv}' AND academic_year='${studentDetails.academic_year}'`)
                let batching = ``;
                for (let j = 0; j < batchlist[0].length; j++) {
                    const element = batchlist[0][j];
                    batching = element.batch;
                }
                tbody += `<td>${batching}</td></tr>`;
            }
            res.send([tbody]);

        } else {
            console.log(err);
        }
    });
});

app.post('/getdepartmentdetailbyid', async (req, res) => {
    let data = req.body;
    // let rows = await runQuery(`select * from dept where id='${data.cid}'`)
    // res.send(rows);

    mysqlConnection.query('select * from dept where id=?', [data.cid], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

app.post('/getsubjdetaillists', (req, res) => {
    let data = req.body;

    mysqlConnection.query('SELECT DISTINCT(dv) FROM subject WHERE did=? and academic_year=? and sem=?  ORDER BY dv,sname', [data.did, data.academicYear, data.sem], async (err, rows) => {
        if (!err) {
            let tbody = ``;
            let table = ``;
            let dvDetails = rows;
            for (let k = 0; k < dvDetails.length; k++) {
                const dvs = dvDetails[k];
                //  console.log(`select * from subject where did='${data.did}' and academic_year='${data.academicYear}' and sem='${data.sem}' and dv='${dvs.dv}'  ORDER BY scode  `)
                let subTable = await promisePool.query(`select * from subject where did='${data.did}' and academic_year='${data.academicYear}' and sem='${data.sem}' and dv='${dvs.dv}'  ORDER BY scode`)
                table += `<table class="table table-bordered text-center"><br/>
                    <thead class="thead-dark">
                        <tr>      
                        </tr>
                        <tr>
            <th>Sl No</th>
            <th>Subject Name</th>
            <th>Scode</th>
            <th>Faculty</th>   
            <th>Division</th>
            </tr>        
                    </thead>
                    <tbody>`;
                for (let i = 0; i < subTable[0].length; i++) {
                    const element = subTable[0][i];
                    let btch = element.batch;
                    let sl = i + 1;

                    table += `<tr style="font-weight:bold">
                    <td>${sl}</td>`;
                    if (btch != '') {
                        table += `<td>${element['sname']} (${element['batch']})</td>`;
                    } else {
                        table += `<td>${element['sname']}</td>`;
                    }
                    table += `<td>${element['scode']}</td>
                   <td>${element['fname']}</td>
                   <td>${element['dv']}</td>
                         </tr>`;
                    sl++;
                }
                table += `</tbody>
                </table>`;

            }
            res.send(table);
        } else {
            console.log(err);
        }
    })
});




app.post('/addsubjects', async (req, res) => {
    let data = req.body;
    let added = 0;
    let cllgid = data.cid;
    let rows = await promisePool.query(`SELECT * FROM subject_pre WHERE scode='${data.scode}' AND dv='${data.dv}' and sem='${data.sem}' AND did='${data.dept}' AND academic_year='${data.academic_year}'`)
    let academic_type = ``;
    let freeze = ``;
    let hodApprove = ``;
    let PrincipalApprove = ``;

    if (cllgid == 8 || cllgid == 9 || cllgid == 34) {
        academic_type = 0;
        freeze = 1;
        hodApprove = 1;
        PrincipalApprove = 1;

    } else if (cllgid == 6) {
        hodApprove = 1;
        PrincipalApprove = 1;
        academic_type = data.academic_type;
        freeze = 0;

    } else {
        academic_type = data.academic_type;
        freeze = 0;
        hodApprove = 0;
        PrincipalApprove = 0;
    }

    //let scheme = `{substr(data.scode,2)}`;

    if (rows[0] > '') {
        console.log('Failed to add!!!! ')
    } else {

        let sqlInsert = await promisePool.query(`insert into subject_pre (academic_year,did,sname ,scode ,stype,sem,dv,academic_type,freeze,hodApprove,PrincipalApprove) values('${data.academic_year}','${data.dept}','${data.sname}','${data.scode}','${data.stype}','${data.sem}', '${data.dv}','${academic_type}','${freeze}','${hodApprove}','${PrincipalApprove}')`)
        added++;
        //  if(sqlInsert!=1){

        //      console.log(`Failed to Add the Subject`)
        //  } else {
        //      console.log(`Added Successfully`)
        //  }
    }
    res.send(rows)

});


// /*app.post('/getsubjects', (req,res,row) => {
//     let data = req.body;
//     var option = `<option value="">Select Subject</option>`;

//     mysqlConnection.query(`SELECT DISTINCT id,scode,sname FROM subject  WHERE sem=? AND did=? AND dv=? AND cid=? AND academic_year=? AND stype!='lab' ORDER BY substr(scode,-1) ASC`,[data.sem,data.dept,data.dv,data.cid,data.academic_year], (err,rows) => {
//         if (!err) {
//             for( let index = 0; index < rows.length; index++){
//                 option += `<option value = "${rows[index].scode}">${rows[index].sname}-(${rows[index].scode})</option>`;
//             }
//             res.send(option);

//         } else {
//             console.log(err);
//         }
//     });

// });*/

app.post('/getbatchoption', async (req, res) => {
    let data = req.body;
    //var option = `<option>Select Subjects (Lab)</option>`;
    let rows = await runQuery(`SELECT DISTINCT id,scode,sname FROM subject  WHERE sem='${data.sem}' AND did='${data.dept}' AND dv='${data.dv}' AND cid='${data.cid}' AND academic_year='${data.academic_year}' AND stype='lab' GROUP BY substr(scode,-1) ASC `)
    let option = `<option value= "" >Select Subjects (Lab)</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value = "${rows[index].scode}">${rows[index].sname}-(${rows[index].scode})</option>`
    }
    res.send(option);

    // mysqlConnection.query(`SELECT DISTINCT id,scode,sname FROM subject  WHERE sem=? AND did=? AND dv=? AND cid=? AND academic_year=? AND stype='lab' GROUP BY substr(scode,-1) ASC `, [data.sem,data.dept,data.dv,data.cid,data.academic_year],(err,rows) => {
    //    if (!err) {
    //        for( let index = 0; index < rows.length; index++){
    //            option += `<option value = "${rows[index].scode}">${rows[index].sname}-(${rows[index].scode})</option>`;
    //        }
    //        res.send(option);

    //    } else {
    //        console.log(err);
    //    }
    // });
});

app.post('/getsubjectwisestudentlist', async (req, res) => {
    let data = req.body;
    let did = req.did;
    let rows1 = ``;
    let rows2 = ``;

    if (did == 6) {
        rows1 = await runQuery(`SELECT  sa.*,si.usn,si.name,sa.id AS sid FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${data.sem}' AND sa.did='${data.dept}' AND dv='${data.dv}' AND sa.cid='${data.cid}' AND sa.academic_year='${data.academic_year}' ORDER BY rno ASC`)
    } else {
        rows1 = await runQuery(`SELECT  sa.*,si.usn,si.name,sa.id AS sid FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem='${data.sem}' AND sa.did='${data.dept}' AND dv='${data.dv}' AND sa.cid='${data.cid}' AND sa.academic_year='${data.academic_year}' ORDER BY si.usn ASC`)
    }
    res.send(rows1)

    //select student_id, usn,name,sa.did,sem from sudent_info INNER JOIN student_academic sa ON student_id=sa.student_id where sem=? and sa.did=? and sa.cid=? and academic_year=?
    //    if(did === 6){
    //     mysqlConnection.query(`SELECT  sa.*,si.usn,si.name,sa.id AS sid FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem=? AND sa.did=? AND dv=? AND sa.cid=? AND sa.academic_year=? ORDER BY rno ASC`,[data.sem,data.dept,data.dv,data.cid,data.academic_year], (err,rows) => {
    //         if(!err) {
    //             res.send(rows);

    //         } else {
    //             console.log(err);
    //         }
    //     });
    //    } else {
    //        mysqlConnection.query(`SELECT  sa.*,si.usn,si.name,sa.id AS sid FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem=? AND sa.did=? AND dv=? AND sa.cid=? AND sa.academic_year=? ORDER BY si.usn ASC`,[data.sem,data.dept,data.dv,data.cid,data.academic_year], (err,rows) => {
    //            if(!err) {
    //                res.send(rows);

    //            } else {
    //                console.log(err);
    //            }
    //        });
    //    }

});

app.post('/getsubjectwisebatch', async (req, res) => {
    let data = req.body;
    // let rows = await runQuery(`SELECT * FROM subject WHERE cid='${data.cid}' AND did='${data.did}' AND sem='${data.sem}' AND dv='${data.dv}' AND scode='${data.id}' AND  academic_year='${data.academic_year}' ORDER BY batch`)
    // let option = `<option value ="">Select batch</option>`;
    // for( let index = 0; index < rows.length; index++){
    //                 option += `<option value = "${rows[index].batch} ">${rows[index].batch}</option>`;
    //             }
    //             res.send(option)

    var option = `<option>Select batch</option>`
    //console.log(`SELECT * FROM subject WHERE cid='${data.cid}' AND did='${data.did}' AND sem='${data.sem}' AND dv='${data.dv}' AND scode='${data.id}' AND  academic_year='${data.academic_year}' and batch='${data.batch}' ORDER BY batch`)
    mysqlConnection.query(`SELECT * FROM subject WHERE cid=? AND did=? AND sem=? AND dv=? AND scode=? AND  academic_year=?  ORDER BY batch`, [data.cid, data.dept, data.sem, data.dv, data.id, data.academic_year], (err, rows) => {
        if (!err) {
            for (let index = 0; index < rows.length; index++) {
                option += `<option value = "${rows[index].batch} ">${rows[index].batch}</option>`;
            }
            res.send(option)
        } else {
            console.log(err);
        }
    });
});


app.post('/getstudentidbatch', (req, res) => {
    let data = req.body;
    let studentId = data.student_id;
    let btch = data.batch;
    let added = 0;
    let add = ``;

    mysqlConnection.query(`SELECT * FROM sub_info WHERE  cid=? AND scd=? AND academic_year=? AND dv=? and sem=? and did=?  and student_id=? `, [data.cid, data.scd, data.academic_year, data.dv, data.sem, data.did, studentId], async (err, rows) => {
        if (!err) {
            let studnetDetails = rows[0];
            if (studnetDetails != null) {
                if (studnetDetails.batch != btch) {
                    //console.log(`UPDATE sub_info SET batch='${btch}' WHERE college='${studnetDetails.college}' AND student_id='${studnetDetails.student_id}' AND scd='${studnetDetails.scd}' AND sem='${studnetDetails.sem}' AND dept='${studnetDetails.dept}' AND academic_year='${studnetDetails.academic_year}' AND dv='${studnetDetails.dv}'`)
                    let row1 = await promisePool.query(`UPDATE sub_info SET batch='${btch}' WHERE college='${studnetDetails.college}' AND student_id='${studnetDetails.student_id}' AND scd='${studnetDetails.scd}' AND sem='${studnetDetails.sem}' AND dept='${studnetDetails.dept}' AND academic_year='${studnetDetails.academic_year}' AND dv='${studnetDetails.dv}'`)
                    added++;
                    add = '1'
                }
            }
            res.send(add);
        } else {
            console.log(err);
        }
    });

});

app.post('/getDbAcademicYear', (req, res) => {
    let data = req.body;
    mysqlConnection.query(`SELECT MAX(academic_year) AS academicYear FROM academic_year WHERE cid=?`, [data.cid], (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    });
})


/*app.post('/getstudentsid', (req,res) => {
    let data = req.body;
    mysqlConnection.query(`select student_id  from sub_info where academic_year=? and cid=? and did=? and sem=? GROUP BY student_id`, [data.academic_year,data.cid,data.dept,data.sem], (err,rows) => {
       if(!err) {
           res.send(rows);
       } else {
           console.log(err);
       }
    });
});*/

app.post('/getinternal', (req, res) => {
    let data = req.body;
    //console.log(`SELECT internal from nba_question where cid='${data.cid}' GROUP BY internal`)
    mysqlConnection.query('SELECT internal from nba_question where cid=? GROUP BY internal', [data.cid], (err, rows) => {
        if (!err) {
            let option = `<option value= "" >Select Internals</option>`;
            for (let index = 0; index < rows.length; index++) {
                option += `<option value="${rows[index].internal}">${rows[index].internal}</option>`
            }
            res.send(option);
        } else {
            console.log(err);
        }
    });
    //connection.end();
});

app.post('/getstudentlist3', (req, res) => {
    let data = req.body;

    mysqlConnection.query(`SELECT  s.student_id,si.usn,si.name from sub_info s INNER JOIN student_info si ON s.student_id= si.student_id where s.did=? and s.sem=? and s.academic_year=? group by s.student_id `, [data.did, data.sem, data.academic_year], async (err, rows) => {
        if (!err) {
            let tbody = '';
            let thead = '';
            let subjectDetails = rows;

            for (let j = 0; j < subjectDetails.length; j++) {
                const studentlist = subjectDetails[j];
                tbody += `<tr>
                <td>${j + 1}</td>
                <td>${studentlist.usn}</td>
                <td class="text-lowercase">${studentlist.name}</td>
                <td></td>
                <td></td>
               <td></td>
                <tr>`
            }
            let getsubjects = await promisePool.query(`SELECT  * from subject_pre where did='${data.did}' and sem='${data.sem}'  and academic_year='${data.academic_year}' and stype='theory'`)

            for (let i = 0; i < getsubjects[0].length; i++) {
                const subjects = getsubjects[0][i];
                thead += ` <th>${subjects.sname}<br/>(${subjects.scode})</th>`;

                let fids = await promisePool.query(`SELECT * from subject where sem='${subjects.sem}' and did='${subjects.did}' and dv='${subjects.dv}' and academic_year='${subjects.academic_year}' and scode='${subjects.scode}'`)
                for (let j = 0; j < fids[0].length; j++) {
                    const element = fids[0][j];
                    let qusetion = await promisePool.query(`SELECT * FROM nba_question WHERE fid='${element.fid}' AND scode='${element.scode}' AND internal='${data.ia}' AND dv='${element.dv}' AND did='${element.did}' ORDER BY id ASC`)
                }
            }

            let table = `<table class="table table-bordered text-center">
            <thead class="thead-dark">
            <tr class="text-Uppercase">
                <th>sl no</th>
                <th>Usn</th>
                <th>Name</th>
                <th>${thead}</th>
                </tr>
                
            </thead>
            <tbody>
                 ${tbody} 
            </tbody>
        </table>`;

            res.send(table);

        } else {
            console.log(err);
        }

    });
});

app.post('/subjectgenerate', async (req, res) => {
    let data = req.body;
    let cid = data.cid;
    let dv = data.dv;
    let cid1 = '';
    let added = ``;

    if (cid == 4 || cid == 8 || cid == 9) {
        cid1 = 0;
    } else {
        cid1 = cid
    }
    let cy = ``;

    //cy = substr(dv, 0, 1);
    cy = dv.substring(0, 4);
    // console.log(cy)
    let sql = ``;
    if (cid == 1 || cid == 3 || cid == 6 || cid == 5) {
        if (cid == 1) {
            if (data.sem > 2) {
                sql = `SELECT a.id,a.scode,a.sname,a.dept,a.did,a.college,a.cid,a.academic_year,a.scheme,a.stype,a.sem,a.punit,a.typ,a.academic_type,(select count(id) from student_academic where  sem=a.sem and did=a.did AND academic_year=a.academic_year and dv='${dv}') as sstr,
               if(stype='lab',(select lab_batch from sal_workload where cid='${cid}' and sstr BETWEEN smini and smax ),'1') as lab_batch
               FROM subject_pre a where academic_year='${data.academic_year}'and did='${data.did}' and cid='${cid}' and sem='${data.sem}' order by sem,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`;
            } else {
                sql = `SELECT a.id,a.scode,a.sname,a.dept,a.did,a.college,a.cid,a.academic_year,a.scheme,a.stype,a.sem,a.punit,a.typ,a.academic_type,(select count(id) from student_academic where  sem=a.sem and did=a.did AND academic_year=a.academic_year and dv='${dv}') as sstr,
               if(stype='lab',(select lab_batch from sal_workload where cid='${cid}' and sstr BETWEEN smini and smax),'1') as lab_batch
               FROM subject_pre a where academic_year='${data.academic_year}'and did='${data.did}' and dv='${cy}'  and sem='${data.sem}' order by sem,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`;
            }
        } else {
            sql = `SELECT a.id,a.scode,a.sname,a.dept,a.did,a.college,a.cid,a.academic_year,a.scheme,a.stype,a.sem,a.punit,a.typ,a.academic_type,(select count(id) from student_academic where  sem=a.sem and did=a.did AND academic_year=a.academic_year and dv='${dv}' and student_id in 
           (SELECT student_id from student_info WHERE did=a.did and academic_type= a.academic_type )) as sstr,
           if(stype='lab',(select lab_batch from sal_workload where cid='${cid}' and sstr BETWEEN smini and smax ),'1') as lab_batch
           FROM subject_pre a where academic_year='${data.academic_year}'and did='${data.did}' and cid='${cid}' and sem='${data.sem}' order by sem,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`;
        }
    } else {
        sql = `SELECT a.id,a.scode,a.sname,a.dept,a.did,a.college,a.cid,a.academic_year,a.scheme,a.stype,a.sem,a.punit,a.typ,a.academic_type,(select count(id) from student_academic where  sem=a.sem and did=a.did AND academic_year=a.academic_year and dv='${dv}') as sstr,
    if(stype='lab',(select lab_batch from sal_workload where cid='${cid}' and sstr BETWEEN smini and smax ),'1') as lab_batch
    FROM subject_pre a where academic_year='${data.academic_year}'and did='${data.did}' and cid='${cid}' and sem='${data.sem}' order by sem,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`;
    }

    let q1 = await promisePool.query(sql);
    let icnt = 1;
    let ncnt = 1;
    for (let i = 0; i < q1[0].length; i++) {
        const r = q1[0][i];


        let sub_id = r['id'];
        let scode = r['scode'];
        let sname = r['sname'];
        let dept = r['dept']
        let lab_batch = r['lab_batch'];
        let stype = r['stype'];
        let sem = r['sem'];
        let did = r['did']
        let ayear = r['academic_year']
        let academic_type = r['academic_type']
        let cid = r['cid'];
        let typ = r['typ'];
        let punit = r['punit'];
        let sche = r['scheme']
        let college = r['college']
        let cnt = 1;


        while (lab_batch >= cnt) {
            let batch = ``;
            if (stype == 'Lab') {
                batch = 'b'.cnt;
            } else {
                batch = '';
            }

            let q2 = await promisePool.query(`select * from subject where scode='${scode}' and sem='${sem}' and dv='${dv}' and batch='${batch}' and did='${did}' and academic_year='${ayear}' and cid='${cid}' and typ='${typ}'`)
            //console.log(q2[0] > '')
            if (q2[0] > '') {
                console.log('failed')
                added = '1';
                ncnt++;
            } else {
                console.log('successfull')
                let q3 = await promisePool.query(`INSERT INTO subject (sub_id, scode, sname, dept, did, sem, dv ,batch, academic_year, punit, scheme, pre_date, college, cid, stype, typ, academic_type)  VALUES ('${sub_id}','${scode}','${sname}','${dept}','${did}','${sem}','${dv}','${batch}','${ayear}','${punit}','${sche}',now(),'${college}','${cid}','${stype}','${typ}','${academic_type}')`)
                icnt++;
                added = '2';
            }
            cnt++;
        }
    }
    let msg = '';
    if (icnt == 1 && ncnt != 1) {
        msg = 'No New Record Added';
    } else {
        msg = 'New Record Added';
    }
    res.send(added)
});


app.post('/getSemNew', (req, res) => {
    let deptid = req.body.did;
    let cllgid = req.body.cid;
    let option = `<option value=""> Select Sem</option>`;

    if (cllgid == 1) {
        if (deptid == 6) {
            //for basic science
            for (let i = 1; i <= 2; i++) {
                option += `<option value="${i}">${i}</option>`;
            }
        } else if (deptid == 7 || deptid == 19 || deptid == 20 || deptid == 21 || deptid == 82 || deptid == 83 || deptid == 84 || deptid == 85) {
            //for PG Departments
            for (let i = 1; i <= 4; i++) {
                option += `<option value="${i}">${i}</option>`;
            }
        } else {
            //for UG and Other Departments
            for (let i = 3; i <= 8; i++) {
                option += `<option value="${i}">${i}</option>`;
            }
        }
    } else if (cllgid == 6) {
        for (let i = 1; i <= 10; i++) {
            option += `<option value="${i}">${i}</option>`;
        }
    } else if (cllgid == 3 || cllgid == 4 || cllgid == 5) {
        for (let i = 1; i <= 6; i++) {
            option += `<option value="${i}">${i}</option>`;
        }
    } else if (cllgid == 8 || cllgid == 9 || cllgid == 34) {
        for (let i = 1; i <= 2; i++) {
            option += `<option value="${i}">${i}</option>`;
        }
    }
    res.send(option)
})

//app.post('/getsemesterwisesubjtable', getsemesterwisesub);

//app.post('/freezeSubject', freezeSubject);

app.post('/eventList', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT id,title,start,end,did, (SELECT name FROM dept WHERE id=c.did) as dept FROM calendar_events as c WHERE academic_year='${data.academic_year}' AND year='${data.year}' AND sem='${data.semtype}'`)
    res.send(rows);
    // mysqlConnection.query('SELECT id,title,start,end,did, (SELECT name FROM `dept` WHERE id=c.did) as dept FROM calendar_events as c WHERE academic_year=? AND year=? AND sem=?' ,  [data.academic_year, data.year, data.semtype], (err, rows, fields) => {
    //     if (!err)
    //         res.send(rows);  
    //     else 
    //         console.log(err);
    // })
});

app.post('/eventdetail', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT id,title,descp,start,end,etype FROM calendar_events WHERE id='${data.id}'`)
    res.send(rows);
    // mysqlConnection.query('SELECT id,title,descp,start,end,etype FROM calendar_events WHERE id=?' ,  [data.id], (err, rows, fields) => {
    //     if (!err)
    //         res.send(rows);  
    //     else 
    //         console.log(err);
    // })
});

app.post('/update', (req, res) => {
    let data = req.body;
    mysqlConnection.query('UPDATE calendar_events SET title=?, descp=?, start=?, end=?, etype=? WHERE id=?', [data.title, data.desc, data.start, data.end, data.etype, data.id], (err, rows, fields) => {
        if (!err)
            res.send("1");
        else
            console.log(err);
    })
});

app.post('/addlsnpln', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`INSERT into tlsnpln (fid,fname,scode,sname,sem,dv,dept,did,planned_date,tdate,mdno,topicd,sub_topic,teaching_methods,teaching_aids,assignment_tool,status,class_id,hod,vp,date,academic_year) values ('${data.fid}','${data.fname}','${data.scode}','${data.sname}','${data.sem}','${data.dv}','${data.dept}','${data.did}','${data.planned_date}','${data.tdate}','${data.mdno}','${data.topicd}','${data.sub_topic}','${data.teaching_methods}','${data.teaching_aids}','${data.assignment_tool}','${data.status}','${data.class_id}','${data.hod}','${data.vp}','${data.date}','${data.academic_year}')`);
    if (rows.affectedRows > 0) {
        res.send('1');
    } else
        console.log(err);
    // mysqlConnection.query('INSERT into tlsnpln (fid,fname,scode,sname,sem,dv,dept,did,planned_date,tdate,mdno,topicd,sub_topic,teaching_methods,teaching_aids,assignment_tool,status,class_id,hod,vp,date,academic_year) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',  [data.fid, data.fname, data.scode, data.sname, data.sem, data.dv, data.dept, data.did, data.planned_date, data.tdate, data.mdno, data.topicd, data.sub_topic, data.teaching_methods, data.teaching_aids, data.assignment_tool, data.status, data.class_id, data.hod, data.vp, data.date, data.academic_year ], (err, rows) => {
    //     if (!err)
    //         res.send('1');
    //     else
    //         console.log(err);
    // })
});

app.post('/addlablsnpln', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`INSERT into tlsnpln_lab (fid,fname,scode,sname,sem,dv,batch,dept,did,planned_date,academic_year,experiment,exp_no,status,class_id) values ('${data.fid}','${data.fname}','${data.scode}','${data.sname}','${data.sem}','${data.dv}','${data.batch}','${data.dept}','${data.did}','${data.planned_date}','${data.academic_year}','${data.exp}','${data.expno}','${data.status}','${data.class_id}')`);
    if (rows.affectedRows > 0) {
        res.send('1');
    } else
        console.log(err);
    //    mysqlConnection.query('INSERT into tlsnpln_lab (fid,fname,scode,sname,sem,dv,batch,dept,did,planned_date,academic_year,experiment,exp_no,status,class_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',  [data.fid, data.fname, data.scode, data.sname, data.sem, data.dv, data.batch, data.dept, data.did, data.planned_date, data.academic_year, data.exp, data.expno, data.status, data.class_id ], (err, rows) => {
    //         if (!err)
    //             res.send('1');
    //         else
    //             console.log(err);
    //     })
});

app.post('/getcurrentacademicyear', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT max(academic_year) as academic_year from academic_year where cid='${data.cid}' `);
    res.send(rows);
    // mysqlConnection.query('SELECT max(academic_year) as academic_year from academic_year where cid=?', [data.cid], (err, rows, fields) => {
    //     if (!err) {
    //         res.send(rows);
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getmoduleoption', async (req, res) => {
    let data = req.body;
    var option = `<option value="">Select Module No</option>`;

    if (data.subject != '') {
        let rows = await runQuery(`SELECT scode,dv FROM subject s WHERE id='${data.subject}' `);

        if (rows.length > 0) {
            let subjectDetails = rows[0];
            // console.log(`SELECT mdno from tlsnpln where fid='${data.fid}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND academic_year='${data.academicYear}' GROUP BY mdno`);
            let rows1 = await runQuery(`SELECT mdno from tlsnpln where fid='${data.fid}' AND scode='${subjectDetails.scode}' AND dv='${subjectDetails.dv}' AND academic_year='${data.academicYear}' GROUP BY mdno `);
            //console.log(rows1.length);
            if (rows1.length > 0) {
                for (let index = 0; index < rows1.length; index++) {
                    option += `<option value="${rows1[index].mdno}">${rows1[index].mdno}</option>`;

                }
                option += '<option value="all">All</option>';
                res.send(option);
            } else {
                console.log(err);
            }
        }
        else {
            console.log(err);
        }
    }
    //     var option = `<option value="">Select Module No</option>`;
    //  //   let query = await promisePool.query("Select scode,dv from subject where id='${data.subject}'")
    //  //   let scode = query['scode'];
    //   //  let dv = query['dv'];   
    //   if(data.subject!=''){
    //   mysqlConnection.query('SELECT scode,dv FROM `subject` s WHERE id=?', [data.subject], (err, row, fields) => {
    //     if (!err) {
    //         let subjectDetails = row[0];

    //     mysqlConnection.query('SELECT mdno from tlsnpln where fid=? AND scode=? AND dv=? AND academic_year=? GROUP BY mdno', [data.fid, subjectDetails.scode, subjectDetails.dv, data.academicYear], (err, rows, fields) => {
    //         if (!err) {
    //             for (let index = 0; index < rows.length; index++) {
    //                 option += `<option value="${rows[index].mdno}">${rows[index].mdno}</option>`;

    //             }
    //             option +='<option value="all">All</option>';
    //             res.send(option);
    //         } else {
    //             console.log(err);
    //         }

    //     })
    // }
    // else {
    //     console.log(err);
    // }

    // })
    // }

});

app.post('/getlsnplndetails', async (req, res) => {
    let data = req.body;
    let mdno = data.mdno;

    if (data.subject != '') {

        let rows = await runQuery(`SELECT scode,dv,did FROM subject s WHERE id='${data.subject}' `);
        if (rows.length > 0) {
            let subjectDetails = rows[0];
            if (mdno == 'all') {

                let rows1 = await runQuery(`SELECT planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids, (select date from class  where lp_id=t.id and status='completed' )as delivered_date from tlsnpln as t where fid='${data.fid}' and did='${subjectDetails.did}' and scode='${subjectDetails.scode}' and dv='${subjectDetails.dv}' and academic_year='${data.academic_year}' Order By mdno `);
                if (rows1.length > 0) {
                    res.send(rows1);
                } else {
                    console.log(err);
                }

            } else {

                let rows2 = await runQuery(`SELECT id,planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids, (select date from class  where lp_id=t.id and status='completed' )as delivered_date from tlsnpln as t where fid='${data.fid}' and did='${subjectDetails.did}' and mdno='${mdno}' and scode='${subjectDetails.scode}' and dv='${subjectDetails.dv}' and academic_year='${data.academic_year}' `);
                if (rows2.length > 0) {
                    res.send(rows2);
                } else {
                    console.log(err);
                }

            }
        }
        else {
            console.log(err);
        }

    }

    //     if(data.subject!=''){
    //     mysqlConnection.query('SELECT scode,dv,did FROM `subject` s WHERE id=?', [data.subject], (err, row, fields) => {
    //         if (!err) {
    //     let subjectDetails = row[0];
    //     if(mdno == 'all'){
    //     mysqlConnection.query('SELECT planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids, (select date from class  where lp_id=t.id and status=? )as delivered_date from tlsnpln where fid=? and did=? and scode=? and dv=? and academic_year=? Order By mdno', ['completed', data.fid, subjectDetails.did, subjectDetails.scode, subjectDetails.dv, data.academic_year], (err, rows, fields) => {
    //         if (!err) {
    //             res.send(rows);
    //         } else {
    //             console.log(err);
    //         }
    //     })
    // } else{
    //     mysqlConnection.query('SELECT id,planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids, (select date from class  where lp_id=t.id and status=? )as delivered_date from tlsnpln where fid=? and did=? and mdno=? and scode=? and dv=? and academic_year=?', ['completed', data.fid, subjectDetails.did, mdno, subjectDetails.scode, subjectDetails.dv, data.academic_year], (err, rows, fields) => {
    //         if (!err) {
    //             res.send(rows);
    //         } else {
    //             console.log(err);
    //         }
    //     })
    // }
    // }
    // else {
    //     console.log(err);
    // }
    // })
    // }
});

app.post('/getlablsnplndetails', async (req, res) => {
    let data = req.body;

    if (data.subject != '') {

        let rows = await runQuery(`SELECT scode,dv,did,batch FROM subject s WHERE id='${data.subject}' `);
        if (rows.length > 0) {
            let subjectDetails = rows[0];


            let rows1 = await runQuery(`SELECT id,planned_date,experiment,exp_no, (select date from class  where lp_id=t.id and status='completed' )as delivered_date from tlsnpln_lab as t where fid='${data.fid}' and did='${subjectDetails.did}' and scode='${subjectDetails.scode}' and dv='${subjectDetails.dv}' and batch='${subjectDetails.batch}' and academic_year='${data.academic_year}' Order By exp_no `);
            if (rows1.length > 0) {
                res.send(rows1);
            } else {
                console.log(err);
            }


        }
        else {
            console.log(err);
        }

    }

    //     if(data.subject!=''){
    //     mysqlConnection.query('SELECT scode,dv,did,batch FROM `subject` s WHERE id=?', [data.subject], (err, row, fields) => {
    //         if (!err) {
    //     let subjectDetails = row[0];

    //     mysqlConnection.query('SELECT id,planned_date,experiment,exp_no, (select date from class  where lp_id=t.id and status=? )as delivered_date from tlsnpln_lab as t where fid=? and did=? and scode=? and dv=? and batch=? and academic_year=? Order By exp_no', ['completed', data.fid, subjectDetails.did, subjectDetails.scode, subjectDetails.dv, subjectDetails.batch, data.academic_year], (err, rows, fields) => {
    //         if (!err) {
    //             res.send(rows);
    //         } else {
    //             console.log(err);
    //         }
    //     })

    // }
    // else {
    //     console.log(err);
    // }
    // })
    // }
});

app.post('/deletelablsnpln', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`DELETE from tlsnpln_lab where id='${data.id}' `);

    if (rows.affectedRows > 0) {
        res.send('1');
    } else {
        console.log(err);
    }

    // mysqlConnection.query('DELETE from tlsnpln_lab where id=?', [data.id], (err, rows, fields) => {
    //     if (!err) {
    //         res.send('1');
    //     } else {
    //         console.log(err);
    //     }
    // });

});

app.post('/deletelsnpln', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`DELETE from tlsnpln where id='${data.id}' `);

    if (rows.affectedRows > 0) {
        res.send('1');
    } else {
        console.log(err);
    }

    // mysqlConnection.query('DELETE from tlsnpln where id=?', [data.id], (err, rows, fields) => {
    //     if (!err) {
    //         res.send('1');
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/deleteevent', async (req, res) => {
    let data = req.body;

    let rows = await runQuery(`DELETE from calendar_events where id='${data.id}' `);
    if (rows.affectedRows > 0) {
        res.send('1');
    } else {
        console.log(err);
    }

    // mysqlConnection.query('DELETE from calendar_events where id=?', [data.id], (err, rows, fields) => {
    //     if (!err) {
    //         res.send('1');
    //     } else {
    //         console.log(err);
    //     }
    // })
});

app.post('/lsnplndetail', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT id,planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids FROM tlsnpln WHERE id='${data.id}' `);
    res.send(rows);
    // mysqlConnection.query('SELECT id,planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids FROM tlsnpln WHERE id=?' ,  [data.id], (err, rows, fields) => {
    //     if (!err)
    //         res.send(rows);  
    //     else 
    //         console.log(err);
    // })
});

app.post('/lablsnplndetail', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`SELECT id,planned_date,experiment FROM tlsnpln_lab WHERE id='${data.id}' `);
    res.send(rows);
    // mysqlConnection.query('SELECT id,planned_date,experiment FROM tlsnpln_lab WHERE id=?' ,  [data.id], (err, rows, fields) => {
    //     if (!err)
    //         res.send(rows);  
    //     else 
    //         console.log(err);
    // }) 
});

app.post('/getcovsyl', async (req, res) => {
    let data = req.body;

    if (data.subject != '') {

        let rows = await runQuery(`SELECT scode,dv,did FROM subject s WHERE id='${data.subject}' `)
        if (rows.length > 0) {
            let subjectDetails = rows[0];


            let rows1 = await runQuery(`SELECT id,planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids, (select date from class  where lp_id=t.id and status='completed' )as delivered_date from tlsnpln as t where fid='${data.fid}' and did='${subjectDetails.did}' and scode='${subjectDetails.scode}' and dv='${subjectDetails.dv}' and academic_year='${data.academic_year}' and status='completed' Order By mdno,planned_date `)

            if (rows1.length > 0) {
                res.send(rows1);
            } else {
                console.log(err);
            }


        }
        else {
            console.log(err);
        }

    }

    //     if(data.subject!=''){
    //     mysqlConnection.query('SELECT scode,dv,did FROM `subject` s WHERE id=?', [data.subject], (err, row, fields) => {
    //         if (!err) {
    //     let subjectDetails = row[0];

    //     mysqlConnection.query('SELECT id,planned_date,mdno,topicd,sub_topic,teaching_methods,teaching_aids, (select date from class  where lp_id=t.id and status=? )as delivered_date from tlsnpln as t where fid=? and did=? and scode=? and dv=? and academic_year=? and status=? Order By mdno,planned_date', ['completed,',  data.fid, subjectDetails.did, subjectDetails.scode, subjectDetails.dv, data.academic_year, 'completed'], (err, rows, fields) => {

    //         if (!err) {
    //             res.send(rows);
    //         } else {
    //             console.log(err);
    //         }
    //     })

    // }
    // else {
    //     console.log(err);
    // }
    // })
    // }
});

app.post('/updlsnpln', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`UPDATE tlsnpln SET planned_date='${data.planned_date}', mdno='${data.mdno}', topicd='${data.topicd}', sub_topic='${data.sub_topic}', teaching_methods='${data.tmethod}', teaching_aids='${data.taids}' WHERE id='${data.id}' `)
    if (rows.affectedRows > 0) {
        res.send("1");
    }
    else
        console.log(err);
    // mysqlConnection.query('UPDATE tlsnpln SET planned_date=?, mdno=?, topicd=?, sub_topic=?, teaching_methods=?, teaching_aids=? WHERE id=?' ,  [data.planned_date, data.mdno, data.topicd, data.sub_topic, data.tmethod, data.taids, data.id], (err, rows, fields) => {
    //     if (!err)
    //         res.send("1");  
    //     else 
    //         console.log(err);
    // })
});

app.post('/updlablsnpln', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`UPDATE tlsnpln_lab SET planned_date='${data.planned_date}', experiment='${data.exp}' WHERE id='${data.id}' `)
    if (rows.affectedRows > 0) {
        res.send("1");
    }
    else
        console.log(err);

    // mysqlConnection.query('UPDATE tlsnpln_lab SET planned_date=?, experiment=? WHERE id=?',  [data.planned_date, data.exp, data.id], (err, rows, fields) => {
    //     if (!err)
    //         res.send("1");  
    //     else 
    //         console.log(err);
    // })
});

app.post('/getcooption', async (req, res) => {
    let data = req.body;
    var option = `<option value="">Select Co</option>`;

    if (data.subject != '') {

        let rows = await runQuery(`SELECT scode,dv FROM subject s WHERE id='${data.subject}' `)
        if (rows.length > 0) {
            let subjectDetails = rows[0];



            let rows1 = await runQuery(`SELECT id,cos FROM nba_co WHERE fid='${data.fid}' AND scode='${subjectDetails.scode}' AND academic_year='${data.academicYear}' AND hod='1' `)
            if (rows1.length > 0) {
                for (let index = 0; index < rows1.length; index++) {
                    option += `<option value="${rows1[index].id}">${rows1[index].cos}</option>`;

                }

                res.send(option);
            } else {
                console.log(err);
            }


        }
        else {
            console.log(err);
        }

    }

    //   if(data.subject!=''){
    //   mysqlConnection.query('SELECT scode,dv FROM `subject` s WHERE id=?', [data.subject], (err, row, fields) => {
    //     if (!err) {
    //         let subjectDetails = row[0];

    //     mysqlConnection.query('SELECT id,cos FROM `nba_co` WHERE fid=? AND scode=? AND academic_year=? AND hod=?', [data.fid, subjectDetails.scode, data.academicYear, '1'], (err, rows, fields) => {
    //         if (!err) {
    //             for (let index = 0; index < rows.length; index++) {
    //                 option += `<option value="${rows[index].id}">${rows[index].cos}</option>`;

    //             }

    //             res.send(option);
    //         } else {
    //             console.log(err);
    //         }

    //     })
    // }
    // else {
    //     console.log(err);
    // }

    // })
    // }

});

app.post('/getcloption', async (req, res) => {
    let data = req.body;
    var option = `<option value="">Select CL</option>`;

    let rows = await runQuery(`SELECT id,colevel FROM nba_co_level WHERE cid='${data.cid}' AND status='1' `)
    if (rows.length > 0) {
        for (let index = 0; index < rows.length; index++) {

            option += `<option value="${rows[index].id}">${rows[index].colevel}</option>`;

        }

        res.send(option);
    } else {
        console.log(err);
    }




    // mysqlConnection.query('SELECT id,colevel FROM `nba_co_level` WHERE cid=? AND status=?', [data.cid, '1'], (err, rows, fields) => {
    //     if (!err) {
    //         for (let index = 0; index < rows.length; index++) {

    //             option += `<option value="${rows[index].id}">${rows[index].colevel}</option>`;

    //         }

    //         res.send(option);
    //     } else {
    //         console.log(err);
    //     }

    // })
});

app.post('/addlsnpln', async (req, res) => {
    let data = req.body;
    let rows = await runQuery(`INSERT into tlsnpln (fid,fname,scode,sname,sem,dv,dept,did,planned_date,tdate,mdno,topicd,sub_topic,teaching_methods,teaching_aids,assignment_tool,status,class_id,hod,vp,date,academic_year) values ('${data.fid}','${data.fname}','${data.scode}','${data.sname}','${data.sem}','${data.dv}','${data.dept}','${data.did}','${data.planned_date}','${data.tdate}','${data.mdno}','${data.topicd}','${data.sub_topic}','${data.teaching_methods}','${data.teaching_aids}','${data.assignment_tool}','${data.status}','${data.class_id}','${data.hod}','${data.vp}','${data.date}','${data.academic_year}') `)
    if (rows.affectedRows > 0)
        res.send('1');
    else
        console.log(err);
    // mysqlConnection.query('INSERT into tlsnpln (fid,fname,scode,sname,sem,dv,dept,did,planned_date,tdate,mdno,topicd,sub_topic,teaching_methods,teaching_aids,assignment_tool,status,class_id,hod,vp,date,academic_year) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',  [data.fid, data.fname, data.scode, data.sname, data.sem, data.dv, data.dept, data.did, data.planned_date, data.tdate, data.mdno, data.topicd, data.sub_topic, data.teaching_methods, data.teaching_aids, data.assignment_tool, data.status, data.class_id, data.hod, data.vp, data.date, data.academic_year ], (err, rows) => {
    //     if (!err)
    //         res.send('1');
    //     else
    //         console.log(err);
    // })
});

app.post('/addsque', (req, res) => {
    let data = req.body;

    mysqlConnection.query('INSERT into nba_question (fid,exm_date,cid,did,dv,sem,scode,internal,qno,quest,marks,max_marks,cos,co_id,colevel,academic_year,status) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.fid, data.exm_date, data.cid, data.did, data.dv, data.sem, data.scode, data.internal, data.qno, data.quest, data.marks, data.max_marks, data.cos, data.co_id, data.colevel, data.academic_year, data.status], (err, rows) => {
        if (!err)
            res.send('1');
        else
            console.log(err);
    })
});

app.post('/addheaders', (req, res) => {
    let data = req.body;
    mysqlConnection.query('INSERT into fees_head (head_name,cid,academic_year,year) values (?,?,?,?)', [data.head_name, data.cid, data.academic_year, data.year], (err, rows) => {
        if (!err)
            res.send('1');
        else
            console.log(err);
    })
});

app.post('/getheadersdetails', (req, res) => {
    let data = req.body;
    mysqlConnection.query('SELECT id,head_name from fees_head WHERE cid=?', [data.cid], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.post('/headerdetail', (req, res) => {
    let data = req.body;
    mysqlConnection.query('SELECT head_name from fees_head WHERE id=?', [data.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.post('/headerdelete', (req, res) => {
    let data = req.body;
    mysqlConnection.query('DELETE from fees_head WHERE id=?', [data.id], (err, rows, fields) => {
        if (!err)
            res.send('1');
        else
            console.log(err);
    })
});

app.post('/updateheader', (req, res) => {
    let data = req.body;
    mysqlConnection.query('UPDATE fees_head set head_name=? WHERE id=?', [data.perticular, data.id], (err, rows, fields) => {
        if (!err)
            res.send('1');
        else
            console.log(err);
    })
});

// app.post('/getfeedetails', (req, res) => {
//     let data = req.body;
//     let result = ``;
//     let total_fix; 
//     let total_pay;  
//     let fee_paid;  
//     let   rows=await db.query(`select * from fee_fixation where student_id='${data.usn}' group by year order by year `)
//     let array1 = [];
app.post('/getfeedetails', async (req, res) => {
    let data = req.body;
    let result = ``;
    let total_fix;
    let total_pay;
    let fee_paid;
    let rows = await db.query(`select * from fee_fixation where student_id='${data.usn}' group by year order by year `)
    let array1 = [];

    //     for(let index=0; index<rows.length; index++){  
    //      // array1 = {'year':rows[index].year};
    //     //  console.log('nn'+array1);

    //     let year = rows[index].year;
    //     let   res=await db.query(`select *, (select sum(fee) from fee_fixation where student_id='${data.usn}' and year='${year}')as total_fix_fee, (select sum(paid_fee) from fee_transaction where student_id='${data.usn}' and year='${year}')as total_paid_fee, (select distinct student_id from fee_transaction where student_id='${data.usn}' and year='${year}')as pay  from fee_fixation as f where student_id='${data.usn}' and year='${year}' `)
    //      result += ` <tr>
    //       <td rowspan='${res.length+1}'>${year}</td>`;

    //          for(let i=0; i<res.length; i++){           
    //           array1[year]=res[i];
    //           if(!res[i].pay){
    //           fee_paid = 0;
    //           }else{
    //           let pay_fee = await db.query(`select  sum(paid_fee) as fee_paid from fee_transaction where student_id='${data.usn}' and year='${res[i].year}' and header_name='${res[i].header_name}'  `);
    //           const element = pay_fee[index];
    //           fee_paid = element.fee_paid;
    //          // array1[year][i].total_paid_fee=element.fee_paid;
    //          console.log(array1[year][i]);
    //           }
    //           result += `   
    //                      <td>${res[i].header_name}</td>
    //                       <td>${res[i].fee}</td>
    //                       <td>${fee_paid}</td>
    //                       <td>${res[i].fee - fee_paid}</td>`;
    //                       // <td>${res[i].fee - fee_paid === 0? '<center><strong style="color:green">FEE PAID</strong></center>' :'<input type="text" style="width:30%;float:left" class="form-control" name="recno[]" id="recno" placeholder="Receipt no"><input type="date" style="width:30%;float:left" id="pdate" name="pdate[]" class="form-control"><input type="number" style="width:30%;" class="form-control" name="amount[]" id="amount" placeholder="Enter Amount">'}</td>
    //                        result += ` <td>
    //                        ${res[i].fee - fee_paid === 0? '<center><strong style="color:green">FEE PAID</strong></center>' :`<Link to='/addfee' className='btn btn-primary'> Pay </Link>`}
    //                        </td>
    //                        </tr>`;
    //                       total_fix = res[i].total_fix_fee;
    //                       total_pay = res[i].total_paid_fee;
    //          } 
    //          if(!total_pay){
    //            total_pay=0;
    //          }
    //          result +=`<tr>
    //                   <td>Total</td>
    //                   <td>${total_fix}</td>
    //                   <td>${total_pay}</td>
    //                   <td>${total_fix - total_pay}</td>
    //                   <td></td>
    //                   </tr><br/>`;       
    //         // result +=`<tr><td class='text-center' colspan='6' ><button class='btn btn-primary' onClick={add()} >Submit </button></td></tr>`
    // }   
    // //console.log(array1);
    //             res.send(result);  
    //           //  console.log(result) ;   

});

app.post('/gettransactiondetails', (req, res) => {
    let data = req.body;
    mysqlConnection.query('select * from fee_transaction where student_id=? and update_status=? order by year,date', [data.usn, '0'], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        //res.send([rows,resu]); 
        // res.send([rows,res]); 
        else
            console.log(err);
    })
});

app.post('/gethistory', (req, res) => {
    let data = req.body;
    mysqlConnection.query('select * from fee_transaction where student_id=? and update_status=? order by year', [data.usn, '1'], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        //res.send([rows,resu]); 
        // res.send([rows,res]); 
        else
            console.log(err);
    })
});

app.post('/gettransaction', (req, res) => {
    let data = req.body;
    mysqlConnection.query('select * from fee_transaction where id=? ', [data.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        //res.send([rows,resu]); 
        // res.send([rows,res]); 
        else
            console.log(err);
    })
});

app.post('/updatetransaction', (req, res) => {
    let data = req.body;
    mysqlConnection.query('UPDATE fee_transaction set paid_fee=? where id=? ', [data.payf, data.id], (err, rows, fields) => {
        if (!err) {
            mysqlConnection.query('INSERT into fee_transaction (cid,did,student_id,receipt_no,header_name,paid_fee,total,year,date,Description,file,update_status) values (?,?,?,?,?,?,?,?,?,?,?,?)', [data.cid, data.did, data.student_id, data.receipt_no, data.header_name, data.old_payf, data.total, data.year, data.date, data.description, '', data.update_status], (err, rows, fields) => {
                if (!err)
                    res.send('1');
                else
                    console.log(err);
            })
        }
        else
            console.log(err);
    })
});

app.post('/getquesdetails', (req, res) => {
    let data = req.body;
    if (data.subject != '') {
        mysqlConnection.query('SELECT scode,dv FROM `subject` s WHERE id=?', [data.subject], (err, row, fields) => {
            if (!err) {
                let subjectDetails = row[0];
                mysqlConnection.query('select *,(select cos from nba_co where id=n.co_id)as co from nba_question as n where fid=? and scode=? and dv=? and academic_year=? and internal=? ', [data.fid, subjectDetails['scode'], subjectDetails['dv'], data.academic_year, data.internal], (err, rows, fields) => {
                    if (!err)
                        res.send(rows);
                    //res.send([rows,resu]); 
                    // res.send([rows,res]); 

                })
            }
            else
                console.log(err);
        })
    }
});

app.post('/getevents', (req, res) => {
    let data = req.body;
    var option = `<option value="">Select Event Type</option>`;
    mysqlConnection.query('select etype from eventsofcoe where cid=? and role=? ', [data.cid, data.role], (err, rows, fields) => {
        // console.log(rows);
        if (!err) {
            for (let index = 0; index < rows.length; index++) {
                option += `<option value="${rows[index].etype}">${rows[index].etype}</option>`;

            }
            res.send(option);
        }

        else
            console.log(err);
    })
});

app.post('/addeventdetail', (req, res) => {
    let data = req.body;
    // console.log(data);
    mysqlConnection.query('INSERT into calendar_events (title,descp,start,end,etype,sem,year,academic_year,cid,did,status,user_id) values (?,?,?,?,?,?,?,?,?,?,?,?)', [data.title, data.descp, data.start, data.end, data.etype, data.sem, data.year, data.academic_year, data.cid, data.did, data.status, data.user_id], (err, rows) => {
        if (!err)
            res.send('1');
        else
            console.log(err);
    })
});

app.post('/chkevents', (req, res) => {
    let data = req.body;
    console.log(data);
    let did;
    let new1
    let etype;
    let events = ``;
    let result;
    let allevents = "";
    let no = 1;
    if (data.role === 'Principal') {
        did = 'all';
    } else if (data.role === 'HOD') {
        did = data.did;
    }
    mysqlConnection.query(`select etype from eventsofcoe where (cid='${data.cid}' or cid=0) and role='${data.role}' and etype not in(select etype from calendar_events where cid='${data.cid}' and did='${did}' and sem='${data.sem}' and year='${data.year}' and academic_year='${data.academic_year}' and status=1)`, (err, rows) => {
        if (!err) {
            if (rows.length == 0) {
                result = 1;
            } else {
                new1 = "\n";
                for (let index = 0; index < rows.length; index++) {
                    etype = rows[index].etype;
                    events = allevents + etype + new1;
                    allevents = events;
                    no++;
                }
                result = allevents;
            }
            //  console.log(rows.length);
            // console.log(result);

            if (result != 1) {
                res.send(allevents);

            } else {

                mysqlConnection.query(`UPDATE calendar_events set freeze=1 where cid='${data.cid}' and did='${did}' and sem='${data.sem}' and year='${year}' and status=1 and academic_year='${data.academic_yer}'    `, (err, rows) => {
                    if (!err)
                        res.send('1');
                    else
                        console.log(err);
                })

            }

        }
        else {
            console.log(err);
        }
    })
});

app.post('/departmentoption', (req, res) => {
    let data = req.body;
    var option = `<option value="">Select Department</option>`;
    if (data.role == 'HOD') {
        mysqlConnection.query('SELECT id,name FROM `dept` WHERE cid=? AND id=? AND status=?', [data.cid, data.did, '1'], (err, rows, fields) => {
            if (!err) {
                option += `<option value="all">All</option>`;
                for (let index = 0; index < rows.length; index++) {

                    option += `<option value="${rows[index].id}">${rows[index].name}</option>`;

                }

                res.send(option);
            } else {
                console.log(err);
            }

        })

    }
    else if (data.role == 'Principal') {
        mysqlConnection.query('SELECT id,name FROM `dept` WHERE cid=? AND status=?', [data.cid, '1'], (err, rows, fields) => {
            if (!err) {
                option += `<option value="all">All</option>`;
                for (let index = 0; index < rows.length; index++) {

                    option += `<option value="${rows[index].id}">${rows[index].name}</option>`;

                }

                res.send(option);
            } else {
                console.log(err);
            }

        })
    }
});

app.post('/addDivision', async (req, res) => {
    let data = req.body;
    let studentId = data.studentId;
    let student_Id = '';
    var added = 0;
    if (data.dv == null) {
        data.dv = "";
    }
    console.log(data.dv);

    for (let index = 0; index < studentId.length; index++) {
        if (studentId[index] != null) {

            let rows1 = await db.query(`SELECT name,(SELECT COUNT(id)+1 FROM student_info ORDER BY id DESC) as studentCount FROM college WHERE id='${data.cid}'`)
            student_Id = data.academicYear + rows1[0].name + rows1[0].studentCount;
            let rows2 = await db.query(`SELECT *,(SELECT id FROM fee_categories WHERE name=sd.category AND cid=sd.cid ) as categoryId,(SELECT id FROM fee_quota WHERE v_name=sd.quota AND cid=sd.cid) as quotaId,(SELECT name FROM college WHERE id=sd.cid) as collegeName,(SELECT name FROM dept WHERE id=sd.did) as dept FROM student_details sd WHERE id='${studentId[index]}'`)
            let studentDetails = rows2[0];
            if (studentDetails.type == "regular") {
                uni_fee = studentDetails.uni_fee_1;
                tut_fee = studentDetails.tut_fee_1;
                bal = (studentDetails.uni_fee_1 + studentDetails.tut_fee_1);
            } else {
                uni_fee = studentDetails[`uni_fee_${studentDetails.year}`];
                tut_fee = studentDetails[`tut_fee_${studentDetails.year}`];
                bal = studentDetails[`uni_fee_${studentDetails.year}`] + studentDetails[`tut_fee_${studentDetails.year}`];
            }

            let rows3 = await db.query(`INSERT INTO student_info(student_id, name, gender, user_name, college, dept, cid, did, mobile, pmobile, dob, caste, cat_id, email, address, pincode, academic_year) VALUES ('${student_Id}', '${studentDetails.name}', '${studentDetails.gender}', '${studentDetails.name}', '${studentDetails.collegeName}', '${studentDetails.dept}', '${studentDetails.cid}', '${studentDetails.did}', '${studentDetails.st_conctac_no}', '${studentDetails.gaurdian_contact_no}', '${studentDetails.dob}', '${studentDetails.caste}', '${studentDetails.categoryId}', '${studentDetails.email}', '${studentDetails.address}', '${studentDetails.pincode}', '${studentDetails.academic_year}')`)
            if (rows3.affectedRows > 0) {
                let rows4 = await db.query(`INSERT INTO student_academic(student_id, college, cid, did, sem, academic_year,dv) VALUES ('${student_Id}', '${studentDetails.collegeName}', '${studentDetails.cid}', '${studentDetails.did}', '${studentDetails.sem}', '${studentDetails.academic_year}', '${data.dv}')`)
                if (rows4.affectedRows > 0) {
                    let rows5 = await db.query(`INSERT INTO fee_details(student_id,cid, did, cat, quota, acd_year, year, uni_fee, tut_fee, bal, paid_fee, uid, admin, admin1, verify ) VALUES ('${student_Id}', '${studentDetails.cid}', '${studentDetails.did}', '${studentDetails.categoryId}', '${studentDetails.quotaId}', '${studentDetails.academic_year}', '${studentDetails.year}', '${uni_fee}', '${tut_fee}', '${bal}', '0', '${data.uid}', '${studentDetails.registrar}', '${studentDetails.vp_admin}', '1')`)
                    if (rows5.affectedRows > 0) {
                        let rows6 = await db.query(`UPDATE student_details SET student_id='${student_Id}' WHERE id='${studentId[index]}'`)
                        if (rows6.affectedRows > 0) {
                            added++;
                        }
                    }
                }
            }
        }
    }
    res.send(`${added}`)
});

app.post('/getAcademicStudentlis', async (req, res) => {
    let data = req.body;
    let rows = await db.query(`SELECT  sa.*,si.usn,si.name FROM student_academic sa INNER JOIN student_info si ON sa.student_id = si.student_id WHERE sem=? AND sa.did=? AND sa.cid=? AND sa.academic_year=? ORDER BY si.usn ASC`, [data.sem, data.did, data.cid, data.academicYear])
    res.send(rows);

});

app.post('/updateDivision', async (req, res) => {
    let data = req.body;
    let studentId = data.studentId;
    let added = 0;
    for (var i = 0; i < studentId.length; i++) {
        let rows = await db.query(`UPDATE student_academic SET dv='${data.dv}' and id='${studentId[i]}'`)
        if (rows.affectedRows > 0) {
            added++;
        }
    }
    res.send(`${added}`);

});

app.post('/admittedStudentList', async (req, res) => {
    let data = req.body;

    if (data.cid == 1) {
        if (data.role == "Admission Dean") {
            let rows = await db.query(`SELECT *,(SELECT name FROM dept WHERE id=sd.did) as dept, (SELECT academic_type FROM dept WHERE id=sd.did) as academic_type FROM student_details sd  WHERE cid='${data.cid}' AND admission_dean=''  AND academic_year=(SELECT MAX(academic_year) AS dbacademicYear FROM academic_year WHERE cid='${data.cid}') ORDER BY name ASC`)
            res.send(rows);
        } else if (data.role == "Registrar") {
            let rows = await db.query(`SELECT * ,(SELECT name FROM dept WHERE id=sd.did) as dept, (SELECT academic_type FROM dept WHERE id=sd.did) as academic_type FROM student_details sd WHERE cid='${data.cid}'  AND admission_dean!='' AND admission_dean!='rejected' AND registrar=''  AND academic_year=(SELECT MAX(academic_year) AS dbacademicYear FROM academic_year WHERE cid='${data.cid}') ORDER BY name ASC`)
            res.send(rows);
        } else if (data.role == "VP admin") {
            let rows = await db.query(`SELECT * ,(SELECT name FROM dept WHERE id=sd.did) as dept, (SELECT academic_type FROM dept WHERE id=sd.did) as academic_type FROM student_details sd WHERE cid='${data.cid}'  AND admission_dean!='' AND admission_dean!='rejected' AND registrar!='' AND registrar!='rejected' AND vp_admin='' AND academic_year=(SELECT MAX(academic_year) AS dbacademicYear FROM academic_year WHERE cid='${data.cid}') ORDER BY name ASC`)
            res.send(rows);
        } else if (data.role == "Principal") {
            let rows = await db.query(`SELECT * ,(SELECT name FROM dept WHERE id=sd.did) as dept, (SELECT academic_type FROM dept WHERE id=sd.did) as academic_type FROM student_details sd WHERE cid='${data.cid}'  AND admission_dean!='' AND admission_dean!='rejected'  AND registrar!='' AND registrar!='rejected' AND  vp_admin!='' AND vp_admin!='rejected' AND principal='' AND academic_year=(SELECT MAX(academic_year) AS dbacademicYear FROM academic_year WHERE cid='${data.cid}') ORDER BY name ASC`)
            res.send(rows);
        }
    } else if (data.cid == 6) {
        let rows = await db.query(`SELECT * ,(SELECT name FROM dept WHERE id=sd.did) as dept, (SELECT academic_type FROM dept WHERE id=sd.did) as academic_type FROM student_details sd WHERE cid='${data.cid}' AND academic_year='${data.academic_year}' AND status=0`)
        res.send(rows);
    } else {
        res.send(`${-1}`);
    }

});

app.post('/getDbAcademicYear', async (req, res) => {
    let data = req.body;
    let rows = await db.query('SELECT MAX(academic_year) AS dbacademicYear FROM `academic_year` WHERE cid=?', [data.cid])
    res.send(rows[0]);

});

app.post('/getadmittedstudent', async (req, res) => {
    let data1 = req.body;
    let rows = await db.query(`SELECT *,(SELECT iname FROM college WHERE id=sd.cid) as collegeName,(SELECT name FROM dept WHERE id=sd.did) as dept FROM student_details sd WHERE cid='${data1.cid}' AND academic_year='${data1.academicYear}'`)
    res.send(rows)


});

app.post('/AddStudent', async (req, res) => {
    let data = req.body;
    if (data.sem == 1 || data.sem == 2) {
        year = 1;
    } else if (data.sem == 3 || data.sem == 4) {
        year = 2;

    } else if (data.sem == 5 || data.sem == 6) {
        year = 3;

    } else if (data.sem == 7 || data.sem == 8) {
        year = 4;
    } else {
        year = 5;
    }
    mysqlConnection.query('SELECT name,(SELECT COUNT(id)+1 FROM `student_details`) as studentCount FROM `college` WHERE id=?', [data.cid], (err, rows, fields) => {
        if (!err) {
            temp_id = data.academicYear + rows[0].name + rows[0].studentCount;
            if (data.type == "lateral") {
                mysqlConnection.query('INSERT INTO `student_details`(`temp_id`,  `name`, `type`, `cid`, `did`, `year`, `sem`, `st_conctac_no`, `gender`, `dob`, `pob`, `caste`, `category`, `quota`, `nationality`, `blood_group`, `aadhar_no`, `email`, `bank_name`, `account_no`, `branch`, `ifsc`, `gaurdian_name`, `gaurdian_occupation`, `annual_income`, `gaurdian_contact_no`, `gaurdian_landphone`, `gaurdian_office`, `gaurdian_email`, `mother_name`, `mother_occupation`, `address`, `pincode`, `sslc_from`, `sslc_to`, `sslc_inst`, `sslc_district`, `sslc_state`, `sslc_class_obtained`, `puc_inst`, `puc_board`, `puc_reg_no`, `dip_sem1_max`, `dip_sem1_obt`, `dip_sem1_per`, `dip_sem2_max`, `dip_sem2_obt`, `dip_sem2_per`, `dip_sem3_max`, `dip_sem3_obt`, `dip_sem3_per`, `dip_sem4_max`, `dip_sem4_obt`, `dip_sem4_per`, `dip_sem5_max`, `dip_sem5_obt`, `dip_sem5_per`, `dip_sem6_max`, `dip_sem6_obt`, `dip_sem6_per`, `agg_max_mark`, `agg_obt_mark`, `agg_per`, `uni_fee_2`, `uni_fee_3`, `uni_fee_4`,  `tut_fee_2`, `tut_fee_3`, `tut_fee_4`,  `academic_year`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [temp_id, data.name, data.type, data.cid, data.department, year, data.sem, data.studentMobile, data.gender, data.date, data.placeOfBirth, data.caste, data.category, data.quota, data.nationality, data.bgrp, data.aadharNo, data.mail, data.bankName, data.accNo, data.branch, data.ifscCode, data.fatherName, data.occupation, data.annualIncome, data.parentMobile, data.landphone, data.office, data.parentMail, data.mothersName, data.motherOccupation, data.address, data.pincode, data.sslcFrom, data.sslcTo, data.sslcInstitute, data.sslcDistrict, data.sslcState, data.sslcClassObtained, data.lastAttendedCOllegeName, data.collegeBoardName, data.collegeRegisterNumber, data.sem1max, data.sem1obt, data.sem1per, data.sem2max, data.sem2obt, data.sem2per, data.sem3max, data.sem3obt, data.sem3per, data.sem4max, data.sem4obt, data.sem4per, data.sem5max, data.sem5obt, data.sem5per, data.sem6max, data.sem6obt, data.sem6per, data.avgmax, data.avgobt, data.avgper, data.university2ndYear, data.university3rdYear, data.university4thYear, data.tuition2ndYear, data.tuition3rdYear, data.tuition4thYear, data.academicYear], (err, rows, fields) => {
                    if (!err) {
                        res.send(rows)
                    } else {
                        console.log(err);
                    }
                })
            } else {
                mysqlConnection.query('INSERT INTO `student_details`(`temp_id`,  `name`, `type`, `cid`, `did`, `year`, `sem`, `st_conctac_no`, `gender`, `dob`, `pob`, `caste`, `category`, `quota`, `nationality`, `blood_group`, `aadhar_no`, `email`, `bank_name`, `account_no`, `branch`, `ifsc`, `gaurdian_name`, `gaurdian_occupation`, `annual_income`, `gaurdian_contact_no`, `gaurdian_landphone`, `gaurdian_office`, `gaurdian_email`, `mother_name`, `mother_occupation`, `address`, `pincode`, `sslc_from`, `sslc_to`, `sslc_inst`, `sslc_district`, `sslc_state`, `sslc_class_obtained`, `puc_inst`, `puc_board`, `puc_reg_no`, `phy_max_marks`, `phy_obt_marks`, `phy_per`, `che_max_marks`, `che_obt_marks`, `che_per`, `math_max_marks`, `math_obt_marks`, `math_per`,  `agg_max_mark`, `agg_obt_mark`, `agg_per`, `uni_fee_1`, `uni_fee_2`, `uni_fee_3`, `uni_fee_4`, `uni_fee_5`, `tut_fee_1`, `tut_fee_2`, `tut_fee_3`, `tut_fee_4`, `tut_fee_5`, `academic_year`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [temp_id, data.name, data.type, data.cid, data.department, year, data.sem, data.studentMobile, data.gender, data.date, data.placeOfBirth, data.caste, data.category, data.quota, data.nationality, data.bgrp, data.aadharNo, data.mail, data.bankName, data.accNo, data.branch, data.ifscCode, data.fatherName, data.occupation, data.annualIncome, data.parentMobile, data.landphone, data.office, data.parentMail, data.mothersName, data.motherOccupation, data.address, data.pincode, data.sslcFrom, data.sslcTo, data.sslcInstitute, data.sslcDistrict, data.sslcState, data.sslcClassObtained, data.lastAttendedCOllegeName, data.collegeBoardName, data.collegeRegisterNumber, data.physicsMaximumMarks, data.physicsMarksObtained, data.physicsPecentage, data.chemistryMaximumMarks, data.chemistryMarksObtained, data.chemistryPecentage, data.mathematicsMaximumMarks, data.mathematicsMarksObtained, data.mathematicsPecentage, data.aggregateMaximumMarks, data.aggregateMarksObtained, data.aggregatePecentage, data.university1stYear, data.university2ndYear, data.university3rdYear, data.university4thYear, data.university5thYear, data.tuition1stYear, data.tuition2ndYear, data.tuition3rdYear, data.tuition4thYear, data.tuition5thYear, data.academicYear], (err, rows, fields) => {
                    if (!err) {
                        res.send(rows)
                    } else {
                        console.log(err);
                    }
                })
            }

        } else {
            console.log(err);
        }
    })
});

app.post('/getStudentAdmissionFormDetails', async (req, res) => {
    let data = req.body;
    if (data.cid == 4 || data.cid == 8 || data.cid == 9 || data.cid == 34 || data.cid == 5 || data.cid == 3) {
        let rows = await db.query(`SELECT * FROM student_info WHERE cid='${data.cid}' and id='${data.id}'`);
        res.send(rows[0])
    } else {
        let rows = await db.query(`SELECT *,(SELECT name FROM dept WHERE id=sd.did) as dept FROM student_details sd WHERE id='${data.id}'`);
        res.send(rows[0])
    }
});

app.post('/getdeptfacultyoption', async (req, res) => {
    let data = req.body;
    rows = await db.query(`SELECT id,name FROM admin WHERE did='${data.did}' and status='Approved' and role='Teaching'`)

    let option = `<option value="">Select Faculty</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    }
    res.send(option)
});

app.post('/getWorkloadSubjectList', async (req, res) => {
    let data = req.body;
    if (data.cid == 1) {
        rows = await db.query(`select * from subject where did='${data.did}' and cid='${data.cid}' and mod(sem,2)='${data.sem}' and academic_year='${data.academicYear}' and fid='0' and academic_type='regular' order by sem,scode,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc `)
    } else if (data.cid == 6 || data.cid == 3 || data.cid == 5 || data.cid == 4 || data.cid == 38) {
        rows = await db.query(`select * from subject where did='${data.did}' and cid='${data.cid}' and mod(sem,2)='${data.sem}' and academic_year='${data.academicYear}' and fid='0'  order by sem,scode,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`)
    } else if (data.cid == 8 || data.cid == 9 || data.cid == 34) {
        rows = await db.query(`select * from subject where did='${data.did}' and cid='${data.cid}' and academic_year='${data.academicYear}' and fid='0' order by sem,scode,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`)

    } else {
        rows = await db.query(`select * from subject where did='${data.did}' and cid='${data.cid}' and sem='${data.sem}' and academic_year='${data.academicYear}' and fid='0' order by sem,scode,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`)
    }

    let option = `<option value="">Select Subject</option>`;
    for (let index = 0; index < rows.length; index++) {
        if (rows[index].batch == '') {
            point = rows[index].punit;
        } else {
            point = 3;
        }
        const name = rows[index].scode + "-" + rows[index].sname + "-" + rows[index].sem + "-" + point + "-" + rows[index].batch + "-" + rows[index].dv + " " + rows[index].stype;
        option += `<option value="${rows[index].id}">${name}</option>`
    }
    res.send(option)
});

app.post('/getDeptPortfolio', async (req, res) => {
    let data = req.body;
    rows = await db.query(`SELECT * FROM portfolios p WHERE p.ptype='Department' and  p.name not in (SELECT portfolio FROM portfolio WHERE ptype=p.ptype and cid='${data.cid}' and did='${data.did}' and status=1 and academic_year in (SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}')) and status=1`)

    let option = `<option value="">Select Faculty</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    }
    res.send(option)
});

app.post('/getCenteralPortfolio', async (req, res) => {
    let data = req.body;
    rows = await db.query(`SELECT * FROM portfolios p WHERE p.ptype='Central'  and p.name not in (SELECT portfolio FROM portfolio WHERE ptype=p.ptype and cid='${data.cid}' and academic_year in (SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}')) and p.status=1`)

    let option = `<option value="">Select Faculty</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    }
    res.send(option)
});

app.post('/getTutorialSubject', async (req, res) => {
    let data = req.body;

    if (data.cid == 1) {
        rows = await db.query(`select * from subject where did='${data.did}' and cid='${data.cid}' and mod(sem,2)='${data.sem}' and academic_year in (SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}') and fid='0' and academic_type='parallel' order by sem,scode,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc `)
    } else {
        rows = await db.query(`select * from subject where did='${data.did}' and cid='${data.cid}' and mod(sem,2)='${data.sem}' and academic_year in (SELECT MAX(academic_year) FROM academic_year WHERE cid='${data.cid}') and fid='0' and academic_type='parallel'  order by sem,scode,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc`)
    }

    let option = `<option value="">Select Subject</option>`;
    for (let index = 0; index < rows.length; index++) {
        if (rows[index].batch == '') {
            point = rows[index].punit;
        } else {
            point = 3;
        }
        const name = rows[index].scode + "-" + rows[index].sname + "-" + rows[index].sem + "-" + point + "-" + rows[index].batch + "-" + rows[index].dv + " " + rows[index].stype;
        option += `<option value="${rows[index].id}">${name}</option>`
    }
    res.send(option)
});

app.post('/getInstitutesOption', async (req, res) => {
    rows = await db.query(`select * from college where  status='1' order by name`)

    let option = `<option value="">Select Sister College</option>`;
    for (let index = 0; index < rows.length; index++) {
        option += `<option value="${rows[index].id}">${rows[index].name}</option>`
    }
    res.send(option)
});

app.post('/updateStudentStatus', async (req, res) => {
    let data = req.body;
    let statu = 0
    if (data.value == "approved") {
        statu = 1
    }
    if (data.cid == 1) {
        if (data.role == "Admission Dean") {
            rows = await db.query(`UPDATE student_details SET admission_dean="${data.value}" WHERE id=${data.id}`)
        } else if (data.role == "Registrar") {
            rows = await db.query(`UPDATE student_details SET registrar="${data.value}" WHERE id=${data.id}`)

        } else if (data.role == "VP admin") {
            rows = await db.query(`UPDATE student_details SET vp_admin="${data.value}" WHERE id=${data.id}`)

        } else if (data.role == "Principal") {
            rows = await db.query(`UPDATE student_details SET principal="${data.value}",status="${statu}" WHERE id=${data.id}`)

        }
    } else if (data.cid == 6) {
        rows = await db.query(`UPDATE student_details SET admission_dean="${data.value}",registrar="${data.value}",vp_admin="${data.value}",principal="${data.value}",status="${statu}" WHERE id=${data.id}`)
    }
    res.send(rows)
});

app.post('/getSisClgSub', async (req, res) => {
    let data = req.body;
    if (data.cid == 8 || data.cid == 9 || data.cid == 34) {
        rows = await db.query(`select * from subject where cid='${data.cid}' and  academic_year='${data.academicYear}' and fid='0'`)
    } else {
        rows = await db.query(`select * from subject where cid='${data.cid}' and mod(sem,2)='${data.sem}' and academic_year='${data.academicYear}' and fid='0'  order by sem,scode,if(substr(scode,5,1)>0,substr(scode,6,1),substr(scode,7,1) ) Asc `)
    }
    let option = `<option value="">Select Subject</option>`;
    for (let index = 0; index < rows.length; index++) {
        if (rows[index].batch == '') {
            point = rows[index].punit;
        } else {
            point = 3;
        }
        const name = rows[index].scode + "-" + rows[index].sname + "-" + rows[index].sem + "-" + point + "-" + rows[index].batch + "-" + rows[index].dv + " " + rows[index].stype;
        option += `<option value="${rows[index].id}">${name}</option>`
    }
    res.send(option)
});

app.post('/getWorkLoadReport', async (req, res) => {
    let data = req.body;
    let wt = '';
    let did = data.department
    let sudentCount = function (cid, did, sem, acdYear) {
        let count = db.query(`SELECT id FROM student_academic WHERE did='${did}' and cid='${cid}' and academic_year='${acdYear}' and sem in (${sem})`)
        return count
    }

    let xSubject = function (acdYear, did, cid, sType, fid, sem) {
        return db.query(`SELECT *  FROM subject WHERE academic_year='${acdYear}' and did='${did}' and cid='${cid}' and stype='${sType}'  and fid='${fid}'  and sem%2='${sem}'`)
    }

    if (data.cid == 1 || data.cid == 3 || data.cid == 6 || data.cid == 5 || data.cid == 4) {
        rows = await db.query(`SELECT *,a.id,a.name,(SELECT GROUP_CONCAT(scode) FROM subject WHERE fid=a.id AND did=a.did and cid=a.cid AND academic_year='${data.academicYear}' AND stype='theory' AND evenodd='${data.semType}')as thscode,
        (SELECT Avg(punit) FROM subject WHERE fid=a.id AND did=a.did and cid=a.cid and academic_year='${data.academicYear}' AND stype='theory' AND evenodd='${data.semType}')as tsunit,
        (SELECT GROUP_CONCAT(CONCAT(scode, '#', batch)) FROM subject WHERE fid=a.id and did=a.did and cid=a.cid AND academic_year='${data.academicYear}' AND stype='lab' AND evenodd='${data.semType}')as lbscode,
        (SELECT Avg(punit) FROM subject WHERE fid=a.id AND academic_year='${data.academicYear}' AND stype='lab' AND evenodd='${data.semType}')as lsunit,
        (SELECT sum(punit) FROM subject WHERE fid=a.id  and did=a.did AND academic_year='${data.academicYear}' AND evenodd='${data.semType}' )as tunit,
        (SELECT sum(punit) FROM subject WHERE fid=a.id  and did!=a.did AND academic_year='${data.academicYear}' AND evenodd='${data.semType}' )as sistunit,
        (SELECT count(punit) FROM subject WHERE fid=a.id  and did!=a.did AND academic_year='${data.academicYear}' AND stype='theory' AND evenodd='${data.semType}' )as sisclgtheorysubjectcount,
        (SELECT count(punit) FROM subject WHERE fid=a.id  and did!=a.did AND academic_year='${data.academicYear}' AND stype='lab' AND evenodd='${data.semType}' )as sisclglabsubjectcount,
        (SELECT count(id) FROM student_academic WHERE mentor=a.id AND academic_year='${data.academicYear}' )as mentor,
        (SELECT GROUP_CONCAT(designation SEPARATOR ',') as designation FROM admin WHERE id=a.id)as designation,
        (SELECT role_name FROM user_role WHERE fid=a.id and role_name='HOD') as hodrole,
        (SELECT iname FROM college WHERE id=a.cid) as iname,
        (SELECT GROUP_CONCAT(name SEPARATOR ', ') as portfolio FROM portfolios WHERE name NOT IN (SELECT portfolio FROM portfolio WHERE  academic_year='${data.academicYear}' and cid='${data.cid}' AND did='${did}') AND academic_year='${data.academicYear}' AND cid='${data.cid}' AND (did=0 OR did='${did}') AND  ptype='Department') as undeptportfolio,
        (SELECT GROUP_CONCAT(name SEPARATOR ', ') as portfolio FROM portfolios WHERE name NOT IN (SELECT portfolio FROM portfolio WHERE  academic_year='${data.academicYear}' and cid='${data.cid}') AND academic_year='${data.academicYear}' AND cid='${data.cid}' AND ptype='Central') as uncentportfolio,
        (SELECT GROUP_CONCAT(portfolio) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='Department')as dport,
        (SELECT GROUP_CONCAT(portfolio) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='Central')as cport,
        (SELECT GROUP_CONCAT(portfolio) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' )as hodport,
        (SELECT GROUP_CONCAT(portfolio) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='adhoc')as adhoc,
        (SELECT sum(punit) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='Department')as dportunit,
        (SELECT sum(punit) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='Central')as cportunit,
        (SELECT GROUP_CONCAT(file_name) FROM subject_other WHERE fid=a.id AND academic_year='${data.academicYear}')as sislink,
        (SELECT GROUP_CONCAT(scode) FROM subject WHERE did!='${did}' and fid=a.id AND academic_year='${data.academicYear}' AND stype='theory' AND evenodd='${data.semType}')as sistheoryfile,
        (SELECT GROUP_CONCAT(did) FROM subject WHERE did!='${did}' and fid=a.id AND academic_year='${data.academicYear}' AND stype='theory' AND evenodd='${data.semType}')as sisTheorySubjectdid,
        (SELECT GROUP_CONCAT(scode) FROM subject WHERE did!='${did}' and fid=a.id AND academic_year='${data.academicYear}' AND stype='lab' AND evenodd='${data.semType}')as sislabfile,
        (SELECT GROUP_CONCAT(did) FROM subject WHERE did!='${did}' and fid=a.id AND academic_year='${data.academicYear}' AND stype='lab' AND evenodd='${data.semType}')as sisLabSubjectdid
        FROM admin a WHERE did='${did}' and cid='${data.cid}' AND role='Teaching' AND status='Approved' ORDER BY a.sl ASC`)
    } else {
        rows = await db.query(`SELECT a.id,a.name,(SELECT GROUP_CONCAT(scode,('('),sem,dv,(')')) FROM subject WHERE fid=a.id AND academic_year='${data.academicYear}' AND stype='theory' )as thscode,
        (SELECT sum(punit) FROM subject WHERE fid=a.id AND academic_year='${data.academicYear}' AND stype='theory' )as tsunit,
        (SELECT GROUP_CONCAT(scode,dv) FROM subject WHERE fid=a.id AND academic_year='${data.academicYear}' AND stype='lab' )as lbscode,
        (SELECT Avg(punit) FROM subject WHERE fid=a.id AND academic_year='${data.academicYear}' AND stype='lab' )as lsunit,
        (SELECT sum(punit) FROM subject WHERE fid=a.id AND academic_year='${data.academicYear}' )as tunit,
        (SELECT iname FROM college WHERE id=a.cid) as iname,
        (SELECT GROUP_CONCAT(name SEPARATOR ', ') as portfolio FROM portfolios WHERE name NOT IN (SELECT portfolio FROM portfolio WHERE  academic_year='${data.academicYear}' and cid='${data.cid}' AND did='${did}') AND academic_year='${data.academicYear}' AND cid='${data.cid}' AND (did=0 OR did='${did}') AND  ptype='Department') as undeptportfolio,
        (SELECT GROUP_CONCAT(name SEPARATOR ', ') as portfolio FROM portfolios WHERE name NOT IN (SELECT portfolio FROM portfolio WHERE  academic_year='${data.academicYear}' and cid='${data.cid}') AND academic_year='${data.academicYear}' AND cid='${data.cid}' AND ptype='Central') as uncentportfolio,
        (SELECT count(id) FROM student_academic WHERE mentor=a.id AND academic_year='${data.academicYear}' )as mentor,
        (SELECT GROUP_CONCAT(portfolio) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='Department')as dport,
        (SELECT GROUP_CONCAT(portfolio) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='Central')as cport,
        (SELECT GROUP_CONCAT(portfolio) FROM portfolio WHERE fid=a.id AND academic_year='${data.academicYear}' AND ptype='adhoc')as adhoc,
        (SELECT GROUP_CONCAT(sname) FROM subject_other WHERE fid=a.id AND academic_year='${data.academicYear}')as sisfile
        FROM admin a WHERE did='${did}' and cid='${data.cid}'  AND role='Teaching' AND status='Approved' ORDER BY a.sl ASC`)
    }

    rows = rows[0]
    if (data.semType == 1) {
        semister = 'Odd';
    }
    else {
        semister = 'Even';
    }
    wt += `<div class="card-header" style="text-align:center">
    <strong class="card-title h3">${rows.iname}</strong>
    <br><strong class="card-title h4">${rows.dept} WorkLoad Format ${semister} Semester
                                                                            ${data.academicYear}</strong>
</div>
<div class="card-body">
<table class="table table-bordered">
                                    <thead class="thead-dark" style="text-align:center">
                                        <tr>
                                            <th colspan="5">No Of Students <?php echo $acdYear; ?></th>
                                            <th colspan="2">Un Allotted Subjects</th>
                                            <th colspan="2">Un Allotted Portfolio</th>
                                            <th colspan="5">Work Load (Unit/Work)</th>
                                            <th rowspan="3">Total No Of Staff Required</th>
                                        </tr>`

    if (data.semType == 1) {

        wt += `
                                            <th>1 sem</th>
                                            <th>3 sem</th>
                                            <th>5 sem</th>`
        if (data.cid != 3) {
            wt += `<th>7 sem</th>`
        } else {
            wt += `<th></th>`
        }
        wt += `<th>Total</th>`

    } else {
        wt += `
                                            <th>2 sem</th>
                                            <th>4 sem</th>
                                            <th>6 sem</th>`
        if (data.cid != 3) {
            wt += `<th>8 sem</th>`
        } else {
            wt += `<th></th>`
        }
        wt += `<th>Total</th>`
    }
    wt += `<th rowspan="2">Theory</th>
                                        <th rowspan="2">Lab</th>
                                        <th rowspan="2">Central</th>
                                        <th rowspan="2">Department</th>
                                        <th rowspan="2">Theory</th>
                                        <th rowspan="2">Lab</th>
                                        <th rowspan="2">Tutorial</th>
                                        <th rowspan="2">Portfolio</th>
                                        <th rowspan="2">Total</th>
                                    </thead> <tbody style="text-align:center">
                                    <tr>`
    let iYearCount = 0;
    if (did == 6) {
        if (data.semType == 1) {
            semi = 1;
        } else {
            semi = 2;
        }
        iYearCount = await sudentCount(data.cid, did, semi, data.academicYear);
        wt += `<td>${iYearCount.length}</td><td>0</td><td>0</td><td>0</td><td>${iYearCount.length}</td>`;
    } else {
        wt += `<td>${iYearCount}</td>`;

        if (data.semType == 1) {
            semi = 3;
        } else {
            semi = 4;
        }
        let iiYearCount = await sudentCount(data.cid, did, semi, data.academicYear);
        wt += `<td>${iiYearCount.length}</td>`;

        if (data.semType == 1) {
            semi = 5;
        } else {
            semi = 6;
        }
        let iiiYearCount = await sudentCount(data.cid, did, semi, data.academicYear);
        wt += `<td>${iiiYearCount.length}</td>`;

        if (data.semType == 1) {
            semi = 7;
        } else {
            semi = 8;
        }
        let iiiiYearCount = await sudentCount(data.cid, did, semi, data.academicYear);
        wt += `<td>${iiiiYearCount.length}</td>`;

        total = iiiiYearCount.length + iiiYearCount.length + iiYearCount.length;
        wt += `<td>${total}</td>`;
    }
    xfacSubjectth = await xSubject(data.academicYear, did, data.cid, 'theory', '0', data.semType);
    xfacSubjectlb = await xSubject(data.academicYear, did, data.cid, 'lab', '0', data.semType);

    tsub = '';
    for (let index = 0; index < xfacSubjectth.length; index++) {
        tsub += index + 1 + ")" + xfacSubjectth[index].scode + "<br>"
    }
    lsub = '';
    for (let index = 0; index < xfacSubjectlb.length; index++) {
        lsub += index + 1 + ")" + xfacSubjectlb[index].scode + "<br>"
    }

    wt += `<td>${tsub}</td><td>${lsub}</td><td>${rows.uncentportfolio}</td><td>${rows.undeptportfolio}</td>`
    wt += `</table>
</div>
`;
    res.send(wt)
});
app.post('/getsubtopic', async (req, res) => {
    let data = req.body;
    if (data.topic != '') {
        let rows = await runQuery(`SELECT scode,sname,fname,sem,did,dept,dv FROM subject WHERE id='${data.subject}'`)
        let subjectDetails = rows[0];
        let lessonPlan = await runQuery(`SELECT topicd FROM tlsnpln WHERE id='${data.topic}}'`)
        let subtopics = await runQuery(`SELECT id,sub_topic FROM tlsnpln WHERE scode='${subjectDetails.scode}' AND sname='${subjectDetails.sname}' AND
    fname='${subjectDetails.fname}' AND sem='${subjectDetails.sem}' AND dv='${subjectDetails.dv}' AND dept='${subjectDetails.dept}' AND did='${subjectDetails.did}' AND topicd='${lessonPlan[0].topicd}' AND (status='' or status='Not Complete') AND sub_topic!=''`);

        let option = `<option value=''>Select sub topic</option>`;
        let a = 0;

        for (let i = 0; i < subtopics.length; i++) {
            const element = subtopics[i];
            option += `<option value='${element.id}'>${element.sub_topic}</option>`;
            a++;
        }

        if (a == 0) {
            option = `<option value='0'>No sub topic</option>`;
        }
        // console.log(option)
        res.send(option)
    }
});

app.post('/getemployeeeoptionforcwfwitness2', async (req, res) => {
    let data = req.body;
    let option = `<option value="">Select Employee</option>`;
    let rows = await runQuery(`SELECT id,name,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE cid='${data.cid}' AND did='${data.did}' AND status='approved' AND id!='${data.id}'  ORDER BY name ASC`);
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        option += `<option value="${element.id}">${element.name} (${element.roles})</option>`;
    }

    res.send(option);
    // mysqlConnection.query(`SELECT id,name,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE cid='${data.cid}' AND did='${data.did}' AND status='approved'  ORDER BY name ASC`, (err, rows, fields) => {
    //     if (!err) {
    //         let option = `<option value="">Select Employee</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             const element = rows[index];
    //             option += `<option value="${element.id}">${element.name} (${element.roles})</option>`;
    //         }

    //         res.send(option);
    //     }
    //     else {
    //         console.log(err);
    //     }
    // })
});

app.post('/getemployeeeoptionforcwfwitness3', async (req, res) => {
    let data = req.body;
    let option = `<option value="">Select Employee</option>`;
    let rows = await runQuery(`SELECT id,name,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE cid='${data.cid}' AND did='${data.did}' AND status='approved' AND id NOT IN('${data.id1}','${data.id2}')  ORDER BY name ASC`);
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        option += `<option value="${element.id}">${element.name} (${element.roles})</option>`;
    }

    res.send(option);
    // mysqlConnection.query(`SELECT id,name,(SELECT GROUP_CONCAT(role_name) FROM user_role WHERE fid=a.id ORDER BY prt ASC limit 1) roles FROM admin a WHERE cid='${data.cid}' AND did='${data.did}' AND status='approved'  ORDER BY name ASC`, (err, rows, fields) => {
    //     if (!err) {
    //         let option = `<option value="">Select Employee</option>`;
    //         for (let index = 0; index < rows.length; index++) {
    //             const element = rows[index];
    //             option += `<option value="${element.id}">${element.name} (${element.roles})</option>`;
    //         }

    //         res.send(option);
    //     }
    //     else {
    //         console.log(err);
    //     }
    // })
});

app.post('/addcwfdetails', async (req, res) => {
    let data = req.body;
    let witness1details = await runQuery(`SELECT name FROM admin WHERE id='${data.witness1_id}'`);
    let witness2details = await runQuery(`SELECT name FROM admin WHERE id='${data.witness2_id}'`);
    let witness3details = await runQuery(`SELECT name FROM admin WHERE id='${data.witness3_id}'`);
    let empdetails = await runQuery(`SELECT name FROM admin WHERE id='${data.empid}'`);
    let deptdetails = await runQuery(`SELECT name FROM dept WHERE id='${data.did}'`);

    let insertData = {
        "empid": data.empid,
        "emp_name": empdetails[0].name,
        "cid": data.clg,
        "dept": deptdetails[0].name,
        "did": data.did,
        "loan_amt": data.loan_amt,
        "duration": data.duration,
        "mnth_dedc": data.month_dedc,
        "apdate": formatDate("db", Date()),
        "bal_amt": data.loan_amt,
        "aid": data.aid,
    }
    await dbConnect();
    let isInsert = await db.insert('sami_cwf_loan', insertData);
    await dbDisconnect();
    if (isInsert.insertId > 0) {
        let isInsert2 = await runQuery(`INSERT INTO sami_cwf_wtness ( loan_id, witnes_id, witness_name,amt_paid,amt_bal,mnt_deduc,status)VALUES('${isInsert.insertId}','${data.witness1_id}','${witness1details[0].name}','0','0','0','0'),('${isInsert.insertId}','${data.witness2_id}','${witness2details[0].name}','0','0','0','0'),('${isInsert.insertId}','${data.witness3_id}','${witness3details[0].name}','0','0','0','0')`)
        if (isInsert2.insertId) {
            res.send(["Record Added", "success"]);
        } else {
            res.send(["CWF Loan Added But Witness Record Noyt Added", "warning"]);
        }
    } else {
        res.send(["Record Not Added", "error"]);
    }
});

app.post('/viewwitness', async (req, res) => {
    let data = req.body;
    let loans = await runQuery(`SELECT emp_name,loan_amt,paid_amt,bal_amt,(SELECT GROUP_CONCAT(witness_name) FROM sami_cwf_wtness WHERE loan_id=scl.id ORDER BY id ASC limit 1) AS witness FROM sami_cwf_loan scl WHERE (empid='${data.fid}' OR emp_name='${data.fid}')`);
    res.send(loans);
});

app.post('/getemployeeeoptionforcwf', async (req, res) => {
    let data = req.body;
    let option = `<option value="">Select Employee</option>`;
    let rows = await runQuery(`SELECT empid,emp_name FROM sami_cwf_loan a WHERE cid='${data.cid}' AND did='${data.did}' ORDER BY emp_name ASC`);
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        option += `<option value="${element.empid}">${element.emp_name}</option>`;
    }

    res.send(option);
});

app.post('/loandetailsindividual', async (req, res) => {
    let data = req.body;
    let loans = await runQuery(`SELECT id,emp_name,loan_amt,paid_amt,bal_amt,(SELECT GROUP_CONCAT(witness_name) FROM sami_cwf_wtness WHERE loan_id=scl.id ORDER BY id ASC limit 1) AS witness,(SELECT iname FROM college WHERE id=scl.cid) AS iname FROM sami_cwf_loan scl WHERE empid='${data.fid}'`);
    let result = `<h3 class="demo" align="center">${loans[0].iname}<br>
    <strong class="demo">CWF Loan Transactions</strong>
</h3>`;
    for (let i = 0; i < loans.length; i++) {
        const element = loans[i];
        let witness = element.witness.split(",");
        

        result += `<div class="card">
        <div class="card-header">
            <strong class="card-title mr-5">Recovery From Dropout Candidate</strong><strong class="card-title mr-5"> Loan ${i + 1} </strong><strong class="card-title ml-5">Loan Amount : ${element.loan_amt}</strong>
            <strong class="card-title ml-5" style="color:red">Balance Amount : ${element.bal_amt} </strong>
            <strong class="card-title ml-5" style="color:green">Paid Amount : ${element.paid_amt}  </strong>
    </div>
    <div class="card-body">
    Loan Of : ${element.emp_name}<br>
    `;
    for (let k = 0; k < witness.length; k++) {
        result+= `<span class="font-weight-bold">${k + 1}) Witness Name : ${witness[k]}</span> <br>`;
    }
    result+=`<table class="table table-bordered">
    <thead class="thead-dark">
    <tr>
    <th>SL NO</th>
    <th>Paid Date</th>
    <th>Mod Of Payment</th>
    <th>Paid Amount</th>
    <th>Balance Amount</th>
    </tr>
    </thead>
    <tbody>`;
        let transactions = await runQuery(`SELECT amt_deduc,bal_amt,for_month,pay_mod,date1 FROM sami_cwf_trans WHERE loan_id='${element.id}'`);
        console.log(transactions.length)
        for (let j = 0; j < transactions.length; j++) {
            const element1 = transactions[j];
            result += `
        <tr>
            <td>${j + 1}</td>
            <td>${formatDate("", element1.date1)}</td>
            <td>${numberWithCommas(element1.pay_mod)}</td>
            <td>${numberWithCommas(element1.amt_deduc)}</td>
            <td>${numberWithCommas(element1.bal_amt)}</td>
        </tr>
        `;
        }
        result += `
    <tbody>
    </table>
    </div>
    </div>`;
    }

    res.send(result);
});