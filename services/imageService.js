import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";

export const getUserIamgeSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("../assets/images/defaultUser.png");
  }
};

export const getSupabaseFileUrl = filePath => {
    if(filePath){
        return {uri:`https://wtudbkbeqblvmpaiccnq.supabase.co/storage/v1/object/public/uploads/${filePath}`}
    }
    return null;
}

export const downloadFile = async (url) => {
  try {
    const {uri} = await FileSystem.downloadAsync(url,getLocalFilePath(url));
    return uri;
  } catch (error) {
   return null;
  }
};

export const getLocalFilePath = (url) => {
    let fileName = url.split("/").pop();
    return `${FileSystem.documentDirectory}${fileName}`;
  }


// export const getLocalFilePath = filePath => {
//   let fileName = filePath.split("/").pop();
//   return `${FileSystem.documentDirectory}${fileName}`;
// }

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });
    if (error) {
      colsole.log("file upload error: ", error);
      return { success: false, message: error.message || "File upload failed" };
    }
    return { success: true, data:data.path };
  } catch (error) {
    colsole.log("file upload error: ", error);
    return { success: false, message: error.message || "File upload failed" };
  }
};

export const getFilePath = (folderName, isImage = true) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".jpg" : ".mp4"}`;
};
