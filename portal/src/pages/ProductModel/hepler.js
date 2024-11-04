function generateRandomString() {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  const randomString = randomNumber.toString();
  return randomString;
}

export { generateRandomString };
