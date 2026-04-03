const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const generateTxId = () => 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance totalEarnings');
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, walletBalance: user.walletBalance, totalEarnings: user.totalEarnings, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMoney = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const user = await User.findById(req.user.id);
    user.walletBalance += amount;
    user.totalEarnings += amount;
    await user.save();

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'credit',
      amount,
      description: `Added via ${paymentMethod || 'online'}`,
      status: 'completed',
      transactionId: generateTxId(),
    });
    await transaction.save();

    res.json({ success: true, walletBalance: user.walletBalance, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.transferMoney = async (req, res) => {
  try {
    const { toEmail, amount, note } = req.body;
    if (!toEmail || !amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid data' });

    const sender = await User.findById(req.user.id);
    if (sender.walletBalance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });

    const receiver = await User.findOne({ email: toEmail });
    if (!receiver) return res.status(404).json({ success: false, message: 'Receiver not found' });

    // Deduct from sender
    sender.walletBalance -= amount;
    await sender.save();

    // Add to receiver
    receiver.walletBalance += amount;
    await receiver.save();

    const txId = generateTxId();
    const senderTx = new Transaction({
      userId: sender._id,
      type: 'debit',
      amount,
      description: `Sent to ${receiver.email}${note ? ` - ${note}` : ''}`,
      status: 'completed',
      transactionId: txId,
      relatedUser: receiver._id,
    });
    await senderTx.save();

    const receiverTx = new Transaction({
      userId: receiver._id,
      type: 'credit',
      amount,
      description: `Received from ${sender.email}${note ? ` - ${note}` : ''}`,
      status: 'completed',
      transactionId: txId,
      relatedUser: sender._id,
    });
    await receiverTx.save();

    res.json({ success: true, message: 'Transfer successful', newBalance: sender.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recharge = async (req, res) => {
  try {
    const { type, number, amount, operator } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const user = await User.findById(req.user.id);
    if (user.walletBalance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });

    user.walletBalance -= amount;
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'debit',
      amount,
      description: `${type} recharge for ${number} (${operator || 'standard'})`,
      status: 'completed',
      transactionId: generateTxId(),
    });
    await transaction.save();

    res.json({ success: true, message: 'Recharge successful', newBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyLoan = async (req, res) => {
  try {
    const { amount, tenure, purpose } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const user = await User.findById(req.user.id);
    user.walletBalance += amount;
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'credit',
      amount,
      description: `Loan approved - ${purpose || 'personal'} (₹${amount}, tenure ${tenure} months)`,
      status: 'completed',
      transactionId: generateTxId(),
    });
    await transaction.save();

    res.json({ success: true, message: 'Loan approved and credited to wallet', newBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};