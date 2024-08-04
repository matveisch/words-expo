import { View, StyleSheet, Keyboard } from 'react-native';
import Label from '../ui/Label';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { TabBarIcon } from '../ui/TabBarIcon';
import { secretCodeStore } from '../features/secretCodeStore';
import useUpdateUser from '../hooks/useUpdateUser';
import { sessionStore } from '../features/sessionStore';
import { observer } from 'mobx-react-lite';

type Inputs = {
  code: string;
};

const SpecialCodeInput = observer(() => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      code: secretCodeStore.secretCode,
    },
  });
  const { mutate } = useUpdateUser(sessionStore.session?.user.id || '', true);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    secretCodeStore.setSecretCode(data.code);
    // @ts-ignore
    if (data.code === process.env.SECRET_CODE) {
      mutate();
    }

    Keyboard.dismiss();
  };

  return (
    <View>
      <Label text="Special code" />
      <View style={styles.container}>
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={styles.input}
              onChangeText={(text) => onChange(text)}
              onBlur={onBlur}
              value={value}
              secureTextEntry={true}
              placeholder="Your special code"
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)}>
          <TabBarIcon name="check" size={20} />
        </Button>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
  },
});

export default SpecialCodeInput;
