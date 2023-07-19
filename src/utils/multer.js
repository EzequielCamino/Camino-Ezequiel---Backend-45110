const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        /* if(req._parsedOriginalUrl.path === '/api/products/'){
            cb(null, path.join(__dirname, '..', '/public/img/products'));
            return
        } */
        let directory
        const value = req.file?? req.files[0];
        switch (value.fieldname) {
            case 'thumbnails':
                directory = 'img/products';
                break;
            case 'profile':
                directory = 'img/profiles';
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