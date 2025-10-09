import React, { useEffect, useState } from 'react';
import { aesDecryptBase64WithKeyHex } from '../utils/cryptoClient'; // implement AES decrypt helper
import JSEncrypt from 'jsencrypt';

export default function MessageView({ msg, onClose, user }) {
  const [plaintext, setPlaintext] = useState('');

  useEffect(()=>{
    async function decrypt() {
      try {
        // decrypt AES key using user's private key
        const encryptedBlob = user.rsaPrivateKeyEncrypted;
        const privateKeyPem = atob(JSON.parse(encryptedBlob).data);
        const jse = new JSEncrypt();
        jse.setPrivateKey(privateKeyPem);
        const aesKeyHex = jse.decrypt(msg.encryptedAESKey);

        // decrypt message payload
        const payloadObj = JSON.parse(msg.payload);
        const plain = await aesDecryptBase64WithKeyHex(payloadObj, aesKeyHex);
        setPlaintext(plain);
      } catch(e) {
        setPlaintext('Error decrypting');
      }
    }
    decrypt();
  }, [msg]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow max-w-lg w-full relative">
            
            <button 
                onClick={onClose} 
                className="absolute top-2 right-2 text-red-500 font-bold"
            >
                X
            </button>
            
            <h3 className="text-xl font-bold mb-4">
                Message from {msg.sender.name}
            </h3>
            
            <div className="bg-gray-100 p-4 rounded max-h-80 overflow-auto">
                
                {/* Always show the decrypted message text (plaintext) */}
                <p className="mb-2 whitespace-pre-wrap">
                    {plaintext}
                </p>

                {/* Only show the download link if msg.file exists and has an original name */}
                {msg.file && msg.file.originalname && (
                    <div className="mt-4 border-t pt-2">
                        <p className="font-semibold text-sm mb-1">
                            Attached File:
                        </p>
                        
                        <a 
                            // This links directly to your secure backend route
                            href={`/api/messages/download/${msg._id}`} 
                            download={msg.file.originalname} 
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {/* Replace "fas fa-file-download mr-2" if you are not using Font Awesome */}
                            <i className="fas fa-file-download mr-2"></i> 
                            Download: {msg.file.originalname} ({Math.round(msg.file.size / 1024)} KB)
                        </a>
                    </div>
                )}
            </div>
        </div>
    </div>
);}