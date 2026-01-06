/*
 * E-Fikishe Data Storage Utility
 * MVP-level data persistence for forms and user interactions
 * Uses localStorage with proper structure for real-world use
 */

class DataStorage {
  constructor() {
    this.prefix = 'efikishe_';
    this.storage = window.localStorage;
  }

  // Generic save method
  save(key, data) {
    try {
      const timestamp = new Date().toISOString();
      const record = {
        ...data,
        timestamp,
        id: this.generateId()
      };
      const storageKey = this.prefix + key;
      const existing = this.getAll(key);
      existing.push(record);
      this.storage.setItem(storageKey, JSON.stringify(existing));
      return { success: true, id: record.id };
    } catch (error) {
      console.error('Storage error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all records for a key
  getAll(key) {
    try {
      const storageKey = this.prefix + key;
      const data = this.storage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Retrieval error:', error);
      return [];
    }
  }

  // Get single record by ID
  getById(key, id) {
    const all = this.getAll(key);
    return all.find(item => item.id === id);
  }

  // Export data as JSON (for admin/backup)
  exportData(key) {
    const data = this.getAll(key);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efikishe_${key}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Waitlist specific methods
  saveWaitlist(data) {
    return this.save('waitlist', {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      interest: data.interest || 'general',
      source: data.source || 'website'
    });
  }

  // Booking specific methods
  saveBooking(data) {
    return this.save('bookings', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      pickup: data.pickup,
      destination: data.destination,
      date: data.date,
      time: data.time,
      package: data.package,
      status: 'pending'
    });
  }

  // Donation specific methods
  saveDonation(data) {
    return this.save('donations', {
      name: data.name,
      email: data.email,
      amount: parseFloat(data.amount),
      currency: 'USD',
      status: 'pending',
      paymentMethod: data.paymentMethod || 'not_processed'
    });
  }

  // Contact specific methods
  saveContact(data) {
    return this.save('contacts', {
      name: data.name,
      email: data.email,
      message: data.message,
      subject: data.subject || 'General inquiry',
      type: data.type || 'general'
    });
  }
}

// Initialize global instance
const dataStorage = new DataStorage();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataStorage;
}

