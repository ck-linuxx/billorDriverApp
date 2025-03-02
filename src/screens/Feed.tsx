import { Button } from '@rneui/themed';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/AuthContext';

export default function Feed() {
  const { setAuth } = useAuth()


  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    setAuth(null)
    if (error) {
      Alert.alert("Error")
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>

      <Pressable onPress={handleSignOut}> <Text>SignOut</Text></Pressable>
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
  title: {
    fontSize: 22,
    fontWeight: "bold"
  }
});
