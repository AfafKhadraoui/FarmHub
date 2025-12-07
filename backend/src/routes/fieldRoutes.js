const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fieldController");

router.post("/", fieldController.createField); // POST /fields
router.get("/paginated", fieldController.listFields); // GET /fields with pagination
router.get("/search", fieldController.searchField);
router.get("/details", fieldController.getFieldDetails);//GET /fields/details to return the details of each field
router.put("/:id", fieldController.updateField); // PUT /fields/:id 
router.delete("/:id", fieldController.deleteField); // DELETE /fields/:id

module.exports = router;
