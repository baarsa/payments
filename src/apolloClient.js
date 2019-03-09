import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error'

const link = new HttpLink({ uri: 'http://localhost:4000' });
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache  
});
export default client;
