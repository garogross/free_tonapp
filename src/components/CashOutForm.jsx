import './CashOutForm.css'
import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { retrieveRawInitData } from '@telegram-apps/sdk'
import { useNotification } from './useNotification';
import axios from 'axios';

export default function CashOutForm({ tonBalance, setTonBalance, setTransactions }) {
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const { showError, showNotification } = useNotification();
    const userFriendlyAddress = useTonAddress();

    useEffect(() => {
        setWalletAddress(userFriendlyAddress);
    }, [userFriendlyAddress]);

    function isPotentialTonAddress(address) {
        const regex = /^[A-Za-z0-9_-]{47,49}$/;
        return regex.test(address);
    }

    async function cashOutTransaction(dataRaw) {
        const postData = {
            cashOutAddress: walletAddress,
            amount: amount
        }
        axios.post('/api/transactions', postData,{
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setTransactions(response.data.transactions);
                setTonBalance(response.data.tonBalance);
                showNotification("Заявка успешно отправлена на модерацию")
            }
            )
            .catch(error => {
                console.error('Create transaction error: ', error);
                showError("Не удалось создать заявку на вывод");
            })
    }

    const handleAmountChange = (e) => {
        let value = e.target.value;

        if (!/^\d*\.?\d*$/.test(value)) {
            return;
        }

        if (value.includes('.')) {
            const [intPart, decimalPart] = value.split('.');
            if (decimalPart.length > 2) {
                value = intPart + '.' + decimalPart.slice(0, 2);
            }
        }

        setAmount(value);
    };


    const handleCashOutAll = () => {
        if (tonBalance < 1) {
            showError("Нет минимальной суммы для вывода")
        }
        setAmount(tonBalance.toFixed(2).toString());
    }

    const handleCashOut = () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0 || amount < 1) {
            showError('Введите корректную сумму');
            return;
        }
        if (tonBalance < 1 || amount > tonBalance) {
            showError("Недостаточно средств для вывода")
            return;
        }
        if (!isPotentialTonAddress(walletAddress)) {
            showError("Некорректный TON адрес")
            return;
        }

        const dataRaw = retrieveRawInitData();
        cashOutTransaction(dataRaw);
    }

    return (
        <div className="cash-out-form">
            <div className="cash-out-form-title">Заявка на вывод</div>
            <div className="cash-out-form-description">Пожалуйста, заполните анкету для вывода средств. Укажите ваш TON-адрес</div>
            <div className="cash-out-form-input-container">
                <input
                    className="cash-out-form-input"
                    type="text"
                    placeholder="Введите сумму вывода..."
                    value={amount}
                    onChange={handleAmountChange}
                />
                <textarea
                    className="cash-out-form-textarea"
                    placeholder="Введите адрес кошелька..."
                    rows="3"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                />
            </div>
            <div className="min-amount">Минимальная сумма вывода: 1 TON</div>
            <div className="cash-out-button-wrapper">
                <button className={`cash-out-form-button ${tonBalance < 1 ? "disable-view" : ""}`} onClick={handleCashOut}>ОТПРАВИТЬ ЗАЯВКУ</button>
                <button className="cash-out-form-all-button" onClick={handleCashOutAll}>ВЫВЕСТИ ВСЁ</button>
                <div className="alert-description">Все заявки обрабатываются вручную, что может занять до 72 часов. Выводим средства только в TON. Убедитесь, что указали корректный адрес кошелька!</div>
            </div>
        </div>
    )
}