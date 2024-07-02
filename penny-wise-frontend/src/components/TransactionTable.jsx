import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { TransactionCard } from "./TransactionCard";
import zIndex from "@mui/material/styles/zIndex";

export const TransactionTable = (props) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [transIDForModal, setTransIDForModal] = useState({});
	const handleModalOpen = () => {
		setModalOpen(true);
	};
	const handleModalClose = () => {
		setModalOpen(false);
	};
	const handleViewTransaction = (transID) => {
		setTransIDForModal(transID);
		handleModalOpen();
	};
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const columns = [
		{ id: "amount", label: "Amount", format: Number, minWidth: 170 },
		{ id: "type", label: "type", format: String, minWidth: 170 },
		{ id: "date", label: "date", format: String, minWidth: 150 },
	];
	function createData(transID, transAmount, transType, transDate) {
		// const density = population / size;
		const timestamp = transDate;
		const parsedDate = new Date(timestamp);
		transDate = parsedDate.toDateString();
		// parsedDate.toDateString()
		return { transID, transAmount, transType, transDate };
	}
	// const rows = [];
	// props.transactions.forEach((trans) => {
	// 	// console.log(createData(trans.amount, trans.transactionType, trans.transactionDate))
	// 	rows.push(
	// 		createData(trans.transactionID,trans.amount, trans.transactionType, trans.transactionDate)
	// 	);
	// });
	// console.log("Rows");
	// console.log(rows);
	// console.log(props.transactions);
	// console.log(dayjs.toString("2002-12-01T00:00:00Z"));
    var count=1
	return (
		<TableContainer component={Paper} sx={{}}>
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby='View Transaction'>
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
					<TransactionCard transactionID={transIDForModal} />
					{/* <Button onClick={handleModalClose}>Close</Button> */}
				</Box>
			</Modal>
			<Table sx={{ minWidth: 600 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell align='center'>S.No</TableCell>
						<TableCell align='center'>Amount</TableCell>
						<TableCell align='center'>Type</TableCell>
						<TableCell align='center'>Date</TableCell>
						<TableCell align='center' />
					</TableRow>
				</TableHead>
				<TableBody>
					{props.transactions.map((trans) => (
						<TableRow key={trans.transactionID}>
							<TableCell align='center'>{count++}</TableCell>
							<TableCell align='center'> {trans.amount}</TableCell>
							<TableCell align='center'>{trans.transactionType}</TableCell>
							<TableCell align='center'>
								{new Date(trans.transactionDate).toDateString()}
							</TableCell>
							{/* <TableCell align='center'>{row.trans}</TableCell> */}
							<TableCell align='center'>
								{
									<Button
										onClick={() => {
											handleViewTransaction(trans.transactionID);
										}}>
										View
									</Button>
								}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
