import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import  Axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// const axios = require('axios');
export const Login=()=> {
  const navigate=useNavigate()
  const [errorMsg,setErrorMsg]=useState("")
  const [emailError, setEmailError]=useState(false)
  const [passwordError, setPasswordError]=useState(false)
  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user={
      email: formData.get('email'),
      password: formData.get('password')
    }
    var errorMsgTemp=""
    var  flag=false
    if (user.email.length<3){
      setEmailError(true)
      errorMsgTemp="invalid email "
      flag=true
    }
    else{
      setEmailError(false)
    }
    if (user.password.length===0){
      setPasswordError(true)
      errorMsgTemp+="enter a password "
      flag=true
    }
    else{
      setPasswordError(false)
    }

    if(flag){
      setErrorMsg(errorMsgTemp)
      return
    }
    console.log(user);

    try{
      await Axios.post('http://localhost:8081/login',user)
      // console.log(await response)
      setErrorMsg("")


      window.sessionStorage.setItem('isLoggedIn',true)
      
      
      // console.log(window.sessionStorage.getItem('token'))
      try{
        
        const test= await Axios.get('http://localhost:8081/tags')
        console.log(test.data)
      }catch(err){
        console.log(err)
      }
        navigate('/')

    }catch(err){
      // console.log(err)
      const msg=err.response.data.error
      if(msg==="invalid email" || msg.slice(0,4)==="mail"){
        setEmailError(true)
      }
      else{
        setEmailError(false)
      }
      setErrorMsg(msg)
    }
  };

  return (
    // <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/login-img.jpg)`,//fix this s
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                type='email'
                error={emailError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                
                error={passwordError}
              />
              <p style={{color:"red"}}>{errorMsg}</p>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link onClick={()=>{navigate('/forgot-password')}} variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link onClick={()=>{navigate('/signup')}} variant="body2">
                    "Don't have an account? Sign Up"
                  </Link>
                </Grid>
              </Grid>
              
            </Box>
          </Box>
        </Grid>
      </Grid>
    // </ThemeProvider>
  );
}