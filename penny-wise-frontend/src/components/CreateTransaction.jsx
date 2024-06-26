import  Axios from "axios"
import { useEffect, useState } from "react"
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



export const CreateTransaction=(props)=>{
    const [tags,setTags]=useState([])
    const handleSubmit=(event)=>{
        event.preventDefault();
        console.log("done")
    }
    const [transType, setTransType] = React.useState('');
    const [transRepeatFreq, setTransRepeatFreq] = React.useState('');
    const [transDate, setTransDate] = React.useState('');

  const updateTransType = (event) => {
    setTransType(event.target.value);
  };
  const updateTransRepeatFreq = (event) => {
    setTransRepeatFreq(event.target.value);
  };
  const updateTransDate = (event) =>{
    const mon=event.month()
    const day=event.day()
    
    const dateTemp = `${event.year()}-${mon<9?'0'+String(mon):mon}-${day<9?'0'+String(day):day}T00:00:00Z`
    console.log(dateTemp)

  }
    useEffect(()=>{
        const getTags=async()=>{
            try{
                const res=await Axios.get('http://localhost:8081/tags')
                setTags(res.data.tags)
                console.log(tags)
            }catch(err){
                console.log(err)
            }
        }
        getTags()
    },[])
    
    return (
    <>
         <div>
            {tags?.map(element => {
            // if (element.tagType==='Income')
            return (
            <p>Tag ID: {element.tagID}
                Tag Name: {element.tagName}
            Tag Type: {element.tagType}</p>
        )
        })
        }
        </div>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        {/* <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        > */}
          
          <Typography component="h1" variant="h5">
            Create Transaction
          </Typography>
          <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12}> */}
              <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="transaction-type">Transaction Type</InputLabel>
        <Select
          labelId="transaction-type"
          id="transaction-type"
          value={transType}
          label="transaction-type"
          onChange={updateTransType}
        >
          <MenuItem value="inc">
          </MenuItem>
          <MenuItem value={"inc"}>Income</MenuItem>
          <MenuItem value={"exp"}>Expense</MenuItem>
        </Select>
        <FormHelperText>Income or Expense</FormHelperText>
      </FormControl>
              {/* </Grid> */}

              <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="transaction-repeat-frequecy">Transaction Repeat Frequency</InputLabel>
        <Select
          labelId="transaction-repeat-frequecy"
          id="transaction-repeat-frequecy"
          value={transRepeatFreq}
          label="transaction-repeat-frequecy"
          onChange={updateTransRepeatFreq}
        >
          <MenuItem value="n">
          </MenuItem>
          <MenuItem value={'n'}>None</MenuItem>
          <MenuItem value={'w'}>Weekly</MenuItem>
          <MenuItem value={'m'}>Monthly</MenuItem>
          <MenuItem value={'y'}>Yearly</MenuItem>
        </Select>
        <FormHelperText>How often should the transaction auto reoccur</FormHelperText>
      </FormControl>
        
              {/* <Grid item xs={12}> */}
                {/* <TextField
                sx={{m:1, minWidth:120}}
                  required
                //   fullWidth
                  id="amount"
                  label="amount"
                  name="amount"
                //   type='amount'
                //   autoComplete="email"
                //   error={emailError}
                /> */}
         <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
          />
        </FormControl>
        <TextField
          id="outlined-multiline-flexible"
          sx={{m:1, minWidth:120}}
          label="Note"
          multiline
          rows={4}
          
        />
         <LocalizationProvider  dateAdapter={AdapterDayjs}>
      <DemoContainer sx={{m:1, minWidth:120}} components={['DatePicker']}>
        <DatePicker label="Date"  format="DD-MM-YYYY" onChange={updateTransDate}/>
      </DemoContainer>
    </LocalizationProvider>
              {/* </Grid> */}
              {/* <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                //   error={passwordError}
                  
                />
              </Grid>
              <Grid item xs={12}>
              </Grid> */}
            </Grid>
            {/* <p style={{color:"red"}}>{errorMsg}</p> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                {/* <Link onClick={()=>{navigate('/login')}} variant="body2">
                  Already have an account? Login
                </Link> */}
              </Grid>
            </Grid>
          </Box>
        {/* </Box> */}
      </Container>

     
    </>)
}