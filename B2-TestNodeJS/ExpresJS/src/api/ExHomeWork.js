import express from 'express'
import bodyParser
 from 'body-parser'
import {checkData} from '../middleware/check-middleware.js';
// import project from 'project.json'
const app = express();
const port = 3000;

import { readFile } from "fs/promises";

async function readAsyncJSON() {
  try {
    const filePath = new URL("project.json", import.meta.url);
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("❌ Lỗi khi đọc file JSON:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
}

let data = await readAsyncJSON();
console.log(" Dữ liệu JSON đã load:", data);


app.use(bodyParser.json());

// const checkData = (req, res, next) => {
//   const { Name, Age } = req.body;
//   if (!Name || typeof Name !== "string") {
//     return res.status(400).send({ error: "Tên không hợp lệ" });
//   }
//   if (!Age || typeof Age !== "number") {
//     return res.status(400).send({ error: "Tuổi không hợp lệ" });
//   }
//   next();
// };

// const checkUser = (req, res, next) => {
//    const id = parseInt(req.params.id)
//    const findIndex = data.findIndex((item) => item.id === id)
//       if (findIndex === -1) {
//         return res.status(404).send("Không có người dùng này")
//       }
//       next()
// }

app.get("/data", (req, res) => {
  const { sort } = req.query;

  if (sort === "asc") {
    data.sort((a, b) => a.Age - b.Age);
  } else if (sort === "dec") {
    data.sort((a, b) => b.Age - a.Age);
  }

  res.send(data);
});

app.get("/data/:id",checkUser, (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const user = data.find((user) => user.id == id)
  console.log(user);
  res.send(user)
})

app.put("/data/:id", checkData, checkUser, (req, res) => {
  const id = parseInt(req.params.id);
  const changInfo = data.find((changInfo) => changInfo.id === id);

  if (!changInfo) {
    return res.status(404).send({ error: "Người dùng không tồn tại" });
  }

  const { Name, Age } = req.body;
  if (Name) changInfo.Name = Name;
  if (Age) changInfo.Age = Age;

  res.send({ message: "Cập nhật thành công", changInfo });
});




app.delete("/data/:id",checkUser, (req, res, next) => {
  const id = parseInt(req.params.id);
  const findIndex = data.findIndex((item) => item.id == id);

  data.splice(findIndex, 1);
  res.send(data)
});


app.post("/data", (req, res) => {
  const { Name, Age } = req.body;
  const newInfo = {
    id: data.length ? data[data.length - 1].id + 1 : 0,
    Name,
    Age,
  }

  data.push(newInfo)
  res.send(newInfo)
})
app.listen(port, () => {
  console.log(`http:localhost${port}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).send({ error: err.message || "Lỗi hệ thống" });
});
