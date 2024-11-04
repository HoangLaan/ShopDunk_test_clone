import React from "react"
import { useParams } from "react-router-dom"
import OffWorkAdd from "./OffWorkAdd"

const OffWorkDetail = () => {

    const { id } = useParams()

    return (
        <OffWorkAdd offworkId={id} isEdit={false}  />
    )
}
export default OffWorkDetail