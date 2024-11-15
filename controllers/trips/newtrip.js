import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

const NewTrip = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    start: '',
    end: '',
    route: '',
    departure: '',
    price: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/trips', formData);
      alert('Viaje registrado exitosamente.');
      navigate('/main-menu');
    } catch (error) {
      console.error('Error al registrar el viaje:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error al registrar el viaje.');
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="container mx-auto p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Viaje</h2>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block mb-1">Punto de Inicio</label>
            <input
              type="text"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder="Ejemplo: Ciudad A"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Punto de Destino</label>
            <input
              type="text"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder="Ejemplo: Ciudad B"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Ruta</label>
            <input
              type="text"
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder="Ejemplo: Autopista, Calle 80, etc."
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Fecha y Hora de Salida</label>
            <input
              type="datetime-local" // Cambiado a datetime-local
              name="departure"
              value={formData.departure}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder="Ejemplo: 15.50"
            />
          </div>
          <div className="flex mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
            >
              Crear Viaje
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate('/main-menu')}
            >
              Volver al Menú Principal
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default NewTrip;
