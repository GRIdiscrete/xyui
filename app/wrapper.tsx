'use client';



import { LoadScript } from '@react-google-maps/api';
import GoogleMap from './page'; // Import your server component

const GoogleMapWrapper = () => {


  const user = sessionStorage.getItem('user');
  if (!user) {
    console.log("asfsfasfasfasfasf")
  }
  return <>
  <LoadScript googleMapsApiKey='AIzaSyDpli1UvuqODlCd-NBLs0hw-4G9a6kbzHo'>
  <GoogleMap /></LoadScript>
  </>;
};

export default GoogleMapWrapper;