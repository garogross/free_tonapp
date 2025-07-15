import './AdminStatistic.css';

export default function AdminStatistic({ statistic }) {
    return statistic && (
        <div className="admin-statistic-container">
            <div className="admin-statistic-title">СТАТИСТИКА</div>
            <div className='statistic-profit-loss-row'>
                <div className='statistic-profit-loss-text'>
                    ПРИБЫЛЬ:
                </div>
                <div className='statistic-profit-loss-value'>{statistic.totalProfit.toFixed(6)}</div>
            </div>
            <div className='statistic-profit-loss-row'>
                <div className='statistic-profit-loss-text'>
                    УБЫТОК:
                </div>
                <div className='statistic-profit-loss-value'>{statistic.totalLoss.toFixed(6)}</div>
            </div>
            <div className='statistic-profit-loss-row'>
                <div className='statistic-profit-loss-text'>
                    ИТОГО:
                </div>
                <div className={`statistic-profit-loss-value ${statistic.totalProfit - statistic.totalLoss > 0 ? 'green' : 'red'}`}>{(statistic.totalProfit - statistic.totalLoss).toFixed(6)}</div>
            </div>
        </div>
    )
}