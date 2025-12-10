ALTER TABLE orders 
ADD COLUMN application_id UUID REFERENCES applications(id);