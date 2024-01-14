import React from 'react';
import { GuestRequest } from '../concierge';
import { Button } from 'react-bootstrap';

type RequestCardProps = {
    className?: string;
    request: GuestRequest;
    onAccept?: () => void;
    onDecline?: () => void;
    onViewGuest?: (uid: number) => void;
};

const RequestCard: React.FC<RequestCardProps> = (props) => {
    const classNames = props.className ? props.className : '';

    const HandleOnAccept = () => {
        props.request.Accept();
        if (props.onAccept) props.onAccept();
    };

    const HandleOnDecline = () => {
        props.request.Decline();
        if (props.onDecline) props.onDecline();
    };

    const HandleOnViewGuest = () => {
        if (props.onViewGuest) props.onViewGuest(props.request.Guest.UID);
    };

    return (
        <div className={`request-card shadow p-3 ${classNames}`}>
            <div className="row">
                <div className="col col-3 request-profile-pic-container align-center">
                    <img
                        // src="./assets/characters/placeholder.png"
                        src="https://placehold.co/256"
                        alt="guest profile pic"
                        className="w-100"
                    ></img>
                    <Button className="mt-2" onClick={HandleOnViewGuest}>
                        View Profile
                    </Button>
                </div>
                <div className="col request-text-container">
                    <div className="request-guest">
                        <h3>
                            {props.request.Guest.Name}(
                            {props.request.RequestType})
                        </h3>
                    </div>
                    <div>
                        <p>{props.request.RequestText}</p>
                    </div>

                    <hr></hr>
                    <div className="w-100 d-flex justify-content-between">
                        <button
                            className="btn btn-success"
                            disabled={!props.request.CanAccept()}
                            onClick={() => HandleOnAccept()}
                        >
                            {props.request.AcceptText}
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => HandleOnDecline()}
                        >
                            {props.request.DeclineText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestCard;
