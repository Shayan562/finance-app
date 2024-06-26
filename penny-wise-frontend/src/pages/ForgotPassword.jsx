import * as React from 'react';
import { useState } from 'react';
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
import  Axios from 'axios'
import { useNavigate } from 'react-router-dom';


export const ForgotPassword=() =>{
  const [errorMsg,setErrorMsg]=useState("")
  const navigate=useNavigate();
  const [emailError, setEmailError]=useState(false)
  
  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user={
      email: formData.get('email')
    }

    if (user.email.length<3){
      setEmailError(true)
      setErrorMsg("invalid email")
      return

    }
    else{
      setEmailError(false)
    }
    console.log(user);
      
      try{
        await Axios.post('http://localhost:8081/forgot-password',user)
        // console.log(await response)
        setErrorMsg("")
    
        window.alert("Your new password has been sent to your email. Kindly use it to login.\nRedirecting")
        navigate("/login")
     
    }catch(err){
        const msg=err.response.data.error
        setEmailError(true)
        setErrorMsg(msg)
    }
  };
  

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* {success && <h1 style={{color:"green"}}>Account Created. Redirecting</h1>} */}
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }} width={500}>
            {/* <Grid container spacing={1}>
        
              <Grid item xs={12}> */}
                <TextField
                  
                  required
                  fullWidth={true}
                  id="email"
                  label="Email Address"
                  name="email"
                  type='email'
                  autoComplete="email"
                  
                  error={emailError}
                />
              {/* </Grid>
              <Grid item xs={12} />
              
            </Grid> */}
            <p style={{color:"red"}}>{errorMsg}</p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
           
          </Box>
        </Box>
      </Container>
  );
}