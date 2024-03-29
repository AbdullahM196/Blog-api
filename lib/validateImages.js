const validateImage = async (img) => {
  const imageSize = 1024 * 1024;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedMimeTypes.includes(img.mimetype) && img.size <= imageSize) {
    return img;
  } else {
    return null;
  }
};
module.exports = validateImage;
