import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Pagination, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import ReservationForm from './ReservationForm';

const ReservationList = ({ reservations, onUpdateReservation, updateReservations }) => {
    const [updatedReservation] = useState(null);
    const [reservationList, setReservationList] = useState(reservations);
    
    // Pagination Variables
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservationList.slice(indexOfFirstItem, indexOfLastItem);

    // Table Sorting Variables
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(reservationList.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        setReservationList(reservations);
    }, [reservations]);

    // Handles the delete function
    const handleDeleteReservation = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this reservation?');
        if (!confirmed) {
            return;
        }
    
        try {
            await axios.delete(`http://localhost:5000/reservations/${id}`);
            // Updates the reservations list after successful deletion
            setReservationList(prevReservations => prevReservations.filter(reservation => reservation.ID !== id));
            // Updates the reservation form in case of errors 
            updateReservations(prevReservations => prevReservations.filter(reservation => reservation.ID !== id));
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };
    
    // Handles the update function and passes the value back to the Reservation Form
    const handleUpdateReservation = (reservation) => {
        onUpdateReservation(reservation);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Handles the sorting of the table based on the table header
    const handleSort = (columnName) => {
        if (sortColumn === columnName) {
            setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(columnName);
            setSortDirection('asc');
        }
    };

    const sortedItems = currentItems.sort((a, b) => {
        const columnA = a[sortColumn];
        const columnB = b[sortColumn];
    
        if (columnA < columnB) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (columnA > columnB) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    
    return (
        <Container className="reservation-form">
            <h2 className="text-center">Reservations</h2>
            <Pagination>
                {pageNumbers.map((number) => (
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                        {number}
                    </Pagination.Item>
                ))}
            </Pagination>
            <div className="table-container">
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th onClick={() => handleSort('reservation_datetime')} className="sortable-header">Date and Time</th>
                    <th onClick={() => handleSort('reservation_first_name')} className="sortable-header">First Name</th>
                    <th onClick={() => handleSort('reservation_last_name')} className="sortable-header">Last Name</th>
                    <th onClick={() => handleSort('phone_number')} className="sortable-header">Phone Number</th>
                    <th onClick={() => handleSort('number_of_guests')} className="sortable-header">Number of Guests</th>
                    <th>Actions</th>
                </tr>
                </thead>
                {currentItems.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center">No records found</td>
                        </tr>
                    )}
                <tbody>
                    {/* Date/Time is formatted */}
                    {sortedItems.map((reservation) => {
                        const formattedDateTime = new Date(reservation.reservation_datetime).toLocaleString();
                        const reservationDate = new Date(reservation.reservation_datetime);
                        const currentDate = new Date();
                        const timeDifference = reservationDate - currentDate;
                        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
                        const isReservationDeletable = daysDifference >= 2;
                        const isReservationEditable = daysDifference >= 2;

                        return (
                            <tr key={reservation.ID}>
                                <td>{formattedDateTime}</td>
                                <td>{reservation.reservation_first_name}</td>
                                <td>{reservation.reservation_last_name}</td>
                                <td>{reservation.phone_number}</td>
                                <td>{reservation.number_of_guests}</td>
                                <td>
                                    <ButtonGroup className="btn-group">
                                    {isReservationEditable && (
                                        <Button onClick={() => handleUpdateReservation(reservation)} variant="primary" className="me-2">Update</Button>
                                    )}
                                    {isReservationDeletable && (
                                        <Button onClick={() => handleDeleteReservation(reservation.ID, reservation.reservation_datetime)} variant="danger">Delete</Button>
                                    )}
                                    {!isReservationDeletable && !isReservationEditable && (
                                        <span>No actions available</span>
                                    )}
                                    </ButtonGroup>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            </div>
            {updatedReservation && <ReservationForm onUpdate={onUpdateReservation} initialData={updatedReservation} />}
        </Container>
    );
};

export default ReservationList;