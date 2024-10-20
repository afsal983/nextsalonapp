import { useCallback } from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack, { type StackProps } from "@mui/material/Stack";

import Iconify from "src/components/iconify";

import {
  type UserTableFilters,
  type UserTableFilterValue,
} from "src/types/user";

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: UserTableFilters;
  onFilters: (name: string, value: UserTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function UserTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onFilters("name", "");
  }, [onFilters]);

  const handleRemoveStatus = useCallback(() => {
    onFilters("status", "all");
  }, [onFilters]);

  const handleRemoveRole = useCallback(
    (inputValue: string) => {
      const newValue = filters.userrole.filter((item) => item !== inputValue);

      onFilters("productcategory", newValue);
    },
    [filters.userrole, onFilters]
  );

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: "body2" }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: "text.secondary", ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        {filters.status !== "all" && (
          <Block label="Status:">
            <Chip
              size="small"
              label={filters.status}
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!(filters.userrole.length === 0) && (
          <Block label="Role:">
            {filters.userrole.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => {
                  handleRemoveRole(item);
                }}
              />
            ))}
          </Block>
        )}

        {!!filters.name && (
          <Block label="Keyword:">
            <Chip
              label={filters.name}
              size="small"
              onDelete={handleRemoveKeyword}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: "hidden",
        borderStyle: "dashed",
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: "subtitle2" }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
