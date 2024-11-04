import React from "react"
import { useParams } from "react-router-dom"
import StocksTransferAdd from "./StocksTransferAdd"

const StocksTransferEdit = () => {

    const { id } = useParams()

    return (
        <StocksTransferAdd stocksTransferId={id} isEdit={true} />
    )
}
export default StocksTransferEdit