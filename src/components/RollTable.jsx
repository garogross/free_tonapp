import './RollTable.css';
import tonIcon from '../assets/small_ton.svg';

const ranges = [
  "0 - 9885",
  "9886 - 9985",
  "9986 - 9993",
  "9994 - 9997",
  "9998 - 9999",
  "10000"
];

export default function RollTable({ initialNumbers }) {
  return (
    <>
      <div className="titles">
        <span className="title">Число</span>
        <span className="title">Выплата</span>
      </div>
      <div className="roll-table">
        {ranges.map((range, index) => (
          <div className="roll-table-item" key={range}>
            <span className="roll-table-item-number">{range}</span>
            <span className="roll-table-item-payment">
              {initialNumbers && initialNumbers[index] !== undefined ? initialNumbers[index] : '-'}
              <img src={tonIcon} alt="TON" className="payment-icon" />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
