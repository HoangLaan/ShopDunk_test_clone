import React, { useEffect , useState , useCallback} from 'react';
import { formatPrice } from 'utils/index';

const DebitSummary = ({
    statistic
}) => {
    const [total_money , setTotalMoney] = useState(0);
    const [total_money_pay , setTotalMoneyPay] = useState(0);
    const [total_money_receivable , setTotalMoneyReceivable] = useState(0);

    const bw_count_cus_style = {
        paddingLeft : '10px',
    }
    
    const loadSumary = useCallback(()=>{
        let {total_money = 0 , total_money_pay = 0, total_money_receivable = 0} = (statistic || {});
        setTotalMoney(total_money)
        setTotalMoneyPay(total_money_pay)
        setTotalMoneyReceivable(total_money_receivable)
    },[statistic])

    useEffect(loadSumary , [loadSumary])

    return(
        <div className="bw_row bw_mb_2 bw_align_items_center">
        <div className="bw_col_8 bw_flex bw_align_items_center">
            <div className="bw_count_cus">
                Tổng công nợ:<b style={bw_count_cus_style}>{formatPrice(total_money||0)} đ</b>
            </div>
            <div className="bw_count_cus">
                CN Thu:<b className="bw_green">{formatPrice(total_money_pay||0)} đ</b>
            </div>
            <div className="bw_count_cus">
                CN Trả:<b className="bw_red">{formatPrice(total_money_receivable||0)} đ</b>
            </div>
        </div>
    </div>
    )
}

export default DebitSummary