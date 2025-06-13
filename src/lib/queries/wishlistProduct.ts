
import { gql } from '@apollo/client';

export const GET_WISHLIST_PRODUCT = gql`
  query GetWishlistProduct($id: String!) {
    product(id: $id) {
      id
      name
      price
      originalPrice
      requiresPrescription
      imageUrl
      manufacturer
      rating
    }
  }
`;
