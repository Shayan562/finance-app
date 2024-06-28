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
import { Tooltip } from "@mui/material";

export const CreateTransaction = (props) => {
	const [tags, setTags] = useState([]);
	const [transType, setTransType] = useState("");
	const [transRepeatFreq, setTransRepeatFreq] = useState("n");
	const [transDate, setTransDate] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [availableTags, setAvailableTags] = useState([]);
	const [transAmount, setTransAmount] = useState(0);
	const [note, setNote] = useState("");
	const [amountErr, setAmountError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState("");
	const navigate=useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault();
		const transaction = {
			transactionType: transType,
			transactionRepeatFreq: transRepeatFreq,
			amount: transAmount,
			transactionDate: transDate,
			transactionTags: selectedTags,
		};
		if (note !== "") {
			transaction["note"] = note;
		}

		if (transaction.amount <= 0) {
			setAmountError(true);
			setErrorMsg("Invalid amount");
			return;
		} else {
			setAmountError(false);
		}
		if (transaction.transactionTags.length < 1) {
			setErrorMsg("No tags selcted");
			return;
		}
		if (transaction.transactionDate === "") {
			setErrorMsg("No date selcted");
			return;
		}
		setErrorMsg("");

		try {
			const res = await Axios.post(
				"http://localhost:8081/transaction",
				transaction
			);
			console.log(res.data);
			setSuccess("Transaction Created.");
		} catch (err) {
			setErrorMsg(err.response.data.Error);
		}
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
		if (isNaN(val)) {
			setAmountError(true);
			setErrorMsg("Amount must be a number");
			return
		}

		setAmountError(false);
		setTransAmount(Number(event.target.value));
		setErrorMsg("");
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
		if (
			isNaN(day) ||
			isNaN(mon) ||
			isNaN(event.year()) ||
			day > 31 ||
			mon > 12 ||
			event.year() < 2000
		) {
			setErrorMsg("Invalid date");
			setTransDate("");
		} else {
			setErrorMsg("");
		}

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
				const msg=err.response.data.error
				if(msg==='http: named cookie not present'){
					navigate('/login')
				}
				console.log(msg);
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
		setErrorMsg("");
		console.log(id);
	};
	const removeTagFromSelected = (event) => {
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
		setErrorMsg("");
		console.log(id);
	};

	return (
		<>
			<Container component='main' maxWidth='xs' sx={{mt:4}}>
				{success !== "" && (
					<Alert sx={{ mb:1,mx:2 }} severity='success'>
						{success}
					</Alert>
				)}
				<CssBaseline />
				<Card sx={{ px: 5, py: 4, borderRadius: 5, boxShadow: 10 }}>
					<Box
						sx={{
							// marginTop: 8,
							display: "flex",
							flexDirection: "column",
							// alignItems: "center",
						}}>
						<Typography component='h1' variant='h5' sx={{ mt: 0 }}>
							Create Transaction
						</Typography>
						<Box
							component='form'
							noValidate={false}
							onSubmit={handleSubmit}
							sx={{ mt: 3, ml: 1 }}>
							<Grid container spacing={2}>
								{/* <Grid item xs={12}> */}
								<FormControl
									sx={{
										m: 1,
										mb: 1,
										minWidth: 180,
										boxShadow: 5,
										borderRadius: 2,
									}}>
									<InputLabel id='transaction-type'>
										Transaction Type
									</InputLabel>
									<Select
										labelId='transaction-type'
										id='transaction-type'
										value={transType}
										label='transaction-type'
										required
										onChange={updateTransType}>
										<MenuItem value={"Income"}>Income</MenuItem>
										<MenuItem value={"Expense"}>Expense</MenuItem>
									</Select>
									{/* <FormHelperText>Income or Expense</FormHelperText> */}
								</FormControl>
								{/* </Grid> */}
								<FormControl
									sx={{
										mt: 0,
										m: 1,
										minWidth: 120,
										boxShadow: 5,
										borderRadius: 2,
									}}>
									<InputLabel htmlFor='outlined-adornment-amount'>
										Amount
									</InputLabel>
									<OutlinedInput
										id='outlined-adornment-amount'
										startAdornment={
											<InputAdornment position='start'>$</InputAdornment>
										}
										label='Amount'
										required
										error={amountErr}
										onChange={updateAmount}
									/>
								</FormControl>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DemoContainer
										sx={{
											ml: 1,
											mb: 1,
											mt: 1,
											// minWidth: 120,
											// pt: 1,
											boxShadow: 5,
											borderRadius: 2,
											
											
										}}
										
										components={["DatePicker"]}>
										<DatePicker
											sx={{ ml: 1,
												mb: 1,
												mt: 1,
												minWidth: 120,
												// pt: 0,
												boxShadow: 5,
												borderRadius: 2,}}
											label='Date'
											format='DD-MM-YYYY'
											onChange={updateTransDate}
											onError={(event) => {
												setTransDate("");
											}}
										/>
									</DemoContainer>
								</LocalizationProvider>

								<FormControl
									sx={{
										mb: 1,
										m: 1,
										mt: 1,
										minWidth: 270,
										boxShadow: 5,
										borderRadius: 2,
									}}>
									<InputLabel id='transaction-repeat-frequecy'>
										Transaction Repeat Frequency
									</InputLabel>
									<Select
										labelId='transaction-repeat-frequecy'
										id='transaction-repeat-frequecy'
										fullWidth
										notched={true}
										value={transRepeatFreq}
										label='transaction-repeat-frequecy'
										required
										onChange={updateTransRepeatFreq}>
										<MenuItem value={"n"}>None</MenuItem>
										<MenuItem value={"w"}>Weekly</MenuItem>
										<MenuItem value={"m"}>Monthly</MenuItem>
										<MenuItem value={"y"}>Yearly</MenuItem>
									</Select>
									{/* <FormHelperText>
									How often should the transaction auto reoccur
								</FormHelperText> */}
								</FormControl>

								<Card
									sx={{
										mt: 1,
										ml: 1,
										minWidth: 320,
										minHeight: 50,
										p: 2,
										boxShadow: 5,
										borderRadius: 2,
									}}>
									<Typography component='h1' variant='body2' sx={{ pb: 1 }}>
										Selected Tags
									</Typography>
									<Grid container spacing={1} alignItems={"center"}>
										{selectedTags?.map((tag) => {
											// if (tag.type === transType) {
											return (
												<Grid item>
													<Tooltip
														title='Click To Remove'
														arrow
														placement='top'>
														<Chip
															label={tag.tagName}
															variant='outlined'
															id={tag.tagID}
															onClick={removeTagFromSelected}

															// deleteIcon={<DeleteIcon />}
														/>
													</Tooltip>
												</Grid>
											);
											// }
										})}
									</Grid>
								</Card>
								<Card
									sx={{
										mt: 2,
										ml: 1,
										minWidth: 320,
										minHeight: 50,
										p: 2,
										boxShadow: 5,
										borderRadius: 2,
									}}>
									<Typography component='h1' variant='body2' sx={{ pb: 1 }}>
										Available Tags
									</Typography>
									<Grid container spacing={1} alignItems={"center"}>
										{availableTags?.map((tag) => {
											// if (tag.type === transType) {
											return (
												<Grid item>
													<Tooltip
														title='Click To Select'
														arrow
														placement='top'>
														<Chip
															label={tag.tagName}
															variant='outlined'
															id={tag.tagID}
															onClick={addTagToSelected}
														/>
													</Tooltip>
												</Grid>
											);
											// }
										})}
									</Grid>
								</Card>
								{/* <Grid item> */}
								<TextField
									id='outlined-multiline-flexible'
									sx={{
										m: 1,
										minWidth: 320,
										mt: 2,
										boxShadow: 5,
										borderRadius: 2,
									}}
									label='Note'
									multiline
									rows={4}
									onChange={updateNote}
								/>

								{errorMsg !== "" && (
									<Alert sx={{ ml: 1, mt: 1 , minWidth:320}} severity='error'>
										{errorMsg}
									</Alert>
								)}

								<Button
									type='submit'
									variant='contained'
									disabled={amountErr||errorMsg!==""}
									sx={{ ml: 1, mr: 1, mt: 2, mb: 0, minWidth: 320 }}>
									Create Transaction
								</Button>
								{/* </Grid> */}
							</Grid>

							<Grid container justifyContent='flex-end'>
								<Grid item></Grid>
							</Grid>
						</Box>
					</Box>
				</Card>
			</Container>
		</>
	);
};
