import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createComment, fetchPostDetails } from "../../services/postService";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import ScreenWrapper from "../../components/ScreenWrapper";

const postDetails = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commnetRef = useRef("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    // fetch post details
    let res = await fetchPostDetails(postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  const onNewComment = async () => {
    if (!commnetRef.current) return null;
    let data = {
      postId: postId,
      userId: user.id,
      text: commnetRef.current,
    };

    // create new comment
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      // send notification later
      inputRef.current.clear();
      commnetRef.current = "";
      getPostDetails();
    } else {
      Alert.alert("Failed to create comment");
    }
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          <PostCard
            item={{ ...post, comments: [{ count: post?.comments?.length }] }}
            currentUser={user}
            router={router}
            hasShadow={false}
            showMoreIcon={false}
          />
          {/* comment input */}
          <View style={styles.inputContainer}>
            <Input
              inputRef={inputRef}
              placeholder="Type comment..."
              onChangeText={(value) => (commnetRef.current = value)}
              placeholderTextColor={theme.colors.textLight}
              containerStyle={{
                flex: 1,
                height: hp(6.2),
                borderRadius: theme.radius.xl,
              }}
            />

            {loading ? (
              <View style={styles.loading}>
                <Loading size="small" />
              </View>
            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="send" color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default postDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
