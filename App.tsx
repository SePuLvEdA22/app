import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { ServiceProvider } from './src/contexts/ServiceContext';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      <AuthProvider>
        <ServiceProvider>
          <AppNavigator />
        </ServiceProvider>
      </AuthProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

export default App;
