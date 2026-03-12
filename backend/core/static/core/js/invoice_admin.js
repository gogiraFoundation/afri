document.addEventListener('DOMContentLoaded', function () {
  const bookingSelect = document.getElementById('id_booking');
  if (!bookingSelect) return;

  const container = bookingSelect.closest('.form-row') || bookingSelect.parentElement;
  if (!container) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button';
  button.textContent = 'Generate from booking';
  button.style.marginLeft = '0.5rem';

  container.appendChild(button);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  button.addEventListener('click', function () {
    const bookingId = bookingSelect.value;
    if (!bookingId) {
      alert('Please select a booking first.');
      return;
    }

    const url = window.location.origin + '/admin/core/invoice/generate-from-booking/';
    const formData = new FormData();
    formData.append('booking_id', bookingId);

    fetch(url, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to generate invoice amounts from booking.');
        }
        return response.json();
      })
      .then((data) => {
        const subtotalInput = document.getElementById('id_subtotal');
        const vatInput = document.getElementById('id_vat_amount');
        const totalInput = document.getElementById('id_total');
        const descriptionInput = document.getElementById('id_description');

        if (subtotalInput && typeof data.subtotal !== 'undefined') {
          subtotalInput.value = data.subtotal;
        }
        if (vatInput && typeof data.vat_amount !== 'undefined') {
          vatInput.value = data.vat_amount;
        }
        if (totalInput && typeof data.total !== 'undefined') {
          totalInput.value = data.total;
        }
        if (descriptionInput && data.description) {
          descriptionInput.value = data.description;
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Could not generate invoice amounts from booking. Please try again.');
      });
  });
});

