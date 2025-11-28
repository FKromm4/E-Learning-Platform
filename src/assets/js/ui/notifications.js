// ============================================
// NOTIFICATIONS.JS - Toast Notification System
// ============================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of notification: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
function showNotification(message, type = 'info', duration = 4000) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    `;
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    // Colors based on type
    const colors = {
        success: { bg: '#10b981', border: '#059669' },
        error: { bg: '#ef4444', border: '#dc2626' },
        warning: { bg: '#f59e0b', border: '#d97706' },
        info: { bg: '#3b82f6', border: '#2563eb' }
    };

    const color = colors[type] || colors.info;

    notification.style.cssText = `
    background: ${color.bg};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    border-left: 4px solid ${color.border};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.3s;
  `;

    notification.innerHTML = `
    <span style="font-size: 20px; font-weight: bold;">${icons[type]}</span>
    <span style="flex: 1;">${message}</span>
    <span style="font-size: 18px; opacity: 0.8; margin-left: 8px;">×</span>
  `;

    // Add hover effect
    notification.addEventListener('mouseenter', () => {
        notification.style.transform = 'scale(1.02)';
    });

    notification.addEventListener('mouseleave', () => {
        notification.style.transform = 'scale(1)';
    });

    // Click to dismiss
    notification.addEventListener('click', () => {
        removeNotification(notification);
    });

    // Add to container
    container.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
}

/**
 * Remove a notification with animation
 */
function removeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';

    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(400px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);
