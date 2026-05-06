export interface Hall {
  id: number;
  name: string;
  capacity: number;
  price_per_day: number;
  description: string;
  image_url: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price_per_person: number;
  category: string;
}

export interface Booking {
  id?: number;
  hall_id: number;
  user_id: number;
  booking_date: string;
  status?: string;
  menu_items?: number[];
  guest_count: number;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
}

const API_URL = '/api';

export const api = {
  getHalls: async (): Promise<Hall[]> => {
    const res = await fetch(`${API_URL}/halls`);
    return res.json();
  },
  getMenuItems: async (): Promise<MenuItem[]> => {
    const res = await fetch(`${API_URL}/menu-items`);
    return res.json();
  },
  checkAvailability: async (hallId: number, date: string): Promise<boolean> => {
    const res = await fetch(`${API_URL}/check-availability?hall_id=${hallId}&date=${date}`);
    const data = await res.json();
    return data.available;
  },
  createBooking: async (booking: Booking) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return res.json();
  },
  getAdminBookings: async () => {
    const res = await fetch(`${API_URL}/admin/bookings`);
    return res.json();
  },
  updateBookingStatus: async (id: number, status: string) => {
    const res = await fetch(`${API_URL}/admin/bookings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  createMenuItem: async (item: Omit<MenuItem, 'id'>) => {
    const res = await fetch(`${API_URL}/admin/menu-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  updateMenuItem: async (id: number, item: Omit<MenuItem, 'id'>) => {
    const res = await fetch(`${API_URL}/admin/menu-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  deleteMenuItem: async (id: number) => {
    const res = await fetch(`${API_URL}/admin/menu-items/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
