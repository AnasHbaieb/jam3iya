
"use client";

import React from 'react';

const MapComponent = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.27083049071!2d10.7770373!3d34.7914267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1301d300744e12bb%3A0x782158b01e4dbcec!2z2KzYsdmG2Yog2KfZhNiy2YjYp9iz2K0g2KfZhNi02YjYt9mB2YbYqg!5e0!3m2!1sar!2stn!4v1719946462719!5m2!1sar!2stn"
      width="250"
      height="150"
      style={{ border: 0 }}
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade">
    </iframe>
  );
};

export default MapComponent;

