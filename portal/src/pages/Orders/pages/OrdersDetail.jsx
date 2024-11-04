import React from "react"
import { useParams } from "react-router-dom"
import OrdersAdd from "./OrdersAdd"

const OrdersDetail = () => {

    const { id } = useParams()

    return (
        <OrdersAdd orderId={id} isEdit={false} />
    )
}
export default OrdersDetail