export function getCalendarUrl(title, details, durationHours = 2) {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  // Create start and end dates (schedule for tomorrow at 10 AM by default)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(10, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + durationHours);

  // Format to basic ISO string without dashes/colons and ending with Z
  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
  
  const url = `${baseUrl}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${dates}`;
  return url;
}
