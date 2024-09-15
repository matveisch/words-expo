import { observer } from 'mobx-react-lite';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, Switch, View } from 'react-native';
import Toast from 'react-native-root-toast';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../../components/Loader';
import LockedFeature from '../../components/LockedFeature';
import SpecialCodeInput from '../../components/SpecialCodeInput';
import User from '../../components/User';
import { autoCheckStore } from '../../features/autoCheckStore';
import { pushStore } from '../../features/pushStore';
import { sessionStore } from '../../features/sessionStore';
import { wordsLimitStore } from '../../features/wordsLimitStore';
import { toastOptions } from '../../helpers/toastOptions';
import useUser from '../../hooks/useUser';
import Button from '../../ui/Button';
import Description from '../../ui/Description';
import Input from '../../ui/Input';
import InputError from '../../ui/InputError';
import Label from '../../ui/Label';
import { TabBarIcon } from '../../ui/TabBarIcon';

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
              {errors.wordsPerSet && <InputError text="This field is required" />}
            </View>

            <View style={[styles.row, { marginTop: 20 }]}>
              <View>
                <Label text="Auto check" />
                <Description text="Mark words by yourself or let app do it for you." />
              </View>
              <Switch
                value={autoCheckStore.autoCheck}
                onChange={() => autoCheckStore.setAutoCheck(!autoCheckStore.autoCheck)}
              />
            </View>

            <View style={styles.row}>
              <View>
                <Label text="Reminders" />
                <Description text="Would you like to recieve remainders?" />
              </View>
              <Switch value={pushStore.push} onChange={() => pushStore.setPush(!pushStore.push)} />
            </View>

            <View style={styles.row}>
              <View>
                <Label text="Time of remainders" />
                <Description text="Select a convenient remainders time." />
              </View>
              <RNDateTimePicker
                mode="time"
                value={new Date(pushStore.time)}
                onChange={(e, date) => {
                  date && pushStore.setTime(date?.toString());
                }}
              />
            </View>
          </>
        )}

        <SpecialCodeInput />
      </View>

      <User />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Settings;
