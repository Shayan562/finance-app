import { useEffect, useState } from "react";
import { CreateTag } from "../components/CreateTag.jsx";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { TagCard } from "../components/TagCard.jsx";
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
import { TagTable } from "../components/TagTable.jsx";

export const ManageTags = () => {
	const [tags, setTags] = useState([]);
	const [tagType, setTagType] = useState("");
    const [refresh, setRefresh]=useState(0)
	const navigate = useNavigate();

    const inc=()=>{
        console.log("Updated")
        // setRefresh((prev)=>prev++) 
    }

	useEffect(() => {
		const getTags = async () => {
			try {
				const res = await Axios.get("http://localhost:8081/tags");
				setTags(res.data.tags);
			} catch (err) {
				const msg = err.response.data.error;
				if (msg === "http: named cookie not present") {
					navigate("/login");
				}
				console.log(err);
			}
		};
		getTags();
	}, [refresh,setRefresh,inc]);

	const updateTagType = (event) => {
		setTagType(event.target.value);
	};

	return (
		<Container component={"main"} maxWidth='m'>
			<Grid
				container
				spacing={2}
				display='flex'
				justifyContent='space-between'
				sx={{ px: 14 }}>
				<Grid
					item
					xs={6}
					sx={{ mt: 3 }}
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"space-between"}>
					<div>
						<Typography variant='h5' gutterBottom>
							Tags
						</Typography>
						<Typography variant='body1' gutterBottom sx={{mb:4}}>
                        On this page, you can view the available pre-created tags and also create new ones if needed. These tags are global and can be used by all the users.		
                        <br/>There are 2 categories of tags; income and expense. Their use case is defined as follows:
                        <br/><b>1. Income</b><br/>These categories of tags are meant to be used with transactions of the type income i.e where user earns money.
                        <br/><b>2. Expense</b><br/>These categories of tags are meant to be use with transactions of type expense i.e where user spends money.
                        <br/>
                        </Typography>
					</div>
					<FormControl sx={{ maxWidth:'250px' }}>
						<InputLabel id='show'>Show</InputLabel>
						<Select
							labelId='show'
							id='show'
							value={tagType}
							label='Show'
							onChange={updateTagType}>
							<MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={"Income"}>Income</MenuItem>
                            <MenuItem value={"Expense"}>Expense</MenuItem>
						</Select>
					</FormControl>
                    {refresh}
                    <TagTable tags={tags} type={tagType}/>  
				</Grid>
                <Grid item xs={1}   sx={{my:1}}><Divider orientation="vertical" variant='middle'/></Grid>
				<Grid item xs={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
					<CreateTag update={inc}/>
				</Grid>
			</Grid>

			{/* <Divider variant="middle" sx={{m:2}}/> */}
{/* 
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
					ml: 10,
                    mr: 10,
					p: 0,
					
				}}>
				{tags?.map((tag) => {
                    switch (tagType){
                        case 'Income':
                            if (tag.tagType==='Income') return <TagCard tag={tag} />
                            break
                        case 'Expense':
                            if (tag.tagType==='Expense') return <TagCard tag={tag} />
                            break 
                        default:
                            return <TagCard tag={tag} />    
                    }
                })}
                 
                    
                
			</Box> */}
		</Container>
	);
};
