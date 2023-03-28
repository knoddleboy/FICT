export default {
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
};
