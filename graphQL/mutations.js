const { gql } = require('apollo-server');

// Mutationd의 type object 정의
const typeDefs = gql`
  type Mutation {
    # 추가할 PospotNear 요소 값들을 Input 인자로 받고 추가된 PospotNear 반환
    postPospotNear(input: PospotNearInput!): PospotNear!

    # 수정할 PospotNear 요소 값들을 Input 인자로 인자로 받고 수정된 PospotNear 반환
    editPospotNear(input: PospotNearInput!): PospotNear!
    
    # 삭제할 PospotNear 이름을 인자로 받고 삭제된 개수 반환
    deletePospotNear(name: String): Int
  }
`;
module.exports = typeDefs;