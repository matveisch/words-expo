import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './Settings';
import SubscriptionOffer from '../SubscriptionOffer';
import { defaultColors } from '../../helpers/colors';

type SettingsStackParamList = {
  Settings: undefined;
  SubscriptionOffer: undefined;
};

const SettingsLayout = () => {
  const Stack = createNativeStackNavigator<SettingsStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Group>
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShadowVisible: false,
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="SubscriptionOffer"
          component={SubscriptionOffer}
          options={{
            headerShadowVisible: false,
            headerTitle: 'Unlock WordEm Pro Features',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: defaultColors.activeColor,
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default SettingsLayout;
