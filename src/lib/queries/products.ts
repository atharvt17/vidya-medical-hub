
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      originalPrice
      ingredients
      manufacturer
      imageUrl
      category
      stockQuantity
      requiresPrescription
      rating
    }
  }
`;