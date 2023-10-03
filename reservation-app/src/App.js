import React, { useState, useEffect } from 'react';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css'; 

const App = () => {
    const [reservations, setReservations] = useState([]);
    const [updatedReservation, setUpdatedReservation] = useState(null);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const createReservation = async (reservationData) => {
        try {
            await axios.post('http://localhost:5000/reservations', reservationData);
            console.log('Reservation created successfully');
            fetchReservations();
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    };

    const updateReservation = async (reservationData) => {
        try {
            if (updatedReservation) {
                await axios.put(`http://localhost:5000/reservations/${updatedReservation.ID}`, reservationData);
                console.log('Reservation updated successfully');
                fetchReservations(); 
                setUpdatedReservation(null); 
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };
    const updateReservations = (updatedReservations) => {
        setReservations(updatedReservations);
    };
    return (
        <div className="container mt-3 mb-3">
            <ReservationForm reservations={reservations} onCreateReservation={createReservation} onUpdate={updateReservation} initialData={updatedReservation}  className="reservation-form-background"/>
            <ReservationList reservations={reservations} onUpdateReservation={setUpdatedReservation} updateReservations={updateReservations}/>
        </div>
    );
};

export default App;