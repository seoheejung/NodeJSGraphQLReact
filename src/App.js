import './App.css';
import React, { useState } from 'react';

import GeoWithin from './components/geoWithin'
import GeoNear from './components/geoNear'
import GeoNearInsert from './components/geoNearInsert'

// ApolloClient 모듈
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client'

function App() {

  const [menu, setMenu] = useState('geoWithin')

  /* 	App-header 아래 메인 화면에 나타날 컴포넌트 매핑 */
  let mainComponent = {
    'geoWithin' : (<GeoWithin />),
    'geoNear' : (<GeoNear />),
    'geoNearInsert' : (<GeoNearInsert />),
  }

  /* menu값에 따라 상단 App-header의 버튼을 표시하는 함수 */
  function NavMenus() {
    return [ 'geoWithin', 'geoNear', 'geoNearInsert']
      .map( (_menu, key) => {
        return (
          <li key={key} className={menu === _menu ? 'on' : ''}
            onClick={ () => {setMenu(_menu);}}> {_menu}</li>
        )
      })
  }

  /* GraphQL 서버와 정보를 주고받을 ApolloClient 객체 */
  const client = new ApolloClient ({
    // GraphQL 서버의 주소
    uri: 'http://localhost:4000', 
    // GraphQL 쿼리 결과를 저장하는데 사용할 cache 생성 
    // (InMemoryCache :한번 받아온 정보를 필요 이상으로 다시 요청할 필요가 없도록 캐시 관리)
    cache: new InMemoryCache({addTypename:false}) 
  })

  return (
    <div className="App">
      {/* Apollo 서버로부터 데이터를 주고 받을 수 있게 
          GraphQL을 사용할 부분(React component)을 ApolloProvider로 감싸주기 */}
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
}

export default App;
