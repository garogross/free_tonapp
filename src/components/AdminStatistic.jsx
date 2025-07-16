import './AdminStatistic.css';

export default function AdminStatistic({ statistic }) {
    return statistic && (
        <div className="admin-statistic-container">
            <div className="admin-statistic-title">СТАТИСТИКА</div>
            <div className='statistic-row'>
                <div className='statistic-text'>
                    ПРИБЫЛЬ:
                </div>
                <div className='statistic-value'>{statistic.totalProfit.toFixed(6)}</div>
            </div>
            <div className='statistic-row'>
                <div className='statistic-text'>
                    УБЫТОК:
                </div>
                <div className='statistic-value'>{statistic.totalLoss.toFixed(6)}</div>
            </div>
            <div className='statistic-row'>
                <div className='statistic-text'>
                    ИТОГО:
                </div>
                <div className={`statistic-value ${statistic.totalProfit - statistic.totalLoss > 0 ? 'green' : 'red'}`}>{(statistic.totalProfit - statistic.totalLoss).toFixed(6)}</div>
            </div>

            <div className='admin-statistic-subcontainer'>
                <div className="statistic-title">ОБЩАЯ ИНФОРМАЦИЯ</div>
                <div className='admin-statistic-subcontainer sub'>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ВСЕГО ПОЛЬЗОВАТЕЛЕЙ:
                        </div>
                        <div className='statistic-value green'>{statistic.totalUsers}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ВСЕГО МОНЕТ:
                        </div>
                        <div className='statistic-value green'>{statistic.totalTonBalance.toFixed(3)}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ВСЕГО ПОПОЛНЕНИЙ:
                        </div>
                        <div className='statistic-value green'>{statistic.totalReplenishments}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ВСЕГО ВЫВОДОВ:
                        </div>
                        <div className='statistic-value green'>{statistic.totalWithdrawlars}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            АКТИВНЫХ ОБЪЯВЛЕНИЙ:
                        </div>
                        <div className='statistic-value green'>{statistic.countActiveAds}</div>
                    </div>
                </div>
            </div>

            <div className='admin-statistic-subcontainer'>
                <div className="statistic-title">НОВЫЕ ПОЛЬЗОВАТЕЛИ</div>
                <div className='admin-statistic-subcontainer sub'>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗА ДЕНЬ:
                        </div>
                        <div className='statistic-value green'>{statistic.newUsersPerDay}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗА НЕДЕЛЮ:
                        </div>
                        <div className='statistic-value green'>{statistic.newUsersPerWeek}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗА МЕСЯЦ:
                        </div>
                        <div className='statistic-value green'>{statistic.newUsersPerMonth}</div>
                    </div>
                </div>
            </div>

            <div className='admin-statistic-subcontainer'>
                <div className="statistic-title">ЗАПУСКИ ПРИЛОЖЕНИЯ</div>
                <div className='admin-statistic-subcontainer sub'>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗА ДЕНЬ:
                        </div>
                        <div className='statistic-value green'>{statistic.appStartsPerDay}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗА НЕДЕЛЮ:
                        </div>
                        <div className='statistic-value green'>{statistic.appStartsPerWeek}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗА МЕСЯЦ:
                        </div>
                        <div className='statistic-value green'>{statistic.appStartsPerMonth}</div>
                    </div>
                </div>
            </div>

            <div className='admin-statistic-subcontainer'>
                <div className="statistic-title">ТРАНЗАКЦИИ</div>
                <div className='statistic-row'>
                    <div className='statistic-text black'>
                        ПОПОЛНЕНИЯ
                    </div>
                </div>
                <div className='admin-statistic-subcontainer sub'>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗАПРОСОВ:
                        </div>
                        <div className='statistic-value green'>{statistic.countReplenishmentsRequests}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ОБЩАЯ СУММА:
                        </div>
                        <div className='statistic-value green'>{statistic.totalReplenishmentsAmount} TON</div>
                    </div>
                </div>
                <div className='statistic-row'>
                    <div className='statistic-text black'>
                        ВЫВОДЫ
                    </div>
                </div>
                <div className='admin-statistic-subcontainer sub'>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗАПРОСОВ:
                        </div>
                        <div className='statistic-value green'>{statistic.countWithdrawalRequests}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ОБЩАЯ СУММА:
                        </div>
                        <div className='statistic-value green'>{statistic.totalWithdrawalAmount} TON</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ОДОБРЕННАЯ СУММА:
                        </div>
                        <div className='statistic-value green'>{statistic.approvedWithdrawalAmount} TON</div>
                    </div>
                </div>
            </div>

            <div className='admin-statistic-subcontainer'>
                <div className="statistic-title">РЕКЛАМНЫЕ ЗАПРОСЫ</div>
                <div className='admin-statistic-subcontainer sub'>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗАПРОСОВ:
                        </div>
                        <div className='statistic-value green'>{statistic.countAdRequests}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ОБЩАЯ СТОИМОСТЬ:
                        </div>
                        <div className='statistic-value green'>{statistic.totalAdCost.toFixed(3)} TON</div>
                    </div>
                </div>
            </div>

            <div className='admin-statistic-subcontainer'>
                <div className="statistic-title">ЗАДАНИЯ</div>
                <div className='admin-statistic-subcontainer sub'>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ЗАПРОСОВ:
                        </div>
                        <div className='statistic-value green'>{statistic.countChallengesRequests}</div>
                    </div>
                    <div className='statistic-row'>
                        <div className='statistic-text black'>
                            ОБЩАЯ СТОИМОСТЬ:
                        </div>
                        <div className='statistic-value green'>{statistic.totalChallengesCost.toFixed(3)} TON</div>
                    </div>
                </div>
            </div>
        </div>
    )
}