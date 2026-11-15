import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect, { isDbConnected } from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', courseTitle, studentEmail, paymentId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    const isLiveConfigured = !keyId.includes('placeholder') && !keySecret.includes('placeholder');

    let order = null;

    if (isLiveConfigured) {
      
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: Math.round(Number(amount) * 100), 
        currency: currency.replace(/[^A-Z]/g, '') || 'INR',
        receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes: {
          course: courseTitle || 'Dance Course Tuition',
          student: studentEmail || 'student@danceacademy.com',
          platform: 'DanceFlow Academy',
        },
      };

      order = await instance.orders.create(options);
    } else {
      
      order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        amount: Math.round(Number(amount) * 100),
        currency: currency.replace(/[^A-Z]/g, '') || 'INR',
        receipt: `rcpt_${Date.now()}`,
        status: 'created',
      };
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: isLiveConfigured ? keyId : 'rzp_test_sandbox_mode',
      isLiveConfigured,
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
