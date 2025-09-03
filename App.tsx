import React from 'react';
import { StatusBar } from 'expo-status-bar';
import LauncherScreen from './src/screens/LauncherScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" hidden={true} />
      <LauncherScreen />
    </>
  );
}
