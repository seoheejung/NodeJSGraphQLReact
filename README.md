## MongoDB와 Apollo Server

* 아폴로 서버, graphql, env, cors express, mongodb 모듈 설치
```js
npm init
npm i apollo-server graphql dotenv cors express mongodb
```
---
### app.js
1. mongoDB와 연결
* models/index.js 호출하여 connect

2. typeDef와 resolver를 인자로 받아 Apollo Server 생성
* typeDefs : Query와 쿼리로 접근하는 데이터의 형태를 정의
* resolvers : 서비스의 액션, 쿼리에 해당하는 데이터를 가져오는 로직 정의
* playground : 작성한 쿼리를 테스트하는 클라이언트
```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
})
```
3. listen()으로 명령 실행
```js
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```
* cors : 도메인 및 포트가 다른 서버로 클라이언트가 요청했을 때 브라우저가 보안상의 이유로 API를 차단하는 문제 해결
---
### model/index.js
* MongoClient 호출해서 MongoDB와 연결 
* MongoDB Atlas에서 설정한 계정의 아이디, 비밀번호, database 이름 필요
```
/* .env  */
ATLAS_URI=mongodb+srv://test:<password>@cluster0.bvh75.mongodb.net/<dbname>?retryWrites=true&w=majority
```
---
### GraphQL/queries.js
* Query 정의 
* 클라이언트에서 Query의 Object의 이름을 호출하여 사용
* Query와 쿼리로 접근하는 데이터의 형태를 정의
---
### GraphQL/mutations.js
* mutations 정의
---
### GraphQL/pospotNear.js
* 스키마와 resolvers 정의
---
### public/dbWorks.js
* resolvers에서 실제로 실행할 DB 작업 작성 (aggregate, find, insertOne 등)
