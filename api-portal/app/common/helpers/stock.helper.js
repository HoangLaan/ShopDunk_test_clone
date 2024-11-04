function convertUnitDensity(density, params) {
    let isComplete = false, value = 0;
    let { input_unit_id, output_unit_id, quantity } = params;
    if (!output_unit_id || output_unit_id == input_unit_id) return quantity;
    while (!isComplete) {
        const densityList = (density || []).filter((v) => v.sub_unit_id == input_unit_id || v.main_unit_id == input_unit_id);
        if (densityList.length) {
            (densityList || []).forEach((v) => {
                const { density_value, sub_unit_id, main_unit_id } = v;
                if ((sub_unit_id == input_unit_id || main_unit_id == input_unit_id) && (
                    sub_unit_id == output_unit_id || main_unit_id == output_unit_id
                )) {
                    // TH tim ra duoc dau tien 
                    if (sub_unit_id == input_unit_id) {
                        value = quantity * density_value;
                    }
                    else value = quantity / (density_value || 1);
                    isComplete = true;
                }
            })
        }
        if (!densityList.length) { isComplete = true; }
        else {
            const { sub_unit_id, main_unit_id, density_value } = densityList[0];
            quantity = sub_unit_id == input_unit_id ? (quantity * density_value) : (quantity / (density_value || 1));
            input_unit_id = sub_unit_id == input_unit_id ? main_unit_id : sub_unit_id;
        }
    }
    return value;
}

module.exports = {
    convertUnitDensity
}