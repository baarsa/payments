import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error'

const link = new HttpLink({ uri: 'http://localhost:3001/graphql' }); //todo get from env
const cache = new InMemoryCache();

const authLink = setContext((_, { headers}) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? token : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache
});
export default client;
