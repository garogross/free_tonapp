import './CashInRequestForm.css';
import React, { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useNotification } from './useNotification';

export default function CashInRequestForm( { setCurrentContent, addTransaction } ) {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [amount, setAmount] = useState('');
    const { showNotification, showError } = useNotification();

    const requestTransaction = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            showError('Введите корректную сумму');
            return;
        }

        const amountNano = (Number(amount) * 1_000_000_000).toFixed(0);

        const transaction = {
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
                {
                    address: "UQCQ84P_-bW15oozG-_GDlNaj96s780Kxofd6RfBa_LPOYUd",
                    amount: amountNano,
                },
            ],
        };

        try {
            await tonConnectUI.sendTransaction(transaction);
            addTransaction({
                utime: Math.floor(Date.now() / 1000),
                type: "in",
                amount: amount,
                status: "load"
            }
            );
            showNotification('Транзакция отправлена', 6000);
        } catch (error) {
            const message = error?.message || String(error);
            showError(message);
            console.error('Ошибка при отправке транзакции:', error);
        }
    };

    const unlinkWallet = () => {
        tonConnectUI.disconnect();
        setCurrentContent("profile");
    };

    return (
        <div className="cash-in-request-form-container">
            <div className="cash-in-request-form-title">Заявка на пополнение</div>
            <div className="cash-in-request-form-description">Заполните сумму в TON и отправьте на пополнение</div>
            <div className="cash-in-request-form-input-container">
                <input
                    className="cash-in-request-form-input"
                    type="text"
                    placeholder="Введите сумму пополнения в TON..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <button className="cash-in-request-form-button" onClick={requestTransaction}>ПОПОЛНИТЬ</button>
            <button className="cash-in-request-form-unlink-button" onClick={unlinkWallet}>ОТВЯЗАТЬ</button>
        </div>
    )
};