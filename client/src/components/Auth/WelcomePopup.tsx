import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { useLocalize } from '~/hooks';

type WelcomePopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  const localize = useLocalize();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-[102]"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-gray-600/65 transition-opacity dark:bg-black/80" />
      
      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all dark:bg-gray-700"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-200">
              Welcome to LibreChat! 👋
            </DialogTitle>
            <button
              onClick={onClose}
              className="inline-block text-gray-500 hover:text-gray-200"
              tabIndex={0}
            >
              <X />
            </button>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Thank you for joining LibreChat! We're excited to have you here.
            </p>
            
            <div className="mt-4 space-y-3">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Getting Started</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Start a new conversation by clicking the "New Chat" button or explore available models and plugins.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Plugins</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enhance your experience with plugins. Browse the plugin store to discover tools for various tasks.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Need Help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Check out our documentation or reach out to support if you have any questions.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                className="w-full rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={onClose}
              >
                Get Started
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default WelcomePopup;
