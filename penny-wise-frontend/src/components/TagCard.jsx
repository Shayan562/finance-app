import { Card } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import { Tooltip } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
export const TagCard = (props) => {
	const tag = props.tag;

	return (
		<>
			<Container maxWidth='xs' sx={{ width: "fit-content", m: 2 }}>
				<CssBaseline />
				<Card
					sx={{
						px: 3,
						py: 3,
						borderRadius: 5,
						boxShadow: 10,
					}}>
					<Typography varient='body1' gutterBottom>
						{tag.tagName}
					</Typography>
					<Typography variant='subtitle2' gutterBottom>
						Name
					</Typography>
					<Divider sx={{ my: 1 }} />
					<Typography variant='body1' gutterBottom>
						{tag.tagType}
					</Typography>
					<Typography variant='subtitle2' gutterBottom>
						Tag Type
					</Typography>
				</Card>
			</Container>
		</>
	);
};
