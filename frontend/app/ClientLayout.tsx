'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type SignupData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check session status when component mounts
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost:4000/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': getCookie('CSRF-TOKEN')
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const getCookie = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': getCookie('CSRF-TOKEN')
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        setIsLoginModalOpen(false);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/session', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': getCookie('CSRF-TOKEN')
        }
      });

      if (response.ok) {
        setCurrentUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': getCookie('CSRF-TOKEN')
        },
        body: JSON.stringify({
          user: {
            email: signupData.email,
            username: signupData.username,
            password: signupData.password
          }
        })
      });

      if (response.ok) {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
        setSignupData({ email: '', username: '', password: '', confirmPassword: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const openSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
    setError('');
    setCredentials({ username: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-warm-gradient">
      <nav className="glass-effect relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-gold/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-6 py-5">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg bg-soft-red/10 flex items-center justify-center transition-colors group-hover:bg-soft-red/20">
                  <svg className="w-5 h-5 text-soft-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h1 className="text-2xl font-playfair text-warm-gray group-hover:text-soft-red transition-colors">
                  Task <span className="text-soft-red">Tracker</span>
                </h1>
              </Link>
              {currentUser && (
                <span className="text-warm-gray border-l border-warm-gray/20 pl-6">
                  Welcome, {currentUser.username}!
                </span>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <a href="/dashboard" className="nav-link text-warm-gray/80 hover:text-warm-gray transition-colors">Dashboard</a>
                <a href="/dashboard/projects" className="nav-link text-warm-gray/80 hover:text-warm-gray transition-colors">Projects</a>
                <a href="/dashboard/todos" className="nav-link text-warm-gray/80 hover:text-warm-gray transition-colors">Tasks</a>
              </nav>
              <div className="flex space-x-3">
                {currentUser ? (
                  <button 
                    className="luxury-button bg-soft-red/20 text-white hover:bg-soft-red hover:text-white"
                    onClick={handleLogout}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log Out
                    </span>
                  </button>
                ) : (
                  <>
                    <button 
                      className="luxury-button bg-soft-red/20 text-white hover:bg-soft-red hover:text-white"
                      onClick={() => setIsSignupModalOpen(true)}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create Account
                      </span>
                    </button>
                    <button 
                      className="luxury-button"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Log In
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Log In</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="luxury-input w-full"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="luxury-input w-full"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setError('');
                    setCredentials({ username: '', password: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="luxury-button"
                >
                  Log In
                </button>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-600">Don't have an account?</p>
                <button
                  type="button"
                  onClick={openSignupModal}
                  className="text-soft-red hover:text-soft-red/80 font-semibold"
                >
                  Create an account here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Create Account</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="luxury-input w-full"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="luxury-input w-full"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="luxury-input w-full"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="luxury-input w-full"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignupModalOpen(false);
                    setError('');
                    setSignupData({ email: '', username: '', password: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="luxury-button"
                >
                  Create Account
                </button>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-600">Already have an account?</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignupModalOpen(false);
                    setIsLoginModalOpen(true);
                    setError('');
                    setSignupData({ email: '', username: '', password: '', confirmPassword: '' });
                  }}
                  className="text-soft-red hover:text-soft-red/80 font-semibold"
                >
                  Log in here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 