import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const clientId = '1036324179659-mlu9o1vuu1m0n2df2tscka1f6chgg0db.apps.googleusercontent.com';

const BackgroundImage = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url('/xeno.png')`, // Replace 'xeno.png' with the actual filename and extension
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
}));

const Login = () => {
  const navigate = useNavigate();

  const onSuccess = (response) => {
    console.log('Login Success:', response);
    navigate('/dashboard');
  };

  const onFailure = (response) => {
    console.log('Login Failed:', response);
  };

  return (
    <BackgroundImage>
      <StyledContainer>
        <Typography variant="h4" align="center" gutterBottom>
          
        </Typography>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            render={(renderProps) => (
              <Button variant="contained" onClick={renderProps.onClick}>
                Login with Google
              </Button>
            )}
          />
        </GoogleOAuthProvider>
      </StyledContainer>
    </BackgroundImage>
  );
};

export default Login;
