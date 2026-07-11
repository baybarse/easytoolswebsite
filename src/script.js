document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Reset animation
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = null;

        if (filterValue === 'all') {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.5s ease backwards';
        } else {
          const tags = card.getAttribute('data-tags') || '';
          const tagArray = tags.split(',').map(t => t.trim().toLowerCase());
          
          if (tagArray.includes(filterValue.toLowerCase())) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.5s ease backwards';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
});
