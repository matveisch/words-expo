import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, View, Text, Switch } from 'react-native';
import Toast from 'react-native-root-toast';
import { observer } from 'mobx-react';

import User from '../../components/User';
import { TabBarIcon } from '../../ui/TabBarIcon';
import Label from '../../ui/Label';
import Input from '../../ui/Input';
import Description from '../../ui/Description';
import Button from '../../ui/Button';
import { wordsLimitStore } from '../../features/wordsLimitStore';
import { toastOptions } from '../../helpers/toastOptions';
import { autoCheckStore } from '../../features/autoCheckStore';
import useUser from '../../hooks/useUser';
import { sessionStore } from '../../features/sessionStore';
import LockedFeature from '../../components/LockedFeature';
import Loader from '../../components/Loader';

type Inputs = {
  wordsPerSet: string;
};

const Settings = observer(() => {
  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      wordsPerSet: wordsLimitStore.limit.toString(),
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    wordsLimitStore.setLimit(Number(data.wordsPerSet));
    Toast.show('Limit updated', toastOptions);
    Keyboard.dismiss();
  };

  function toggleSwitch() {
    autoCheckStore.setAutoCheck(!autoCheckStore.autoCheck);
  }

  if (!user) return <Loader />;

  return (
    <View
      style={{
        height: '100%',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <View>
        {!user.pro ? (
          <LockedFeature text="Get pro version to get access to additional settings" />
        ) : (
          <>
            <View>
              <Label text="New words per session" />
              <Description text="Set desired amount of words (up to 100) you want to learn per studying session." />
              <View style={{ gap: 10, flexDirection: 'row' }}>
                <Controller
                  name="wordsPerSet"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      style={{ flex: 1 }}
                      onChangeText={(text) => onChange(text)}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      value={value}
                      maxLength={2}
                    />
                  )}
                />
                <Button onPress={handleSubmit(onSubmit)}>
                  <TabBarIcon name="check" size={20} />
                </Button>
              </View>
              {errors.wordsPerSet && <Text style={{ color: 'red' }}>This field is required</Text>}
            </View>

            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Label text="Auto check" />
                <Description text="Mark words by yourself or let app do it for you." />
              </View>
              <Switch value={autoCheckStore.autoCheck} onChange={toggleSwitch} />
            </View>
          </>
        )}
      </View>

      <User />
    </View>
  );
});

export default Settings;
