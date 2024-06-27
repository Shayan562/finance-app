import Axios from "axios";
import { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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
import Card from "@mui/material/Card";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

export const CreateTag = (props) => {
	const [tags, setTags] = useState([]);
	const [tagName, setTagName] = useState("");
	const [transType, setTransType] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		var flag = false;
		tags.forEach((tag) => {
			if (tag.tagName === tagName && tag.tagType === transType) {
				setErrorMsg("Tag already exists");
				flag = true;
				return;
			}
		});
		setErrorMsg("");
		if (flag) {
			return;
		}

		try {
			const res = await Axios.post("http://localhost:8081/tag", {
				tagName,
				tagType: transType,
			});
			setSuccess(true);
		} catch (err) {
			setErrorMsg(err.response.data.error);
		}
	};

	const updateTransType = (event) => {
		setTransType(event.target.value);
		setErrorMsg("");
	};

	const updateTagName = (event) => {
		setTagName(event.target.value.toLowerCase().trim());
		setErrorMsg("");
	};
	useEffect(() => {
		const getTags = async () => {
			try {
				const res = await Axios.get("http://localhost:8081/tags");
				const tagsTemp = [];
				res.data.tags.forEach((tag) => {
					tag.tagName = tag.tagName.toLowerCase().trim();
					tagsTemp.push(tag);
				});
				setTags(tagsTemp);
			} catch (err) {
				console.log(err);
			}
		};
		getTags();
	}, []);

	return (
		<>
			<Container component='main' maxWidth='xs'>
				{success && <Alert severity='success'>Tag Created.</Alert>}
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<Typography component='h1' variant='h5'>
						Create Tag
					</Typography>
					<Box
						component='form'
						noValidate={false}
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							{/* <Grid item xs={12}> */}
							<FormControl sx={{ m: 1, minWidth: 120 }}>
								<InputLabel id='transaction-type'>Transaction Type</InputLabel>
								<Select
									labelId='transaction-type'
									id='transaction-type'
									value={transType}
									label='transaction-type'
									onChange={updateTransType}>
									<MenuItem value={"Income"}>Income</MenuItem>
									<MenuItem value={"Expense"}>Expense</MenuItem>
								</Select>
								<FormHelperText>Income or Expense</FormHelperText>
							</FormControl>
							{/* </Grid> */}

							<TextField
								id='outlined-multiline-flexible'
								sx={{ m: 1, minWidth: 120 }}
								label='tag-name'
								onChange={updateTagName}
								error={errorMsg !== ""}
							/>
						</Grid>
						{<p style={{ color: "red" }}>{errorMsg}</p>}
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}>
							Create Tag
						</Button>
						<Grid container justifyContent='flex-end'>
							<Grid item></Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
};
