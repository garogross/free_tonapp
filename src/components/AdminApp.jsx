import Header from "./Header"
import AdminFootMenu from "./AdminFootMenu"
import AdminAd from "./AdminAd"
import AdminTransaction from './AdminTransaction'

import { useState, useEffect } from "react"
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios'


export default function AdminApp({ setCurrentContent, adPackages }) {
    const [adminCurrentContent, setAdminCurrentContent] = useState('adminstatistic')
    const [adminTransactions, setAdminTransactions] = useState([]);
    const [adminAds, setAdminAds] = useState([]);

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

    async function getAdvertisements(dataRaw) {
        axios.get('/api/freetonadmin/ad', {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setAdminAds(response.data.advertisements);
            }
            )
            .catch(error => {
                console.error('Get advertisements error: ', error);
            })
    }

    useEffect(() => {
        const dataRaw = retrieveRawInitData();
        getAdvertisements(dataRaw);
        getTransactions(dataRaw);
    }, []);

    const renderAdminContent = () => {
        switch (adminCurrentContent) {
            case 'admintransactions':
                return (
                    <AdminTransaction adminTransactions={adminTransactions} setAdminTransactions={setAdminTransactions}/>
                );
            case 'adminstatistic':
                return (
                    <></>
                )
            case 'adminad':
                return (
                    <AdminAd adminAds={adminAds} setAdminAds={setAdminAds} adPackages={adPackages}/>
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