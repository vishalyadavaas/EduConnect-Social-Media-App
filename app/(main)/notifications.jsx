import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreeenWrapper from '../../components/ScreenWrapper'
import { fetchNotification } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { useRouter } from 'expo-router';
import NotificationItem from '../../components/NotificationItem';
import Header from '../../components/Header';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const {user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, [])

  const getNotifications = async () => {
    let res = await fetchNotification(user.id);
    if(res.success) setNotifications(res.data);
    
  }

  return (
    <ScreeenWrapper bg={"white"}>
     <View style={styles.container}>
     <Header title="Notifications" />
     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
     {
      notifications.map(item=>{
        return(
          <NotificationItem key={item?.id} item={item} router={router} />
        )
      })
     }
     {
        notifications.length == 0 && (
          <Text style={styles.noData}>No Notifications</Text>
        )
     }
     </ScrollView>
     </View>
    </ScreeenWrapper>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10
  },
  noData: {
    fontSize: hp(1.8),

    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center'
  },
})