import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { EQUIPMENT_OPTIONS } from "../../constants/RoomOptions";

/**
 * Values of the room filter form fields.
 * All values are stored as strings, as they come directly from the inputs.
 */
export interface RoomFilterValues {
  // Minimum room capacity entered by the user.
  minCapacity: string;
  // Floor number entered by the user.
  floor: string;
  // Selected equipment option, or an empty string for any equipment.
  equipment: string;
}

/**
 * Validation error messages for each filter field.
 * A field has an entry only when its value is invalid.
 */
export type RoomFilterErrors = Partial<Record<keyof RoomFilterValues, string>>;

// Define the default filter values used for the initial state and for resetting the form.
export const EMPTY_FILTER_VALUES: RoomFilterValues = {
  minCapacity: "",
  floor: "",
  equipment: "",
};

/**
 * Props accepted by the RoomFilters component.
 */
interface RoomFiltersProps {
  // Current values of the filter fields.
  values: RoomFilterValues;
  // Validation errors to display next to the fields.
  errors?: RoomFilterErrors;
  // Disables all inputs and buttons, for example while data is loading.
  disabled?: boolean;
  // Called with the updated values whenever any field changes.
  onChange: (values: RoomFilterValues) => void;
  // Called when the user submits the form to apply the filters.
  onApply: () => void;
  // Called when the user clears the filters.
  onReset: () => void;
}

/**
 * Renders a form with filters for the room list: minimum capacity,
 * floor and equipment, along with buttons to apply or clear the filters.
 */
export function RoomFilters({
  values,
  errors = {},
  disabled = false,
  onChange,
  onApply,
  onReset,
}: RoomFiltersProps) {
  return (
    // Render the filters as a form so they can also be applied by pressing Enter.
    <Box
      component="form"
      noValidate
      onSubmit={(event) => {
        // Prevent the default page reload and apply the filters instead.
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
      {/* Input for the minimum room capacity. */}
      <TextField
        label="Minimum Capacity"
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

      {/* Input for the floor number. */}
      <TextField
        label="Floor"
        type="number"
        size="small"
        value={values.floor}
        onChange={(event) => onChange({ ...values, floor: event.target.value })}
        error={Boolean(errors.floor)}
        helperText={errors.floor}
        disabled={disabled}
        sx={{ width: 130 }}
      />

      {/* Dropdown for selecting the required equipment. */}
      <FormControl
        size="small"
        sx={{ width: 240 }}
        error={Boolean(errors.equipment)}
        disabled={disabled}
      >
        {/* Keep the label shrunk so it does not overlap the "Any" option. */}
        <InputLabel id="room-filter-equipment-label" shrink>
          Equipment
        </InputLabel>
        <Select
          labelId="room-filter-equipment-label"
          label="Equipment"
          displayEmpty
          notched
          value={values.equipment}
          onChange={(event) =>
            onChange({ ...values, equipment: String(event.target.value) })
          }
        >
          {/* Allow clearing the equipment filter. */}
          <MenuItem value="">Any</MenuItem>
          {/* Render one menu item for each available equipment option. */}
          {EQUIPMENT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={String(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {/* Show the validation error below the dropdown, if any. */}
        {errors.equipment && <FormHelperText>{errors.equipment}</FormHelperText>}
      </FormControl>

      {/* Render the buttons for applying and clearing the filters. */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained" disabled={disabled}>
          Filter
        </Button>
        <Button type="button" onClick={onReset} disabled={disabled}>
          Clear
        </Button>
      </Box>
    </Box>
  );
}

export default RoomFilters;