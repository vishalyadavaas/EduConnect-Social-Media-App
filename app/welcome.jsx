import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image
          style={styles.welcomeIamge}
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
        />

        <View style={{ gap: 20 }}>
          <Text style={styles.title}>EduConnect!</Text>
          <Text style={styles.punchline}>
            Where every thought finds a home and every tells a story.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button title="Getting Started" 
          onPress={() => router.push("signup")} 
          buttonStyle={{marginHorizontal: wp(3)}}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable onPress={()=> router.push("login")}>
              <Text style={[styles.loginText,{color:theme.colors.primaryDark,fontWeight
              :theme.fonts.semibold
              }]}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: wp(4),
  },
  welcomeIamge: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    fontWeight: theme.fonts.extrabold,
    textAlign: "center",
  },
  punchline: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.7),
    paddingHorizontal: wp(10),
  },
  footer: {
    width: "100%",
    gap: 30,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    color: theme.colors.text,
    fontSize: hp(1.6),
    textAlign: "center",
  },
});
