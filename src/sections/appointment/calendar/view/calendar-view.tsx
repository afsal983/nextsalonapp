"use client";

import useSWR from "swr";
import Calendar from "@fullcalendar/react"; // => request placed at the top
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import { useState, useEffect, useCallback } from "react";
import interactionPlugin from "@fullcalendar/interaction";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import { Select, SelectChangeEvent } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import { fetcher } from "src/utils/axios";
import { isAfter, isBetween } from "src/utils/format-time";

import { CALENDAR_COLOR_OPTIONS } from "src/_mock/_calendar";
import {
  updateEvent,
  useGetEvents,
} from "src/app/api/salonapp/appointments/calendar";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";

import { EmployeeItem } from "src/types/employee";
import {
  ICalendarEvent,
  ICalendarFilters,
  ICalendarFilterValue,
} from "src/types/calendar";

import { StyledCalendar } from "../styles";
import CalendarForm from "../calendar-form";
import { useEvent, useCalendar } from "../hooks";
import CalendarToolbar from "../calendar-toolbar";
import CalendarFilters from "../calendar-filters";
import CalendarFiltersResult from "../calendar-filters-result";

// ----------------------------------------------------------------------

const start = new Date();
start.setDate(start.getDate() - 120);

const end = new Date();
end.setDate(end.getDate() + 30);

const defaultFilters: ICalendarFilters = {
  colors: [],
  startDate: start,
  endDate: end,
};

// ----------------------------------------------------------------------

export default function CalendarView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const smUp = useResponsive("up", "sm");

  const openFilters = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedEmployee, setSelectedEmployee] = useState("");

  const appFilters = {
    employeeId: Number(selectedEmployee),
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const { events, eventsLoading } = useGetEvents(appFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const { data: employees, isLoading: isemployeeLoading } = useSWR(
    "/api/salonapp/employee",
    fetcher
  );
  const { data: services, isLoading: isservicesLoading } = useSWR(
    "/api/salonapp/services",
    fetcher
  );

  const {
    calendarRef,
    //
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onInitialView,
    //
    openForm,
    onOpenForm,
    onCloseForm,
    //
    selectEventId,
    selectedRange,
    //
    onClickEventInFilters,
  } = useCalendar();

  const currentEvent = useEvent(
    events,
    selectEventId,
    selectedRange,
    openForm,
    Number(selectedEmployee)
  );

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const handleFilters = useCallback(
    (name: string, value: ICalendarFilterValue) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset =
    !!filters.colors.length || (!!filters.startDate && !!filters.endDate);

  const dataFiltered = applyFilter({
    inputData: events,
    filters,
    dateError,
  });

  const handleEmployeeChange = (event: SelectChangeEvent<string>) => {
    setSelectedEmployee(event.target.value);
  };

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  if (isemployeeLoading || isservicesLoading) return <div>Loading...</div>;

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h4">Calendar</Typography>
          <Select
            native
            name="employee"
            label="Employee"
            onChange={handleEmployeeChange}
          >
            <option key={0}>Select</option>
            {employees.data.map((employee: EmployeeItem) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </Select>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpenForm}
          >
            New Event
          </Button>
        </Stack>

        {canReset && renderResults}

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              loading={eventsLoading}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
            />

            <Calendar
              weekends
              editable
              droppable
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              select={onSelectRange}
              eventClick={onClickEvent}
              height={smUp ? 720 : "auto"}
              eventDrop={(arg) => {
                onDropEvent(arg, updateEvent);
              }}
              eventResize={(arg) => {
                onResizeEvent(arg, updateEvent);
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentEvent?.id ? "Edit Event" : "Add Event"}</>}
        </DialogTitle>

        <CalendarForm
          currentEvent={currentEvent}
          employees={employees?.data}
          customer_id={currentEvent?.customer_id || 0}
          SelectedCustomer={currentEvent?.Customer || null}
          Product={currentEvent?.Product || null}
          employee={selectedEmployee}
          services={services?.data}
          colorOptions={CALENDAR_COLOR_OPTIONS}
          onClose={onCloseForm}
          appFilters={appFilters}
        />
      </Dialog>

      <CalendarFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        canReset={canReset}
        onResetFilters={handleResetFilters}
        //
        dateError={dateError}
        //
        events={events}
        colorOptions={CALENDAR_COLOR_OPTIONS}
        onClickEvent={onClickEventInFilters}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  dateError,
}: {
  inputData: ICalendarEvent[];
  filters: ICalendarFilters;
  dateError: boolean;
}) {
  const { colors, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map((el) => el[0]);

  if (colors.length) {
    inputData = inputData.filter((event) =>
      colors.includes(event.color as string)
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((event) =>
        isBetween(event.start, startDate, endDate)
      );
    }
  }

  return inputData;
}
