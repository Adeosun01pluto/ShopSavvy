import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingG, setLoadingG] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const createUserDocument = async (user, name, phoneNumber) => {
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      name: name,
      email: user.email,
      phoneNumber: phoneNumber,
      isAdmin: false,
      isWorker: false,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      routeUser();
    } catch (error) {
      setError('Error logging in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoadingG(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user, result.user.displayName, '');      
      routeUser();
    } catch (error) {
      setError('Error logging in with Google: ' + error.message);
    } finally {
      setLoadingG(false);
    }
  };

  const routeUser = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isAdmin) {
          navigate('/');
          // navigate('/owner-dashboard');
        } else if (userData.isWorker) {
          // navigate('/worker-dashboard');
          navigate('/');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[80%] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#435EEF] focus:border-[#435EEF] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#435EEF] focus:border-[#435EEF] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#435EEF] hover:bg-[#3141B0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#435EEF]"
              disabled={loading}
            >
              {loading ? <TailSpin height={20} width={20} color="#fff" /> : 'Sign in'}
            </button>
          </div>
        </form>
        {error && (
          <div className="text-red-500 text-center mt-4">
            <p>{error}</p>
          </div>
        )}
        <div>
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loadingG}
          >
            {loadingG ? <TailSpin height={20} width={20} color="#fff" /> : <><FaGoogle className="mr-2" /> Sign in with Google</>}
          </button>
        </div>
        <div className="text-center">
          <Link to="/signup" className="font-medium text-[#435EEF] hover:text-[#3141B0]">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
