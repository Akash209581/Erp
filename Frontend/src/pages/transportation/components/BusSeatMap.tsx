import React from 'react';
import '../styles/BusSeatMap.css';

interface Seat {
  seatNumber: number;
  category: 'staff' | 'girl' | 'boy';
  isOccupied: boolean;
  occupantName?: string;
}

interface BusSeatMapProps {
  capacity: number;
  staffSeats: number;
  girlSeats: number;
  boySeats: number;
  allocations: any[]; // List of allocations from backend
  seatingType?: '2+2' | '2+3';
}

const BusSeatMap: React.FC<BusSeatMapProps> = ({
  capacity,
  staffSeats,
  girlSeats,
  boySeats,
  allocations,
  seatingType = '2+2'
}) => {
  const seats: Seat[] = [];

  for (let i = 1; i <= capacity; i++) {
    let category: 'staff' | 'girl' | 'boy' = 'boy';
    if (i <= staffSeats) {
      category = 'staff';
    } else if (i <= staffSeats + girlSeats) {
      category = 'girl';
    } else {
      category = 'boy';
    }

    const allocation = allocations.find(a => a.seat_number === i);
    const rider = allocation?.rider;
    const occupantLabel = rider?.name || allocation?.user_id || 'Occupied';
    const riderDetails = rider
      ? ` - ${rider.person_id || allocation.user_id} ${rider.branch ? '(' + rider.branch + ')' : ''}`
      : '';
    seats.push({
      seatNumber: i,
      category,
      isOccupied: !!allocation,
      occupantName: allocation ? `${occupantLabel}${riderDetails}` : undefined
    });
  }

  // Group seats into rows based on seating type
  const rows = [];
  const seatsPerRow = seatingType === '2+3' ? 5 : 4;
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  return (
    <div className="bus-seat-map">
      <div className="bus-front">
        <div className="entrance">🚪</div>
        <div className="steering-wheel">🎡</div>
      </div>
      <div className="seats-container">
        {rows.map((row, rowIndex) => {
          const leftCount = seatingType === '2+3' ? 2 : 2;
          const rightCount = seatingType === '2+3' ? 3 : 2;
          const leftSeats = row.slice(0, leftCount);
          const rightSeats = row.slice(leftCount, leftCount + rightCount);

          return (
            <div key={rowIndex} className="seat-row">
              <div className="seat-pair left">
                {leftSeats.map((seat) => (
                  <div
                    key={`left-${seat.seatNumber}`}
                    className={`seat ${seat.category} ${seat.isOccupied ? 'occupied' : 'empty'}`}
                    title={`${seat.category.toUpperCase()} Seat ${seat.seatNumber} ${seat.occupantName ? '- ' + seat.occupantName : ''}`}
                  >
                    {seat.seatNumber}
                  </div>
                ))}
              </div>
              <div className="bus-aisle"></div>
              <div className="seat-pair right">
                {rightSeats.map((seat) => (
                  <div
                    key={`right-${seat.seatNumber}`}
                    className={`seat ${seat.category} ${seat.isOccupied ? 'occupied' : 'empty'}`}
                    title={`${seat.category.toUpperCase()} Seat ${seat.seatNumber} ${seat.occupantName ? '- ' + seat.occupantName : ''}`}
                  >
                    {seat.seatNumber}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="map-legend">
        <div className="legend-item"><span className="legend-color staff"></span> Staff</div>
        <div className="legend-item"><span className="legend-color girl"></span> Girls</div>
        <div className="legend-item"><span className="legend-color boy"></span> Boys</div>
        <div className="legend-item"><span className="legend-color occupied"></span> Occupied</div>
      </div>
    </div>
  );
};

export default BusSeatMap;
