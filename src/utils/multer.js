const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        let directory
        const value = req.file?? req.files[0];
        console.log(value)
        switch (value.fieldname) {
            case 'thumbnails':
                directory = 'img/products';
                break;
            case 'documents':
                file.originalname.startsWith('profile') ?
                directory = 'img/profiles'
                : directory = 'documents'
                break;
            default:
                directory = 'documents';
                break;
        }
        cb(null, path.join(__dirname, '..', '/public', directory));
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})

module.exports = multer({storage})