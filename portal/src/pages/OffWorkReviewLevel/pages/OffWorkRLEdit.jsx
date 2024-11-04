import React from "react"
import { useParams } from "react-router-dom"
import OffWorkRLAdd from "./OffWorkRLAdd"

const OffWorkRLEdit = () => {

    const { id } = useParams()

    return (
        <OffWorkRLAdd offworkRLId={id} isEdit={true} />
    )
}
export default OffWorkRLEdit