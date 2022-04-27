//StatusBar imported from react-native. May still need expo-status-bar
//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//facebook sdk required imports
import { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableHighlight
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { LoginButton, AccessToken, ShareDialog, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { Card, Image } from 'react-native-elements'



const SHARE_LINK_CONTENT = {
  contentType: 'link',
  contentUrl: 'https://www.facebook.com/',
};

export default function App() {

  const [profile, setProfile] = useState([]);
  const [profileImage, setProfileImage] = useState();
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View>
            <LoginButton
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    setLoggedIn(true);
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log(data.accessToken.toString());
                        this.getPublicProfile();
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => {
                console.log("logout.");
                setLoggedIn(false);
              }}/>
            { isLoggedIn && <Card
                title={profile.name}>
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 50, height: 50 }}
                />
                <TouchableHighlight onPress={this.shareLinkWithDialog}>
                  <Text style={styles.shareText}>Share link with ShareDialog</Text>
                </TouchableHighlight>
              </Card>
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

getPublicProfile = async () => {
  const infoRequest = new GraphRequest(
    '/me?fields=id,name,picture',
    null,
    (error, result) => {
      if (error) {
        console.log('Error fetching data: ' + error.toString());
      } else {
        console.log(result);
        setProfile(result);
        setProfileImage(result.picture.data.url);
      }
    }
  );
  new GraphRequestManager().addRequest(infoRequest).start();
}

shareLinkWithDialog = async () => {
  const canShow = await ShareDialog.canShow(SHARE_LINK_CONTENT);
  if (canShow) {
    try {
      const {isCancelled, postId} = await ShareDialog.show(
        SHARE_LINK_CONTENT,
      );
      if (isCancelled) {
        Alert.alert('Share cancelled');
      } else {
        Alert.alert('Share success with postId: ' + postId);
      }
    } catch (error) {
      Alert.alert('Share fail with error: ' + error);
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
