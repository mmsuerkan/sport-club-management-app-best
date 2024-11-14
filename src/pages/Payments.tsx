import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { translations } from '../locales/translations';

const PaymentsOverview = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;
  return <h2 className="text-2xl font-bold">{t.overview}</h2>;
};

const PaymentHistory = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;
  return <h2 className="text-2xl font-bold">{t.history}</h2>;
};

const PendingPayments = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;
  return <h2 className="text-2xl font-bold">{t.pending}</h2>;
};

export const Payments: React.FC = () => {
  const { settings } = useSettings();
  const t = translations[settings.language].pages;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t.payments}
      </h1>
      <div className="mt-6">
        <Routes>
          <Route path="overview" element={<PaymentsOverview />} />
          <Route path="history" element={<PaymentHistory />} />
          <Route path="pending" element={<PendingPayments />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </div>
    </div>
  );
};