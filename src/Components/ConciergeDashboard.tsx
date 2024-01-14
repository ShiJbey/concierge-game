import React, { useState, useReducer } from 'react';
import HotelStatusInfo from './HotelStatusInfo';
import RequestCard from './RequestCard';
import {
    CheckInRequest,
    ConciergeGame,
    Guest,
    RoomQualityLevel,
} from '../concierge';
import GuestInfoCard from './GuestInfoCard';
import { Modal } from 'react-bootstrap';

type ConciergeDashboardProps = {
    game: ConciergeGame;
};

const ConciergeDashboard: React.FC<ConciergeDashboardProps> = (props) => {
    const requests = props.game.GetRequests();

    const [guestProfileUID, setGuestProfileUID] = useState(-1);
    const [showGuestProfile, setShowGuestProfile] = useState(false);
    const handleCloseGuestProfile = () => setShowGuestProfile(false);

    const handleShowGuestProfile = (uid: number) => {
        setGuestProfileUID(uid);
        setShowGuestProfile(true);
    };

    const [showReservations, setShowReservations] = useState(false);
    const handleCloseReservations = () => setShowReservations(false);
    const handleShowReservations = () => setShowReservations(true);

    const [showGuests, setShowGuests] = useState(false);
    const handleCloseGuests = () => setShowGuests(false);
    const handleShowGuests = () => setShowGuests(true);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const handleChoiceMade = (choiceIndex: number) => {
        props.game.RemoveRequest(choiceIndex);

        if (props.game.GetRequests().length === 0) {
            props.game.Tick();
        }

        forceUpdate();
    };

    const handleSkipDay = () => {
        props.game.Tick();
        forceUpdate();
    };

    return (
        <div>
            <div className="dashboard w-100 row">
                <div className="col col-3 p-4 dashboard-nav">
                    <HotelStatusInfo
                        className="mb-3 w-100"
                        hotelName={props.game.Hotel.Name}
                        day={props.game.CurrentDay}
                        reputation={props.game.Hotel.Reputation}
                        maxReputation={100}
                        basicRooms={
                            props.game.Hotel.GetVacantRoomsOfQuality(
                                RoomQualityLevel.BASIC
                            ).length
                        }
                        maxBasicRooms={
                            props.game.Hotel.GetRoomsOfQuality(
                                RoomQualityLevel.BASIC
                            ).length
                        }
                        plusRooms={
                            props.game.Hotel.GetVacantRoomsOfQuality(
                                RoomQualityLevel.PLUS
                            ).length
                        }
                        maxPlusRooms={
                            props.game.Hotel.GetRoomsOfQuality(
                                RoomQualityLevel.PLUS
                            ).length
                        }
                        deluxeRooms={
                            props.game.Hotel.GetVacantRoomsOfQuality(
                                RoomQualityLevel.DELUXE
                            ).length
                        }
                        maxDeluxeRooms={
                            props.game.Hotel.GetRoomsOfQuality(
                                RoomQualityLevel.DELUXE
                            ).length
                        }
                    />
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary mb-3 w-100"
                            onClick={() => handleShowReservations()}
                        >
                            See Reservations
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary mb-3 w-100"
                            onClick={() => handleShowGuests()}
                        >
                            See Current Guests
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary mb-3 w-100"
                            onClick={() => handleSkipDay()}
                        >
                            Skip to next day
                        </button>
                    </div>
                </div>
                <div className="col col-9 dashboard-feed">
                    {requests.map((r, i) => (
                        <RequestCard
                            request={r}
                            key={i}
                            onAccept={() => handleChoiceMade(i)}
                            onDecline={() => handleChoiceMade(i)}
                            onViewGuest={(uid) => handleShowGuestProfile(uid)}
                            className="mb-3"
                        />
                    ))}
                </div>
            </div>

            <Modal show={showReservations} onHide={handleCloseReservations}>
                <Modal.Header closeButton>
                    <Modal.Title>Reservations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.game.FutureReservations.map((r, i) => (
                        <GuestInfoCard guest={r.Guest} key={i} />
                    ))}
                </Modal.Body>
            </Modal>

            <Modal show={showGuests} onHide={handleCloseGuests}>
                <Modal.Header closeButton>
                    <Modal.Title>Current Guests</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.game.Hotel.CurrentGuests.map((g, i) => (
                        <GuestInfoCard guest={g} key={i} />
                    ))}
                </Modal.Body>
            </Modal>

            <Modal show={showGuestProfile} onHide={handleCloseGuestProfile}>
                <Modal.Header closeButton>
                    <Modal.Title>Guest Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {guestProfileUID !== -1 && (
                        <GuestInfoCard
                            guest={props.game.GetGuest(guestProfileUID)}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ConciergeDashboard;
