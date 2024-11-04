import React from "react"
import { useParams } from "react-router-dom"
import BookingAdd from "./BookingAdd"

const BookingDetail = () => {

    const { id } = useParams()

    return (
        <BookingAdd orderId={id} isEdit={false} />
    )
}
export default BookingDetail