import asyncHandler from "express-async-handler";
import Txn from "../models/txnModel.mjs";

const createTxn = asyncHandler(async (req, res) => {
  const { title, type, amount, description, timestamp } = req.body;
  
  try {
    const newTxn = new Txn({
      title,
      type,
      amount,
      description,
      timestamp,
      user: req.user,
    });

    await newTxn.save();
    res.status(201).json({ message: "Transaction added successfully !" });
  } catch (error) {
    res.status(400).json({ err: "Server Error !" });
  }
});

const fetchTxns = asyncHandler(async (req, res) => {
  try {
    const filter = {...req.query, user: req.user};
    const txns = await Txn.find(filter);
    res.status(200).json({ txns });
  } catch (error) {
    console.log(error);
    res.status(400).json({ err: "Server Error !" });
  }
});

const updateTxn = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, amount, description, timestamp } = req.body;
  
    const txn = await Txn.findById(id);

    txn.title = title;
    txn.type = type;
    txn.amount = amount;
    txn.description = description;
    txn.timestamp = timestamp;

    const isChanged = txn.isModified();

    if (!isChanged) {
      res.status(204).send();
      return;
    }

    await txn.save();
    res.status(200).json({ message: "Transaction updated successfully !" });
  } catch (error) {
    res.status(400).json({ err: "Server Error !" });
  }
});

const deleteTxn = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await Txn.findOneAndDelete({ _id: id });

    res.json({ message: "Transaction deleted successfully !" });
  } catch (error) {
    res.status(400).json({ err: "Server Error !" });
  }
});

export default { createTxn, fetchTxns, updateTxn, deleteTxn };