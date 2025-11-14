import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Mock data
const mockRoutes = [
  {
    id: 1,
    name: 'RAMAN ROUTE 1',
    startDate: '20/11 - 07:00',
    endDate: '20/11 - 09:25',
    driver: 'Unassig...',
    vehicle: 'Unassig...',
    status: 'unassigned',
    drops: 1,
    distance: 124,
    duration: '2:25',
    coordinates: [[51.5074, -0.1278], [51.5174, -0.1378], [51.5274, -0.1478]]
  },
  {
    id: 2,
    name: 'Route',
    startDate: '17/11 - 07:00',
    endDate: '17/11 - 19:05',
    driver: 'Unassig...',
    vehicle: 'Unassig...',
    status: 'unassigned',
    drops: 8,
    distance: 519,
    duration: '12:05',
    coordinates: [[53.4808, -2.2426], [53.5808, -2.3426], [53.6808, -2.4426]]
  },
  {
    id: 3,
    name: 'Route 1',
    startDate: '17/11 - 07:00',
    endDate: '17/11 - 18:31',
    driver: 'Unassig...',
    vehicle: 'Unassig...',
    status: 'unassigned',
    drops: 14,
    distance: 334,
    duration: '11:31',
    coordinates: [[51.4545, -2.5879], [51.5545, -2.6879], [51.6545, -2.7879]]
  },
  {
    id: 4,
    name: 'Route 4',
    startDate: '17/11 - 07:00',
    endDate: '17/11 - 18:58',
    driver: 'Unassig...',
    vehicle: 'Unassig...',
    status: 'unassigned',
    drops: 13,
    distance: 351,
    duration: '11:58',
    coordinates: [[52.4862, -1.8904], [52.5862, -1.9904], [52.6862, -2.0904]]
  },
  {
    id: 5,
    name: 'Route 5',
    startDate: '17/11 - 07:00',
    endDate: '17/11 - 16:54',
    driver: 'Unassig...',
    vehicle: 'Unassig...',
    status: 'unassigned',
    drops: 11,
    distance: 353,
    duration: '9:54',
    coordinates: [[53.8008, -1.5491], [53.9008, -1.6491], [54.0008, -1.7491]]
  },
  {
    id: 6,
    name: 'Route 6',
    startDate: '17/11 - 07:00',
    endDate: '18/11 - 00:10',
    driver: 'Unassig...',
    vehicle: 'Unassig...',
    status: 'unassigned',
    drops: 12,
    distance: 706,
    duration: '17:10',
    coordinates: [[55.9533, -3.1883], [56.0533, -3.2883], [56.1533, -3.3883]]
  }
];

const mockUnplannedLocations = [
  { id: 1, location: 'PE15 9HB', name: 'Debbie Morton', order: 'VDM3102', service: 'Standard', liveDate: '25/11/2024' },
  { id: 2, location: 'PR9 7ET', name: 'Jean Watson', order: 'VDI54071', service: 'Standard', liveDate: '29/11/2024' },
  { id: 3, location: 'TS6 0EU', name: 'Irene Green', order: 'VDI56621', service: 'Standard', liveDate: '13/12/2024' }
];

