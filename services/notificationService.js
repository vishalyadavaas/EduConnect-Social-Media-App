import { supabase } from "../lib/supabase";


export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.error("notification error: ", error);
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("notification error: ", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const fetchNotification = async (receiverId) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `*,
            sender:senderId(id,name,image)
        `
        )
        .eq("receiverId", receiverId)
        .order("created_at", { ascending: false});
  
      if (error) {
        return {
          success: false,
          message: error.message || "Failed to fetch notification details",
        };
      }
      return { success: true, data: data };
    } catch (error) {
      console.log("fetch notification error: ", error);
      return {
        success: false,
        message: error.message || "Failed to fetch notification details",
      };
    }
  };