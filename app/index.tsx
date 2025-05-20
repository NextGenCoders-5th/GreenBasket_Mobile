// import { View, Text } from 'react-native';
// import React from 'react';
// import { Link, router } from 'expo-router';
// import TextButton from '@/components/ui/TextButton';

// export default function Welcome() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//         backgroundColor: '#f0f0f0',
//         gap: 20,
//       }}
//     >
//       <Text
//         style={{
//           fontSize: 28,
//         }}
//       >
//         Welcome
//       </Text>

//       <TextButton
//         title='Lets Get Started'
//         onPress={() => {
//           router.navigate('/(tabs)/home');
//         }}
//       />
//     </View>
//   );
// }

// app/index.tsx
import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import TextButton from '@/components/ui/TextButton'; // Assuming this is your custom button
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function WelcomeScreen() {
  const colors = useColorTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        {/* Optional: Add your app logo */}
        <Image
          source={require('@/assets/images/welcome.png')} // Replace with your actual logo path
          style={styles.logo}
          resizeMode='contain'
        />

        <Text style={[styles.title, { color: colors['gray-900'] }]}>
          Welcome to MiniExpress!
        </Text>
        <Text style={[styles.subtitle, { color: colors['gray-600'] }]}>
          Your one-stop shop for fresh produce.
        </Text>

        <TextButton
          title="Let's Get Started"
          onPress={() => {
            router.navigate('/(tabs)/home'); // Navigate to the home tab
          }}
          style={[styles.button, { backgroundColor: colors.primary }]}
          titleStyle={{ color: colors.white, fontFamily: 'Inter-SemiBold' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30, // Increased padding
    gap: 25, // Increased gap
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold', // Use fontWeight for standard boldness
    fontFamily: 'Inter-Bold', // Use custom font
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginBottom: 20, // Add some margin
  },
  button: {
    width: '80%', // Make button wider
    paddingVertical: 12, // Add more padding
    borderRadius: 8,
  },
});
