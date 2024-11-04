import React from "react"
import { useParams } from "react-router-dom"
import OrdersAdd from "./BookingAdd"

const BookingEdit = () => {

    const { id } = useParams()

    return (
        <OrdersAdd orderId={id} isEdit={true} />
    )
}
export default BookingEdit