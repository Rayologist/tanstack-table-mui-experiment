import {
  Popover,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  useTheme,
  Box,
  Stack,
} from "@mui/material";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import { Table } from "@tanstack/react-table";
import { ReactNode, useCallback, useState } from "react";

type ColumnToggleProps<RowData> = Pick<
  Table<RowData>,
  | "getIsAllColumnsVisible"
  | "getAllLeafColumns"
  | "toggleAllColumnsVisible"
  | "getIsSomeColumnsVisible"
>;

function ColumnToggle<RowData>(props: ColumnToggleProps<RowData>) {
  const {
    getAllLeafColumns,
    getIsAllColumnsVisible,
    toggleAllColumnsVisible,
    getIsSomeColumnsVisible,
  } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const theme = useTheme();

  const columns = getAllLeafColumns();
  const allChecked = getIsAllColumnsVisible();
  const indeterminate = getIsSomeColumnsVisible() && !allChecked;

  return (
    <>
      <IconButton onClick={handleClick} size="large">
        <ViewWeekOutlinedIcon fontSize="large"/>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box padding="1rem">
          <Typography
            mb="1rem"
            sx={{ fontWeight: 500 }}
            color={theme.palette.secondary.dark}
          >
            Column Toggle
          </Typography>

          <FormControlLabel
            label="Toggle All"
            control={
              <Checkbox
                checked={allChecked}
                indeterminate={indeterminate}
                onChange={() => toggleAllColumnsVisible(!allChecked)}
              />
            }
          />
          <Stack spacing={0}>
            {columns.map((column) => {
              if (!column.getCanHide()) return null;
              return (
                <FormControlLabel
                  key={column.id}
                  label={
                    (column.columnDef.header as ReactNode | undefined) ??
                    column.id
                  }
                  sx={{ ml: 3 }}
                  control={
                    <Checkbox
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />
                  }
                />
              );
            })}
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

export default ColumnToggle;
