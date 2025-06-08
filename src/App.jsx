import { useState, useEffect } from 'react'
import RollButton from './components/RollButton'
import FootMenu from './components/FootMenu'
import Header from './components/Header'
import Rullet from './components/Rullet'
import RollTable from './components/RollTable'
import Add from './components/Add'
import ProfileMenu from './components/ProfileMenu'
import TransactionTable from './components/TransactionTable'
import AdvertisingCabinet from './components/AdvertisingCabinet'
import Friends from './components/Friends'
import Staking from './components/Staking'
import CashInForm from './components/CashInForm'
import CashInRequestForm from './components/CashInRequestForm'
import CashOutForm from './components/CashOutForm'
import Challenges from './components/Challenges'
import AddChallengeForm from './components/AddChallengeForm'
import AddsPackagesForm from './components/AddsPackagesForm'
import AddAddForm from './components/AddAddForm'
import './App.css'

function App() {
  const [currentContent, setCurrentContent] = useState('cran')
  const [profileSubMenu, setProfileSubMenu] = useState('profile')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [backPath, setBackPath] = useState(null)

  useEffect(() => {
    switch (currentContent) {
      case 'cran':
      case 'challenges':
      case 'staking':
      case 'friends':
      case 'profile':
        setBackPath('None')
        break;
      case 'cashIn':
      case 'addPackagesForm':
      case 'cashOut':
        setBackPath('profile')
        break;
      case 'cashInRequest':
        setBackPath('cashIn')
        break;
      case 'addChallengeForm':
        setBackPath('challenges')
        break;
      case 'addAddForm':
        setBackPath('addPackagesForm')
        break;
      default:
        setBackPath('None')
    }
  }, [currentContent])

  const renderContent = () => {
    switch (currentContent) {
      case 'cran':
        return (
          <>
            <Rullet currentContent={currentContent} gridRow="1"/>
            <RollTable />
            <RollButton />
            <Add />
          </> 
        );
      case 'challenges':
        return (
          <>
            <Challenges setCurrentContent={setCurrentContent} />
            <Add />
          </>
        );
      case 'staking':
        return (
          <>
            <Staking />
            <Add />
          </>
        );
      case 'friends':
        return (
          <>
           <Friends />
           <Add />
          </>
        );
      case 'profile':
        switch (profileSubMenu) {
          case 'profile':
            return (
              <>
                <ProfileMenu profileSubMenu={profileSubMenu} setProfileSubMenu={setProfileSubMenu}/>
                <Rullet currentContent={currentContent} gridRow="2" setCurrentContent={setCurrentContent}/>
                <div className="last-transactions">Последние транзакции</div>
                <div className="transaction-column-names">
                  <div className="transaction-column-name">Дата</div>
                  <div className="transaction-column-name">Тип</div>
                  <div className="transaction-column-name">Сумма</div>
                  <div className="transaction-column-name">Статус</div>
                </div>
                <TransactionTable />
                <Add />
              </>
            );
          case 'advertising':
            return (
              <>
                <AdvertisingCabinet setCurrentContent={setCurrentContent}/>
                <ProfileMenu profileSubMenu={profileSubMenu} setProfileSubMenu={setProfileSubMenu}/>
                <Add />
              </>
            );
        }
      case 'cashIn':
        return (
          <>
            <CashInForm setCurrentContent={setCurrentContent}/>
            <Add />
          </>
        );
      case 'cashInRequest':
        return (
          <>
            <CashInRequestForm />
            <Add />
          </>
        );
      case 'cashOut':
        return (
          <>
            <CashOutForm />
            <Add />
          </>
        );
      case 'addChallengeForm':
        return (
          <>
            <AddChallengeForm />
            <Add />
          </>
        );
      case 'addPackagesForm':
        return (
          <>
            <AddsPackagesForm setCurrentContent={setCurrentContent} setSelectedPackage={setSelectedPackage} />
            <Add />
          </>
        );
      case 'addAddForm':
        return (
          <>
            <AddAddForm selectedPackage={selectedPackage} />
            <Add />
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <Header setCurrentContent={setCurrentContent} path={backPath} />
      <main className="main-content">
        {renderContent()}
      </main>
      <FootMenu setCurrentContent={setCurrentContent} currentContent={currentContent}/>
    </div>
  )
}

export default App;
