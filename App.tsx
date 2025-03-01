import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './src/routes/index.routes';
import "./src/themes/global.css"

export default function App() {
  return (
    <Routes />
  );
}