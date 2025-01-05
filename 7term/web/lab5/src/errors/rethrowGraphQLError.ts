import { GraphQLError } from "graphql";

export const rethrowGraphQLError = (err: unknown) => {
  if (err instanceof GraphQLError) {
    throw err;
  }
};
