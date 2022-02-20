import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { FastFieldProps, Field } from "formik";
import { useState } from "react";
import { TRegisterValues } from "../lib/formik-init";

interface IProps {
  name: string;
  label: string;
  passwordType?: "new" | "current";
}

const CustomInput = ({ name, label, passwordType }: IProps) => {
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);

  const placeholder: Record<string, string> = {
    fullName: "John Doe",
    email: "johndoe@domain.com"
  };

  const autoComplete: Partial<Record<string, string>> = {
    fullName: "name",
    email: "email",
    password: passwordType ? `${passwordType}-password` : undefined
  };

  const handleToggleVisibility = () => setIsPasswordShowing(!isPasswordShowing);

  return (
    <Field id={`${name}-input`} name={name}>
      {({
        field,
        form: { isSubmitting },
        meta: { touched, error }
      }: FastFieldProps<TRegisterValues>) => (
        <FormControl
          id={name}
          margin="normal"
          size="small"
          sx={{
            "& label": {
              fontSize: "0.875rem"
            }
          }}
          fullWidth
        >
          <label htmlFor={`${name}-input`}>{label}</label>
          <OutlinedInput
            id={`${name}-input`}
            {...field}
            type={
              name === "password" && !isPasswordShowing ? "password" : "text"
            }
            error={Boolean(touched && error)}
            placeholder={placeholder[name]}
            autoComplete={autoComplete[name]}
            disabled={isSubmitting}
            inputProps={{ required: true }}
            endAdornment={
              name === "password" ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleVisibility}
                    aria-label={
                      isPasswordShowing ? "Hide Password" : "Show Password"
                    }
                  >
                    {isPasswordShowing ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : undefined
            }
            sx={{
              mt: 0.5,
              bgcolor: "#F4F4F4"
            }}
          />
          {touched && error && (
            <FormHelperText
              id={`${name}-error`}
              sx={{ color: ({ palette }) => palette.error.main }}
            >
              {error}
            </FormHelperText>
          )}
        </FormControl>
      )}
    </Field>
  );
};

export default CustomInput;
