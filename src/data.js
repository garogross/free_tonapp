import CraneIcon from './assets/icons/crane.svg?react';
import ChallengesIcon from './assets/icons/challenges.svg?react';
import MiningIcon from './assets/icons/mining.svg?react';
import FriendsIcon from './assets/icons/friends.svg?react';
import ProfileIcon from './assets/icons/profile.svg?react';

export const footMenuItems = [
  { Icon: CraneIcon, alt: 'Кран', textKey: 'footMenu.cran' },
  { Icon: ChallengesIcon, alt: 'Задания', textKey: 'footMenu.challenges' },
  { Icon: MiningIcon, alt: 'Майнинг', textKey: 'footMenu.staking' },
  { Icon: FriendsIcon, alt: 'Друзья', textKey: 'footMenu.friends' },
  { Icon: ProfileIcon, alt: 'Профиль', textKey: 'footMenu.profile' },
];

export const adminFootMenuItems = [
    { image: '/images/staking.svg', alt: 'Статистика', textKey: 'adminFootMenu.statistics' },
    { image: '/images/staking.svg', alt: 'Операции', textKey: 'adminFootMenu.operations' },
    { image: '/images/staking.svg', alt: 'Реклама', textKey: 'adminFootMenu.advertisement' },
    { image: '/images/staking.svg', alt: 'Настройки', textKey: 'adminFootMenu.settings' },
]

export const languages = [
    {
        image: '/assets/russia.svg',
        alt: 'Русский',
        text: 'RU',
    },
    {
        image: '/assets/usa.svg',
        alt: 'English',
        text: 'EN',
    },    
]

export const accelerators = [
    {
        period: '30',
        incomePerDay: '0.2333',
        totalIncome: '7',
        rentCost: '5'
    },
    {
        period: '30',
        incomePerDay: '0.5',
        totalIncome: '15',
        rentCost: '10'
    },
    {
        period: '30',
        incomePerDay: '1',
        totalIncome: '30',
        rentCost: '20'
    }
]