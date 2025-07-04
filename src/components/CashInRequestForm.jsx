import './CashInRequestForm.css';
import React, { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';

export default function CashInRequestForm() {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [amount, setAmount] = useState('');

    const requestTransaction = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert('Введите корректную сумму');
            return;
        }

        const amountNano = (Number(amount) * 1_000_000_000).toFixed(0);

        const transaction = {
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
                {
                    address: "UQDY51Tm9tIAyGsRwcnA-r6p4oodHZ7F-6XDYRYT7KFKvcLM",
                    amount: amountNano,
                },
            ],
        };

        try {
            await tonConnectUI.sendTransaction(transaction);
            alert('Транзакция отправлена. Ожидайте подтверждения.');
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error);
        }
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
        </div>
    )
};