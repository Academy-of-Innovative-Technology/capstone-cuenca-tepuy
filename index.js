
let elements = document.querySelectorAll('.bg-half-dark');
let elements_2 = document.querySelectorAll('.bg-half-dark-reverse');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is visible → trigger animation
        entry.target.classList.add('on');

        // Clear any pending reset
        clearTimeout(entry.target._resetTimer);
      } else {
        // Element left screen → start 2s timer
        entry.target._resetTimer = setTimeout(() => {
          entry.target.classList.remove('on');
        }, 2000);
      }
    });
  }, {
    threshold: 0
  });
elements.forEach(el => observer.observe(el));
elements_2.forEach(el => observer.observe(el));