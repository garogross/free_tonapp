import Header from "./Header"
import AdminFootMenu from "./AdminFootMenu"
import AdminAd from "./AdminAd"
import AdminTransaction from './AdminTransaction'
import AdminSettings from './AdminSettings'
import AdminStatistic from './AdminStatistic'

import { useState, useEffect } from "react"
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios'


export default function AdminApp({ setCurrentContent, adPackages, setAdPackages, initialNumbers, setInitialNumbers, challengesConfig, setChallengesConfig }) {
    const [adminCurrentContent, setAdminCurrentContent] = useState('adminstatistic')
    const [adminTransactions, setAdminTransactions] = useState([]);
    const [adminAds, setAdminAds] = useState([]);
    const [statistic, setStatistic] = useState(null);
    const [acceleratorsConfig, setAcceleratorsConfig] = useState([]);
    const [challenges, setChallenges] = useState(null);

    async function getStatistic(dataRaw) {
        axios.get('/api/freetonadmin/statistic', {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setStatistic(response.data.statistic);
                console.log(response.data.statistic);
            }
            )
            .catch(error => {
                console.error('Get statistic error: ', error);
            })
    }

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

    async function getAcceleratorsConfig(dataRaw) {
        axios.get('/api/freetonadmin/acceleratorsconfig', {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setAcceleratorsConfig(response.data.acceleratorsConfig);
            }
            )
            .catch(error => {
                console.error('Get accelerators config error: ', error);
            })
    }

    async function getChallenges(dataRaw) {
        axios.get('/api/freetonadmin/challenges', {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setChallenges(response.data);
            }
            )
            .catch(error => {
                console.error('Get challenges error: ', error);
            })
    }

    useEffect(() => {
        const dataRaw = retrieveRawInitData();
        getChallenges(dataRaw);
        getAcceleratorsConfig(dataRaw);
        getStatistic(dataRaw);
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
                    <AdminStatistic statistic={statistic}/>
                )
            case 'adminad':
                return (
                    <AdminAd adminAds={adminAds} setAdminAds={setAdminAds} adPackages={adPackages} setAdPackages={setAdPackages} challenges={challenges} setChallenges={setChallenges}/>
                )
            case 'adminsettings':
                return (
                    <AdminSettings initialNumbers={initialNumbers} setInitialNumbers={setInitialNumbers} setAcceleratorsConfig={setAcceleratorsConfig} acceleratorsConfig={acceleratorsConfig} challengesConfig={challengesConfig} setChallengesConfig={setChallengesConfig}/>
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