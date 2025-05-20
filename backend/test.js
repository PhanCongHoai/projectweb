const { sequelize } = require("./src/config/db");
const User = require("./src/models/User");

(async () => {
  await sequelize.authenticate();

  const newUser = await User.create({
    fullname: "Test Admin",
    email: "admin99@example.com",
    phone_number: "0999999999",
    address: "test",
    password: "123456",
    role_id: 1,
    created_at: new Date(),
    update_at: new Date(),
  });

  console.log("🧪 Tạo thành công:", newUser.toJSON());
})();
