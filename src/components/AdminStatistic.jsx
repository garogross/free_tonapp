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
                <div className='statistic-row'>
                    <div className='statistic-text'>
                        ВСЕГО ПОЛЬЗОВАТЕЛЕЙ:
                    </div>
                    <div className='statistic-value green'>{statistic.totalUsers}</div>
                </div>
                <div className='statistic-row'>
                    <div className='statistic-text'>
                        ВСЕГО МОНЕТ:
                    </div>
                    <div className='statistic-value green'>{statistic.totalTonBalance.toFixed(6)}</div>
                </div>
                <div className='statistic-row'>
                    <div className='statistic-text'>
                        ВСЕГО ПОПОЛНЕНИЙ:
                    </div>
                    <div className='statistic-value green'>{statistic.totalReplenishments}</div>
                </div>
                <div className='statistic-row'>
                    <div className='statistic-text'>
                        ВСЕГО ВЫВОДОВ:
                    </div>
                    <div className='statistic-value green'>{statistic.totalWithdrawlars}</div>
                </div>
                <div className='statistic-row'>
                    <div className='statistic-text'>
                        АКТИВНЫХ ОБЪЯВЛЕНИЙ:
                    </div>
                    <div className='statistic-value green'>{statistic.countActiveAds}</div>
                </div>
            </div>
        </div>
    )
}