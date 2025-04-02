function checkData(req, res, next) {
    const { Name, Age } = req.body;
    if (!Name || typeof Name !== "string") {
      return res.status(400).send({ error: "Tên không hợp lệ" });
    }
    if (!Age || typeof Age !== "number") {
      return res.status(400).send({ error: "Tuổi không hợp lệ" });
    }
    next();
  };
  
  function checkUser(req, res, next) {
     const id = parseInt(req.params.id)
     const findIndex = data.findIndex((item) => item.id === id)
        if (findIndex === -1) {
          return res.status(404).send("Không có người dùng này")
        }
  
        next()
  }

 module.exports = {checkData, checkUser }