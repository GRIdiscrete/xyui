'use client';

import GoogleMap from './page'; // Import your server component

const GoogleMapWrapper = () => {


  const user = sessionStorage.getItem('user');
  if (!user) {
    console.log("asfsfasfasfasfasf")
  }
  return <>

  <GoogleMap />
  </>;
};

export default GoogleMapWrapper;