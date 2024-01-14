import React from 'react';
import { GuestRequest } from '../concierge';

type RequestCardProps = {
    className?: string;
    request: GuestRequest;
    onAccept?: () => void;
    onReject?: () => void;
};

const RequestCard: React.FC<RequestCardProps> = (props) => {
    const classNames = props.className ? props.className : '';

    return (
        <div className={`request-card shadow p-3 ${classNames}`}>
            <div className="row">
                <div className="col col-3 request-profile-pic-container">
                    <img
                        // src="./assets/characters/placeholder.png"
                        src="https://placehold.co/256"
                        alt="guest profile pic"
                        className="w-100"
                    ></img>
                </div>
                <div className="col request-text-container">
                    <div className="request-guest">
                        <h3>
                            <span onClick={() => console.log('clicked name')}>
                                {props.request.Guest.Name}
                            </span>{' '}
                            ({props.request.RequestType})
                        </h3>
                    </div>
                    <div>
                        <p>{props.request.RequestText}</p>
                    </div>

                    <hr></hr>
                    <div className="w-100 d-flex justify-content-between">
                        <button className="btn btn-success">
                            {props.request.AcceptText}
                        </button>
                        <button className="btn btn-danger">
                            {props.request.DeclineText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestCard;
