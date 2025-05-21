const app = require("./app");
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
