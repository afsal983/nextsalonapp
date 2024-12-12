import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

import { IReportItem } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (inputValue: string) => void;
  search: UseSetStateReturn<{
    query: string;
    results: IReportItem[];
  }>;
};

export default function ReportSearch({ search, onSearch }: Props) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(paths.dashboard.report.details(id));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (search.state.query) {
      if (event.key === 'Enter') {
        const selectProduct = search.state.results.filter(
          (job) => job.category === search.state.query
        )[0];

        handleClick(selectProduct.category);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={search.state.results.map((category) => category.items).flat()}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={search.state.query} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, report, { inputValue }) => {
        const matches = match(report.name, inputValue);
        const parts = parse(report.name, matches);

        return (
          <Box component="li" {...props} onClick={() => handleClick(report.id)} key={report.id}>
            <div>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}
