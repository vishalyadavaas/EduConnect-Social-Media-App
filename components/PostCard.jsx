import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "../constants/theme";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseFileUrl } from "../services/imageService";
import { Video } from "expo-av";
import { createPostLike, removePostLike } from "../services/postService";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import Loading from "./Loading";

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const textStyles = {
    color: theme.colors.dark,
    fontSize: hp(1.75),
  };

  const tagsStyles = {
    div: textStyles,
    p: textStyles,
    ol: textStyles,
    h1: {
      color: theme.colors.dark,
    },
    h2: {
      color: theme.colors.dark,
    },
    h3: {
      color: theme.colors.dark,
    },
  };

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      setLikes(Array.isArray(item?.postLike) ? item.postLike : []);
    },
    [item?.postLike],
    [item?.comments]
  );

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({
      pathname: "/(main)/postDetails",
      params: { postId: item?.id },
    });
  };

  const onLike = async () => {
    if (liked) {
      // remove like
      let updatedLikes = likes.filter(
        (like) => like.userId !== currentUser?.id
      );
      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      console.log("removed like", res);
      if (!res.success) {
        Alert.alert("Failed to remove like");
      }
    } else {
      // add like
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLike(data);
      console.log("added like", res);
      if (!res.success) {
        Alert.alert("Failed to like post");
      }
    }
  };

  const onShare = async () => {
    try {
      const message = stripHtmlTags(item?.body) || "Check out this post!";

      if (item?.file) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Please grant media access permission"
          );
          return;
        }
        setLoading(true);
        const downloadedUrl = await downloadFile(
          getSupabaseFileUrl(item?.file).uri
        );
        setLoading(false);
        if (downloadedUrl) {
          // Share the downloaded file directly using shareAsync
          await Sharing.shareAsync(downloadedUrl, {
            mimeType: "image/jpeg",
            dialogTitle: "Share Post",
            UTI: "public.jpeg",
          });
        }
      } else {
        // Text-only share
        await Share.share({ message });
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Error", "Failed to share post");
    }
  };

  const handlePostDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
      ]);
    };

  const created_at = moment(item?.created_at).format("MMM DD, YYYY");

  const liked = likes.filter((like) => like.userId === currentUser?.id)[0]
    ? true
    : false;

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            uri={item?.user?.image}
            size={hp(4.5)}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{created_at}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.4)}
              stokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        {showDelete && currentUser?.id === item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={()=>onEdit(item)}>
              <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
        {/* post image */}
        {item?.file && item?.file?.includes("postImage") && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}
        {/* post video */}
        {item?.file && item?.file?.includes("postVideo") && (
          <Video
            shouldPlay={false}
            isLooping
            useNativeControls
            resizeMode="cover"
            source={getSupabaseFileUrl(item?.file)}
            style={[styles.postMedia, { height: hp(35) }]}
          />
        )}
      </View>
      {/* like,comment & share */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.rose : "transparent"}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length || 0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments?.[0].count || 0}</Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;
const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),

    color: theme.colors.textDark,
    fontWeight: theme.fonts.bold,
  },
  postTime: {
    fontsize: hp(1.4),

    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
