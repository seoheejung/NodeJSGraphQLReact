import './components.css'
import { useState } from 'react'
import { gql, useLazyQuery  } from '@apollo/client'


/* gql 쿼리문 작성해 저장하기*/
const GET_AIRBNB = gql `
# 검색 목록 가져오기
query GET_AIRBNB ($query: String!, $lng: Float!, $lat: Float!, $radius: Int!){
    airBnb ( query: $query, lng: $lng, lat: $lat, radius: $radius) {
        _id
        name  
        host {
            host_name
        }
        address {
            government_area
            street
            location {
                coordinates
            }
        }
        price
        score
    }
}
`
let country = {
    'australia': {'lat':-33.8638, 'lng': 151.2115},
    'hongkong': {'lat':22.3165, 'lng': 114.1703},
    'newyork': {'lat':40.71558, 'lng': -74.0096},
    'turkey': {'lat':41.04272, 'lng': 28.9998}
}

function GeoWithin () {
    
    const [airBnb, setAirBnb] = useState({
        lng: 0,
        lat: 0,
        radius: 0,
        bnb: ''
    })

    const [itemData, setItemData] = useState({})
    const [visibleView, setVisibleView] = useState(false)

    
    function infoContainer() {
        const item = itemData

        function getDistance(lat1, lon1, lat2, lon2) {
            if ((lat1 === lat2) && (lon1 === lon2))
                return 0

            var radLat1 = Math.PI * lat1 / 180
            var radLat2 = Math.PI * lat2 / 180
            var theta = lon1 - lon2
            var radTheta = Math.PI * theta / 180
            var dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta)
            if (dist > 1) dist = 1

            dist = Math.acos(dist)
            dist = dist * 180 / Math.PI
            dist = dist * 60 * 1.1515 * 1.609344 * 1000
            /*if (dist < 100) dist = Math.round(dist / 10) * 10
            else dist = Math.round(dist / 100) * 100*/

            return dist.toLocaleString('ko-KR', {maximumFractionDigits: 2}) + 'M'
        }
        // console.log(item)
        let lon1 = airBnb.lng
        let lat1 = airBnb.lat
        let lon2 = item.address.location.coordinates[0]
        let lat2 = item.address.location.coordinates[1]
        const distance = getDistance(lat1, lon1, lat2, lon2)

        return (
            <table className="table text-center table-width"> 
                <thead> 
                    <tr> 
                        <th colSpan="2">
                            {item.name}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="thead-dark">ID</td>
                        <td>
                            {item._id}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">나라</td>
                        <td>
                            {item.address.street}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">행정구역</td>
                        <td>
                            {item.address.government_area}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">호스트</td>
                        <td>
                            {item.host.host_name}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">가격</td>
                        <td>
                            {item.price.$numberDecimal}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">위도</td>
                        <td>
                            {item.address.location.coordinates[1]}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">경도</td>
                        <td>
                            {item.address.location.coordinates[0]}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">거리</td>
                        <td>
                            {distance}
                        </td>
                    </tr>
                    <tr>
                        <td className="thead-dark">매칭 점수</td>
                        <td>
                            {(item.score).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    /* 메인화면 */
    function MainContents () {
        
        // useQuery: 자동 실행, 결과 반환, useLazyQuery: 수동 실행 (이벤트에 대한 응답으로 쿼리를 실행), 결과 + 쿼리를 실행할 수 있는 함수 반환
        const [search_AIRBNB, {loading, error, data}] = useLazyQuery(GET_AIRBNB, {
            // GraphQL 쿼리에 전달하려는 변수를 포함하는 객체
            variables: 
            {query: airBnb.bnb, lng: Number(airBnb.lng), lat: Number(airBnb.lat), radius: Number(airBnb.radius)},
        })

        function searchChange(e) {
            const {name, value} = e.target
            if (airBnb.lat === 0 || airBnb.lng === 0 || airBnb.radius === 0){
                return
            }

            setAirBnb({
                ...airBnb,
                [name]: value
            })
            // useLazyQuery 실행
            if(airBnb.bnb !== '') {
                search_AIRBNB()
            }
            
        }

        function geoChange(e) {
            const {name, value} = e.target
            setAirBnb({
                ...airBnb,
                [name]: value
            })
            //console.log(airBnb)
        }

        function radioChange(e) {
            const {value} = e.target
            
            setAirBnb({
                ...airBnb,
                lng: country[value].lng,
                lat: country[value].lat,
                bnb: ""
            })
            setTimeout(() => {
                setVisibleView(false)
                setItemData({})
            },3)
            // console.log(airBnb)
        }
        
        function itemChange(item) {
            setItemData(item)
            setTimeout(() => {
                setVisibleView(true)
            },5)
            // console.log(itemData)
        }
        
        return (
            <div >
                <div className="container">
                    <div className="text-center">
                        <p className="nav-brand text-dark">AirBnB 숙소 찾기</p>
                    </div>
                </div>
                <div className="container text-center">
                    <div className="new_user">
                        <div className="form-group">
                            <label htmlFor="lat" className="text-light">위도</label>
                            <input type="number" name="lat" id="lat" min="0" step="0.0001"
                                value={airBnb.lat} onChange={geoChange} />
                            <label htmlFor="lng" className="text-light">경도</label>
                            <input type="number" name="lng" id="lng"  min="0" step="0.0001"
                                value={airBnb.lng} onChange={geoChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lat" className="text-light">반경</label>
                            <input type="number" name="radius" id="radius"step="500" min="0" 
                                onChange={geoChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="radio inline">
                        <label htmlFor="country" className="text-light">Country</label>
                            <input type="radio" name="group" value="australia" id="australia" onChange={radioChange} />
                            <label htmlFor="australia" className="radio-label">Australia Sydney</label>

                            <input type="radio" name="group" value="hongkong" id="hongkong" onChange={radioChange} />
                            <label htmlFor="hongkong" className="radio-label">Hong Kong</label>
                            
                            <input type="radio" name="group" value="newyork" id="newyork" onChange={radioChange} />
                            <label htmlFor="newyork" className="radio-label">New York</label>
                            
                            <input type="radio" name="group" value="turkey" id="turkey" onChange={radioChange} />
                            <label htmlFor="turkey" className="radio-label">Turkey Istanbul</label>
                        </div>
                    </div>
                    <div className="search">
                        <input
                            name="bnb"
                            className="seacrhbar"
                            placeholder="검색어를 입력하세요."
                            onChange={(e) => searchChange(e)}
                        ></input>
                        {data && 
                        <div  className="searchResult">
                        {data.airBnb.map((item) => {
                            return (
                                <p key={item._id} className="searchItem" onClick={() => itemChange(item)}>
                                    {item.name}
                                </p>
                            )
                        })}
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div id="geoWithin" className="component">
            {/* 문서 영역 - 리스트 각 항목의 내용부가 표시될 곳 */}
                <section className="contents">
                    <div className="inputContainer">{MainContents()}</div>
                {visibleView && 
                    <div className="inputContainer">
                    {infoContainer()}
                    </div>
                }
                </section>
        </div>
    )
}

export default GeoWithin