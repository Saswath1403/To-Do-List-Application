const mongoose = require("mongoose");

//-------------------------------------------------------[Validators]---------------------------------------------------------------------//


const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};


const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "object" && Object.keys(value).length === 0) return false;
    return true;
};


const isEmpty = (value) => {
  if (Object.keys(value).length === 0) return false;
  return true;
};


const isValidDate =function(date){
    const isValidDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    return isValidDate.test(date)
  };



module.exports = { isValidObjectId, isValid, isEmpty, isValidDate };     // Exporting them
                                                                                                        