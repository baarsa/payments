import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SIGN_IN = gql`
  mutation signIn($email: String!, $password: String!) {
    loginWithEmail(email: $email, password: $password)
  }
`;

class EmailAuth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  async onSubmit(e, signIn) {
    e.preventDefault();
    const { email, password } = this.state;
    const {data : { loginWithEmail: token }} = await signIn({
      variables: {
        email,
        password
      }
    }); //todo check errors
    localStorage.setItem('token', token);
    //location = '/';
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  render() {
    return (
    <Mutation mutation={SIGN_IN}>
      {(signIn, { data }) => (
        <form
          onSubmit={(e) => this.onSubmit(e, signIn)}
          >
          <input value={this.state.email} onChange={e => this.onChangeEmail(e)}  />
          <input value={this.state.password} onChange={e => this.onChangePassword(e)}  />
          <button type="submit">Войти</button>
        </form>
      )}
    </Mutation>
  )
  }

}

export default EmailAuth;
