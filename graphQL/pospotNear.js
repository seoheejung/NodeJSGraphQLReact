const { gql } = require('apollo-server')
const dbWorks = require('../public/dbWorks')

// 스키마 (Schema)
const typeDefs = gql `
    scalar ObjectId

    # 반환될 데이터의 형태를 지정
    type PospotNear {
        _id: ObjectId
        description: String
        name: String
        address: PospotNearAddress
        distance: Float
    }

    type PospotNearAddress {
        location: PospotNearAddressLocation
        streetNameAddress: String
        zipCode: Int
    }

    type PospotNearAddressLocation {
        coordinates: [Float]
        type: String
    }

    # input 형식으로 데이터를 추가, 수정할 때 필요한 필드를 지정 
    input PospotNearInput {
        _id: ObjectId
        name: String
        description: String
        address: PospotNearAddressInput
    }

    input PospotNearAddressInput {
        location: PospotNearAddressLocationInput
        streetNameAddress: String
        zipCode: Int
    }
    input PospotNearAddressLocationInput {
        coordinates: [Float]
        type: String
    }
`
// 지정된 스키마를 호출해 주는 역할
const resolvers ={
    // object의 항목들로 데이터를 반환하는 함수 선언
    Query: {
        pospotNearOne: (parent, args) => dbWorks.pospotNearOne(args),
        pospotNear: (parent, args) => dbWorks.pospotNear(args),
        pospotNearList: (parent, args) => dbWorks.pospotNearList(args)
    },
    Mutation: {
        postPospotNear: async (parent, args) => await dbWorks.postPospotNear(args),
        editPospotNear: (parent, args) => dbWorks.editPospotNear(args),
        deletePospotNear: (parent, args) => dbWorks.deletePospotNear(args),
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}