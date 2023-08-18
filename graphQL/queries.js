const { gql } = require('apollo-server');

// 클라이언트에서 Query의 Object의 이름을 호출하여 사용
// Query와 쿼리로 접근하는 데이터의 형태를 정의
const typeDefs = gql`
  type Query {
    # Query 루트 타입으로 지정 PospotNear가 여러개 들어가기 때문에 배열로 지정
    pospotNearList : [PospotNear]

    # id를 인자로 받아 하나의 PospotNear 데이터를 반환
    pospotNearOne (_id: String): PospotNear

    # 위도, 경도, 반경을 인자로 받아 PospotNear 배열을 반환
    pospotNear (lng:Float!, lat:Float!, radius:Int!): [PospotNear]
    airBnb (query: String!, lng: Float!, lat:Float!, radius:Int!) : [AirBnb]
  }
`;
module.exports = typeDefs;