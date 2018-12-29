export default `
  type Product {
    id: Int!
    owner: Profile!
    type: String!
    title: String!
    desc: String!
    price: Float!
    deliveryType: String!
    inStock: Boolean!
    quantity: Int!
    url: String
    filetype: String
  }

  type Query {
    allMyProducts(searchQuery: String): [Product!]!
    viewProduct(productId: Int!): Product!
  }

  type createProduct {
    ok: Boolean!
    errors: [Error!]
  }

  type updateProduct {
    ok: Boolean!
    errors: [Error!]
  }

  type Mutation {
    createProduct(type: String!, title: String!, desc: String!, price: Float!, deliveryType: String!, quantity: Int!, file: File!): createProduct!
    updateProduct(productId: Int!, type: String, title: String, desc: String, price: Float, quantity: Int, inStock: Boolean, file: File): UptadeProfile!
  }
`;
