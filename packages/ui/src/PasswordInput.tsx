"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input, InputProps } from "./Input";

export interface PasswordInputProps extends Omit<
  InputProps,
  "type" | "rightIcon"
> {}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      ref={ref}
      type={showPassword ? "text" : "password"}
      leftIcon={<Lock className="h-4 w-4" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[#6E6678] hover:text-[#17131F] focus:outline-none cursor-pointer transition-colors p-1"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      }
    />
  );
});

PasswordInput.displayName = "PasswordInput";
