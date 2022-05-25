import React from 'react'

const EditSubjects = () => {
  return (
    <div className="row">
        <h3 >hello</h3>
    {/* <div className="col-lg-1"></div>
    <div className="col-10">
        <form action="<?php echo base_url('sohail/subject/updateSubject'); ?>" method="post">
            <div className="card">
                <div className="card-header bg-info text-center" style={{color:'#fff'}}>
                    <strong>Edit Subject</strong>
                </div>
                <div className="card-body card-block"> 
                    <h3 className="text-center mb-2">Department of </h3>

                    <div className="form-group">
                        <label htmlFor="street" className="form-control-label font-weight-bold">Select Academic Year</label>
                        <select required name="academicYear" id="academicYear" className="form-control">
                            <option value="">Select Academic Year</option>
                            <option selected value=""></option>
                            
                        </select>
                    </div>
                    
                        <div className="form-group">
                            <label htmlFor="street" className="form-control-label font-weight-bold">Select Department</label>
                            <select name="department" id="department" className="form-control">
                            <option selected value=""></option>
                            
                            </select>
                        </div>
                    
                
                    <div className="row form-group">
                        <div className="form-group col col-md-6">
                            <label htmlFor="street" className="form-control-label font-weight-bold">Subject Name</label>
                            <input required type="text" id="subjectName" value="" name="subjectName" placeholder="Enter subject Name" className="form-control"/>
                        </div>
                        <div className="form-group col col-md-6">
                            <label htmlFor="street" className="form-control-label font-weight-bold">Subject Code</label>
                            <input required type="text" id="subjectCode" value="" name="subjectCode" placeholder="Enter subject Code" className="form-control"/>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="form-group col col-md-6">
                            <label htmlFor="street" className="form-control-label font-weight-bold">Select AcademicYear Type</label>
                            <select required name="academicYearType" id="academicYearType" className=" form-control">
                                <option value="">Select AcademicYear Type</option>
                                <option value="1">Odd</option>
                                <option value="0">Even</option>
                            </select>
                        </div>
                        <div className="form-group col col-md-6">
                            <label htmlFor="street" className="form-control-label font-weight-bold">Select Semester</label>
                            <select required name="semester" id="semester" className=" form-control">
                                <option value="">Select Semester</option>
                                <option selected value=""></option>
                            </select>
                        </div>
                    </div>
                    <div className="row form-group col col-md-4 text-center" id="division">
                        <label htmlFor="street" className="form-control-label font-weight-bold">Select Division</label>
                        <select className="form-control" id="division" name="division">
                            <option value=''>Select Division</option>
                            <option selected value=""></option>
                            <option value='P'>P</option>
                            <option value='C'>C</option>
                        </select>
                    </div>
                    <div className="row form-group">
                        <div className="form-group col col-md-6">
                            <label htmlFor="street" className="form-control-label font-weight-bold">Select Subject Type</label>
                            <select required className="form-control" id="subjectType" name="subjectType">
                                <option value="">Select Subject Type</option>
                                <option selected value=""></option>
                                <option value="theory">Theory</option>
                                <option value="lab">Lab</option>
                            </select>
                        </div>
                        <div className="form-group col col-md-6">
                            <label htmlFor="street" className="form-control-label font-weight-bold">Select Subject Academic Type</label>
                            <select required className="form-control" id="subjectAcademicType" name="subjectAcademicType">
                                <option value="">Select Subject Academic Type</option>
                                <option selected value="<?php echo $subjectDetail['academic_type']; ?>"></option>
                                <option value="regular">Regular</option>
                                <option value="parallel">Parallel</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group col-12 text-center">
                        <div className="col-md-3" id="units">

                        </div>
                    </div>

                </div>
                <div className="card-footer text-center">
                    <button type="submit" value="<?php echo $subjectDetail['id']; ?>" name="subjectId" className="btn btn-primary btn-sm rounded"><i className="fa fa-dot-circle-o"></i> Update</button>
                    <button type="reset" className="btn btn-danger btn-sm rounded"><i className="fa fa-ban"></i> Reset</button>
                </div>
            </div>
        </form>
    </div> */}
</div>
  )
}

export default EditSubjects
