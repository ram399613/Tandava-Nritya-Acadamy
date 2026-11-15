
import dbConnect, { isDbConnected } from './mongodb';
import Payment from '@/models/Payment';

if (!global._danceflowPayments) {
  global._danceflowPayments = [
    {
      _id: 'pay_1',
      studentName: 'Aarav Patel',
      courseTitle: 'Urban Hip-Hop & Street Choreography',
      amount: 4500,
      paymentMethod: 'UPI (Google Pay)',
      transactionId: 'TXN_UPI_992143',
      status: 'paid',
      paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'pay_2',
      studentName: 'Lucas Silva',
      courseTitle: 'Contemporary Movement & Fluidity',
      amount: 5200,
      paymentMethod: 'Razorpay / Card',
      transactionId: 'TXN_RZP_481029',
      status: 'paid',
      paidAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      _id: 'pay_3',
      studentName: 'Ananya Sharma',
      courseTitle: 'Classical Russian Ballet & Pointe Mastery',
      amount: 6000,
      paymentMethod: 'Net Banking',
      transactionId: 'TXN_NET_120938',
      status: 'paid',
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'pay_4',
      studentName: 'Lucas Silva',
      courseTitle: 'Freestyle Dance & Battle Concepts',
      amount: 3800,
      paymentMethod: 'UPI / PhonePe',
      transactionId: 'PENDING_INV_8832',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'pay_5',
      studentName: 'Rohan Verma',
      courseTitle: 'Salsa & Latin Ballroom Styling',
      amount: 4200,
      paymentMethod: 'Credit Card',
      transactionId: 'PENDING_INV_8833',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getAllPayments(statusFilter) {
  let list = global._danceflowPayments;
  if (statusFilter && statusFilter !== 'All') {
    list = list.filter((p) => p.status === statusFilter);
  }
  return list;
}

export function createPendingInvoice({ studentName, courseTitle, amount, courseId, studentId }) {
  const invoice = {
    _id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    studentName: studentName || 'Lucas Silva',
    studentId: studentId || 'std_3',
    courseTitle: courseTitle || 'Academy Dance Course',
    courseId: courseId || '',
    amount: Number(amount) || 4500,
    paymentMethod: 'Pending Payment Gateway',
    transactionId: `INV_${Date.now().toString().slice(-6)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  global._danceflowPayments.unshift(invoice);

  if (global.io) {
    global.io.emit('payment_updated', invoice);
  }

  return invoice;
}

export async function markPaymentPaid(idOrRecordId, details = {}) {
  const targetId = idOrRecordId;
  const paidAt = new Date().toISOString();
  const txId = details.transactionId || `PAY_LIVE_${Date.now()}`;

  let updated = null;

  try {
    const conn = await dbConnect();
    if (conn && isDbConnected()) {
      updated = await Payment.findByIdAndUpdate(
        targetId,
        {
          status: 'paid',
          transactionId: txId,
          paymentMethod: details.paymentMethod || 'Razorpay Live UPI / Card',
          paymentDate: new Date(),
        },
        { new: true }
      );
    }
  } catch (_) {}

  const idx = global._danceflowPayments.findIndex((p) => p._id === targetId || p.transactionId === targetId);
  if (idx !== -1) {
    global._danceflowPayments[idx] = {
      ...global._danceflowPayments[idx],
      status: 'paid',
      paymentMethod: details.paymentMethod || global._danceflowPayments[idx].paymentMethod || 'Razorpay Live / UPI',
      transactionId: txId,
      paidAt,
    };
    updated = global._danceflowPayments[idx];
  } else {
    updated = {
      _id: targetId || `pay_${Date.now()}`,
      status: 'paid',
      transactionId: txId,
      amount: details.amount || 4500,
      courseTitle: details.courseTitle || 'Academy Dance Discipline',
      studentName: details.studentName || 'Student Dancer',
      paymentMethod: details.paymentMethod || 'Razorpay Live UPI / Card',
      paidAt,
    };
    global._danceflowPayments.unshift(updated);
  }

  if (global.io) {
    global.io.emit('payment_updated', updated);
    global.io.emit('payment_completed', updated);
    global.io.emit('new_notification', {
      _id: `notif_${Date.now()}`,
      title: 'Tuition Payment Confirmed',
      message: `₹${updated.amount} received from ${updated.studentName} for ${updated.courseTitle}`,
      type: 'payment',
      createdAt: paidAt,
      read: false,
    });
  }

  return updated;
}
