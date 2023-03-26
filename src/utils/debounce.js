export const debounce = (func, delay) => {
    let lastCall = null;
  
    return function (...args) {
      const now = Number(new Date());
  
      if (lastCall && now - lastCall < delay) {
        return;
      }
  
      lastCall = now;
  
      func(...args);
    };
  };
  