import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { supabase } from '../helpers/initSupabase';
import { Controller, useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Label from '../ui/Label';
import Input from '../ui/Input';
import InputError from '../ui/InputError';
import PressableArea from '../ui/PressableArea';

type Inputs = {
  email: string;
  password: string;
};

export default function EmailForm() {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function signInWithEmail(data: Inputs) {
    setLoading(true);
    const { error, data: session } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    // if (!error) navigation.navigate('Decks', { userId: session.user?.id });
  }

  async function signUpWithEmail(data: Inputs) {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
    if (!error && !session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  // const onSubmit: SubmitHandler<Inputs> = (data) => {
  //   console.log(data);
  //   Keyboard.dismiss();
  //   // reset();
  //   // setOpenCreateDeckModal(false);
  // };

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: '#fff',
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: insets.top,
        height: '100%',
      }}
    >
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Label text="Email" />
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChangeText={(text) => onChange(text)}
              onBlur={onBlur}
              value={value}
              placeholder="email@address.com"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <InputError text="This field is required" />}
      </View>
      <View style={styles.verticallySpaced}>
        <Label text="Password" />
        <Controller
          name="password"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChangeText={(text) => onChange(text)}
              onBlur={onBlur}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Password"
            />
          )}
        />
        {errors.password && <InputError text="This field is required" />}
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <PressableArea disabled={loading} onPress={handleSubmit(signInWithEmail)}>
          <Text>Sign in</Text>
        </PressableArea>
      </View>
      <View style={styles.verticallySpaced}>
        <PressableArea disabled={loading} onPress={handleSubmit(signUpWithEmail)}>
          <Text>Sign up</Text>
        </PressableArea>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    // marginTop: 20,
  },
});
