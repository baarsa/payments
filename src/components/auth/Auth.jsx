import React from 'react';
import FbAuth from './fbauth/FbAuth';
import EmailAuth from './email_auth/EmailAuth';

const Auth = () => (
  <section>
    <FbAuth />
    <EmailAuth />
  </section>
);

export default Auth;
