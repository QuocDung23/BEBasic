const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = [
  {
    id: 1,
    name: "A",
    age: 10,
  },
  {
    id: 2,
    name: "B",
    age: 20,
  },
  {
    id: 3,
    name: "C",
    age: 30,
  },
];

app.get("/users", (req, res) => {
  const { sort } = req.query || "asc";
  console.log(sort);

  if (sort === "asc") {
    users.sort((a, b) => a.age - b.age);
  } else if (sort === "dec") {
    users.sort((a, b) => b.age - a.age);
  }

  res.send(users);
});

app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const changeUser = users.find((changeUser) => changeUser.id === id);
  const { name, age } = req.body; // request đên body
  if (name) {
    changeUser.name = name;
  }
  if (age) {
    changeUser.age = age;
  }

  res.send(changeUser);
});

// app.get("/users/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const user = users.find((user) => user.id == id);
//   res.send(user);
// });

// app.get("/users/?:id", (res, req) => {
//   const id
// })

app.delete("/users/:id", (req, res) => {
  console.log("");
  const deleteUser = users.findIndex(
    (deleteUser) => deleteUser.id == parseInt(req.params.id)
  );
  users.splice(deleteUser, 1);
  res.send(users);
});

// app.get("/", (req, res) => {
//   res.send("hi anh Đức");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
