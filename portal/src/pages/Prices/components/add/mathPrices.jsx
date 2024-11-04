const allArea = {
    area_id: 9999,
    area_name: "Tất cả",
    label: "Tất cả",
    value: 9999,
}

const allBusiness = {
    business_id: 9999,
    business_name: "Tất cả",
    label: "Tất cả",
    value: 9999,
}

const mapArrayGetKey = (arr, key, valueNotGet = null, valueDefault = null) => {
    let result = valueDefault;
    const checkArr = Array.isArray(arr);
    let count = 0;
    if(checkArr) {
        arr.map((val, index) => {
            if(val) {
                if(val[key]) {
                    if(val[key] != valueNotGet) {
                        if(!count) {
                            result = [];
                        }
                        result.push(val[key]);
                        count++
                    }
                }
            }
        })
    }
}

const mapArrayRemoveKey = (arr, key, valueNotGet, valueDefault = null) => {
    let result = valueDefault;
    const checkArr = Array.isArray(arr);
    if(checkArr) {
        result = arr.filter((val) => val[key] != valueNotGet);
    }
    return result;
}

export {
    allArea,
    allBusiness,
    mapArrayGetKey,
    mapArrayRemoveKey,
}