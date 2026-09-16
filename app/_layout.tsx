import { Stack } from 'expo-router';
import { I18nManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
I18nManager.allowRTL(true); I18nManager.forceRTL(true);
export default function Layout(){useEffect(()=>{I18nManager.allowRTL(true);},[]); return <GestureHandlerRootView style={{flex:1}}><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:'#0B0F1A'}}}/></GestureHandlerRootView>}
