const parseKeyValuePairs = (string: string): Record<string, string> => {
  const normalizedValue = string.replace(/[#?]/, '');
  const pairs = normalizedValue.split('&');

  return pairs.reduce((accumulator, pair) => {
    const [key, value] = pair.split('=');

    return {
      ...accumulator,
      [key]: value,
    };
  }, {});
};

const REPORT_CODE_POSITION_IN_PATHNAME = 1;

export const parseReportUrl = (url: string) => {
  const { hash, pathname } = new URL(url);

  const paths = pathname.split('/').filter(Boolean);
  const code = paths[REPORT_CODE_POSITION_IN_PATHNAME];
  const { fight } = parseKeyValuePairs(hash);

  return { fightId: Number(fight), code };
};
