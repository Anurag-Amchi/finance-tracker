import mongoose from "mongoose";

const txnSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Txn = mongoose.model("Txn", txnSchema);
export default Txn;