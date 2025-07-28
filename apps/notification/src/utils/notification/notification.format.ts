export const formatWeatherMessage = (
  city: string,
  weather: { temperature: number; humidity: number; description: string },
  unsubscribeUrl: string,
): string => {
  return (
    `Weather forecast for ${city}\n\n` +
    `Temperature: ${weather.temperature}°C\n` +
    `Humidity: ${weather.humidity}%\n` +
    `Description: ${weather.description}\n\n` +
    `If you no longer wish to receive these notifications, you can unsubscribe here: ${unsubscribeUrl}`
  );
};
