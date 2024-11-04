import React from "react"
import { useParams } from "react-router-dom"
import OffWorkTypeAdd from "./OffWorkTypeAdd"

const OffWorkTypeDetail = () => {

    const { id } = useParams()

    return (
        <OffWorkTypeAdd offworkTypeId={id} isEdit={false} />
    )
}
export default OffWorkTypeDetail