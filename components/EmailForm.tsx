import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../helpers/initSupabase';
import { Button, Input, Label, Text } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProps } from '../App';

type Inputs = {
  email: string;
  password: string;
};

export default function EmailForm({ navigation }: NavigationProps) {
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
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    if (!error) navigation.navigate('Decks');
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
        <Label>Email</Label>
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
              size="$4"
              borderWidth={2}
              placeholder="email@address.com"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <Text color="red">This field is required</Text>}
      </View>
      <View style={styles.verticallySpaced}>
        <Label>Password</Label>
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
              size="$4"
              borderWidth={2}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Password"
            />
          )}
        />
        {errors.password && <Text color="red">This field is required</Text>}
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button disabled={loading} onPress={handleSubmit(signInWithEmail)}>
          Sign in
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button disabled={loading} onPress={handleSubmit(signUpWithEmail)}>
          Sign up
        </Button>
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
