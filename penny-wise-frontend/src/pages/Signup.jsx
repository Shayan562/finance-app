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


export const SignUp=() =>{
  const [errorMsg,setErrorMsg]=useState("")
  const navigate=useNavigate();
  const [emailError, setEmailError]=useState(false)
  const [passwordError, setPasswordError]=useState(false)
  const [nameError, setNameError]=useState(false)
  const [success, setSuccess]=useState(false)
  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user={
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name')
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

    if (user.name.length===0){
      setNameError(true)
      errorMsgTemp+="invalid name "
      flag=true
    }
    else  if (user.name.length>50){
      setNameError(true)
      errorMsgTemp+="name too long "
      flag=true
    }
    else{
      setNameError(false)
    }
  
    if (user.password.length<8){
      setPasswordError(true)
      errorMsgTemp+="password must be atleast 8 characters long "
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
        await Axios.post('http://localhost:8081/signup',user)
        // console.log(await response)
        setErrorMsg("")
        setSuccess(true)
        window.alert("Success! Account Created.\nRedirecting")
        navigate("/")
      //redirect to home
      // try{
        
        const test= await Axios.get('http://localhost:8081/tags')
        console.log(test.data)
      // }catch(err){
      //   console.log(err)
      // }

    }catch(err){
      // console.log(err)
      const msg=err.response.data.error
      if(msg==="invalid email" || msg.slice(0,4)==="mail"){
        setEmailError(true)
      }
      else{
        setEmailError(false)
      }
      if(msg.slice(0,8)==="password"){
        setPasswordError(true)
      }
      else{
        setPasswordError(false)
      }
      if(msg.slice(0,4)==="name"){
        setNameError(true)
      }
      else{
        setNameError(false)
      }
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
          {success && <h1 style={{color:"green"}}>Account Created. Redirecting</h1>}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                  error={nameError}
                />
              </Grid>
        
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type='email'
                  autoComplete="email"
                  error={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={passwordError}
                  
                />
              </Grid>
              <Grid item xs={12}>
              </Grid>
            </Grid>
            <p style={{color:"red"}}>{errorMsg}</p>
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
                <Link onClick={()=>{navigate('/login')}} variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}