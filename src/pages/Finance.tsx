import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { translations } from '../locales/translations';

const FinanceOverview = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;
  return <h2 className="text-2xl font-bold">{t.overview}</h2>;
};

const ExpenseManagement = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;
  return <h2 className="text-2xl font-bold">{t.expenses}</h2>;
};

const BudgetPlanning = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;
  return <h2 className="text-2xl font-bold">{t.budget}</h2>;
};

const FinancialReports = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;
  return <h2 className="text-2xl font-bold">{t.reports}</h2>;
};

export const Finance: React.FC = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].pages;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t.finance}
      </h1>
      <div className="mt-6">
        <Routes>
          <Route path="overview" element={<FinanceOverview />} />
          <Route path="expenses" element={<ExpenseManagement />} />
          <Route path="budget" element={<BudgetPlanning />} />
          <Route path="reports" element={<FinancialReports />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </div>
    </div>
  );
};