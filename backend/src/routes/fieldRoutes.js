const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fieldController");

router.post("/", fieldController.createField); // POST /fields
router.get("/worker/fields", fieldController.getWorkerFields);
router.get("/worker/fields/:fieldId", fieldController.getWorkerFieldDetails);
// history Screens
router.get('/:id/history/summary', fieldController.getFieldHistorySummary); // Widget
router.get('/:id/history', fieldController.getFieldHistory); // Full Page
//
router.get("/paginated", fieldController.listFields); // GET /fields with pagination
router.get("/search", fieldController.searchField);
router.get("/details", fieldController.getFieldDetails);//GET /fields/details to return the details of each field
router.get("/filter", fieldController.filterField);//GET /fields/filter?status=value
router.put("/:id", fieldController.updateField); // PUT /fields/:id 
router.delete("/:id", fieldController.deleteField); // DELETE /fields/:id

module.exports = router;
