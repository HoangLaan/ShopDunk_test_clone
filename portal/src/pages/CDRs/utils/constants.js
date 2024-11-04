import { StarTwoTone } from '@ant-design/icons';
import styled from 'styled-components';

const StarOption = styled.div`
  }
  display: flex;
  align-items: center;
  }
`;

export const CDRS_PERMISSION = {
  RECORD_LISTEN: 'CRDS_RECORD_LISTEN',
  RECORD_DOWNLOAD: 'CRDS_RECORD_DOWNLOAD',
}

export const STATUS_CALL = [
  {
    label: 'ANSWERED',
    value: 'answered',
  },
  {
    label: 'BUSY-LINE',
    value: 'busy-line',
  },
  {
    label: 'NO-ANSWERED',
    value: 'no-answered',
  },
  {
    label: 'BUSY',
    value: 'busy',
  },
  {
    label: 'NOT-AVAILABLE',
    value: 'not-available',
  },
  {
    label: 'IVR',
    value: 'ivr',
  },
  {
    label: 'INVALID-NUMBER',
    value: 'invalid-number',
  },
  {
    label: 'FAILED',
    value: 'failed',
  },
  {
    label: 'CANCEL',
    value: 'cancel',
  },
  {
    label: 'Phone Block',
    value: 'phone-block',
  },
  {
    label: 'CONGESTION',
    value: 'congestion',
  },
  {
    label: 'DROP',
    value: 'drop',
  },
  {
    label: 'TELCO BLOCK',
    value: 'telco-block',
  },
  {
    label: 'FAIL SYSTEM',
    value: 'fail-system',
  },
];

export const DIRECTION_CALL = [
  {
    label: 'Gọi đến',
    value: 'inbound',
  },
  {
    label: 'Gọi đi',
    value: 'outbound',
  },
  {
    label: 'Gọi nội bộ',
    value: 'local',
  },
];

export const DURATION_CALL = [
  {
    label: 'Tất cả',
    value: null,
  },
  {
    label: 'Nhỏ hơn 5 giây',
    value: 5,
  },
  {
    label: 'Giữa 5 giây và 30 giây',
    value: 30,
  },
  {
    label: 'Giữa 30 giây và 1 phút',
    value: 60,
  },
  {
    label: 'Lớn hơn 1 phút',
    value: 61,
  },
];

export const ISRECORDING_CALL = [
  {
    label: 'Tất cả',
    value: null,
  },
  {
    label: 'Có',
    value: true,
  },
  {
    label: 'Không',
    value: false,
  },
];

export const ISRATE = [
  {
    label: <StarOption><span>1 </span><StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} /></StarOption>,
    value: 1,
  },
  {
    label: <StarOption><span>2 </span><StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} /></StarOption>,
    value: 2,
  },
  {
    label: <StarOption><span>3 </span><StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} /></StarOption>,
    value: 3,
  },
  {
    label: <StarOption><span>4 </span><StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} /></StarOption>,
    value: 4,
  },
  {
    label: <StarOption><span>5 </span><StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} /></StarOption>,
    value: 5,
  }
];

export const HANGUP_OPTION = {
  AGENT: 'send_bye',
  MOBILE: 'recv_bye',
};

export const RateOptions = {
  '': <span class='bw_label '>Không có đánh giá</span>,
  1: <span>{<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}</span>,
  2: (
    <span>
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
    </span>
  ),
  3: (
    <span>
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
    </span>
  ),
  4: (
    <span>
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
    </span>
  ),
  5: (
    <span>
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
      {<StarTwoTone twoToneColor='#ebcb51' style={{ fontSize: 20 }} />}
    </span>
  ),
};

export const DEFAULT_STATUS_CALL = ['busy-line', 'no-answered', 'busy', 'answered', 'ivr']


export const IS_MISSED_CALL_OPTIONS = {
  ALL: 0,
  MISSED: 1,
  NOT_MISSED: 2
}

export const IS_MISSED_CALL = [
  {
    label: 'Tất cả',
    value: IS_MISSED_CALL_OPTIONS.ALL,
  },
  {
    label: 'Bị nhỡ',
    value: IS_MISSED_CALL_OPTIONS.MISSED,
  },
  {
    label: 'Không bị nhỡ',
    value: IS_MISSED_CALL_OPTIONS.NOT_MISSED,
  },
];
