import { useAuth } from '@clerk/clerk-expo';
import { View, Text, Button } from 'react-native';

export default function Profile() {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>Profile</Text>

      <Button title='Sign Out' onPress={() => signOut()} />
    </View>
  );
}