function App() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showUnplanned, setShowUnplanned] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoutes = mockRoutes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold">Stream</span>
          </div>
          <h1 className="text-xl text-gray-700 ml-8">Advanced Planning</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="px-3 py-1.5 hover:bg-gray-100 rounded border border-gray-300 text-sm">
            Menu ▼
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Routes */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col min-h-0">
          {/* Routes Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">
                <span className="font-semibold">Runs (14/11/25 - 21/11/25)</span>
                <div className="text-gray-600 mt-1">
                  <span>Runs: 30</span>
                  <span className="ml-4">Distance: 14979</span>
                </div>
                <div className="text-gray-600">
                  <span>Duration: 344:25 (418:55)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Active"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm w-40"
                />
                <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Search
                </button>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Create
                </button>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Actions ▼
                </button>
              </div>
            </div>
          </div>

          {/* Routes Table - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Run</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Start ↓</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Driver</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Vehicle</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
                      <span className="w-4 h-4 bg-orange-500 rounded-sm"></span>
                      <span className="w-4 h-4 bg-gray-400 rounded-sm"></span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700 whitespace-nowrap">Drops</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700 whitespace-nowrap">Dist</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700 whitespace-nowrap">Dur</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700 whitespace-nowrap">Last</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route, index) => (
                  <tr
                    key={route.id}
                    className={`border-b border-gray-200 cursor-pointer hover:bg-blue-50 ${
                      selectedRoute?.id === route.id ? 'bg-blue-100' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gray-200 rounded border border-gray-300 flex-shrink-0">
                          <svg className="w-full h-full text-gray-400 p-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium whitespace-nowrap">{route.name}</div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">{route.endDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">{route.startDate}</td>
                    <td className="px-3 py-3 text-red-600 whitespace-nowrap">{route.driver}</td>
                    <td className="px-3 py-3 text-red-600 whitespace-nowrap">{route.vehicle}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <input type="radio" name={`route-${route.id}`} className="w-4 h-4" defaultChecked />
                        <input type="radio" name={`route-${route.id}`} className="w-4 h-4" />
                        <input type="radio" name={`route-${route.id}`} className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">{route.drops}</td>
                    <td className="px-3 py-3 text-center">{route.distance}</td>
                    <td className="px-3 py-3 text-center">{route.duration}</td>
                    <td className="px-3 py-3 text-center"></td>
                    <td className="px-3 py-3 text-center"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Unplanned Section */}
          <div className="border-t border-gray-200 flex-shrink-0">
            <div
              className="bg-gray-50 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100"
              onClick={() => setShowUnplanned(!showUnplanned)}
            >
              <div className="font-semibold text-sm">
                Unplanned
                <span className="ml-2 text-gray-600">1 / 122 Selected</span>
              </div>
              <span className="text-gray-600">{showUnplanned ? '▼' : '▶'}</span>
            </div>
            {showUnplanned && (
              <div className="max-h-48 overflow-auto bg-white">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="font-medium">Show Unplanned?</span>
                  </label>
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">Method:</span>
                    <div className="ml-4">V1 Distribution Vehicles</div>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Location</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Serv. Lvl</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Live Date</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUnplannedLocations.map((location, index) => (
                      <tr
                        key={location.id}
                        className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📍</span>
                            {location.location}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">👤</span>
                            {location.name}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⚙️</span>
                            <span className="text-orange-600">{location.order}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">{location.service}</td>
                        <td className="px-3 py-2">{location.liveDate}</td>
                        <td className="px-3 py-2"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-1/2 relative">
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded shadow-md">
            <button className="p-2 hover:bg-gray-100 border-b border-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <MapContainer
            center={[53.5, -2.0]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mockRoutes.map((route) => (
              <React.Fragment key={route.id}>
                <Polyline
                  positions={route.coordinates}
                  color={selectedRoute?.id === route.id ? '#3b82f6' : '#10b981'}
                  weight={3}
                  opacity={0.7}
                />
                {route.coordinates.map((coord, idx) => (
                  <Marker key={`${route.id}-${idx}`} position={coord}>
                    <Popup>
                      <div className="text-sm">
                        <div className="font-semibold">{route.name}</div>
                        <div>Stop {idx + 1}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </React.Fragment>
            ))}
          </MapContainer>

          {/* Selected Run Panel */}
          {selectedRoute && (
            <div className="absolute bottom-4 right-4 bg-white rounded shadow-lg p-4 w-96 z-[1000] max-h-80 overflow-auto">
              <h3 className="font-semibold mb-3">Selected Run</h3>
              <div className="flex gap-2 mb-3">
                <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Search
                </button>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Load
                </button>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Actions ▼
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1 text-left text-xs">ETA / ETD</th>
                    <th className="px-2 py-1 text-left text-xs">Slot</th>
                    <th className="px-2 py-1 text-left text-xs">Location</th>
                    <th className="px-2 py-1 text-left text-xs">Name</th>
                    <th className="px-2 py-1 text-left text-xs">Order</th>
                    <th className="px-2 py-1 text-left text-xs">Weight</th>
                    <th className="px-2 py-1 text-left text-xs">Total Wgt</th>
                    <th className="px-2 py-1 text-left text-xs">On Site</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-2 py-2">
                      <span className="text-lg">📍</span>
                    </td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2">WS8 6JP</td>
                    <td className="px-2 py-2">Start</td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2"></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-2 py-2">
                      <span className="text-lg">📍</span>
                    </td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2">WS8 6JP</td>
                    <td className="px-2 py-2">End</td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2"></td>
                    <td className="px-2 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
