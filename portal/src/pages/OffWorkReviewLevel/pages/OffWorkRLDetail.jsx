import React from "react"
import { useParams } from "react-router-dom"
import OffWorkRLAdd from "./OffWorkRLAdd"

const OffWorkRLDetail = () => {

    const { id } = useParams()

    return (
        <OffWorkRLAdd offworkRLId={id} isEdit={false} />
    )
}
export default OffWorkRLDetail