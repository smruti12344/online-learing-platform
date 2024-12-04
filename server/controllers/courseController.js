import { Course } from "../models/courseModels.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

//Create course
export const createCourse = async (req, res) => {
  console.log("createCoruse");
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category is required.",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "Course created.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed in Create course",
    });
  }
};

//get all course
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

//get published course
export const getPublishedCourse = async (_,res) => {
  try {
      const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name profileImage"});
      if(!courses){
          return res.status(404).json({
              message:"Course not found"
          })
      }
      return res.status(200).json({
          courses,
      })
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message:"Failed to get published courses"
      })
  }
}

//edit course
export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId; //course-Id
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body; //update-Details
    const thumbnail = req.file; //update-image

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      //delete previous thumbnail
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0]; //publicId for cloudinary
        await deleteMediaFromCloudinary(publicId); // delete old image
      }
      // upload a thumbnail on clourdinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Edit course",
    });
  }
};

//populate the course (add course in side courses)
export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course by id"
        })
    }
}

//publish and unpublish course

export const togglePublishCourse = async (req,res) => {
  try {
      const {courseId} = req.params;
      const {publish} = req.query; // true, false
      const course = await Course.findById(courseId);
      if(!course){
          return res.status(404).json({
              message:"Course not found!"
          });
      }
      // publish status based on the query paramter
      course.isPublished = publish === "true";
      await course.save();

      const statusMessage = course.isPublished ? "Published" : "Unpublished";
      return res.status(200).json({
          message:`Course is ${statusMessage}`
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message:"Failed to update status"
      })
  }
}

//get search course
export const searchCourse = async (req,res) => {
  try {
      const {query = "", categories = [], sortByPrice =""} = req.query;
      console.log(categories);
      
      // create search query
      const searchCriteria = {
          isPublished:true,
          $or:[
              {courseTitle: {$regex:query, $options:"i"}},
              {subTitle: {$regex:query, $options:"i"}},
              {category: {$regex:query, $options:"i"}},
          ]
      }

      // if categories selected
      if(categories.length > 0) {
          searchCriteria.category = {$in: categories};
      }

      // define sorting order
      const sortOptions = {};
      if(sortByPrice === "low"){
          sortOptions.coursePrice = 1;//sort by price in ascending
      }else if(sortByPrice === "high"){
          sortOptions.coursePrice = -1; // descending
      }

      let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name profileImage"}).sort(sortOptions);

      return res.status(200).json({
          success:true,
          courses: courses || []
      });

  } catch (error) {
      console.log(error);
      
  }
}