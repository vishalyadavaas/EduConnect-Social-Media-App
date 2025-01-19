import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,Pressable,
  Alert
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import RichTextEditor from "../../components/RichTextEditor";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "../../assets/icons";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { getSupabaseFileUrl } from "../../services/imageService";
import { Video ,ResizeMode} from "expo-av";
import { createOrUpdatePost } from "../../services/postService";

const NewPost = () => {
  const post = useLocalSearchParams();
  console.log(post);
  
  const { user } = useAuth();
  const bodyRef = useRef();
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  useEffect(() => {
    if(post && post.id){
      bodyRef.current = post.body;
      setFile(post.file || null);
      setTimeout(() => {
        editorRef.current?.setContentHTML(post.body);

      },300);
    }
  }, []);

  const onPick = async (isIamge) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    }
    if(!isIamge){
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    

    if(!result.canceled){
      setFile(result.assets[0]);
    }
  };
  const isLocalFile = file =>{
    if(!file) return null;
    if(typeof file == "object") return true;
    return false;
  }
  const getFileType = (file) => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.type;
    }
    // check image or video for remote file
    if(file.includes('postImage')){
      return 'image';
    }
    return 'video';
  }

  const getFileUri = (file) => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  }

  const onSubmit = async () => {
    if(!bodyRef.current && !user) {
      Alert.alert("Post","Please choose a image or video");
      return;
    };
    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    }
    if(post && post?.id) data.id = post.id;
    // create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if(res.success){
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();
    }
    else{
      Alert.alert("Post","res.message");
    }
  };
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <Header title={post?.id ? "Update Post" : "Create Post"} />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {/* avatar */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user?.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>

          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>

          {
            file && (
              <View style={styles.file}>
                {
                  getFileType(file) =='video'?(
                   <Video source={{uri:getFileUri(file)}} useNativeControls  resizeMode={ResizeMode.COVER}  isLooping style={{flex:1}}/>
                  ):
                  (
                   <Image source={{uri:getFileUri(file)}} resizeMode="cover" style={{flex:1}}/>
                  )
                }
                <Pressable style={styles.closeIcon} onPress={()=> setFile(null)}>
                  <Icon name='delete' size={20} color='white' />
                </Pressable>
              </View>
            )
          }

          <View style={styles.media}>
            <Text style={styles.mediaText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={()=> onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            buttonStyle={{ height: hp(6.2) }}
            title={post?.id ? "Update" : "Post"}

            loading={loading}
            hasShadow={false}
            onPress={onSubmit}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  title: {
    fontsize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  media: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
  },

  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginLeft: -65,
  },
  addImage: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(255,0,0,0.6)',
  },
});
