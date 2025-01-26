import "./App.css";


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Main = () => {
  
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 const twoCalls = (e) => {
  console.log(e)
  updateSearchParamInURL(e)
    setSearchQuery(e)
    console.log(e,e.length)
    
    if(e.length===0){
      fetchTripsall()
    }
    if(e.length>2){
      fetchTrips(e)
    }
   
  }

  const fetchTripsall = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/trips', {
      
      });
      console.log(response.data)
      setTrips(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load data');
      setLoading(false);
    }
  };
  
  const fetchTrips = async (e) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/trips', {
        params: { keyword: e }
      });
      console.log(response.data)
      setTrips(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    
    
    try{
      
      const urlParams = new URLSearchParams(window.location.search);
      const search = urlParams.get('search'); // Get the "search" query parameter
      setSearchQuery(search)
        if(search.length>0){
          fetchTrips(search)
        }
        else{
          fetchTripsall();
        }
      
      
    } catch(error){
      fetchTripsall();
    }
    
    // if (searchQuery) {
    //   setSearchTerm(searchQuery); // Set the search term from the URL query parameter
    //   fetchData(searchQuery); // Fetch data based on the search term
    // }

   
  }, []);

  const updateSearchParamInURL = (term) => {
    // Using URLSearchParams to manipulate the query string
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('search', term);  // Set the 'search' parameter
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    
    // Update the browser URL without reloading the page
    window.history.pushState({}, '', newUrl);  // Add the new search parameter to the URL

    // console.log('Updated URL:', newUrl); // For debugging
  };

  return (
    <main className=" w-full   grid justify-center mx-auto ">
       
   <div className="container mx-auto  px-2 py-2">
      <div className=" justify-center  p-9 text-center text-lg">
      <p className="title text-center text-4xl font-semibold  text-bold">เที่ยวไหนดี</p>
    <input type="search" 
    className="hover:outline-none focus:outline-none placeholder-gray-500 placeholder-opacity-50 placeholder: text-center border-b-2 w-full border-gray-200 py-3 px-7 focus:border-blue-300 focus:outline-hidden" 
    placeholder="หาที่เที่ยวแล้วไปกัน..." 
        value={searchQuery}
        onChange={(e) => twoCalls(e.target.value)}
    />
       </div>
       {!loading && !error && trips.length > 0 && (
       <div>
 {!trips ? "No data received" : trips.map( data => (
         
      
    
      
         <div class="mt-5 max-w-4xl mx-auto  rounded-lg  overflow-hidden">
      <div class="md:flex">
       <div class="md:flex-shrink-0 p-4">
        <img src={data.photos[0]} alt="" class="  object-cover w-full  h-full   rounded-2xl md:w-48" height="300"  width="400"/>
       </div>
       <div class=" p-4">
        <div class="  text-lg  tracking-wide  text-black-500 font-semibold">
        <a class=" ml-1" href={data.url} target="_blank">
        {data.title}
         </a>
        </div>
        <p class="mt-2 text-gray-500 ">
        {data.description}
         <a class="text-blue-500 ml-1" href={data.url} target="_blank">
          อ่านต่อ
         </a>
         
        </p>
        <div class="mt-4 text-gray-500">
         <span className=" text-gray-300  text-sm font-semibold ">หมวด : &nbsp;&nbsp;&nbsp;</span> 
        {data.tags.map((tag, tagIndex) => (
                   <span class="text-gray-400  text-lg mr-2 underline" key={tagIndex}><a  className=" hover: cursor-pointer" onClick={(e) => twoCalls(tag)} >{tag}</a></span>
                 ))}
         {/* <span class="mr-2">
          เกาะ
         </span> */}
      
        </div>
        <div class="mt-4 flex space-x-4  visble   ">
        {data.photos.slice(1).map((photo, photoIndex) => (
                    <img alt={`Travel Image ${photoIndex + 1}`}  src={photo} class="w-25 h-40  object-cover rounded-3xl" height="11"  width="150"/>
                 ))}
        
         
        </div>
      
       </div>
      </div>
     </div>
     ))}

       </div>
       
       )}
      


    </div>



          </main>
  );
}

export default Main;
