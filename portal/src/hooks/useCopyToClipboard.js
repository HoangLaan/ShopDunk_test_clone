import { useState } from 'react';
import { showToast } from 'utils/helpers';

function useCopyToClipboard(message = 'Đã sao chép') {
  const [copiedText, setCopiedText] = useState(null);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      showToast.success(message);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return { copiedText, copy };
}

export default useCopyToClipboard;
