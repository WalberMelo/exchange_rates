function removeTimezone(dateString) {
  return dateString.replace("+0000", "").trim();
}

module.exports = removeTimezone;
