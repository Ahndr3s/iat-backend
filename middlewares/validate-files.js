const { response } = require("express")

const validateUploads = (req, resp = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.uploadFiles) {
        console.log('-----------------------------------------------')
        // console.log(req.files.uploadFiles)
        console.log(req)
        console.log('-----------------------------------------------')
        return resp.status(400).json({msg: "No files were uploaded!!!"});
      }    
    next()
}

module.exports = {
    validateUploads
}