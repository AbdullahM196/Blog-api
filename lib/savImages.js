const multer = require("multer");
const uuid = require("uuid").v4;
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const config = require("../config/firebase.config.js");

// initializeApp
initializeApp(config.firebaseConfig);
// initialize cloud storage and get a reference to the service.
const storage = getStorage();
//setting up multer as a middleware to grab photo uploads.
const upload = multer({ storage: multer.memoryStorage() });

async function saveImage(img) {
  try {
    const imgName = uuid();

    const storageRef = ref(storage, `images/${imgName}`);
    const metaData = {
      contentType: img.mimetype,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      img.buffer,
      metaData
    );
    const downloadURl = await getDownloadURL(snapshot.ref);
    return {
      status: 201,
      imgName,
      downloadURl,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}
async function deleteImage(imgName) {
  try {
    const storageRef = ref(storage, `images/${imgName}`);
    await deleteObject(storageRef);
    return {
      status: 204,
      message: "Image deleted successfully",
    };
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
}

module.exports = {
  upload,
  saveImage,
  deleteImage,
};
