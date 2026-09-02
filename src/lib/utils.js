import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getModuleStatus = (module, userProgress) => {
  if (!userProgress) return MODULE_STATUS.LOCKED;
  const progress = userProgress.find((p) => p.module_id === module.id);
  if (!progress) return MODULE_STATUS.LOCKED;
  if (progress.completed) return MODULE_STATUS.COMPLETED;
  if (progress.started) return MODULE_STATUS.IN_PROGRESS;
  return MODULE_STATUS.UNLOCKED;
};