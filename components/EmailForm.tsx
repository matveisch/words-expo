import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import { supabase } from '../helpers/initSupabase';
import { Button, Input, Label, Text } from 'tamagui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useCreateUser from '../hooks/useCreateUser';

type Inputs = {
  email: string;
  password: string;
};

export default function EmailForm() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const createUserMutation = useCreateUser({
    email: getValues('email'),
    password: getValues('password'),
  });

  async function signInWithEmail(data: Inputs) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
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
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    createUserMutation.mutate();
    Keyboard.dismiss();
    // reset();
    // setOpenCreateDeckModal(false);
  };

  return (
    <View style={styles.container}>
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
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
