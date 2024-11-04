import React from "react"
import { useParams } from "react-router-dom"
import StocksTransferAdd from "./StocksTransferAdd"

const StocksTransferDetail = () => {

    const { id } = useParams()

    return (
        <StocksTransferAdd stocksTransferId={id} isEdit={false} />
    )
}
export default StocksTransferDetail