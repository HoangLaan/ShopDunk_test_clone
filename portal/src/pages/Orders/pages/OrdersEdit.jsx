import React from "react"
import { useParams } from "react-router-dom"
import OrdersAdd from "./OrdersAdd"

const OrdersEdit = () => {

    const { id } = useParams()

    return (
        <OrdersAdd orderId={id} isEdit={true} />
    )
}
export default OrdersEdit