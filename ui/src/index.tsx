import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app/App'
import reportWebVitals from './reportWebVitals'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { gql } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
})

// const client = ...

client
  .query({
    query: gql`
      query GetNodes {
        nodes {
          id
        }
      }
    `,
  })
  .then((result) => console.log(result))

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// https://bit.ly/CRA-vitals
reportWebVitals()
