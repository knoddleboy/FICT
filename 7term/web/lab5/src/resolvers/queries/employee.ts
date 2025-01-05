import { QueryResolvers } from "../../__generated__/resolvers-types";

export const employeeQueries: QueryResolvers = {
  employees: async (_, __, { dataSources }) => {
    return await dataSources.employeeRepository.find({
      relations: {
        department: true,
        computerSpecs: true,
      },
    });
  },

  employee: async (_, { id }, { dataSources }) => {
    return await dataSources.employeeRepository.findOne({
      where: { id },
      relations: {
        department: true,
        computerSpecs: true,
      },
    });
  },
};
