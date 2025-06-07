import { gql } from '@apollo/client';

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    product(id: $id) {
      id
      name
      price
      originalPrice
      ingredients
      imageUrl
      category
      stockQuantity
      requiresPrescription
      rating
      description
      manufacturer
      dosage
      warnings
      expiryDate
      createdAt
      updatedAt
    }
  }
`;