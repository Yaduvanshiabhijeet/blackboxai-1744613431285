import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Dashboard = () => {
    const [whatsappStatus, setWhatsappStatus] = useState('Active');
    const [wifiStatus, setWifiStatus] = useState('Connected to: Home_WiFi (5GHz)');
    const [targetInfo, setTargetInfo] = useState({
        mobileNumber: '',
        snapchatId: '',
        instagramId: '',
        whatsappNumber: ''
    });
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
    const [truecallerStatus, setTruecallerStatus] = useState('Enter details to search');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTargetInfo({ ...targetInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call and update status
        setTruecallerStatus('Verified: ' + targetInfo.mobileNumber);
        // Update map to random location for demo
        setMapCenter([
            51.505 + (Math.random() - 0.5) * 0.1,
            -0.09 + (Math.random() - 0.5) * 0.1
        ]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Target Person Information Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Target Person Information</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Mobile Number</label>
                        <input 
                            type="tel" 
                            name="mobileNumber" 
                            value={targetInfo.mobileNumber} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 border rounded-md" 
                            placeholder="+91 XXXXXXXXXX" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Snapchat ID</label>
                        <input 
                            type="text" 
                            name="snapchatId" 
                            value={targetInfo.snapchatId} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 border rounded-md" 
                            placeholder="username" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Instagram ID</label>
                        <input 
                            type="text" 
                            name="instagramId" 
                            value={targetInfo.instagramId} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 border rounded-md" 
                            placeholder="username" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">WhatsApp Number</label>
                        <input 
                            type="tel" 
                            name="whatsappNumber" 
                            value={targetInfo.whatsappNumber} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 border rounded-md" 
                            placeholder="+91 XXXXXXXXXX" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button 
                            type="submit" 
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            <i className="fas fa-search mr-2"></i>Search Information
                        </button>
                    </div>
                </form>
            </div>

            {/* My Information Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">My Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                            <i className="fab fa-snapchat text-yellow-500 text-xl"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold">Snapchat</h3>
                            <p className="text-gray-600">my_snap_id</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                            <i className="fab fa-instagram text-pink-500 text-xl"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold">Instagram</h3>
                            <p className="text-gray-600">my_insta_id</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <i className="fab fa-whatsapp text-green-500 text-xl"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold">WhatsApp</h3>
                            <p className="text-gray-600">+91 XXXXXXXXXX</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Status Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Connection Status</h2>
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <i className="fab fa-whatsapp text-green-500 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="font-semibold">WhatsApp Status</h3>
                        <p className="text-gray-600">
                            {whatsappStatus} 
                            <span className={`w-3 h-3 rounded-full ${whatsappStatus === 'Active' ? 'bg-green-500' : 'bg-red-500'} inline-block ml-2`}></span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <i className="fas fa-wifi text-blue-500 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="font-semibold">Wi-Fi Connection</h3>
                        <p className="text-gray-600">{wifiStatus}</p>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Information Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <i className="fas fa-phone text-blue-500 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-semibold">Truecaller Status</h3>
                        </div>
                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${truecallerStatus.startsWith('Verified') ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                            <p>{truecallerStatus}</p>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                <i className="fab fa-snapchat text-yellow-500 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-semibold">Snapchat Location</h3>
                        </div>
                        <div className="h-64 rounded-md overflow-hidden">
                            <MapContainer 
                                center={mapCenter} 
                                zoom={13} 
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={mapCenter}>
                                    <Popup>Last known location</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
