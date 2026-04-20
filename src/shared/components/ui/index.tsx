import React from 'react';
import { Textarea, Button, TextInput, type TextareaProps, type ButtonProps, type TextInputProps } from '@mantine/core';

export const EnhancedTextarea: React.FC<TextareaProps> = (props) => (
  <Textarea autosize minRows={3} {...props} />
);

export const EnhancedInput: React.FC<TextInputProps> = (props) => <TextInput {...props} />;

export const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <Button color="blue" radius="md" {...props} />
);

