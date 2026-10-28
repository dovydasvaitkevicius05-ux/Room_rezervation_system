import { useId } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

interface DateFieldProps {
  label: string;
  type: "date" | "datetime-local";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  width?: number;
}

/**
 * A reusable date input field with an optional label, error message,
 * and configurable width.
 */
export function DateField({
  label,
  type,
  value,
  onChange,
  error,
  disabled = false,
  size = "medium",
  fullWidth = false,
  width,
}: DateFieldProps) {
  // Generate a unique ID to associate the input with its label.
  const id = useId();

  return (
    <FormControl
      size={size}
      error={Boolean(error)}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={fullWidth ? undefined : { width }}
    >
      {/* Keep the label visible for date and date-time inputs. */}
      <InputLabel htmlFor={id} shrink>
        {label}
      </InputLabel>

      {/* Use a controlled input so its value is managed by the parent. */}
      <OutlinedInput
        id={id}
        type={type}
        label={label}
        notched
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {/* Display validation feedback only when an error is provided. */}
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export default DateField;