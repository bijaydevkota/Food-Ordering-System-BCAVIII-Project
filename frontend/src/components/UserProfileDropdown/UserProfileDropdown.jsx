/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLogOut, FiCamera, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createPortal } from 'react-dom';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const initialUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [userState, setUserState] = useState(initialUser);
  const { username, email, profilePhoto } = userState;

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/');
    window.location.reload();
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const token = localStorage.getItem('authToken');
      const response = await axios.put('http://localhost:4000/api/user/profile-photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const updatedUser = { ...userState, profilePhoto: response.data.profilePhoto };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserState(updatedUser);
        setShowPhotoUpload(false);
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('Failed to upload profile photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
          {profilePhoto ? (
            <img
              src={`http://localhost:4000${profilePhoto}`}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${profilePhoto ? 'hidden' : 'flex'}`}>
            {getInitials(username)}
          </div>
        </div>
        <span className="text-gray-800 font-medium hidden sm:block">{username || 'User'}</span>
      </button>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  {profilePhoto ? (
                    <img
                      src={`http://localhost:4000${profilePhoto}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${profilePhoto ? 'hidden' : 'flex'}`}>
                    {getInitials(username)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 font-semibold text-lg">{username || 'User'}</h3>
                  <p className="text-gray-500 text-sm">{email || 'user@example.com'}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setShowPhotoUpload(true);
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiCamera className="text-lg" />
                <span>Change Profile Photo</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowProfileModal(true);
                }}
                className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiUser className="text-lg" />
                <span>View Profile</span>
              </button>

              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-6 py-3 text-red-500 hover:text-red-600 hover:bg-red-100 transition-colors"
              >
                <FiLogOut className="text-lg" />
                <span>Logout</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Profile Modal */}
      {showProfileModal && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          onClick={() => setShowProfileModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-800 font-semibold text-xl">Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-700">
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white text-4xl font-bold">
                {profilePhoto ? (
                  <img
                    src={`http://localhost:4000${profilePhoto}`}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span>{getInitials(username)}</span>
                )}
              </div>
              <div className="w-full text-center">
                <div className="space-y-1">
                  <div className="text-gray-500 text-sm">Name</div>
                  <div className="text-gray-800 text-xl font-semibold">{username || 'User'}</div>
                </div>
                <div className="space-y-1 mt-3">
                  <div className="text-gray-500 text-sm">Email</div>
                  <div className="text-gray-700 text-lg font-semibold break-all">{email || 'user@example.com'}</div>
                </div>
                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          onClick={() => setShowPhotoUpload(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-gray-800 font-semibold text-lg mb-4">Upload Profile Photo</h3>
              <p className="text-gray-500 text-sm mb-6">Choose a new profile photo (max 5MB)</p>

              {isUploading ? (
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-300 border-t-transparent"></div>
                  <span className="text-gray-700">Uploading...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-semibold py-3 rounded-xl hover:from-pink-500 hover:to-yellow-400 transition-all duration-300"
                  >
                    Choose Photo
                  </button>
                  <button
                    onClick={() => setShowPhotoUpload(false)}
                    className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
};

export default UserProfileDropdown;
