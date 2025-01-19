import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    // Check if file exists and is a local file
    if (post.file && typeof post.file === "object") {
      let isImage = post?.file?.type === "image"; // Determine if the file is an image
      let folderName = isImage ? "postImage" : "postVideo";

      // Upload file to appropriate folder
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data; // Update post.file with the uploaded file URL or identifier
      } else {
        return fileResult; // Return error from file upload
      }
    }

    // Create or update post in the Supabase 'posts' table
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: error.message || "Failed to create post",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("create post error: ", error);
    return {
      success: false,
      message: error.message || "Failed to create post",
    };
  }
};

export const fetchPost = async (limit = 10, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*,
        user:users (id,name,image),
        postLike (*),
        comments (count)
      `
        )
        .limit(limit)
        .eq("userId", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return {
          success: false,
          message: error.message || "Failed to fetch post",
        };
      }
      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*,
        user:users (id,name,image),
        postLike (*),
        comments (count)
      `
        )
        .limit(limit)
        .order("created_at", { ascending: false });

      if (error) {
        return {
          success: false,
          message: error.message || "Failed to fetch post",
        };
      }
      return { success: true, data: data };
    }
  } catch (error) {
    console.log("fetch post error: ", error);
    return { success: false, message: error.message || "Failed to fetch post" };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postLike")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.error("createPostLike error: ", error);
      return {
        success: false,
        message: error.message || "failed to create post like",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("createPostLike error: ", error);
    return {
      success: false,
      message: error.message || "failed to create post like",
    };
  }
};

export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLike")
      .delete()
      .eq("postId", postId)
      .eq("userId", userId);

    if (error) {
      console.error("removePostLike error: ", error);
      return {
        success: false,
        message: error.message || "failed to remove post like",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("removePostLike error: ", error);
    return {
      success: false,
      message: error.message || "failed to remove post like",
    };
  }
};

export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*,
        user:users (id,name,image),
        postLike (*),
        comments (*,user:users(id,name,image))
      `
      )
      .eq("id", postId)
      .single()
      .order("created_at", { ascending: false, foreignTable: "comments" });

    if (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch post details",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetch post error: ", error);
    return {
      success: false,
      message: error.message || "Failed to fetch post details",
    };
  }
};

export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.error(" create comment error: ", error);
      return {
        success: false,
        message: error.message || "failed to create comment",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("create comment error: ", error);
    return {
      success: false,
      message: error.message || "failed to create comment",
    };
  }
};

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("remove comment error: ", error);
      return {
        success: false,
        message: error.message || "failed to remove comment",
      };
    }
    return { success: true, data: { commentId } };
  } catch (error) {
    console.error("remove comment error: ", error);
    return {
      success: false,
      message: error.message || "failed to remove comment",
    };
  }
};

export const removePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error("remove post error: ", error);
      return {
        success: false,
        message: error.message || "failed to remove post",
      };
    }
    return { success: true, data: { postId } };
  } catch (error) {
    console.error("remove post error: ", error);
    return {
      success: false,
      message: error.message || "failed to remove post",
    };
  }
};
