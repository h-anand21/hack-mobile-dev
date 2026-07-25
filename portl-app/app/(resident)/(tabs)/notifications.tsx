import { View } from 'react-native';
import { Redirect } from 'expo-router';

// This file exists only to register the tab route.
// Navigation is handled via tabBarButton in _layout.tsx using router.push
// so this screen is never actually rendered.
export default function NotificationsTabStub() {
  return <Redirect href="/(resident)/notifications" />;
}
