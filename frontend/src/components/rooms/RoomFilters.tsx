import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { EQUIPMENT_OPTIONS } from "../../constants/RoomOptions";

export interface RoomFilterValues {
  minCapacity: string;
  floor: string;
  equipment: string;
}

export type RoomFilterErrors = Partial<Record<keyof RoomFilterValues, string>>;

export const EMPTY_FILTER_VALUES: RoomFilterValues = {
  minCapacity: "",
  floor: "",
  equipment: "",
};

interface RoomFiltersProps {
  values: RoomFilterValues;
  errors?: RoomFilterErrors;
  disabled?: boolean;
  onChange: (values: RoomFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
}

export function RoomFilters({
  values,
  errors = {},
  disabled = false,
  onChange,
  onApply,
  onReset,
}: RoomFiltersProps) {
  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <TextField
        label="Minimali talpa"
        type="number"
        size="small"
        value={values.minCapacity}
        onChange={(event) =>
          onChange({ ...values, minCapacity: event.target.value })
        }
        error={Boolean(errors.minCapacity)}
        helperText={errors.minCapacity}
        disabled={disabled}
        sx={{ width: 170 }}
      />

      <TextField
        label="Aukštas"
        type="number"
        size="small"
        value={values.floor}
        onChange={(event) => onChange({ ...values, floor: event.target.value })}
        error={Boolean(errors.floor)}
        helperText={errors.floor}
        disabled={disabled}
        sx={{ width: 130 }}
      />

      <FormControl
        size="small"
        sx={{ width: 240 }}
        error={Boolean(errors.equipment)}
        disabled={disabled}
      >
        <InputLabel id="room-filter-equipment-label" shrink>
          Įranga
        </InputLabel>
        <Select
          labelId="room-filter-equipment-label"
          label="Įranga"
          displayEmpty
          notched
          value={values.equipment}
          onChange={(event) =>
            onChange({ ...values, equipment: String(event.target.value) })
          }
        >
          <MenuItem value="">Bet kokia</MenuItem>
          {EQUIPMENT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={String(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errors.equipment && <FormHelperText>{errors.equipment}</FormHelperText>}
      </FormControl>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained" disabled={disabled}>
          Filtruoti
        </Button>
        <Button type="button" onClick={onReset} disabled={disabled}>
          Išvalyti
        </Button>
      </Box>
    </Box>
  );
}

export default RoomFilters;