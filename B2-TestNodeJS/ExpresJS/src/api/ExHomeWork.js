const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const data = require("../../project.json");
console.log(data);

app.use(bodyParser.json());

const checkData = (req, res, next) => {
  const { Name, Age } = req.body;
  if (!Name || typeof Name !== "string") {
    return res.status(400).send({ error: "Tên không hợp lệ" });
  }
  if (!Age || typeof Age !== "number") {
    return res.status(400).send({ error: "Tuổi không hợp lệ" });
  }
  next();
};

const checkUser = (req, res, next) => {
   const id = parseInt(req.params.id)
   const findIndex = data.findIndex((item) => item.id === id)
      if (findIndex === -1) {
        return res.status(404).send("Không có người dùng này")
      }
      next()
}

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
  const user = data.find((user) => user.id == id)

  res.send(user)
})

app.put("/data/:id",checkData,checkUser , (req, res) => {
  const id = parseInt(req.params.id)
  const changInfo = data.find((changInfo) => changInfo.id === id)

  const {Name, Age} = req.body;
  if (Name) {
    changInfo.Name = Name;
  } if (Age) {
    changInfo.Age = Age;
  }

  res.send(changInfo)
})



app.delete("/data/:id",checkUser, (req, res, next) => {
  const id = parseInt(req.params.id);
  const findIndex = data.findIndex((item) => item.id == id);

  data.splice(findIndex, 1);
  res.send(data)
  res.status(200).send("Xóa thành công")
});


app.post("/data",checkData,checkUser, (req, res) => {
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
  res.status(err.status).send({error: err.message})
})