import { GraphQLError } from "graphql";
import { MutationResolvers } from "../../__generated__/resolvers-types";
import { isQueryFailedError } from "../../errors/isQueryFailedError";
import { rethrowGraphQLError } from "../../errors/rethrowGraphQLError";

export const employeeMutations: MutationResolvers = {
  createEmployee: async (_, args, { dataSources }) => {
    const { name, email, departmentId, computerSpecs } = args;

    try {
      const department = await dataSources.departmentRepository.findOne({
        where: { id: departmentId },
      });

      if (!department) {
        throw new GraphQLError("Department not found");
      }

      if (computerSpecs.ram <= 0) {
        throw new GraphQLError("RAM must be a positive integer");
      }

      if (computerSpecs.storage <= 0) {
        throw new GraphQLError("Storage must be a positive integer");
      }

      const newComputerSpecs = await dataSources.computerSpecsRepository.save(
        dataSources.computerSpecsRepository.create(computerSpecs)
      );

      const employee = dataSources.employeeRepository.create({
        name,
        email,
        department,
        computerSpecs: newComputerSpecs,
      });

      return await dataSources.employeeRepository.save(employee);
    } catch (error) {
      rethrowGraphQLError(error);

      if (isQueryFailedError(error) && error.code === "23505") {
        throw new GraphQLError("Employee with this email already exists");
      }

      throw new GraphQLError("An error occurred while creating the employee");
    }
  },

  updateEmployee: async (_, args, { dataSources }) => {
    const { id, name, email, departmentId, computerSpecs } = args;

    try {
      const employee = await dataSources.employeeRepository.findOne({
        where: { id },
      });

      if (!employee) {
        throw new GraphQLError("Employee not found");
      }

      if (name) {
        employee.name = name;
      }

      if (email) {
        employee.email = email;
      }

      if (departmentId) {
        const department = await dataSources.departmentRepository.findOne({
          where: { id: departmentId },
        });

        if (!department) {
          throw new GraphQLError("Department not found");
        }

        employee.department = department;
      }

      if (computerSpecs) {
        if (computerSpecs.ram <= 0) {
          throw new GraphQLError("RAM must be a positive integer");
        }

        if (computerSpecs.storage <= 0) {
          throw new GraphQLError("Storage must be a positive integer");
        }

        employee.computerSpecs = {
          ...employee.computerSpecs,
          ...computerSpecs,
        };
      }

      return await dataSources.employeeRepository.save(employee);
    } catch (error) {
      rethrowGraphQLError(error);
      throw new GraphQLError("An error occurred while updating the employee");
    }
  },

  deleteEmployee: async (_, { id }, { dataSources }) => {
    const deleted = await dataSources.employeeRepository.delete(id);

    if (deleted.affected === 0) {
      throw new GraphQLError("Employee not found");
    }

    return true;
  },
};
