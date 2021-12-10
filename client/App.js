import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Linking, Pressable } from 'react-native';

export default function App() {

  const [text, onChangeText] = React.useState("");
  const [data, onChangeData] = React.useState({});
  const [userInfo, onChangeuserInfo] = React.useState([]);
  const fetchUser = async (username) => {
    const { API_URL } = process.env;
    // const response = await fetch(`${API_URL}${username}`);
    const response = await fetch(`http://localhost:4242/api/users/` + username);

    const data = await response.json();
    if (data) {
      onChangeData(data.userAdded)
    }
    //data && onChangeData(data)
  }

  const OpenURLButton = ({ url, children }) => {
    if (url) {
      const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
      }, [url]);

      return (
        <Pressable
          style={styles.button}
          onPress={
            handlePress
          }>
          <Text style={styles.FontTextColor}>{children}</Text>
        </Pressable>
      )
    }
    return null;
  };

  React.useEffect(() => {
    if (Object.keys(data).length != 0) {
      onChangeuserInfo([data.login, data.bio, data.company, data.hireable, data.location]);
    }
  }, [data])

  return (
    <View style={styles.container}>
      <Text>Rechercher un utilisateur GIT</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Pressable
        style={styles.button}
        onPress={
          async () => {
            fetchUser(text);
          }
        }>
        <Text style={styles.FontTextColor}>Rechercher</Text>
      </Pressable>
      {Object.keys(data).length != 0 &&
        <View style={styles.containerCard}>
          <View style={styles.card}>
            <Image
              style={styles.LogoUser}
              source={{
                uri: data.avatar_url,
              }}
            />
            <View style={styles.UserInfo}>
              {
                userInfo.map(item => (
                  <Text style={styles.FontTextColor}>{item}</Text>
                ))}
            </View>
            <View style={styles.UserInfo}>
              <Text style={styles.FontTextColor}>Identifiant : {data.id}</Text>
              <Text style={styles.FontTextColor}>Crée le : {data.created_at}</Text>
              <Text style={styles.FontTextColor}>Nombre d'abonnés : {data.followers}</Text>
              <Text style={styles.FontTextColor}>Nombre d'abonnement :{data.following}</Text>
              <Text style={styles.FontTextColor}>Nombre de repository : {data.public_repos}</Text>
            </View>
            <OpenURLButton url={data.html_url}>Rediriger vers ce profil</OpenURLButton>
          </View>
        </View>
      }
      <StatusBar style="auto" />
    </View>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  LogoUser: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  containerCard: {
    height: "auto",
  },
  card: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "steelblue",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,

  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
  UserInfo: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 10,
    width: 160
  },
  FontTextColor: {
    color: "white",
  },
});
