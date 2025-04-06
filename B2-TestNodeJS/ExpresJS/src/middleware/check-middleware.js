// middleware/check-middleware.js

export const checkData = (req, res, next) => {
  const { Name, Age } = req.body;

  if (!Name || typeof Name !== "string") {
    return res.status(400).send({ error: "Tên không hợp lệ" });
  }

  if (Age === undefined || typeof Age !== "number") {
    return res.status(400).send({ error: "Tuổi không hợp lệ" });
  }

  next();
};

export const checkUser = (req, res, next) => {
  const id = parseInt(req.params.id);
  const data = req.app.locals.data;

  const findIndex = data.findIndex((item) => item.id === id);
  if (findIndex === -1) {
    return res.status(404).send("Không có người dùng này");
  }

  next();
};
