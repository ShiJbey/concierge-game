import React from 'react';
import HotelStatusInfo from './HotelStatusInfo';
import RequestCard from './RequestCard';
import { CheckInRequest, ConciergeGame, Guest } from '../concierge';
import GuestInfoCard from './GuestInfoCard';

type ConciergeDashboardProps = {
    game: ConciergeGame;
};

const ConciergeDashboard: React.FC<ConciergeDashboardProps> = (props) => {
    const requests = props.game.GetRequests();

    return (
        <div className="dashboard w-100 row">
            <div className="col col-3 p-4 dashboard-nav">
                <HotelStatusInfo
                    className="mb-3 w-100"
                    hotelName="La'Milton"
                    day={20}
                    reputation={57}
                    maxReputation={100}
                    basicRooms={10}
                    maxBasicRooms={20}
                    plusRooms={8}
                    maxPlusRooms={12}
                    deluxeRooms={4}
                    maxDeluxeRooms={6}
                    onButtonPress={() => {}}
                />
                <div>
                    <button
                        type="button"
                        className="btn btn-primary mb-3 w-100"
                        onClick={() => console.log('Showing reservations')}
                    >
                        See Reservations
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary mb-3 w-100"
                        onClick={() => console.log('Showing current guests')}
                    >
                        See Current Guests
                    </button>
                </div>
            </div>
            <div className="col col-9 dashboard-feed">
                <GuestInfoCard
                    guest={props.game.GetGuest(0)}
                    className="mb-3"
                />
                {requests.map((r, i) => (
                    <RequestCard request={r} key={i} className="mb-3" />
                ))}
            </div>
        </div>
    );
};

export default ConciergeDashboard;
