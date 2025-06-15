const bcrypt = require('bcrypt');
const saltRounds = 10;

// Enter the password you want to hash here
const plainPassword = 'admin123'; 

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log(`Password: ${plainPassword}`);
  console.log(`Hashed Password: ${hash}`);
  console.log("\nCopy the hashed password and update your database.");
});