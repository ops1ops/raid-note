import {ApolloClient, InMemoryCache} from "@apollo/client";

const API_URL = 'https://www.warcraftlogs.com/api/v2/client';

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
  }
});

export default client;
