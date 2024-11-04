import React from "react"
import { useParams } from "react-router-dom"
import OffWorkAdd from "./OffWorkAdd"

const OffWorkEdit = () => {

    const { id } = useParams()

    return (
        <OffWorkAdd offworkId={id} isEdit={true} />
    )
}
export default OffWorkEdit