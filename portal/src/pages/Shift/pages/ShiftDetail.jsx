import React from "react"
import { useParams } from "react-router-dom"
import ShiftAdd from "./ShiftAdd"

const ShiftDetail = () => {

    const { id } = useParams()

    return (
        <ShiftAdd shiftId={id} isEdit={false} />
    )
}
export default ShiftDetail