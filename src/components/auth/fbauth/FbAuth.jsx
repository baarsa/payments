import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import querystring from 'querystring';

class FbAuth extends React.Component {
  constructor(props) {
    super(props);
    this.appId = '278032162986576'; //TODO to env
    this.redirectUrl = `http:
      //${document.location.host}
      /auth/fb`;

    if (document.location.pathname === '/auth/fb') {
      this.code = querystring.parse(document.location.search)['?code'];
    }

    this.state = {
      loading: false,
    };
  }

  async componentDidMount() {
      if (!this.code) {
        return;
      }

      this.setState({ loading: true });
      const res = await this.props.mutate({variables: {code: this.code}});
      this.setState({ loading: false });
      const { error, user, session } = res.data.authFacebook.token;
      if (error) {
        alert('sign in error: ', error);
      } else {
        alert('sign in success, your token: ', session.token);
      }

  }

  onFacebookLogin(event) {
    event.preventDefault();
    window.location = `https://www.facebook.com/v3.3/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(this.redirectUrl)}`;
  }

  render() {
    const { loading } = this.state;
    const icon = 'fa ' + (loading ? 'fa-refresh fa-spin' : 'fa-facebook');

    return (
      <a href='/auth/fb' onClick={(e) => this.onFacebookLogin(e)}><i className={icon}></i> Facebook </a>
    );
  }
}

export default graphql(gql`
  mutation fbauth($code: String!) {
    authFacebook(input: {accessToken: $code}) {
      name
      token
    }
  }
`)(FbAuth);
