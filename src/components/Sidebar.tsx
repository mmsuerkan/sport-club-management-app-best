import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { translations } from '../locales/translations';
import {
  Home,
  Building2,
  Users,
  GraduationCap,
  ClipboardCheck,
  Clock,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Wallet,
  LineChart,
  UserPlus,
  Calendar,
  Trophy
} from 'lucide-react';

interface SubMenuItem {
  name: string;
  path: string;
}

interface MenuItem {
  icon: React.ReactNode;
  name: string;
  path: string;
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onExpandedChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);

  const t = translations[settings.language].sidebar;

  const menuItems: MenuItem[] = [
    { icon: <Home size={20} />, name: t.dashboard, path: '/dashboard' },
    { icon: <Building2 size={20} />, name: t.branches, path: '/branches' },
    { icon: <Users size={20} />, name: t.groups, path: '/groups' },
    { icon: <UserPlus size={20} />, name: t.students, path: '/students' },
    { icon: <GraduationCap size={20} />, name: t.trainers, path: '/trainers' },
    { icon: <ClipboardCheck size={20} />, name: t.attendance, path: '/attendance' },
    { icon: <Clock size={20} />, name: t.attendanceRecords, path: '/attendance-records' },
    { icon: <LineChart size={20} />, name: t.studentProgress, path: '/student-progress' },
    { icon: <Trophy size={20} />, name: t.matchSchedule, path: '/match-schedule' },
    {
      icon: <CreditCard size={20} />,
      name: t.payments,
      path: '/payments',
      subItems: [
        { name: t.overview, path: '/payments/overview' },
        { name: t.history, path: '/payments/history' },
        { name: t.pending, path: '/payments/pending' },
      ],
    },
    {
      icon: <Wallet size={20} />,
      name: t.finance,
      path: '/finance',
      subItems: [
        { name: t.overview, path: '/finance/overview' },
        { name: t.expenses, path: '/finance/expenses' },
        { name: t.budget, path: '/finance/budget' },
        { name: t.reports, path: '/finance/reports' },
      ],
    },
  ];

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-900 text-white transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      } overflow-hidden`}
      onMouseEnter={() => onExpandedChange(true)}
      onMouseLeave={() => onExpandedChange(false)}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.path}>
              <div
                className={`flex items-center px-2 py-2 rounded-lg cursor-pointer ${
                  location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
                onClick={() => {
                  if (item.subItems) {
                    toggleMenu(item.path);
                  } else {
                    navigate(item.path);
                  }
                }}
              >
                <span className="min-w-[24px]">{item.icon}</span>
                {isExpanded && (
                  <>
                    <span className="ml-3 flex-grow">{item.name}</span>
                    {item.subItems && (
                      <span className="ml-auto">
                        {expandedMenus.includes(item.path) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </>
                )}
              </div>
              {isExpanded && item.subItems && expandedMenus.includes(item.path) && (
                <div className="ml-8 mt-2 space-y-2">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.path}
                      className={`px-2 py-1.5 rounded-lg cursor-pointer ${
                        location.pathname === subItem.path
                          ? 'bg-blue-600'
                          : 'hover:bg-gray-800'
                      }`}
                      onClick={() => navigate(subItem.path)}
                    >
                      {subItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};