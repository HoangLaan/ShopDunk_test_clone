import React from "react"
import { useParams } from "react-router-dom"
import ShiftAdd from "./ShiftAdd"

const ShiftEdit = () => {

    const { id } = useParams()

    return (
        <ShiftAdd shiftId={id} isEdit={true} />
    )
}
export default ShiftEdit