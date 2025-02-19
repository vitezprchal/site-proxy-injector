console.log('Injected!');

interface CustomMessage {
  text: string;
  timestamp: number;
}

function showInjectionMessage(): void {
  const message: CustomMessage = {
    text: 'Successfully Injected!',
    timestamp: Date.now()
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3498db;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  notification.textContent = message.text;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showInjectionMessage);
} else {
  showInjectionMessage();
}
