import './components.css'
import { useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'

const Get_PospotNear_List = gql `
# 목록 가져오기
query GetPospotNearList {
    pospotNearList {
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
    }
}
`
const Post_PospotNear = gql `
# 정보 추가하기
    mutation PostPospotNear($input: PospotNearInput!) {
        postPospotNear(input: $input) {
            _id
            name
        }
    }
`
/* 호출하면 쿼리를 다시 보내서 최신의 데이터를 받아오는 함수 */
let refetchData

function GeoNearInsert () {

    const [itemData, setitemData] = useState({
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
            zipCode: 0
        },
    })


    const [itemList, setItemList] = useState({})

    function InfoContainer() {

        return (
            <div className="info">
                <table className="table text-center" id="infoTable">
                    <thead>
                        <tr className="thead-dark">
                            <th>이름</th>
                            <th>설명</th>
                            <th>주소</th>
                            <th>번지</th>
                            <th>위도</th>
                            <th>경도</th>
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
                                        {item.address.zipCode}
                                    </td>
                                    <td className="border-left">
                                        {item.address.location.coordinates[1]}
                                    </td>
                                    <td className="border-left">
                                        {item.address.location.coordinates[0]}
                                    </td>
                                </tr>
                            )
                        }) : 
                        <tr>
                            <td colSpan={6} className="border-left">
                                결과가 없습니다.
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        )
    }

    /* 메인화면 */
    function MainContents () {

        // 컴포넌트가 Mount, Render 될 때, apollo client가 자동으로 실행
        const {loading, error, data, refetch} = useQuery(Get_PospotNear_List, {
            onCompleted: (data) => {
                console.log(data)
                setItemList(data.pospotNearList)
            }
        })
        refetchData = refetch

        function handleChange(e) {
            let {name, value, id} = e.target
            if (name === 'zipCode' || name === 'streetNameAddress' ) {
                setitemData((prevState) => ({
                    ...prevState,
                    address: {
                        ...prevState.address,
                        [name]: name === 'zipCode' ? Number(value) : value
                    }
                }))
            } else if (name === 'lat' || name === 'lng' ) {
                let num = (name === 'lng') ? 0 : 1
                itemData.address.location.coordinates.splice(num,1,Number(value))
                let geo = itemData.address.location.coordinates
                setitemData((prevState) => ({
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
                setitemData({
                    ...itemData,
                    [name]: value
                })
            }
            // console.log(itemData)
        }

    const [postPospotNear] = useMutation (
        Post_PospotNear,
        { 
            variables: {input: itemData},
            onCompleted: 
            (data) => {
                console.log(data)
                alert(data.postPospotNear.name + ` 음식점이 추가되었습니다.`)
                refetchData()
                setitemData ({
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
            }
        }
    )

        return (
            <div>
                <div className="container">
                    <div className="text-center">
                        <p className="nav-brand text-dark">Pospot 주변 음식점 추가하기</p>
                    </div>
                </div>
                <div className="container text-center">
                    <div className="new_user">
                        <div className="form-group">
                            <label htmlFor="name" className="text-light">이름</label>
                            <input type="text" name="name" id="name" onChange={handleChange} 
                                value={itemData.name}/>
                        </div>	
                        <div className="form-group">   
                            <label htmlFor="description" className="text-light">설명</label>
                            <input type="text" name="description" id="description" onChange={handleChange}
                                value={itemData.description}/>
                        </div>	
                        <div className="form-group">
                            <label htmlFor="streetNameAddress" className="text-light">주소</label>
                            <input type="text" name="streetNameAddress" id="streetNameAddress" onChange={handleChange}
                                value={itemData.address.streetNameAddress}/>
                        </div>	
                        <div className="form-group">
                            <label htmlFor="zipCode" className="text-light">번지</label>
                            <input type="number" name="zipCode" id="zipCode" min="0" onChange={handleChange}
                                value={itemData.address.zipCode}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lat" className="text-light">위도</label>
                            <input type="number" name="lat" id="lat"  min="0" step="0.000001" onChange={handleChange}
                                value={itemData.address.location.coordinates[1]}/>
                            <label htmlFor="lng" className="text-light">경도</label>
                            <input type="number" name="lng" id="lng" min="0" step="0.000001" onChange={handleChange}
                                value={itemData.address.location.coordinates[0]}/>
                        </div>	
                    </div>
                    <div className="form-group">
                        <button type="button" id="update" className="btn btn-text-dark update" 
                            onClick={postPospotNear}>추가</button>
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
                </section>
        </div>
    )
}

export default GeoNearInsert