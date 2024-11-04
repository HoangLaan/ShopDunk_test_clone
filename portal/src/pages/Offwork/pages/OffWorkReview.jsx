import React from "react"
import { useParams } from "react-router-dom"
import OffWorkAdd from "./OffWorkAdd"

const OffWorkReview = () => {

    const { id } = useParams()

    return (
        <OffWorkAdd offworkId={id} isEdit={true} isReview={true} />
    )
}
export default OffWorkReview