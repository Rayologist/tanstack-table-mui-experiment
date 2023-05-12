import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function GlobalFilter(props: TextFieldProps) {
  const { placeholder, InputProps, ...rest } = props;
  return (
    <TextField
      placeholder={placeholder || "Search"}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        ...InputProps,
      }}
      {...rest}
    />
  );
}

export default GlobalFilter;
