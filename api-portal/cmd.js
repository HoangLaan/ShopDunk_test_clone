const density = [
    {
        "sub_unit_id": 7,
        "sub_unit_name": "Lốc",
        "main_unit_id": 2,
        "main_unit_name": "Chai",
        "density_value": 6,
        "id": "181636",
        "_k": "181636",
        "checked": 1
    },
    // {
    //     "sub_unit_id": 1,
    //     "sub_unit_name": "Thùng",
    //     "main_unit_id": 2,
    //     "main_unit_name": "Chai",
    //     "density_value": 12,
    //     "id": "181637",
    //     "_k": "181637",
    //     "checked": 1
    // },
    {
        "_k": 0.9205866757547627,
        "checked": 1,
        "sub_unit_id": 1,
        "sub_unit_name": "Thùng",
        "main_unit_id": 7,
        "main_unit_name": "Lốc",
        "density_value": 4
    }
]

const params = {
    // input_unit_id:1, output_unit_id: 2, input_unit_name: 'Thùng', output_unit_name: 'Chai', quantity: 10
    input_unit_id:2, output_unit_id: 1, input_unit_name: 'Chai', output_unit_name: 'Thùng', quantity: 24
}

function convert(density, params){
    let isComplete = false;
    let value = 0;
    let { input_unit_id, output_unit_id, quantity, input_unit_name, output_unit_name } = params;
    const originQuantity = quantity;
    while(!isComplete){
        const densityList = (density||[]).filter((v) => v.sub_unit_id == input_unit_id || v.main_unit_id == input_unit_id);
        if(densityList.length){
            (densityList||[]).forEach((v) => {
                const { density_value, sub_unit_id, main_unit_id} = v;
                if((sub_unit_id == input_unit_id || main_unit_id == input_unit_id) && (
                    sub_unit_id == output_unit_id || main_unit_id == output_unit_id
                )){
                    // TH tim ra duoc dau tien 
                    if(sub_unit_id == input_unit_id){
                        value = quantity * density_value;
                    }
                    else value = quantity/(density_value||1);
                    isComplete = true;
                }
            })
        } 
        if(!densityList.length){ isComplete = true;}
        else {
            const { sub_unit_id , main_unit_id, density_value} = densityList[0];
            quantity = sub_unit_id == input_unit_id ? (quantity*density_value) : (quantity/(density_value||1));
            input_unit_id = sub_unit_id == input_unit_id ? main_unit_id : sub_unit_id;
        }
    }
    return value;
}

convert(density, params);