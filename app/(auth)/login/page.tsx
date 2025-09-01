'use client';

import React from 'react';
import LoginForm from '@/components/forms/LoginForm';
import DarkVeil from '@/components/Backgrounds/DarkVeil';

const Login = () => {
  return (
    <div className='relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8'>
      <DarkVeil />
      <LoginForm 
        showSignUpLink={true}
        redirectPath="/Dashboard"
        className='w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl'
      />
    </div>
  )
}

export default Login