import express from 'express';
import protect from "../middleware/authMiddleware.mjs";
import TxnsRoutes from "../controllers/txnControllers.mjs";
const { createTxn, fetchTxns, updateTxn, deleteTxn } = TxnsRoutes;
    
const router = express.Router();

router.route("/").get(protect, fetchTxns);
router.route("/").post(protect, createTxn);
router.route("/:id").put(protect, updateTxn);
router.route("/:id").delete(protect, deleteTxn);

export default router;