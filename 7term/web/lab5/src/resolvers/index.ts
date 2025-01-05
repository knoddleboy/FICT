import { Resolvers } from "../__generated__/resolvers-types";
import { employeeQueries } from "./queries/employee";
import { departmentQueries } from "./queries/department";
import { employeeMutations } from "./mutation/employee";
import { departmentMutations } from "./mutation/department";

const resolvers: Resolvers = {
  Query: {
    ...employeeQueries,
    ...departmentQueries,
  },
  Mutation: {
    ...employeeMutations,
    ...departmentMutations,
  },
};

export default resolvers;
