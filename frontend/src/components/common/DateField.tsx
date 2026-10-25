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
  /** Plotis pikseliais, kai fullWidth nenaudojamas */
  width?: number;
}

/**
 * Natyvus datos arba datos ir laiko laukas su MUI stiliumi.
 * Etiketė visada pakelta, kad nesidengtų su naršyklės formato užuomina.
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
  const id = useId();

  return (
    <FormControl
      size={size}
      error={Boolean(error)}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={fullWidth ? undefined : { width }}
    >
      <InputLabel htmlFor={id} shrink>
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={type}
        label={label}
        notched
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export default DateField;