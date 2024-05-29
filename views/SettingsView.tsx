import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, View, Text } from 'react-native';
import User from '../components/User';
import { TabBarIcon } from '../ui/TabBarIcon';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Description from '../ui/Description';
import Button from '../ui/Button';
import { observer } from 'mobx-react';
import { wordsLimitStore } from '../features/wordsLimitStore';
import Toast from 'react-native-root-toast';
import { toastOptions } from '../helpers/toastOptions';

type Inputs = {
  wordsPerSet: string;
};

const SettingsView = observer(() => {
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
  };

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
        <Label text="New words per session" />
        <Description text="Set desired amount of words you want to learn per studying session." />
        <View style={{ gap: 10, flexDirection: 'row' }}>
          <Controller
            name="wordsPerSet"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={{ flex: 1 }}
                onChangeText={(text) => onChange(text)}
                onBlur={onBlur}
                keyboardType="number-pad"
                value={value}
              />
            )}
          />
          <Button
            onPress={() => {
              handleSubmit(onSubmit);
              Keyboard.dismiss();
            }}
          >
            <TabBarIcon name="check" size={20} />
          </Button>
        </View>
        {errors.wordsPerSet && <Text style={{ color: 'red' }}>This field is required</Text>}
      </View>

      <User />
    </View>
  );
});

export default SettingsView;
