/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBooks
// ====================================================

export interface GetBooks_books {
  __typename: 'Book'
  author: string | null
}

export interface GetBooks {
  books: (GetBooks_books | null)[] | null
}
