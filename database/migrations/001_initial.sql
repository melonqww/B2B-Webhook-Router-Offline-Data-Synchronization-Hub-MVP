CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    raw_headers JSONB,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_source ON webhook_events(source);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    synced_at TIMESTAMPTZ,
    client_created_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_client_id ON ledger_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_status ON ledger_entries(status);

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    square_footage NUMERIC(10, 2),
    bedrooms INTEGER,
    bathrooms NUMERIC(3, 1),
    price NUMERIC(12, 2),
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_zip VARCHAR(10),
    description TEXT,
    amenities JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_square_footage ON properties(square_footage);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location_state, location_city);

INSERT INTO properties (name, property_type, square_footage, bedrooms, bathrooms, price, location_city, location_state, location_zip, amenities) VALUES
('Sunset Medical Tower', 'medical', 45000, 0, 12, 12500000, 'Miami', 'FL', '33101', '["Elevator","Parking Garage","Security System","HVAC Backup"]'),
('Green Valley Clinic', 'medical', 12000, 0, 6, 3400000, 'Austin', 'TX', '73301', '["Handicap Access","Parking Lot","Generator"]'),
('Pacific Health Center', 'medical', 28000, 0, 8, 8900000, 'San Diego', 'CA', '92101', '["Underground Parking","Solar Panels","Backup Generator"]'),
('Maple Residential Care', 'residential', 8500, 12, 8, 2100000, 'Portland', 'OR', '97201', '["Garden","Laundry","Common Room"]'),
('Heritage Assisted Living', 'residential', 22000, 30, 15, 6700000, 'Chicago', 'IL', '60601', '["Dining Hall","Garden","Physical Therapy Room","Parking"]'),
('Desert Springs Motel', 'motel', 9500, 20, 20, 1800000, 'Phoenix', 'AZ', '85001', '["Pool","Parking","Vending Machines"]'),
('Oceanview Motel', 'motel', 7200, 15, 15, 950000, 'Santa Monica', 'CA', '90401', '["Beach Access","Parking","WiFi"]'),
('Highway Inn & Suites', 'motel', 11000, 25, 25, 2200000, 'Denver', 'CO', '80201', '["Restaurant","Pool","Conference Room"]'),
('Suburban Office Plaza', 'commercial', 35000, 0, 4, 7800000, 'Dallas', 'TX', '75201', '["Cafeteria","Meeting Rooms","Reception"]'),
('Tech Park Building A', 'commercial', 55000, 0, 6, 14200000, 'San Jose', 'CA', '95101', '["Server Room","Open Plan","ROOF Deck","EV Charging"]');
