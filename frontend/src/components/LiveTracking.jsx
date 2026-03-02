import React, { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Use the token directly from environment
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

mapboxgl.accessToken = MAPBOX_TOKEN

const LiveTracking = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)
  const [error, setError] = useState(null)

  const defaultCenter = {
    lat: -3.745,
    lng: -38.523
  }

  useEffect(() => {
    if (map.current) return // initialize map only once

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [defaultCenter.lng, defaultCenter.lat],
        zoom: 15,
        accessToken: MAPBOX_TOKEN
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Initialize marker
      marker.current = new mapboxgl.Marker({
        color: '#000',
        scale: 1.2
      })
        .setLngLat([defaultCenter.lng, defaultCenter.lat])
        .addTo(map.current)

    } catch (err) {
      console.error('Error initializing map:', err)
      setError(err.message)
    }

  }, [])

  useEffect(() => {
    if (!map.current) return

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log('Position updated:', latitude, longitude)

        if (marker.current) {
          marker.current.setLngLat([longitude, latitude])
        }

        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            essential: true
          })
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    // Watch position
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        if (marker.current) {
          marker.current.setLngLat([longitude, latitude])
        }
      },
      (err) => {
        console.error('Watch position error:', err)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-500 font-semibold">Error loading map</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={mapContainer} className="w-full h-full" />
  )
}

export default LiveTracking
