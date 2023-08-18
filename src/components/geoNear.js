import './components.css'
import { useState } from 'react'
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client'


/* gql 쿼리문 작성*/
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

const Edit_PospotNear = gql `
# 정보 수정하기
    mutation EditPospotNear($input: PospotNearInput!) {
        editPospotNear(input: $input) {
            name
        }
    }
`

/* 호출하면 쿼리를 다시 보내서 최신의 데이터를 받아오는 함수 */
let refetchData

function GeoNear () {
    const [search, setSearch] = useState({
        lng: 126.9478459,
        lat: 37.374819,
        radius: 0,
    })
    const [itemList, setItemList] = useState({})
    const [itemData, setItemData] = useState({
        description: '',
        name: '',
        address: {
            location: {
                type : "Point",
                coordinates: [
                    126.9478459,
                    37.374819,
                ]
            }, 
            streetNameAddress: '', 
            zipCode: 0},
    })
    const [changed, setChanged] = useState(false)

    function InfoContainer() {
        function handleClick(e) {
            setItemData(itemList.find(item => item._id === e.target.value))
            setTimeout(() => {
                setChanged(false)
            },5)
        }

        return (
            <div className="info">
                <table className="table text-center" id="infoTable">
                    <thead>
                        <tr className="thead-dark">
                            <th>이름</th>
                            <th>설명</th>
                            <th>주소</th>
                            <th>거리</th>
                            <th>수정</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        itemList.length > 0 ?
                        itemList.map ((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-left">
                                        {item.name}
                                    </td>
                                    <td className="border-left">
                                        {item.description}
                                    </td>
                                    <td className="border-left">
                                        {item.address.streetNameAddress}
                                    </td>
                                    <td className="border-left">
                                        {(item.distance).toFixed(2) + "M"}
                                    </td>
                                    <td className="border-left">
                                        <button className="update-button" id='update' 
                                            onClick={handleClick} value={item._id}>수정</button>
                                    </td>
                                </tr>
                            )
                        }) : 
                        <tr>
                            <td colSpan={5} className="border-left">
                            검색 결과가 없습니다.
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        )
    }

    function UpdateContainer () {
        
        function handleChange(e) {
            let {name, value} = e.target
            setChanged(true)
            if (name === 'zipCode' || name === 'streetNameAddress' ) {
                setItemData((prevState) => ({
                    ...prevState,
                    address: {
                        ...prevState.address,
                        [name]: name === 'zipCode' ? Number(value) : value
                    }
                }))
            } else if (name === 'lat' || name === 'lng' ) {
                let num = (name === 'lng') ? 0 : 1
                // 해당 위치의 배열 값 변환
                let geo = []
                itemData.address.location.coordinates.map((coordinate) => {
                    geo.push(coordinate)
                })
                // console.log(itemData.address.location.coordinates)
                geo.splice(num,1,Number(value))
                
                setItemData((prevState) => ({
                    ...prevState,
                    address: {
                        ...prevState.address,
                        location: { 
                            ...prevState.address.location,
                            coordinates: geo
                            }
                        }
                    }))
            } else {
                setItemData((prevState) => ({
                    ...prevState,
                    [name]: value
                }))
            }
            // console.log(itemData)
        }

        /* 정보 수정 함수 */
        function execEditPospotNear() {
            if(!changed) {
                alert("수정된 항목이 없습니다.")
                return
            }

            // 요소 삭제
            delete itemData.distance
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

                    setItemData ({
                        description: '',
                        name: '',
                        address: {
                            location: {
                                type : "Point",
                                coordinates: [
                                    126.9478459,
                                    37.374819,
                                ]
                            }, 
                            streetNameAddress: '', 
                            zipCode: 0},
                    })
                    alert(data.editPospotNear.name + ` 음식점이 수정되었습니다.`)
                }
            }
        )

        return (
            <div>
                <div className="container text-center">
                    <div className="new_user">
                        <div className="form-group">
                            <label htmlFor="name" className="text-light">이름</label>
                            <input type="text" name="name" id="name"
                                value={itemData.name} onChange={handleChange}/>
                        </div>	
                        <div className="form-group">   
                            <label htmlFor="description" className="text-light">설명</label>
                            <input type="text" name="description" id="description"
                                value={itemData.description} onChange={handleChange}/>
                        </div>	
                        <div className="form-group">
                            <label htmlFor="streetNameAddress" className="text-light">주소</label>
                            <input type="text" name="streetNameAddress" id="ㅣ"
                                value={itemData.address.streetNameAddress} onChange={handleChange}/>
                        </div>	
                        <div className="form-group">
                            <label htmlFor="zipCode" className="text-light">번지</label>
                            <input type="number" name="zipCode" id="zipCode" 
                                value={itemData.address.zipCode} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lat" className="text-light">위도</label>
                            <input type="number" name="lat" id="lat"  min="0" step="0.0001" 
                                value={itemData.address.location.coordinates[1]} onChange={handleChange}/>
                            <label htmlFor="lng" className="text-light">경도</label>
                            <input type="number" name="lng" id="lng" min="0" step="0.0001"
                                value={itemData.address.location.coordinates[0]} onChange={handleChange}/>
                        </div>	
                    </div>
                    <div className="form-group">
                        <button type="button" id="update" className="btn btn-text-dark update" 
                            onClick={execEditPospotNear}>수정</button>
                    </div>
                </div>
            </div>
        )
    }


    /* 메인화면 */
    function MainContents () {

        const [search_PospotNear, {loading, error, data, refetch}] = useLazyQuery(Get_PospotNear, {
            // GraphQL 쿼리에 전달하려는 변수를 포함하는 객체
            variables: 
            {lng: search.lng, lat: search.lat, radius: search.radius},
            onCompleted: (data) => {
                console.log(data)
                setItemList(data.pospotNear)
            }
        })

        /* 호출하면 쿼리를 다시 보내서 최신의 데이터를 받아오는 함수 */
        refetchData = refetch

        
        function searchClick(e) {
            if (search.lat === 0 || search.lng === 0 || search.radius === 0){
                return
            }
            // useLazyQuery 실행
            search_PospotNear()
        }

        function geoChange(e) {
            const {name, value} = e.target
            setSearch({
                ...search,
                [name]: Number(value)
            })
            //console.log(airBnb)
        }

        return (
            <div>
                <div className="container">
                    <div className="text-center">
                        <p className="nav-brand text-dark">Pospot 주변 음식점 찾기</p>
                    </div>
                </div>
                <div className="container text-center">
                    <div className="new_user">
                        <div className="form-group">
                            <label htmlFor="lat" className="text-light">위도</label>
                            <input type="number" name="lat" id="lat"  min="0" step="0.000001" 
                                value={search.lat} onChange={geoChange}/>
                            <label htmlFor="lng" className="text-light">경도</label>
                            <input type="number" name="lng" id="lng" min="0" step="0.000001"
                                value={search.lng} onChange={geoChange}/>
                        </div>	
                        <div className="form-group">
                            <label htmlFor="radius" className="text-light">반경</label>
                            <input type="number" name="radius" id="radius" step="100"  min="0"
                                value={search.radius} onChange={geoChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="button" id="search" className="btn btn-text-dark update"
                            onClick={searchClick} >검색</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div id="geoNear" className="component">
            {/* 문서 영역 - 리스트 각 항목의 내용부가 표시될 곳 */}
                <section className="contents">
                    <div className="inputContainer">{MainContents()}</div>
                    <div className="inputContainer">
                        {InfoContainer()}
                    </div>
                    <div className="inputContainer">
                        {UpdateContainer()}
                    </div>
                </section>
        </div>
    )
}

export default GeoNear