import React from "react"
import { useParams } from "react-router-dom"
import OffWorkTypeAdd from "./OffWorkTypeAdd"

const OffWorkTypeEdit = () => {

    const { id } = useParams()

    return (
        <OffWorkTypeAdd offworkTypeId={id} isEdit={true} />
    )
}
export default OffWorkTypeEdit