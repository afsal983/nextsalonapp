import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";
import Card, { type CardProps } from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { fCurrency } from "src/utils/format-number";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import Scrollbar from "src/components/scrollbar";
import { ColorPreview } from "src/components/color-utils";

// ----------------------------------------------------------------------

interface ItemProps {
  id: string;
  name: string;
  numbersold: string;
  totalprice: string;
}

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function BestProduct({
  title,
  subheader,
  list,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface ProductItemProps {
  product: ItemProps;
}

function ProductItem({ product }: ProductItemProps) {
  const { name, numbersold, totalprice } = product;

  return (
    <Stack direction="row" spacing={2}>
      <Avatar>{name.charAt(0)} </Avatar>
      {/*
      <Avatar
        variant="rounded"
        alt={name}
        src={coverUrl}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />
    */}

      <ListItemText
        primary={
          <Link sx={{ color: "text.primary", typography: "subtitle2" }}>
            {name}
          </Link>
        }
        secondary={
          <>
            <Box
              component="span"
              sx={{ color: totalprice ? "error.main" : "text.secondary" }}
            >
              {fCurrency(totalprice)}
            </Box>
          </>
        }
        primaryTypographyProps={{
          noWrap: true,
        }}
        secondaryTypographyProps={{
          mt: 0.5,
        }}
      />

      {/* <ColorPreview limit={3} colors={product.colors} /> */}
      <Chip
        icon={<FilterNoneIcon />}
        label={`${numbersold} times`}
        variant="outlined"
        color="primary"
      />
    </Stack>
  );
}
