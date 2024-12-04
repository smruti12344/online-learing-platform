import multer from 'multer';

const upload = multer({dest:"uploads/"}); //define folder to upload image and doc
export default upload;