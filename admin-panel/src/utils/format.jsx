export const currencyFormat = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const dateFormat = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat('id-ID', { ...defaultOptions, ...options }).format(date);
};

export const timeFormat = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const dateTimeFormat = (date) => {
  return `${dateFormat(date)} pukul ${timeFormat(date)}`;
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} menit`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '+62' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('62')) {
    return '+62' + cleaned;
  }
  return '+' + cleaned;
};

// Format number with thousands separator
export const numberFormat = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Format percentage
export const percentageFormat = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

// Format table cell value
export const formatTableCell = (value, type) => {
  switch (type) {
    case 'currency':
      return currencyFormat(value);
    case 'date':
      return dateFormat(new Date(value));
    case 'datetime':
      return dateTimeFormat(new Date(value));
    case 'time':
      return timeFormat(new Date(value));
    case 'percentage':
      return percentageFormat(value);
    case 'phone':
      return formatPhoneNumber(value);
    default:
      return value || '-';
  }
};

// Get status color for badges
export const getStatusColor = (status, type = 'order') => {
  const statusColors = {
    order: {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      picked_up: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    },
    user: {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      unverified: 'bg-yellow-100 text-yellow-800'
    },
    payment: {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
  };

  return statusColors[type]?.[status] || 'bg-gray-100 text-gray-800';
};