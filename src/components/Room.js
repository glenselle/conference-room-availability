import React from "react";
import { css } from "emotion";

import useRoomStatus from "../hooks/useRoomStatus";

function Room({ id, name, capacity }) {
  const { hasFetchedOnce, events } = useRoomStatus(id);

  const [nextEvent] = events;
  const status = getAvailability(nextEvent);

  let backgroundColor = "#eee";
  if (hasFetchedOnce) {
    backgroundColor = status.isAvailable ? "LightGreen" : "LightPink";
  }

  return (
    <div
      className={css`
        background: ${backgroundColor};
        margin-bottom: 0.25rem;
        padding: 0.5rem;
      `}
    >
      <div
        className={css`
          font-weight: bold;
          text-transform: uppercase;
        `}
      >
        {name} ({capacity})
      </div>
      <div>{status.message}</div>
    </div>
  );
}

export default Room;

function getAvailability(nextEvent) {
  let availabilityMessage = "Available forever.";
  let isAvailable = true;
  if (nextEvent) {
    const start = new Date(nextEvent.start);
    const now = new Date();
    isAvailable = now < start;

    if (isAvailable) {
      const meetingIsTomorrow = start.getDay() > now.getDay();
      if (meetingIsTomorrow) {
        availabilityMessage = "Available";
      } else {
        const msAvailable = start - now;
        const secsAvailable = msAvailable / 1000;
        const minsAvailable = secsAvailable / 60;
        if (minsAvailable < 60) {
          availabilityMessage = `Available for ${Math.floor(
            minsAvailable
          )} minutes.`;
        } else {
          const hour = start.getHours() % 12;
          const isAM = start.getHours() < 12;
          const minutes = ("0" + start.getMinutes()).slice(-2);
          availabilityMessage = `Available until ${hour}:${minutes}${
            isAM ? "AM" : "PM"
          }.`;
        }
      }
    } else {
      availabilityMessage = `Unavailable`;
    }
  }
  return { message: availabilityMessage, isAvailable };
}
