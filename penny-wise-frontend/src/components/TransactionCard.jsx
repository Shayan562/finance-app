import { Card, Modal } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import { Tooltip } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import { UpdateTransaction } from "./UpdateTransactionModal";

export const TransactionCard = (props) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [transaction, setTransaction] = useState({});
	const navigate = useNavigate();
	const handleModalOpen = () => {
		setModalOpen(true);
	};
	const handleModalClose = () => {
		setModalOpen(false);
	};

	// const editTransaction = async () => {
	// 	console.log("Editing" + transaction.transactionID);
	// };
	const deleteTransaction = async () => {
		console.log("Deleting" + transaction.transactionID);
	};
	useEffect(() => {
		const getTransaction = async () => {
            if (props.transactionID === null || isNaN(props.transactionID)) {
				setModalOpen(false);
				return;
			}
			try {
				const res = await Axios.get(
					`http://localhost:8081/transaction/${props.transactionID}`
				);
				setTransaction(await res.data);
				
			} catch (err) {
                
				const msg = err.response.data.error;
				if (msg === "http: named cookie not present") {
					navigate("/login");
					return;
				}
				console.error(err);
			}
		};
		getTransaction();
        
	}, []);
	// console.log(props.trans);
	return (
		<>
			<Container maxWidth='xs' sx={{ minWidth: 300, m: 5 }}>
				<CssBaseline />
				<Modal
					open={modalOpen}
					onClose={handleModalClose}
					aria-labelledby='Edit Transaction'>
					<Box
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 500,
							bgcolor: "white",
							//   border: '2px solid #000',
							//   boxShadow: 24,
							p: 4,
						}}>
						<UpdateTransaction
							closeModal={handleModalClose}
							trans={transaction}
						/>
						{/* <Button onClick={handleModalClose}>Close</Button> */}
					</Box>
				</Modal>
				<Card
					sx={{
						px: 3,
						py: 3,
						borderRadius: 5,
						boxShadow: 10,
						// maxWidth: 200,
						// m: 2,
					}}>
					<Grid container spacing={2}>
						<Grid item xs={3}>
							<Typography variant='body1' gutterBottom>
								{transaction?.transactionType}
							</Typography>
							<Typography variant='subtitle2' gutterBottom>
								Type
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<Typography
								variant='body1'
								color={
									transaction?.transactionType === "Income"
										? "primary"
										: "error"
								}
								gutterBottom>
								{transaction?.amount}
							</Typography>
							<Typography variant='subtitle2' gutterBottom>
								Amount
							</Typography>
						</Grid>
						<Grid item xs={5}>
							<Typography variant='body1' gutterBottom>
								{new Date(transaction?.transactionDate).toDateString()}
							</Typography>
							<Typography variant='subtitle2' gutterBottom>
								Date
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Typography variant='body1' gutterBottom>
								{transaction?.transactionRepeatFreq}
							</Typography>
							<Typography variant='subtitle2' gutterBottom>
								Auto Repeat Frequency
							</Typography>
						</Grid>
						<Grid
							item
							xs={9}
							style={{
								padding: 4,
								paddingLeft: 14,
								paddingRight: 12,
								paddingBottom: 12,
							}}>
							<Card
								sx={{
									// mt: 1,
									// ml: 1,
									// minWidth: 320,
									// minHeight: 50,
									p: 2,
									boxShadow: 1,
									borderRadius: 2,
								}}>
								<Typography component='h1' variant='body2' gutterBottom>
									Tags
								</Typography>
								<Grid
									container
									spacing={1}
									alignItems={"center"}
									xs={{ pt: 0 }}>
									{transaction.transactionTags?.map((tag) => {
										return (
											<Grid item>
												<Chip
                                                    key={tag.tagID}
													label={tag.tagName}
													variant='outlined'
													id={tag.tagID}
												/>
											</Grid>
										);
									})}
								</Grid>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='body1' gutterBottom>
								{transaction?.note === "" || transaction?.note == null
									? "No Note"
									: transaction.note}
							</Typography>
							<Typography variant='subtitle2' gutterBottom>
								Note
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Divider sx={{ mb: 1 }} />
						</Grid>
						<Grid item xs={6}>
							<Button
								type='button'
								variant='contained'
								onClick={handleModalOpen}
								// sx={{ m: 1, mx: 0,mr:3 }}
								fullWidth>
								<Edit sx={{ fontSize: "large" }} />
								Edit
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button
								type='submit'
								variant='contained'
								onClick={deleteTransaction}
								color='error'
								fullWidth
								// sx={{ ml: 1,mr:0}}
							>
								<DeleteIcon sx={{ fontSize: "large" }} />
								Delete
							</Button>
						</Grid>
					</Grid>
				</Card>
				{/* </Box> */}
			</Container>
		</>
	);
};