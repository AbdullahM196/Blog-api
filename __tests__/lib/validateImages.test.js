const validateImage = require("../../lib/validateImages");

//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "image/gif",
//     "image/webp",
//     "image/svg+xml",
//   ];
describe.skip("test validate image function", () => {
  it("should return the image when the mimetype is allowed and the size is less than or equal to 1MB", async () => {
    const img = {
      mimetype: "image/jpeg",
      size: 1024 * 1024,
    };
    const result = await validateImage(img);
    expect(result).toEqual(img);
  });
  it("should return null if the mimetype is not in allowed Types", async () => {
    const img = {
      mimetype: "application/pdf",
      size: 1024 * 1024,
    };
    const result = await validateImage(img);
    expect(result).toBeNull();
  });
  it("should return null if the size exceed the limit size although it is in allowed types", async () => {
    const img = {
      mimetype: "image/jpeg",
      size: 1024 * 1024 * 2,
    };
    const result = await validateImage(img);
    expect(result).toBeNull();
  });
});
