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

export const NavBar = (props) => {
	const navigate = useNavigate();
	const [anchorTrans, setAnchorTrans] = useState(null);
	const [anchorReports, setAnchorReports] = useState(null);
	const [anchorUser, setAnchorUser] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [user, setUser] = useState({});

	useEffect(() => {
		const interval = setInterval(() => {
			getDataForLogin();
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		getDataForLogin();
	}, [anchorTrans, anchorReports, anchorUser, loggedIn]);
	const getDataForLogin = async () => {
		try {
			const res = await Axios.get("http://localhost:8081/user");
			setLoggedIn(true);
			setUser(res.data);
		} catch (err) {
			const msg = err.response.data.error;
			if (msg === "http: named cookie not present") {
				setLoggedIn(false);
				return;
			}
		}
	};

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
	const handleUsersOpen = (event) => {
		setAnchorUser(event.currentTarget);
	};

	const handleUsersClose = () => {
		setAnchorUser(null);
	};
	const handleLogout = async () => {
		try {
			await Axios.get("http://localhost:8081/logout");
			navigate("/login");
		} catch (err) {
			const msg = err.response.data.error;
			if (msg === "http: named cookie not present") {
				navigate("/login");
				return;
			}
			console.log(msg);
		}
	};

	return (
		<>
			{
				<AppBar
					position='sticky'
					style={{ width: "100%", margin: 0, padding: 0, height: "5em" }}>
					<Toolbar>
						<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
							<Link to={"/home"} className='logo'>
								<h4>Penny Wise</h4>
							</Link>
						</Typography>
						<Stack direction='row' spacing={2}>
							{loggedIn && (
								<>
									<Button
										onClick={() => navigate("/")}
										color='inherit'
										disabled={!loggedIn}>
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
										onClick={() => navigate("/manage-goals")}
										color='inherit'
										disabled={!loggedIn}>
										Manage Goals
									</Button>
									<Button
										aria-controls='reports-menu'
										aria-haspopup='true'
										onClick={handleReportsOpen}
										color='inherit'
										disabled={!loggedIn}>
										Reports ▼
									</Button>
								</>
							)}
							{loggedIn && (
								<Button
									aria-controls='user-menu'
									aria-haspopup='true'
									onClick={handleUsersOpen}
									color='inherit'>
									{user?.name} ▼
								</Button>
							)}
							{!loggedIn && (
								<Button onClick={() => navigate("/signup")} color='inherit'>
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
						<Menu
							id='user-menu'
							anchorEl={anchorUser}
							open={Boolean(anchorUser)}
							onClose={handleUsersClose}>
							<MenuItem onClick={() => navigate("/user-settings")}>
								Settings
							</MenuItem>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
			}
		</>
	);
};
