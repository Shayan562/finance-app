import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Stack,
	Button,
	Menu,
	MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import "./css/navbar.css";
import Axios from "axios";

export const NavBar = () => {
	const navigate = useNavigate();
	const [anchorTrans, setAnchorTrans] = useState(null);
	const [anchorReports, setAnchorReports] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		const getDataForLogin = async () => {
			try {
				const res = await Axios.get("http://localhost:8081/tags?type=inc");
				setLoggedIn(true);
			} catch (err) {
				const msg = err.response.data.error;
				if (msg === "http: named cookie not present") {
					setLoggedIn(false);
					return;
				}
			}
		};
        getDataForLogin()
	}, [anchorTrans, anchorReports, setAnchorTrans, setAnchorReports]);

	const handleTransOpen = (event) => {
		setAnchorTrans(event.currentTarget);
	};

	const handleTransClose = () => {
		setAnchorTrans(null);
	};
	const handleReportsOpen = (event) => {
		setAnchorReports(event.currentTarget);
	};

	const handleReportsClose = () => {
		setAnchorReports(null);
	};

	return (
		<AppBar
			position='static'
			style={{ borderRadius: 15, width: "100%", margin: 0, padding: 0 }}>
			<Toolbar>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					<Link to={"/home"} className='logo'>
						<h4>Fritter</h4>
					</Link>
				</Typography>
				<Stack direction='row' spacing={2}>
					<Button onClick={() => navigate("/")} color='inherit' disabled={!loggedIn}>
						Dashboard
					</Button>
					<Button
						aria-controls='transactions-menu'
						aria-haspopup='true'
						onClick={handleTransOpen}
						color='inherit'
						disabled={!loggedIn}>
						Transactions ▼
					</Button>
					<Button
						aria-controls='reports-menu'
						aria-haspopup='true'
						onClick={handleReportsOpen}
						color='inherit'
						disabled={!loggedIn}>
						Reports ▼
					</Button>
					{loggedIn && (
						<Button onClick={() => console.log("Logout")} color='inherit'>
							Logout
                            Option to settinngs
						</Button>
					)}
                    {!loggedIn && (
						<Button onClick={() => navigate("/Login")} color='inherit'>
							Get Started
						</Button>
					)}
					
				</Stack>
				<Menu
					id='transactions-menu'
					anchorEl={anchorTrans}
					open={Boolean(anchorTrans)}
					onClose={handleTransClose}>
					<MenuItem onClick={() => navigate("/new-transaction")}>
						Create Transaction
					</MenuItem>
					<MenuItem onClick={() => navigate("/manage-transactions")}>
						Manage Transactions
					</MenuItem>
					<MenuItem onClick={() => navigate("/manage-tags")}>
						Manage Tags
					</MenuItem>
				</Menu>
				<Menu
					id='reports-menu'
					anchorEl={anchorReports}
					open={Boolean(anchorReports)}
					onClose={handleReportsClose}>
					<MenuItem onClick={() => navigate("/new-report")}>
						New Report
					</MenuItem>
					<MenuItem onClick={() => navigate("/saved-reports")}>
						Saved Reports
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
};
