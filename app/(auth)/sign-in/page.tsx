'use client';


import { signInWithCredentials } from '@/lib/actions/auth';
import AuthForm from '../../../components/AuthForm'
import { signInSchema } from '@/lib/validations'
 

const page = () => (
  <AuthForm 
    type='SIGN_IN'
    schema={signInSchema}
    defaultValues={{email: '', password: ''}}
    onSubmit={signInWithCredentials}

  />
);

export default page;