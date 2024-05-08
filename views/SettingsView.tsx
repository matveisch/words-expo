import { View, Text, Label, Input, SizableText, Button, XStack } from 'tamagui';
import User from '../components/User';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet } from 'react-native';
import { Check } from '@tamagui/lucide-icons';

type Inputs = {
  wordsPerSet: string;
};

export default function SettingsView() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      wordsPerSet: '20',
    },
  });

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
        <Label>New words per session</Label>
        <SizableText size="$3" style={styles.description}>
          Set desired amount of words you want to learn per studying session.
        </SizableText>
        <XStack style={{ gap: 10 }}>
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
                size="$4"
                borderWidth={2}
              />
            )}
          />
          <Button
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <Check />
          </Button>
        </XStack>
        {errors.wordsPerSet && <Text color="red">This field is required</Text>}
      </View>
      <User />
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    marginTop: -10,
    marginBottom: 10,
    color: 'grey',
  },
});
