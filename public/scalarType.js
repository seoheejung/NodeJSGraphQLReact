const { GraphQLScalarType } = require('graphql');

const Decimal = new GraphQLScalarType({
  name: "Decimal",
  description: "The `Decimal` scalar type to represent currency values",
  serialize(value) {
    return new Big(value);
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      // @ts-ignore | TS2339
      throw new TypeError(`${String(ast.value)} is not a valid decimal value.`);
    }

    return Big(ast.value);
  },

  parseValue(value) {
    return Big(value);
  }
});

const ObjectId = new GraphQLScalarType({
    name: "ObjectId",
    description: "Mongo object id scalar type",
    serialize(value) {
      return value.toHexString(); // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new ObjectId(ast.value); // value from the client query
        }
        return null;
    },
    parseValue(value) {
      return new ObjectId(value); // value from the client input variables
    },
});

module.exports = {
    Decimal: Decimal,
    ObjectId: ObjectId
}