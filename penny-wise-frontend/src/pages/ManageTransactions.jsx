import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransactionCard } from "../components/TransactionCard.jsx";
import { Box } from "@mui/material";


export const ManageTransactions = () => {
	const [transactions, setTransactions] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		const getTransactions = async () => {
			
				try {
					const res = await Axios.get("http://localhost:8081/transactions");
					setTransactions(res.data);
					console.log(res.data);
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
		<>
			{/* {loginStatus && userDetails?.name + "\n" + userDetails?.email} */}
			{/* <CreateTransaction /> */}
			{/* <CreateTag /> */}
			{/* {transactions?.map((trans) => {
				return <TransactionCard transaction={trans} />;
			})} */}
			<Box  sx={{display:"flex",flexDirection:"row",flexWrap:"wrap",m:0,p:0}}>
			{transactions?.map((trans) => (
					<TransactionCard transaction={trans} />
				))}
			</Box>

			{/* <div style={{ display: "flex", flexDirection: "row" , maxWidth:"100"}}>
				
			</div> */}
		</>
	);
};
