import { supabase } from "../lib/supabase";

export const getUserData = async (userId) => {
    try{
        const {data,error} = await supabase
        .from('users')
        .select()
        .eq('id,',userId)
        .single();

        if(error){
            return {success: false, message: error.message}
        }
        return {success: true, data: data}
    }catch(error){
        console.log('got error: ',error);
        return {success: false, message: error.message}
    }
}

export const updateUser = async (userId,data) => {
    try{
        const {error} = await supabase
        .from('users')
        .update(data)
        .eq('id',userId);

        if(error){
            return {success: false, message: error.message}
        }
        return {success: true, data: data}
    }catch(error){
        console.log('got error: ',error);
        return {success: false, message: error.message}
    }
}