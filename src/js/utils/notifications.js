export default {
  setup() {
    if (!('Notification' in window)) {
      console.error('Window does not support notifications');
    } else if (Notification.permission === 'granted') {
      return;
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          console.log('Permission granted');
        }
      });
    }
  },
  show({ title, body }) {
    new Notification(title, { body });
  },
};
