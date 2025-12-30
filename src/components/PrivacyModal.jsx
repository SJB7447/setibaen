import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import Button from './Button';

const PrivacyModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-2 text-primary">
                                <Shield className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Privacy Policy</h3>
                            </div>
                            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-muted space-y-4 leading-relaxed">
                            <p>
                                <strong>1. Data Collection</strong><br />
                                We collect your name, email address, and phone number to provide our services. Your emotion logs are stored locally on your device or securely in our database to improve recommendations.
                            </p>
                            <p>
                                <strong>2. Usage of Information</strong><br />
                                Your data is used solely for:
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Authenticating your account</li>
                                    <li>Providing personalized cafe recommendations</li>
                                    <li>Recovering your account via phone verification</li>
                                </ul>
                            </p>
                            <p>
                                <strong>3. Data Protection</strong><br />
                                We implement security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
                            </p>
                            <p>
                                <strong>4. Consent</strong><br />
                                By using our site, you consent to our web site privacy policy.
                            </p>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
                            <Button onClick={onClose} variant="primary">
                                I Understand
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PrivacyModal;
