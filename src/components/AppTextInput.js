import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';

/**
 * Wrapper TextInput qui neutralise le rectangle noir sur Expo Web
 * et l'underline Android. Utilise forwardRef pour les écrans avec refs (OTP...).
 */
const AppTextInput = forwardRef(function AppTextInput({ style, ...props }, ref) {
  return (
    <TextInput
      ref={ref}
      underlineColorAndroid="transparent"
      style={[{ outlineWidth: 0 }, style]}
      {...props}
    />
  );
});

export default AppTextInput;
