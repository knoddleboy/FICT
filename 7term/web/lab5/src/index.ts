import "reflect-metadata";
import path from "node:path";
import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers";
import repository from "./repository";
import { AppDataSource } from "./data-source";

export interface ContextWithDataSources {
  dataSources: typeof repository;
}

async function bootstrapServer() {
  const schemaFile = path.resolve(path.join(__dirname, "./schema.graphql"));
  const typeDefs = readFileSync(schemaFile, { encoding: "utf-8" });

  const server = new ApolloServer<ContextWithDataSources>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => ({
      dataSources: {
        employeeRepository: repository.employeeRepository,
        departmentRepository: repository.departmentRepository,
        computerSpecsRepository: repository.computerSpecsRepository,
      },
    }),
  });

  console.log(`🚀 Server ready at: ${url}`);
}

try {
  await AppDataSource.initialize();
  await bootstrapServer();
} catch (error) {
  console.error(error);
}
