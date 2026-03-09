import { api } from "../api/axios";
import AdminAd from "./AdminAd";
import "./AdminAddAddForm.css";
import "./AdminApp.css";
import AdminFootMenu from "./AdminFootMenu";
import AdminSettings from "./AdminSettings";
import AdminStatistic from "./AdminStatistic";
import AdminTransaction from "./AdminTransaction";
import Header from "./Header";

import { useEffect, useState } from "react";

export default function AdminApp({
  setCurrentContent,
  adPackages,
  setAdPackages,
  initialNumbers,
  setInitialNumbers,
  challengesConfig,
  setChallengesConfig,
  keyboardVisible,
  course,
  setCourse,
}) {
  const [adminCurrentContent, setAdminCurrentContent] =
    useState("adminstatistic");
  const [adminTransactions, setAdminTransactions] = useState([]);
  const [adminAds, setAdminAds] = useState([]);
  const [statistic, setStatistic] = useState(null);
  const [acceleratorsConfig, setAcceleratorsConfig] = useState([]);
  const [challenges, setChallenges] = useState(null);

  async function getStatistic() {
    api
      .get("/api/freetonadmin/statistic")
      .then((response) => {
        setStatistic(response.data.statistic);
        console.log(response.data.statistic);
      })
      .catch((error) => {
        console.error("Get statistic error: ", error);
      });
  }

  async function getTransactions() {
    api
      .get("/api/freetonadmin/transactions")
      .then((response) => {
        setAdminTransactions(response.data.transactionsWithUser);
      })
      .catch((error) => {
        console.error("Get transactions error: ", error);
      });
  }

  async function getAdvertisements() {
    api
      .get("/api/freetonadmin/ad")
      .then((response) => {
        setAdminAds(response.data.advertisements);
      })
      .catch((error) => {
        console.error("Get advertisements error: ", error);
      });
  }

  async function getAcceleratorsConfig() {
    api
      .get("/api/freetonadmin/acceleratorsconfig")
      .then((response) => {
        setAcceleratorsConfig(response.data.acceleratorsConfig);
      })
      .catch((error) => {
        console.error("Get accelerators config error: ", error);
      });
  }

  async function getChallenges() {
    api
      .get("/api/freetonadmin/challenges")
      .then((response) => {
        setChallenges(response.data);
      })
      .catch((error) => {
        console.error("Get challenges error: ", error);
      });
  }

  useEffect(() => {
    getChallenges();
    getAcceleratorsConfig();
    getStatistic();
    getAdvertisements();
    getTransactions();
  }, []);

  const renderAdminContent = () => {
    switch (adminCurrentContent) {
      case "admintransactions":
        return (
          <AdminTransaction
            adminTransactions={adminTransactions}
            setAdminTransactions={setAdminTransactions}
          />
        );
      case "adminstatistic":
        return <AdminStatistic statistic={statistic} />;
      case "adminad":
        return (
          <AdminAd
            adminAds={adminAds}
            setAdminAds={setAdminAds}
            adPackages={adPackages}
            setAdPackages={setAdPackages}
            challenges={challenges}
            setChallenges={setChallenges}
          />
        );
      case "adminsettings":
        return (
          <AdminSettings
            initialNumbers={initialNumbers}
            setInitialNumbers={setInitialNumbers}
            setAcceleratorsConfig={setAcceleratorsConfig}
            acceleratorsConfig={acceleratorsConfig}
            challengesConfig={challengesConfig}
            setChallengesConfig={setChallengesConfig}
            course={course}
            setCourse={setCourse}
          />
        );
    }
  };

  return (
    <>
      <header>
        <Header setCurrentContent={setCurrentContent} path={"None"} />
      </header>
      <main>{renderAdminContent()}</main>
      <footer className={`admin ${keyboardVisible ? "hidden" : ""}`}>
        <AdminFootMenu
          setAdminCurrentContent={setAdminCurrentContent}
          adminCurrentContent={adminCurrentContent}
        />
      </footer>
    </>
  );
}
