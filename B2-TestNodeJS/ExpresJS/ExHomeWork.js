const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const data = require("./project.json");
console.log(data);

app.use(bodyParser.json());

app.get("/data", (req, res) => {
  const { sort } = req.query;

  if (sort === "asc") {
    data.sort((a, b) => a.Age - b.Age);
  } else if (sort === "dec") {
    data.sort((a, b) => b.Age - a.Age);
  }

  res.send(data);
});

app.get("/data/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = data.find((user) => user.id == id)

  res.send(user)
})

app.put("/data/:id", (req, res) => {
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

app.delete("/data/:id", (req, res) => {
  const deleteInfo = data.findIndex((deleteInfo) => deleteInfo.id === parseInt(req.params.id))
  data.splice(deleteInfo, 1)

  res.send(data)
})

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
