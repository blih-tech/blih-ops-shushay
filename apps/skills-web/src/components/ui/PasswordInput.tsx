import React from "react";
import { Lock } from "lucide-react";
import { Input, InputProps } from "./Input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ leftIcon = <Lock className="h-4 w-4" />, ...props }, ref) => {
    return <Input ref={ref} type="password" leftIcon={leftIcon} {...props} />;
  }
);

PasswordInput.displayName = "PasswordInput";
