import axios from 'axios';
import { useState } from 'react';
import { FaCheckCircle, FaEnvelopeOpenText } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { userEndpoints } from '../../constraints/endpoints/userEnpoints';

function EmailVerification() {
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');
    const data = useParams()

    const handleVerifyEmail = async () => {
        try {
          console.log(data.id,'data.id')
          const email= data.id
            const result= await  axios.post(userEndpoints.verifyEmail,{email})
            if(result.status==200){
                setIsVerified(true);
            }
            setError('');
        } catch (err) {
            setError('Failed to verify email. Please try again.');
            console.log('Failed to verify email. Please try again.',err)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mb-4">Email Verification</h2>

                {!isVerified ? (
                    <div className="text-center">
                        <FaEnvelopeOpenText size={50} className="text-blue-500 mb-4 " />
                        <p className="text-gray-600 text-center mb-6">
                        You have successfully clicked the email verification link.
                        Click the button below to complete your registration and verify your email.
                        </p>

                        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                        <button
                            onClick={handleVerifyEmail}
                            className="w-full bg-blue-500 text-white font-bold rounded-lg p-3 hover:bg-blue-600 transition duration-300"
                        >
                            Verify Email
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <FaCheckCircle size={50} className="text-green-500 mb-4" />
                        <p className="text-green-600 font-bold mb-4">Your email has been verified!</p>

                        <p className="text-gray-600 mb-6">
                            Thank you for verifying your email. You can now proceed to log in and access your account.
                        </p>

                        <button
                            onClick={() => window.location.href = '/'} // Redirect to login or any page after verification
                            className="bg-blue-500 text-white font-bold rounded-lg px-6 py-2 hover:bg-blue-600 transition duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmailVerification;