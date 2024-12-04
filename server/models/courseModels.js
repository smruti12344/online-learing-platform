import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle: {type:String}, 
    description:{ type:String},
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number
    },
    courseThumbnail:{
        type:String
    },
    enrolledStudents:[  // to check how many student enrollment this course
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'       //relation with User collection
        }
    ],
    lectures:[            // to check how many lectures enrollment this course
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"         //relation with Lecture collection
        }
    ],
    creator:{              // to check creator it define object because of one creator
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'          //relation with User collection
    },
    isPublished:{
        type:Boolean,
        default:false
    }

}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);