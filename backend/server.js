import express from 'express';
// import urlContr

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
app.get("/", (req, res) => {
  res.send({ message: "Hello from an Express API!" });
});
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});