import { FC } from 'react';

import './styles.scss';

interface ResultText {
  title: string;
  text: string;
}

const ResultText: FC<ResultText> = ({ text, title }) => (
  <details className="result-text">
    <summary>{title}</summary>
    <p style={{ whiteSpace: 'pre-line' }}>{text}</p>
  </details>
);

export default ResultText;
