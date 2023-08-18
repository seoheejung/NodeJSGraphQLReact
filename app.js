const { ApolloServer } = require('apollo-server');
const cors = require('cors'); // // cors 미들웨어
const express = require('express'); // express 미들웨어

const app = express(); 
const dotenv = require('dotenv');

app.use(cors());
dotenv.config(); // 환경변수를 위한 dotenv

const port = process.env.PORT || 4000;

// mongoDB와 연결
const dbConnect = require('./models');
dbConnect.connect;

// export로 보내진 모듈
const queries = require('./graphQL/queries');
const mutations = require('./graphQL/mutations');
const pospotNear = require('./graphQL/pospotNear')
const ariBnB = require('./graphQL/ariBnB')

// GraphQL 명세에서 사용될 데이터
const typeDefs = [
  queries, 
  mutations,
  pospotNear.typeDefs,
  ariBnB.typeDefs,
]
// 쿼리에 해당하는 데이터를 가져오는 로직 정의
const resolvers = [
  pospotNear.resolvers,
  ariBnB.resolvers,
]

/* error log */
const formatError = (err) => {
  console.error("--- GraphQL Error ---");
  console.error("Path:", err.path);
  console.error("Message:", err.message);
  console.error("Code:", err.extensions.code);
  console.error("Original Error", err.originalError);
  return err;
};

// Apollo Server에 대한 Obejct를 생성
// typeDef와 resolver를 인자로 받아 서버 생성
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError,
  playground: true
});

// listen()으로 명령 실행
server.listen(port).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});