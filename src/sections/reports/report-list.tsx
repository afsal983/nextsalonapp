import { useCallback } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Pagination, { paginationClasses } from "@mui/material/Pagination";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { IReportItem } from "src/types/report";

import ReportItem from "./report-item";

// ----------------------------------------------------------------------

type Props = {
  reports: IReportItem[];
};

export default function ReportList({ reports }: Props) {
  const router = useRouter();

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.report.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.report.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id: string) => {
    console.info("DELETE", id);
  }, []);

  return (
    <>
      {reports.map((report) => (
        <>
          <Stack spacing={0}>
            <Typography variant="h6" sx={{ color: "text.disabled", mb: 0 }}>
              {report.category}
            </Typography>

            <Divider sx={{ mt: 0, borderStyle: "solid" }} />
          </Stack>
          <Box
            gap={3}
            sx={{ p: 2 }}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
          >
            {report.items.map((reportitem) => (
              <ReportItem
                key={reportitem.id}
                report={reportitem}
                onView={() => handleView(reportitem.id)}
                onEdit={() => handleEdit(reportitem.id)}
                onDelete={() => handleDelete(reportitem.id)}
              />
            ))}
          </Box>
        </>
      ))}

      {reports.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: "center",
            },
          }}
        />
      )}
    </>
  );
}
