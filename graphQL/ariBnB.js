const { gql } = require('apollo-server')
const dbWorks = require('../public/dbWorks')

// 스키마 (Schema)
const typeDefs = gql `
    scalar Decimal

    # 반환될 데이터의 형태를 지정
    type AirBnb {
        _id: String
        access: String
        accommodates: Int
        address: ListingsAndReviewAddress
        amenities: [String]
        availability: ListingsAndReviewAvailability
        bathrooms: Float
        bed_type: String
        bedrooms: Int
        beds: Int
        cancellation_policy: String
        cleaning_fee: Decimal
        description: String
        extra_people: Float
        guests_included: Float
        host: ListingsAndReviewHost
        house_rules: String
        images: ListingsAndReviewImage
        interaction: String
        listing_url: String
        maximum_nights: String
        minimum_nights: String
        monthly_price: Decimal
        name: String
        neighborhood_overview: String
        notes: String
        number_of_reviews: Int
        price: Decimal
        property_type: String
        review_scores: ListingsAndReviewReview_score
        reviews: [ListingsAndReviewReview]
        room_type: String
        security_deposit: Float
        space: String
        summary: String
        transit: String
        weekly_price: Decimal
        score: Float
    }
    type ListingsAndReviewAddress {
        country: String
        country_code: String
        government_area: String
        location: ListingsAndReviewAddressLocation
        market: String
        street: String
        suburb: String
    }

    type ListingsAndReviewAddressLocation {
        coordinates: [Float]
        is_location_exact: Boolean
        type: String
    }
    
    type ListingsAndReviewAvailability {
        availability_30: Int
        availability_365: Int
        availability_60: Int
        availability_90: Int
    }

    type ListingsAndReviewImage {
        medium_url: String
        picture_url: String
        thumbnail_url: String
        xl_picture_url: String
    }

    type ListingsAndReviewHost {
        host_about: String
        host_has_profile_pic: Boolean
        host_id: String
        host_identity_verified: Boolean
        host_is_superhost: Boolean
        host_listings_count: Int
        host_location: String
        host_name: String
        host_neighbourhood: String
        host_picture_url: String
        host_response_rate: Int
        host_response_time: String
        host_thumbnail_url: String
        host_total_listings_count: Int
        host_url: String
        host_verifications: [String]
    }

    type ListingsAndReviewReview {
        _id: String
        comments: String
        listing_id: String
        reviewer_id: String
        reviewer_name: String
    }

    type ListingsAndReviewReview_score {
        review_scores_accuracy: Int
        review_scores_checkin: Int
        review_scores_cleanliness: Int
        review_scores_communication: Int
        review_scores_location: Int
        review_scores_rating: Int
        review_scores_value: Int
    }
`
// 서비스의 액션들을 함수로 지정, 요청에 따라 데이터를 반환, 입력, 수정 삭제
const resolvers ={
    Query: {
        airBnb: (parent, args) => dbWorks.airBnb(args)
    },
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}