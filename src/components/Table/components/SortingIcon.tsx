import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { SvgIconProps } from "@mui/material";
import { SortDirection } from "@tanstack/react-table";

function SortingIcon({
  sorted,
  canSort,
  sx,
  ...args
}: { sorted: false | SortDirection; canSort: boolean } & SvgIconProps) {
  const icon = {
    asc: ArrowUpwardIcon,
    desc: ArrowDownwardIcon,
  };

  if (!canSort) {
    return null;
  }

  if (sorted) {
    const Icon = icon[sorted];
    return <Icon {...args} />;
  }
  return <UnfoldMoreIcon {...args} />;
}

export default SortingIcon;
