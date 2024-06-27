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

export const CreateTransaction = (props) => {
	const [tags, setTags] = useState([]);
	const [transType, setTransType] = useState("");
	const [transRepeatFreq, setTransRepeatFreq] = useState("");
	const [transDate, setTransDate] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [availableTags, setAvailableTags] = useState([]);
	const [transAmount, setTransAmount] = useState(0);
	const [note, setNote] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		const transactions = {
			transactionType: transType,
			transactionRepeatFreq: transRepeatFreq,
			amount: transAmount,
			transactionDate: transDate,
			transactionTags: selectedTags,
		};
		if (note !== "") {
			transactions["note"] = note;
		}
		console.log(transactions);
    //need to checks before post request
	};

	const updateTransType = (event) => {
		setTransType(event.target.value);
		setSelectedTags([]);
		setAvailableTags(
			tags.filter((tag) => {
				return tag.tagType === event.target.value;
			})
		);
	};
	const updateAmount = (event) => {
		const val = event.target.value;
		if (!isNaN(val)) {
			setTransAmount(Number(event.target.value));
			console.log(Number(event.target.value));
		}
	};
	const updateNote = (event) => {
		setNote(event.target.value);
	};
	const updateTransRepeatFreq = (event) => {
		setTransRepeatFreq(event.target.value);
	};
	const updateTransDate = (event) => {
		const mon = event.month();
		const day = event.day();

		const dateTemp = `${event.year()}-${mon < 9 ? "0" + String(mon) : mon}-${
			day < 9 ? "0" + String(day) : day
		}T00:00:00Z`;
		console.log(dateTemp);
		setTransDate(dateTemp);
	};
	useEffect(() => {
		const getTags = async () => {
			try {
				const res = await Axios.get("http://localhost:8081/tags");
				setTags(res.data.tags);
				// setSelectedTags(res.data.tags);
				console.log(tags);
			} catch (err) {
				console.log(err);
			}
		};
		getTags();
	}, []);
	const addTagToSelected = (event) => {
		const id = Number(event.currentTarget.id);
		setAvailableTags((prev) => {
			return prev?.filter((tag) => {
				return tag.tagID !== id;
			});
		});
		setSelectedTags((prev) => {
			return [
				...prev,
				tags.find((tag) => {
					return tag.tagID === id;
				}),
			];
		});
		console.log(id);
		console.log(event.currentTarget);
	};
	const removeTagFromSelected = (event) => {
		console.log(event);
		const id = Number(event.currentTarget.id);
		setSelectedTags((prev) => {
			return prev?.filter((tag) => {
				return tag.tagID !== id;
			});
		});
		setAvailableTags((prev) => {
			return [
				...prev,
				tags.find((tag) => {
					return tag.tagID === id;
				}),
			];
		});
		console.log(event.currentTarget.id);
		console.log(event.currentTarget);
	};

	return (
		<>
			<div>
				{tags?.map((element) => {
					// if (element.tagType==='Income')
					return (
						<p>
							Tag ID: {element.tagID}
							Tag Name: {element.tagName}
							Tag Type: {element.tagType}
						</p>
					);
				})}
			</div>
			<Container component='main' maxWidth='xs'>
				{/* <CssBaseline /> */}
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<Typography component='h1' variant='h5'>
						Create Transaction
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

							<FormControl sx={{ m: 1, minWidth: 120 }}>
								<InputLabel id='transaction-repeat-frequecy'>
									Transaction Repeat Frequency
								</InputLabel>
								<Select
									labelId='transaction-repeat-frequecy'
									id='transaction-repeat-frequecy'
									value={transRepeatFreq}
									label='transaction-repeat-frequecy'
									onChange={updateTransRepeatFreq}>
									<MenuItem value={"n"}>None</MenuItem>
									<MenuItem value={"w"}>Weekly</MenuItem>
									<MenuItem value={"m"}>Monthly</MenuItem>
									<MenuItem value={"y"}>Yearly</MenuItem>
								</Select>
								<FormHelperText>
									How often should the transaction auto reoccur
								</FormHelperText>
							</FormControl>

							<FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
								<InputLabel htmlFor='outlined-adornment-amount'>
									Amount
								</InputLabel>
								<OutlinedInput
									id='outlined-adornment-amount'
									startAdornment={
										<InputAdornment position='start'>$</InputAdornment>
									}
									label='Amount'
									onChange={updateAmount}
								/>
							</FormControl>
							<TextField
								id='outlined-multiline-flexible'
								sx={{ m: 1, minWidth: 120 }}
								label='Note'
								multiline
								rows={4}
								onChange={updateNote}
							/>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DemoContainer
									sx={{ m: 1, minWidth: 120 }}
									components={["DatePicker"]}>
									<DatePicker
										label='Date'
										format='DD-MM-YYYY'
										onChange={updateTransDate}
									/>
								</DemoContainer>
							</LocalizationProvider>
							<Card sx={{ ml: 1, mt: 1, minWidth: 350, minHeight: 50, p: 2 }}>
								<Typography component='h1' variant='body2' sx={{ pb: 1 }}>
									Selected Tags
								</Typography>
								<Grid container spacing={1} alignItems={"center"}>
									{selectedTags?.map((tag) => {
										// if (tag.type === transType) {
										return (
											<Grid item>
												<Chip
													label={tag.tagName + " ❌"}
													variant='outlined'
													id={tag.tagID}
													onClick={removeTagFromSelected}

													// deleteIcon={<DeleteIcon />}
												/>
											</Grid>
										);
										// }
									})}
								</Grid>
							</Card>
							<Card sx={{ ml: 1, mt: 2, minWidth: 350, minHeight: 50, p: 2 }}>
								<Typography component='h1' variant='body2' sx={{ pb: 1 }}>
									Available Tags
								</Typography>
								<Grid container spacing={1} alignItems={"center"}>
									{availableTags?.map((tag) => {
										// if (tag.type === transType) {
										return (
											<Grid item>
												<Chip
													label={tag.tagName + " ✅"}
													variant='outlined'
													id={tag.tagID}
													onClick={addTagToSelected}
												/>
											</Grid>
										);
										// }
									})}
								</Grid>
							</Card>
							{/* <br /> */}
							{/* <Stack
								direction='row'
								maxWidth={120}
								spacing={1}
								wrap={"wrap"}
								alignItems={"flex-start"}>
								<Chip
									label='Clickable'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
								<Chip
									label='Clickable'
									variant='outlined'
									onClick={() => {
										console.log("cllicked");
									}}
								/>
							</Stack> */}
						</Grid>
						{/* <p style={{color:"red"}}>{errorMsg}</p> */}
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}>
							Save
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
