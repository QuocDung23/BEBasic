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

// Lấy Thông Tin Có Hỗ Trợ Săp Xếp
app.get("/users", (req, res) => {
  const { sort } = req.query || "asc";

  if (sort === "asc") {
    users.sort((a, b) => a.age - b.age);
  } else if (sort === "dec") {
    users.sort((a, b) => b.age - a.age);
  }

  res.send(users);
});

// Get details 
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id == id);
  res.send(user);
});

// Update info
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

// Delete thông tin
app.delete("/users/:id", (req, res) => {
  console.log("");
  const deleteUser = users.findIndex(
    (deleteUser) => deleteUser.id == parseInt(req.params.id)
  );
  users.splice(deleteUser, 1);
  res.send(users);
});

//Add user
app.post("/users", (req, res) => {
  const { name, age } = req.body;
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    age,
  };

  users.push(newUser);
  res.send(newUser);
});



// app.get("/users/?:id", (res, req) => {
//   const id
// })

// app.get("/", (req, res) => {
//   res.send("hi anh Đức");
// });

app.listen(port, () => {
  console.log(`http:locallhost${port}/users`);
});
