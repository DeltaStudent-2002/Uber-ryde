import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'

const Payment = ({ amount, onSuccess, onCancel }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('cash')

    const handlePayment = async () => {
        if (paymentMethod === 'cash') {
            onSuccess({ method: 'cash' })
            return
        }

        if (!stripe || !elements) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/payments/create-payment`,
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            })

            if (result.error) {
                setError(result.error.message)
            } else {
                onSuccess({ method: 'card', paymentIntentId: data.paymentIntentId })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 bg-white rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            
            <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="w-4 h-4"
                    />
                    <span>Cash on Ride</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4"
                    />
                    <span>Card Payment (Stripe)</span>
                </label>
            </div>

            {paymentMethod === 'card' && (
                <div className="mb-4 p-3 border rounded-lg">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }} />
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePayment}
                    disabled={loading || (paymentMethod === 'card' && (!stripe || !elements))}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : `Pay ₹${amount}`}
                </button>
            </div>
        </div>
    )
}

export default Payment
