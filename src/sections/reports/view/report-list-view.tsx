'use client';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  _roles,
  JOB_SORT_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
} from 'src/_data';

import { EmptyContent } from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IReportItem, ReportFilters } from 'src/types/report';

import JobSort from '../job-sort';
import ReportList from '../report-list';
import JobFilters from '../job-filters';
import ReportSearch from '../report-search';
import { report_types } from './_reporttypes';
import ReportFiltersResult from '../report-filters-result';

// ----------------------------------------------------------------------

const defaultFilters: ReportFilters = {
  name: [],
};

// ----------------------------------------------------------------------

export default function ReportListView() {
  const settings = useSettingsContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const search = useSetState<{
    query: string;
    results: IReportItem[];
  }>({ query: '', results: [] });

  const filters = useSetState<ReportFilters>({
    name: [],
  });

  const dataFiltered = applyFilter({
    inputData: report_types,
    filters: filters.state,
    sortBy,
  });

  const canReset = filters.state.name.length > 0;

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      search.setState({ query: inputValue });

      if (inputValue) {
        const results = report_types.filter(
          (job) => job.category.toLowerCase().indexOf(search.state.query.toLowerCase()) !== -1
        );

        search.setState({ results });
      }
    },
    [search]
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ReportSearch search={search} onSearch={handleSearch} />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <JobFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            roles: _roles,
            benefits: JOB_BENEFIT_OPTIONS.map((option) => option.label),
            employmentTypes: JOB_EMPLOYMENT_TYPE_OPTIONS.map((option) => option.label),
            experiences: ['all', ...JOB_EXPERIENCE_OPTIONS.map((option) => option.label)],
          }}
        />

        <JobSort sort={sortBy} onSort={handleSortBy} sortOptions={JOB_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ReportFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Reports',
            href: paths.dashboard.report.root,
          },
          { name: 'List' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}

      <ReportList reports={dataFiltered} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IReportItem[];
  filters: ReportFilters;
  sortBy: string;
};

const applyFilter = ({ inputData, filters, sortBy }: ApplyFilterProps) => {
  const { name } = filters;

  // FILTERS
  if (name.length) {
    // inputData = inputData.filter((job) => name.includes(job.name));
    inputData = report_types
      .map((category) => {
        const filteredItems = category.items.filter((item) => name.includes(item.name));
        if (filteredItems.length > 0) {
          return {
            ...category,
            items: filteredItems,
          };
        }
        return {
          ...category,
          items: [],
        };
      })
      .filter((category) => category !== null);
  }
  return inputData;
};
