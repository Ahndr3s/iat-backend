const { response } = require("express");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { uploadFileHelper } = require("../helpers");
const { User, Course, Video } = require("../models");

// UPLOADS A FILE TO THE SERVER
const uploadFile = async (req, resp = response) => {
  try {
    const imgName = await uploadFileHelper(req.files, undefined, "users");
    // const imgName = await uploadFileHelper(req.files, undefined)
    resp.json({ name: imgName });
  } catch (error) {
    resp.status(400).json({ error });
  }
};

// UPDATES THE IMAGE OF THE SCPECIFIED MODEL
const updateImageCloudinary = async (req, resp = response) => {
  const { id, collection } = req.params;
  let model;

  try {
    switch (collection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return resp
            .status(400)
            .json({ msg: `There is no user with the id ${id}!!!` });
        }
        break;

      case "courses":
        model = await Course.findById(id);
        if (!model) {
          return resp
            .status(400)
            .json({ msg: `There is no course with the id ${id}!!!` });
        }
        break;

      case "videos":
        model = await Video.findById(id);
        if (!model) {
          return resp
            .status(400)
            .json({ msg: `There is no videoblog with the id ${id}!!!` });
        }
        break;

      default:
        return resp.status(500).json({ msg: "I forgot to validate this" });
    }

    // CLEAN UP PREVIOUS IMAGES
    if(model.img){
      // DELETE IMAGE FROM CLOUDINARY
      const maimedLink = model.img.split('/')
      const file = maimedLink[maimedLink.length - 1]
      const [fileName] = file.split('.')
      cloudinary.uploader.destroy(fileName)  
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return resp.status(400).json({ msg: "No files were uploaded." });
    }

    // console.log(req.files.uploadFiles)
    const { tempFilePath } = req.files.uploadFiles;
    // const { secure_url } = await cloudinary.uploader.upload(tempFilePath,{folder:`RestServer NodeJs/${collection}`} );
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath );
    model.img = secure_url;
    await model.save();

    resp.json(model);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ msg: "Something went wrong. Please try again later." });
  }

};

// UPDATES THE IMAGE OF THE SCPECIFIED MODEL
const updateImage = async (req, resp = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return resp
          .status(400)
          .json({ msg: `There is no user with the id ${id}!!!` });
      }
      break;

    case "courses":
      // console.log('este es mi modelo \n'+Course)
      model = await Course.findById(id);
      if (!model) {
        return resp
          .status(400)
          .json({ msg: `There is no course with the id ${id}!!!` });
      }
      break;

    case "videos":
      model = await Video.findById(id);
      if (!model) {
        return resp
          .status(400)
          .json({ msg: `There is no course with the id ${id}!!!` });
      }
      break;

    default:
      return resp.status(500).json({ msg: "I forgot to validate this" });
  }

  //  CLEAN UP PREVIOUS IMAGES
  if (model.img) {
    // DELETE IMAGE FROM THE SERVER
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const imgName = await uploadFileHelper(req.files, undefined, collection);
  // const imgName = await uploadFileHelper(req.files, undefined, 'users');
  model.img = imgName;
  await model.save();

  resp.json({ id, collection });
};

const showImage = async (req, resp = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return resp
          .status(400)
          .json({ msg: `There is no user with the id ${id}!!!` });
      }
      break;

    case "courses":
      model = await Course.findById(id);
      if (!model) {
        return resp
          .status(400)
          .json({ msg: `There is no course with the id ${id}!!!` });
      }
      break;

    default:
      return resp.status(500).json({ msg: "I forgot to validate this" });
  }

  //  DELIVER THE CORRESPONDING IMAGES
  if (model.img) {
    // SERVE IMAGE FROM THE SERVER
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imagePath)) {
      return resp.sendFile(imagePath);
    }
  }

  const placeholderImage = path.join(__dirname, "../assets/no-image.jpg");
  return resp.sendFile(placeholderImage);
};

module.exports = {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
};
