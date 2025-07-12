import Header from "./Header"
import AdminFootMenu from "./AdminFootMenu"
import WithdrawalRequests from "./WithdrawalRequests"

import { useState, useEffect } from "react"
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios'


export default function AdminApp({ setCurrentContent }) {
    const [adminCurrentContent, setAdminCurrentContent] = useState('adminstatistic')
    const [adminTransactions, setAdminTransactions] = useState([]);

    useEffect(() => {
        const dataRaw = retrieveRawInitData();
        async function getTransactions(dataRaw) {
            axios.get('/api/freetonadmin/transactions', {
                headers: {
                    'Authorization': 'tma ' + dataRaw
                }
            })
                .then(response => {
                    setAdminTransactions(response.data.transactionsWithUser);
                }
                )
                .catch(error => {
                    console.error('Get transactions error: ', error);
                })
        }
        getTransactions(dataRaw);
    }, []);

    const renderAdminContent = () => {
        switch (adminCurrentContent) {
            case 'admintransactions':
                return (
                    <WithdrawalRequests adminTransactions={adminTransactions} />
                );
            case 'adminstatistic':
                return (
                    <></>
                )
            case 'adminad':
                return (
                    <></>
                )
            case 'adminsettings':
                return (
                    <></>
                )
        }
    };

    return (
        <>
            <header>
                <Header setCurrentContent={setCurrentContent} path={"None"} />
            </header>
            <main>
                {renderAdminContent()}
            </main>
            <footer className="admin">
                <AdminFootMenu setAdminCurrentContent={setAdminCurrentContent} adminCurrentContent={adminCurrentContent} />
            </footer>
        </>
    )
} 