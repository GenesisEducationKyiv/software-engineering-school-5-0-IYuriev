document.addEventListener('DOMContentLoaded', function () {
  const API_BASE_URL = 'http://localhost:3000/api';

  const urlParams = new URLSearchParams(window.location.search);
  const pathSegments = window.location.pathname.split('/');
  const lastSegment = pathSegments[pathSegments.length - 2];
  const token = pathSegments[pathSegments.length - 1];

  if (lastSegment === 'confirm' && token) {
    confirmSubscription(token);
  } else if (lastSegment === 'unsubscribe' && token) {
    unsubscribeFromUpdates(token);
  }

  const weatherForm = document.getElementById('weather-form');
  weatherForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('weather-city').value.trim();
    getWeather(city);
  });

  const subscriptionForm = document.getElementById('subscription-form');
  subscriptionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('subscription-email').value.trim();
    const city = document.getElementById('subscription-city').value.trim();
    const frequency = document.getElementById('subscription-frequency').value;

    subscribeToWeather(email, city, frequency);
  });

  async function getWeather(city) {
    const weatherResult = document.getElementById('weather-result');
    const weatherError = document.getElementById('weather-error');

    try {
      showLoading(weatherForm);

      const response = await fetch(
        `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`,
      );
      const data = await response.json();

      hideLoading(weatherForm);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get weather information');
      }

      document.getElementById('weather-city-name').textContent = city;
      document.getElementById('weather-description').textContent =
        data.description;
      document.getElementById('weather-temperature').textContent =
        `${data.temperature}°C`;
      document.getElementById('weather-humidity').textContent =
        `${data.humidity}%`;

      weatherError.classList.add('hidden');
      weatherResult.classList.remove('hidden');
    } catch (error) {
      hideLoading(weatherForm);
      weatherResult.classList.add('hidden');
      weatherError.textContent =
        error.message || 'An error occurred while fetching weather data';
      weatherError.classList.remove('hidden');
    }
  }

  async function subscribeToWeather(email, city, frequency) {
    const subscriptionResult = document.getElementById('subscription-result');
    const subscriptionError = document.getElementById('subscription-error');

    try {
      showLoading(subscriptionForm);

      const payload = {
        email: email,
        city: city,
        frequency: frequency.toLowerCase(),
      };

      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      hideLoading(subscriptionForm);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      subscriptionError.classList.add('hidden');
      subscriptionResult.textContent =
        'Subscription successful! Please check your email to confirm your subscription.';
      subscriptionResult.classList.remove('hidden');
      subscriptionForm.reset();

      showNotification(
        'Subscription request sent! Check your email to confirm.',
      );
    } catch (error) {
      hideLoading(subscriptionForm);
      subscriptionResult.classList.add('hidden');
      subscriptionError.textContent =
        error.message || 'An error occurred while subscribing';
      subscriptionError.classList.remove('hidden');
    }
  }

  async function confirmSubscription(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/confirm/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to confirm subscription');
      }

      showNotification('Subscription confirmed successfully!');

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      showNotification(
        error.message || 'An error occurred while confirming subscription',
        true,
      );
    }
  }

  async function unsubscribeFromUpdates(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/unsubscribe/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe');
      }

      showNotification('Unsubscribed successfully!');

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      showNotification(
        error.message || 'An error occurred while unsubscribing',
        true,
      );
    }
  }

  function showLoading(form) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Loading...';
  }

  function hideLoading(form) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = false;
    button.textContent = button.textContent.replace(
      'Loading...',
      button.getAttribute('data-original-text') || 'Submit',
    );
  }

  function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
    notification.classList.add('show');

    setTimeout(() => {
      notification.classList.remove('show');
    }, 5000);
  }

  document.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.setAttribute('data-original-text', button.textContent);
  });
});
