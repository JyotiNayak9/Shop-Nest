const mongoose = require('mongoose')

const idvalidate =  (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid){
        throw {status:400, message:" This Id is invalid"};

}
}
module.exports = idvalidate
