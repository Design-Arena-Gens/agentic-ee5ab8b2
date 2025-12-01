'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppState } from '@/lib/state';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

// Fix default icon paths in Next
function ensureLeafletIcons() {
  // tiny blue marker data URI to avoid external assets
  const iconUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAB0L0zTAAAACXBIWXMAAAsSAAALEgHS3X78AAAByUlEQVRIib2Vv0tVURzHP/eY0pYkY2bD0qC1gNQ0oVAoQqJQh9bGkqJg4gKX8H0gJ8QGg0kK0iJpZQ2k3Wg2dFq4c1w0h5q9Z6f2z1fP85v3k8f0pIS3w3z3fN+z7+6wK7yTgCk4zq1Wq2t2h9VYcY0m9v7M2m0aH0zv3YF2g0Eo3m8Hh0uUO5fC8ZC0Qp2m3R2m81mC0YhJm7J4dDg8H9D3kCwWg0Qkq2wCwqQeVZVZbDb7PJZlq3a7bI0QjZDL5fL4fD4WQWw2m0p9N0p8rLy+3b7d9Xq9JElKqfQ2WwYhGJ4PB6/X6/X0dFRYWCgSCQSoVCr6+vGxkZkSWZbDb7bFYrFYDAZnUqlULpfD7/d7S0tJ8Ph8KhcJISEhLpdLpdBqtZrFYrEwmEwmEwmM5/Pw8HBQXq9nkqlUpychJpMpn8/n8VqtFVVVfHx8cBzHkUiEYmEolEomEwmUzqd3W43m82mQSaTSVVVVKpUKhUKiUSiYmJgY7Ozt4PB6CwWCYmJiQJEnGxsYoFArv93s7O0uWZb/fb7vd7jUYj8fHxwJAkfH19YW1tDWq1GlVVVY7ncygUCnQ6Hf7+/pgsFqZp2traQpIkKpUKAoEAn8+n1WrFfD6fJEmS+Pj4gF6vR6/XI0mS0Wg0r9er9fX1gW63w+FwaGhoMDY2BqFQiF6vJ5lM5mtra1gMBh4PB7S0tLA6/WG0Wg0QpIkfX19kMlkpKWlkSQJmUyGqqqq8Pl8cDgcZrNZ4uLi8Pv9kMlkEh8fH8zMzOByuQyGQx+Px8PDw9bW1rC8vIxKpcLExESYTCbW1tYgSRJVVVX8fj+RyeT4fD6ioqJgNBrQ6/VgMBg4nU6Xy2Ww2+2w2G0qlUo+E8h2i3iH9k9+N3s2k3UAAAAAElFTkSuQmCC';
  const iconRetinaUrl = iconUrl;
  const shadowUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAWCAYAAADafVyIAAAACXBIWXMAAAsSAAALEgHS3X78AAABQElEQVQ4y+2UTU7CUBSGP6Zl2gk6QzJ0m0Z2A9yA4Qk1jGQ5hYcE1oGk7k2gLwJ8VEhGgmK0kKpQfH0tEw5dU1s4K0Gf1Gzq8y9v7v3zv9bq9i4IFC3gkQ6iD3Qv5kO0bJ0fWQp4nQxR9i7QMS2iI0e0Qm8z3zQq8y1n/0xq1mDqJQq0Bf7zqk0mQ6r0JQkVqGkCzL0Sg0d4LxZ5mGkHqK7f3e1E0qlkqYp6XJZp7m8nJ0eB0Qb2traCq6sLk8nh8AnJyc8qJQK2tra8nq9WFtbI0dHR6/X6LwYh0N/fD3q9XoVCIYDAY9PT2wWCymp6eBQKBbW1uEw2F/fz94PB6UlZXR6XSi1WqR/8Jz3i8U4gKq8w0nJ0zqYd3b9cK9g9jQ3QfF8mWQkUj4H6m8Jm0q6wK0Hq8m8D7p7j2uKJ3o6f5k8G9c2XQG1LQhRkQzv0t4eGgjwO3n+oU3N3H9mHjQ0sPLK3pja7F3b9T9P0F7k7gZ9Fz3H6j4y9k9x3P9k0k6k7Qm3wJzXyY0o2u1Hq8AAAAASUVORK5CYII=';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (L.Icon.Default as any).mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
  });
}

export default function DriversMap() {
  const { drivers } = useAppState();
  useEffect(() => {
    ensureLeafletIcons();
  }, []);
  const center = drivers[0]?.location ?? { lat: 16.8409, lng: 96.1735 };
  return (
    <div className="mapContainer">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {drivers
          .filter((d) => d.active)
          .map((d) => (
            <Marker key={d.id} position={[d.location.lat, d.location.lng]}>
              <Popup>
                <div>
                  <strong>{d.name}</strong>
                  <div className="muted">{d.phone}</div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

