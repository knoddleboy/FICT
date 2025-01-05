import { GraphQLError } from "graphql";
import { MutationResolvers } from "../../__generated__/resolvers-types";
import { isQueryFailedError } from "../../errors/isQueryFailedError";
import { rethrowGraphQLError } from "../../errors/rethrowGraphQLError";

export const departmentMutations: MutationResolvers = {
  createDepartment: async (_, { name }, { dataSources }) => {
    try {
      const department = dataSources.departmentRepository.create({ name });
      return await dataSources.departmentRepository.save(department);
    } catch (error) {
      if (isQueryFailedError(error) && error.code === "23505") {
        throw new GraphQLError("Department with this name already exists");
      }

      throw new GraphQLError("An error occurred while creating the department");
    }
  },

  updateDepartment: async (_, { id, name }, { dataSources }) => {
    try {
      const department = await dataSources.departmentRepository.findOne({
        where: { id },
      });

      if (!department) {
        throw new GraphQLError("Department not found");
      }

      department.name = name;
      return await dataSources.departmentRepository.save(department);
    } catch (error) {
      rethrowGraphQLError(error);

      if (isQueryFailedError(error) && error.code === "23505") {
        throw new GraphQLError("Department with this name already exists");
      }

      throw new GraphQLError("An error occurred while updating the department");
    }
  },

  deleteDepartment: async (_, { id }, { dataSources }) => {
    try {
      const deleted = await dataSources.departmentRepository.delete(id);

      if (deleted.affected === 0) {
        throw new GraphQLError("Department not found");
      }

      return true;
    } catch (error) {
      rethrowGraphQLError(error);

      if (isQueryFailedError(error) && error.code === "23503") {
        throw new GraphQLError(
          "You cannot delete this department because it has more than one employee"
        );
      }

      throw new GraphQLError("An error occurred while deleting the department");
    }
  },
};
