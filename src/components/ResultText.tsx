import { FC } from 'react';

interface ResultText {
  title: string;
  text: string;
}

const ResultText: FC<ResultText> = ({ text, title }) => (
  <div>
    <span>{title}</span>
    <p style={{ whiteSpace: 'pre-line' }}>{text}</p>
  </div>
);

export default ResultText;
