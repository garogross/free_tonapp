import './RollTable.css';
import tonIcon from '../assets/small_ton.svg';
import { useEffect, useRef } from 'react';

export default function RollTable() {
    return (
        <>
            <div className="titles">
                <span className="title">Число</span>
                <span className="title">Выплата</span>
            </div>
            <div className="roll-table">
                <div className="roll-table-item">
                    <span className="roll-table-item-number">0 - 9885</span>
                    <span className="roll-table-item-payment">
                        0.000092
                        <img src={tonIcon} alt="TON" className="payment-icon" />
                    </span>
                </div>
                <div className="roll-table-item">
                    <span className="roll-table-item-number">9886 - 9985</span>
                    <span className="roll-table-item-payment">
                        0.000667
                        <img src={tonIcon} alt="TON" className="payment-icon" />
                    </span>
                </div>
                <div className="roll-table-item">
                    <span className="roll-table-item-number">9986 - 9993</span>
                    <span className="roll-table-item-payment">
                        0.003667
                        <img src={tonIcon} alt="TON" className="payment-icon" />
                    </span>
                </div>
                <div className="roll-table-item">
                    <span className="roll-table-item-number">9994 - 9997</span>
                    <span className="roll-table-item-payment">
                        0.367769
                        <img src={tonIcon} alt="TON" className="payment-icon" />
                    </span>
                </div>
                <div className="roll-table-item">
                    <span className="roll-table-item-number">9998 - 9999</span>
                    <span className="roll-table-item-payment">
                        3.67
                        <img src={tonIcon} alt="TON" className="payment-icon" />
                    </span>
                </div>
                <div className="roll-table-item">
                    <span className="roll-table-item-number">10000</span>
                    <span className="roll-table-item-payment">
                        10
                        <img src={tonIcon} alt="TON" className="payment-icon" />
                    </span>
                </div>
            </div>
        </>
    );
}
