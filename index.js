const CryptoJS = require("crypto-js");
const { faker } = require("@faker-js/faker");
const fs = require("fs");

const encrypt = (message, base64EncodedSecret) => {
  const secretWordArray = CryptoJS.enc.Base64.parse(base64EncodedSecret);
  const passphrase = secretWordArray.toString(CryptoJS.enc.Utf8);

  const encryptedWords = CryptoJS.AES.encrypt(message, passphrase);
  const cipherText = encryptedWords.toString();
  return cipherText;
};

const decrypt = (base64EncodedAndEncryptedMessage, base64EncodedSecret) => {
  const secretWordArray = CryptoJS.enc.Base64.parse(base64EncodedSecret);
  const passphrase = secretWordArray.toString(CryptoJS.enc.Utf8);

  const bytes = CryptoJS.AES.decrypt(
    base64EncodedAndEncryptedMessage,
    passphrase
  );
  const plainText = bytes.toString(CryptoJS.enc.Utf8);

  return plainText;
};

let encryptionKey = "YTVxZkhrbUdoaXp6dlJncw==";
let profilesArray = [];
let decryptedProfileArray = [];
var lookup = {};
var result = [];

for (let i = 0; i < 10000; i++) {
  var badgeId = faker.number.int();
  var profile =
    "v1|enc-vi" +
    badgeId +
    "|" +
    faker.person.firstName() +
    "|" +
    faker.person.lastName() +
    "|" +
    faker.company.name() +
    "|" +
    faker.person.jobTitle() +
    "|" +
    faker.internet.email() +
    "|" +
    1000010001 +
    "|" +
    faker.address.country();

  console.log("\n");

  if (!(badgeId in lookup)) {
    lookup[badgeId] = 1;
    result.push(badgeId);
  }

  var encryptedProfile = encrypt(profile, encryptionKey);
  console.log(encryptedProfile);

  profilesArray.push({ badge1: encryptedProfile });

  var decryptedProfile = decrypt(encryptedProfile, encryptionKey);
  console.log(decryptedProfile);

  decryptedProfileArray.push({ badge1: decryptedProfile });

  console.log("\n");
}

console.log('Distinct BadgeId Count:', result.length);

const jsonString = JSON.stringify(profilesArray);
const decryptedJsonString = JSON.stringify(decryptedProfileArray);

fs.writeFileSync('encryptedBadges-feed.json', jsonString);
fs.writeFileSync('decryptedBadges-feed.json', decryptedJsonString);

console.log('JSON file created successfully.');

