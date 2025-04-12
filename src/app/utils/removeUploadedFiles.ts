import fs from "fs";
import util from "util";

const unlinkAsync = util.promisify(fs.unlink);

export const removeUploadedFiles = async (files: any) => {
  await Promise.all(
    ["images", "videos"].flatMap((field) =>
      files[field]
        ? files[field].map((file: Express.Multer.File) =>
            unlinkAsync(file.path).catch((err) => {
              console.error("Failed to remove file:", file.path, err);
            }),
          )
        : [],
    ),
  );
};

//remove the local file after upload.
export const removeSingleUploadedFile = async (path: string) => {
  fs.unlink(path, (err: any) => {
    if (err) {
      throw new Error("File removing Faield!");
    }
  });
};
