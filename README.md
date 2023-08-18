## React와 Apollo Client 
---
* 아폴로 클라이언트, graphql 모듈 설치
```js
npm init
npm install @apollo/client graphql
```
---
### App.js
1. 아폴로 클라이언트 모듈 임포트
* import { ApolloProvider } from '@apollo/client';
* import { ApolloClient, InMemoryCache } from '@apollo/client' 

2.  GraphQL 서버로와 정보를 주고받을 ApolloClient 객체 생성
* client : GraphQL 서버로와 정보를 주고받을 ApolloClient 객체
* uri : GraphQL 서버의 주소
* cache : InMemoryCache를 통한 캐시 관리
```js
const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});
```
3. React에 클라이언트 연결
* Apollo 서버로부터 데이터를 주고 받을 수 있게 GraphQL을 사용할 부분(root Component)을 ApolloProvider로 감싸주기
```js
  return (
    <div className="App">
      <ApolloProvider client={client}>
          <header className="App-header">
            <h2>GeospatialQuery</h2>
            <nav>
              <ul>
                {NavMenus()}
              </ul>
            </nav>
          </header>
          <main>
            {mainComponent[menu]}
          </main>
      </ApolloProvider>
    </div>
  )

```
---
### Components.js
1. ApolloClient 필요한 모듈 임포트
* import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
2. 조회를 위한 Query문 작성 (gql)
* Apollo에서 제공하는 Playground에서 쿼리 테스트 가능 https://studio.apollographql.com/sandbox/explorer
* 쿼리에 주석 달기 : # 내용

```
query 쿼리 이름 {
  받아올 내용  {
    원하는 컬럼1,
    원하는 컬럼2,
    원하는 컬럼3
    ....
  }
}
```
```js
const Get_PospotNear = gql `
# 검색 목록 가져오기
query GetPospotNear ($lng: Float!, $lat: Float!, $radius: Int!) {
    pospotNear(lng: $lng, lat: $lat, radius: $radius){
        _id
        description
        name
        address {
            location {
                type
                coordinates
            }
        streetNameAddress
        zipCode
    }
    distance
    }
}
`
```
3. GraphQL로부터 데이터를 받아오기
* 반환 값을 넣을 변수 = useQuery ( graphQL 쿼리, { 옵션 } )
* 반환 값 종류
  * loading : 요청 진행 중 여부
  * error : 요청에 오류가 발생할 시 반환
  * data : 쿼리의 결과를 포함하는 객체
  * refetch : 호출하면 쿼리를 다시 보내서 최신의 데이터를 받아오는 함수
* Apollo HOOK
  * useQuery : 컴포넌트가 Mount, Render 될 때, apollo client가 자동으로 실행
  * useLazyQuery : 컴포넌트가 Render 될 때가 아닌 어떠한 이벤트에 대해 Query를 실행
  * useMutation : 특정 함수에서 우리가 원하는 때에 직접 요청을 시작하는 형태로 작동

```js
const {loading, error, data, refetch} = 
    useQuery(Get_PospotNear_List, {
        onCompleted: (data) => {
            console.log(data)
            setItemList(data.pospotNearList)
        }
    })
const [search_PospotNear, {loading, error, data, refetch}]
    = useLazyQuery(Get_PospotNear, {
        variables: 
        {lng: search.lng, lat: search.lat, radius: search.radius},
        onCompleted: (data) => {
            console.log(data)
            setItemList(data.pospotNear)
        }
    })
```

4. 추가, 수정 작업을 위한 Query문 쿼리 작성
```
mutation 쿼리 이름 (variables 변수: 쿼리에서 받는 변수 타입) {
  받아올 내용 (보내는 데이터) {
    원하는 컬럼1,
    원하는 컬럼2,
    원하는 컬럼3
    ....
  }
}
```
```js
const Post_PospotNear = gql `
# 정보 추가하기
    mutation PostPospotNear($input: PospotNearInput!) {
        postPospotNear(input: $input) {
            _id
            name
        }
    }
`
const Edit_PospotNear = gql `
# 정보 수정하기
    mutation EditPospotNear($input: PospotNearInput!) {
        editPospotNear(input: $input) {
            name
        }
    }
`
```

5. GraphQL로 데이터 보내기
* 해당 이벤트를 줄 버튼 등에 onClick 함수 추가 
* 해당 함수에서 variables을 인자 값에 추가하여 useMutation() 함수 실행
* useMutation( graphQL 쿼리, { 옵션 } )
* 옵션 종류 
  * query: graphQL 쿼리
  * variables: 쿼리실행에 필요한 변수
  * onCompleted: 쿼리가 성공적으로    종료될 때 호출되는 콜백함수
  * onError: 쿼리 요청 중 에러 발생시    호출되는 콜백함수

```js
<div className="form-group">
    <button type="button" id="search" className="btn btn-text-dark update"
        onClick={searchClick} >검색</button>
</div>

/* 정보 수정 함수 */
function execEditPospotNear() {
    editPospotNear({
        variables: {input: itemData}
    })
}

const [editPospotNear] = useMutation (
    Edit_PospotNear,
    { onCompleted: 
        async (data) => {
            // console.log(data)
            await refetchData()
            alert(data.editPospotNear.name + ` 음식점이 수정되었습니다.`)
        }
    }
)
```
