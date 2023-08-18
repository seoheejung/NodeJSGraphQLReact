// mongoDB와 연결
const dbConnect = require('../models');

/* Convert string to ObjectID in MongoDB */
const ObjectId = require('mongodb').ObjectId;

const dbWorks = {
    pospotNear: (args) => {
        try {
            // console.log(args)
            let results = dbConnect.collectionPospot.aggregate([
                /* 특정 geo 값으로부터 얼마만큼 떨어져 있는가를 기준으로 데이터를 불러오는 함수  */
                {
                    "$geoNear": {
                        "near": {
                            "type": "Point",
                            // 포스팟 좌표 : { 경도 : 126.9478459, 위도 : 37.374819 }
                            "coordinates": [args.lng, args.lat]
                        },
                        "distanceField": "distance",
                        "maxDistance": args.radius,
                        "spherical": true,
                        "key": "address.location"
                    }
                },
                
                {
                    "$project" : {
                        "name" : 1,
                        "description" : 1,
                        "address" : 1,
                        "distance":1
                    }
                }
            ]).toArray();
            return results
        } catch (e) {
            console.log(e)
        }
    },
    pospotNearList: (args) => {
        try {
            /* sort : 정렬 (-1 : desc, 1 : asc) */
            let results = dbConnect.collectionPospot.find({}).sort( { "_id": -1 }).toArray()

            return results
        } catch (e) {
            console.log(e)
        }
    },
    pospotNearOne: (args) => {
        try {
            let id = args

            // 객체 타입이 string면 ObjectId로 변환
            if(typeof(args._id) === 'string') {
                id = new ObjectId(args._id)
            }

            let result = dbConnect.collectionPospot.findOne({"_id" : id});
            return result
        } catch (e) {
            console.log(e)
        }
    },
    postPospotNear: (args) => {
        try {
            let results = dbConnect.collectionPospot.insertOne(args.input)
                        .then(results => {
                            // {insertedId: ObjectId } 반환된 ObjectId로 해당 정보 검색 후 데이터 반환
                            let OneData = dbWorks.pospotNearOne(results.insertedId)
                            return OneData
                        })

            let getResult = results.then((OneData) => {
                                return OneData 
                            })
            return getResult
        } catch (e) {
            console.log(e)
        }
    },
    editPospotNear: (args) => {
        try {
            
            let data = args.input;
            //console.log(data)

            // string로 넘어온 _id를 ObjectId로 변경
            data._id = new ObjectId(data._id)

            let values = Object.values(data)

            // replaceOne()을 사용하면 전체 문서 변경 
            /*dbConnect.collectionPospot.replaceOne(
                {"_id" : values[0]},
                {
                    data
                }
            ).then(results => {console.log(results)})
            */
            
            // updateOne()은 필드 업데이트
            let results = dbConnect.collectionPospot.updateOne(
                {"_id" : values[0]},
                {$set: 
                    {
                        "name" : values[1],
                        "description" : values[2],
                        "address" : values[3],
                    }
                }
            ).then(results => {
                // ObjectId로 해당 정보 검색 후 데이터 반환
                console.log(values[0])
                let OneData = dbWorks.pospotNearOne(values[0])
                return OneData
            })
            
            let getResult = results.then((OneData) => {
                
                return OneData 
            })

            return getResult

        } catch (e) {
            console.log(e)
        }
    },
    deletePospotNear: (args) => {
        try {
            
            let results = dbConnect.collectionPospot.deleteMany(
                { "name": args.name }
            ).then(results => {
                return results.deletedCount
            })
            
            return results

        } catch (e) {
            console.log(e)
        }
    },
    airBnb: (args) => {
        try {
            // mongodb 조건 검색 후 배열로 반환
            //console.log(args)
            let results = dbConnect.collectionAriBnb.aggregate([
                /* 파이프라인 */
                {   /* Atlas 컬렉션의 필드에 대한 전체 텍스트 검색을 수행 */
                    "$search": {
                        /* 사용 검색 인덱스 */
                        "index": "autocomplete",
                        /* 둘 이상의 연산자를 단일 쿼리로 결합 */
                        "compound": {
                            /* document 결과에 포함되기 위해 배열 안의 조건이 모두 일치해야 하는 절 (AND) */
                            "must": [
                                {   
                                    /* 자동 완성 연산자 */
                                    "autocomplete": {
                                        "query": `${args.query}`,
                                        "path": "name",
                                        /* 검색어와 유사한 문자열 찾기 옵션 */
                                        "fuzzy": {
                                            "maxEdits": 1,
                                            "prefixLength": 15
                                        },
                                        "score": { "boost": { "value": 5 } }
                                    }
                                },
                                {
                                    /* 위도와 경도로 지정된 원형 영역 내에서 검색 (	주어진 위치를 기준으로 위치 기반의 검색을 수행해서 일정 반경 이내의 결과만 다음 스테이지로 전달) */
                                    "geoWithin":{
                                        /*  검색할 중심점과 반경을 미터 단위로 지정하여 검색*/
                                        "circle": {
                                            /* 원의 중심 */
                                            "center": {
                                                "type": "Point",
                                                /* 경도, 위도 */
                                                "coordinates": [args.lng, args.lat]
                                            },
                                            /* 미터로 지정 */
                                            "radius": args.radius,
                                            
                                        },
                                        /* 인덱싱된 지역 유형 필드 또는 검색할 필드 */
                                        "path": "address.location",
                                    }
                                }
                            ]
                        }
                    }
                },
                /* ordey by (오름차순 : 1, 내림차순 -1) 
                { "$sort" : { "name" : 1 } },*/
                {
                    /* 반환하려는 필드만 정의하여 응답 */
                    "$project": {
                        /* name과 address 제외한 모든 필드를 제외*/
                        "name": 1,
                        "price": 1,
                        "host":1,
                        "address": 1,
                        "reviews":1,
                        /* 일치하는 검색 결과에 할당된 점수 (실제로 얼마나 가까운지 결정 가능)*/
                        "score": {"$meta": "searchScore"}
                    }
                }
            ]).toArray();
            return results
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = dbWorks
