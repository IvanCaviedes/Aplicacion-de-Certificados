const path = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../temp'),
    filename: (req, file, cb) => {
        cb(null, 'Basededatos' + path.extname(file.originalname))
    }
})
module.exports =  multer({ storage })