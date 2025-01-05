import { QueryResolvers } from "../../__generated__/resolvers-types";

export const departmentQueries: QueryResolvers = {
  departments: async (_, __, { dataSources }) => {
    return await dataSources.departmentRepository.find({
      relations: {
        employees: true,
      },
    });
  },

  department: async (_, { id }, { dataSources }) => {
    return await dataSources.departmentRepository.findOne({
      where: { id },
      relations: {
        employees: true,
      },
    });
  },
};
