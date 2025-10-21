import './RollTable.css';
import { useTranslation } from 'react-i18next';

const ranges = [
  "0 - 9885",
  "9886 - 9985",
  "9986 - 9993",
  "9994 - 9997",
  "9998 - 9999",
  "10000"
];

export default function RollTable({ initialNumbers, starsMode, course}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="titles">
        <span className="title">{t('rulletTableNumberTitle')}</span>
        <span className="title">{t('rulletTablePrizeTitle')}</span>
      </div>
      <div className="roll-table">
        {ranges.map((range, index) => (
          <div className="roll-table-item" key={range}>
            <span className="roll-table-item-number">{range}</span>
            <span className="roll-table-item-payment">
              {initialNumbers && initialNumbers[index] !== undefined ? (starsMode ? (initialNumbers[index] * course).toFixed(6) : initialNumbers[index].toFixed(6)) : '-'}
              {starsMode ? (
                <img src="/assets/star.svg" alt="TON" className="star-small-icon" />
              ) : (
                <img src="/assets/small_ton.svg" alt="TON" className="payment-icon" />
              )}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
