import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransactionCard } from "../components/TransactionCard.jsx";
import {
	Box,
	Container,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import { TransactionTable } from "../components/TransactionTable.jsx";

export const ManageTransactions = () => {
	const [transactions, setTransactions] = useState([]);
    const  [showSelect, setShowSelect]=useState("")
	const navigate = useNavigate();
	useEffect(() => {
		const getTransactions = async () => {
			try {
				const res = await Axios.get("http://localhost:8081/transactions/min");
				setTransactions(res.data);
				// console.log(res.data);
			} catch (err) {
				const msg = err.response.data.error;
				if (msg === "http: named cookie not present") {
					navigate("/login");
					return;
				}
				console.log(err);
			}
		};

		getTransactions();
	}, []);
	return (
			
			<Container component={"main"} maxWidth='m'>
				<Grid
					container
					spacing={2}
					display={"flex"}
					justifyContent={"space-between"}
                    sx={{m:2}}>
					<Grid item xs={4} >
						<Typography variant='h5'>Your Transactions</Typography>
					</Grid>
					<Grid item xs={2} sx={{pr:4}}>
						<FormControl fullWidth>
							<InputLabel id='show'>Show</InputLabel>
							<Select
								labelId='show'
								id='show'
								value={showSelect}
								label='Show'
								onChange={(event)=>{setShowSelect(event.target.value)}}
                                >
								<MenuItem value={'all'}>All</MenuItem>
								
							</Select>
						</FormControl>
					</Grid>
				</Grid>
				<Divider sx={{m:1}}/>

                        <TransactionTable transactions={transactions}/>

                {/* <Grid
					container
					spacing={2}
					display={"flex"}
					justifyContent={"space-between"}
                    sx={{m:2}}>
					<Grid item xs={2} >
						<Typography variant='body1'>Amount</Typography>
					</Grid>
                    <Grid item xs={2} >
						<Typography variant='body1'>Date</Typography>
					</Grid>
                    <Grid item xs={2} >
						<Typography variant='body1'>Type</Typography>
					</Grid>
                    <Grid item xs={2} >
						<Typography variant='body1'>Tag Names</Typography>
					</Grid>
                    </Grid> */}

				{/* <Box
					sx={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						m: 0,
						p: 0,
					}}>
					{transactions?.map((trans) => (
						<TransactionCard transaction={trans} />
					))}
				</Box> */}

				{/* <div style={{ display: "flex", flexDirection: "row" , maxWidth:"100"}}>
				
			</div> */}
			</Container>
	);
};
