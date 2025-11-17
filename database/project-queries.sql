-- Drop old objects if you want a fresh start (use with caution)
DROP TABLE IF EXISTS transaction_log CASCADE;
DROP TABLE IF EXISTS blood_donation CASCADE;
DROP TABLE IF EXISTS blood_inventory CASCADE;
DROP TABLE IF EXISTS recipient_request CASCADE;
DROP TABLE IF EXISTS hospital CASCADE;
DROP TABLE IF EXISTS donor CASCADE;

-- Domain types for strong constraints
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blood_group') THEN
    CREATE TYPE blood_group AS ENUM ('O+','O-','A+','A-','B+','B-','AB+','AB-');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'urgency_level_t') THEN
    CREATE TYPE urgency_level_t AS ENUM ('normal','urgent','emergency');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status_t') THEN
    CREATE TYPE request_status_t AS ENUM ('pending','approved','rejected','fulfilled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inventory_status_t') THEN
    CREATE TYPE inventory_status_t AS ENUM ('available','reserved','assigned','expired','used');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'testing_status_t') THEN
    CREATE TYPE testing_status_t AS ENUM ('pending','tested','failed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type_t') THEN
    CREATE TYPE transaction_type_t AS ENUM ('issue','reserve','return');
  END IF;
END$$;

-- Donor
CREATE TABLE donor (
  donor_id         SERIAL PRIMARY KEY,
  first_name       VARCHAR(80) NOT NULL,
  last_name        VARCHAR(80) NOT NULL,
  email            VARCHAR(150) UNIQUE,
  phone            VARCHAR(30),
  blood_type       blood_group NOT NULL,
  gender           VARCHAR(16),
  date_of_birth    DATE,
  address          TEXT,
  city             VARCHAR(80),
  state            VARCHAR(80),
  zip_code         VARCHAR(20),
  status           VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','unavailable')),
  medical_history  TEXT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospital
CREATE TABLE hospital (
  hospital_id         SERIAL PRIMARY KEY,
  name                VARCHAR(200) NOT NULL,
  registration_number VARCHAR(100) UNIQUE,
  email               VARCHAR(150),
  phone               VARCHAR(30),
  address             TEXT,
  city                VARCHAR(80),
  state               VARCHAR(80),
  zip_code            VARCHAR(20),
  contact_person      VARCHAR(120),
  contact_person_phone VARCHAR(30),
  contact_person_email VARCHAR(150),
  hospital_type       VARCHAR(60),
  bed_capacity        INT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipient request (references hospital; no duplicate hospital name)
CREATE TABLE recipient_request (
  request_id        SERIAL PRIMARY KEY,
  hospital_id       INT NOT NULL REFERENCES hospital(hospital_id) ON DELETE RESTRICT,
  doctor_name       VARCHAR(120),
  doctor_contact_number VARCHAR(30),
  blood_type        blood_group NOT NULL,
  units_requested   INT NOT NULL CHECK (units_requested > 0),
  units_fulfilled   INT DEFAULT 0 CHECK (units_fulfilled >= 0),
  urgency_level     urgency_level_t DEFAULT 'normal',
  patient_name      VARCHAR(150),
  patient_age       INT,
  patient_gender    VARCHAR(16),
  diagnosis_reason  TEXT,
  required_by_date  DATE,
  request_date      DATE DEFAULT CURRENT_DATE,
  request_status    request_status_t DEFAULT 'pending',
  approved_by       VARCHAR(120),
  rejection_reason  TEXT,
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood inventory (no donor_name duplication; reference donor optional)
CREATE TABLE blood_inventory (
  bag_id            SERIAL PRIMARY KEY,
  bag_number        VARCHAR(100) UNIQUE NOT NULL,
  donor_id          INT REFERENCES donor(donor_id) ON DELETE SET NULL,
  blood_type        blood_group NOT NULL,
  collection_date   DATE NOT NULL,
  expiry_date       DATE NOT NULL,
  volume_ml         INT NOT NULL CHECK (volume_ml > 0),
  component_type    VARCHAR(60),
  storage_location  VARCHAR(150),
  testing_status    testing_status_t DEFAULT 'pending',
  status            inventory_status_t DEFAULT 'available',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood donations (records of donations; canonical source of donation events)
CREATE TABLE blood_donation (
  donation_id     SERIAL PRIMARY KEY,
  donor_id        INT NOT NULL REFERENCES donor(donor_id) ON DELETE CASCADE,
  donation_date   DATE NOT NULL,
  location        VARCHAR(200),
  units_ml        INT NOT NULL CHECK (units_ml > 0),
  status          VARCHAR(30) DEFAULT 'recorded' CHECK (status IN ('recorded','collected','rejected')),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction log: canonical bag <-> request mapping + issued amount + type
CREATE TABLE transaction_log (
  transaction_id  SERIAL PRIMARY KEY,
  request_id      INT REFERENCES recipient_request(request_id) ON DELETE CASCADE,
  bag_id          INT REFERENCES blood_inventory(bag_id) ON DELETE CASCADE,
  units_ml        INT NOT NULL CHECK (units_ml > 0),
  transaction_type transaction_type_t DEFAULT 'issue',
  issued_by       VARCHAR(120),
  issue_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks         TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blood_inventory_type_status ON blood_inventory(blood_type, status);
CREATE INDEX IF NOT EXISTS idx_req_status_priority ON recipient_request(request_status, urgency_level);
CREATE INDEX IF NOT EXISTS idx_donor_blood_type ON donor(blood_type);
CREATE INDEX IF NOT EXISTS idx_transaction_log_request ON transaction_log(request_id);
CREATE INDEX IF NOT EXISTS idx_transaction_log_bag ON transaction_log(bag_id);
CREATE INDEX IF NOT EXISTS idx_donation_donor_date ON blood_donation(donor_id, donation_date);

-- Trigger: mark expired bags
CREATE OR REPLACE FUNCTION fn_set_expired_if_needed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.expiry_date < CURRENT_DATE THEN
    NEW.status := 'expired';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_blood_inventory_set_expired ON blood_inventory;
CREATE TRIGGER trg_blood_inventory_set_expired
BEFORE INSERT OR UPDATE ON blood_inventory
FOR EACH ROW EXECUTE FUNCTION fn_set_expired_if_needed();

-- Views for derived information
CREATE OR REPLACE VIEW v_available_blood AS
SELECT blood_type, COUNT(*) AS available_count
FROM blood_inventory
WHERE status = 'available'
  AND expiry_date >= CURRENT_DATE
GROUP BY blood_type
ORDER BY blood_type;

CREATE OR REPLACE VIEW v_near_expiry AS
SELECT 
  bag_id, bag_number, blood_type, donor_id, 
  collection_date, expiry_date, status,
  (expiry_date - CURRENT_DATE) AS days_to_expiry
FROM blood_inventory
WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY expiry_date;

-- Donor stats as a view (preferred to storing counters)
CREATE OR REPLACE VIEW v_donor_stats AS
SELECT d.donor_id,
       COUNT(bd.donation_id) AS total_donations,
       MAX(bd.donation_date) AS last_donation_date
FROM donor d
LEFT JOIN blood_donation bd ON bd.donor_id = d.donor_id
GROUP BY d.donor_id;

INSERT INTO donor (first_name, last_name, email, phone, blood_type, gender, date_of_birth, address, city, state, zip_code, medical_history)
VALUES
('Aish', 'Kumar', 'aish.k@example.com', '9000010001', 'O+', 'Female', '1998-02-10', 'Street 12', 'Hyderabad', 'Telangana', '500001', 'None'),
('Rahul', 'Patel', 'rahul.p@example.com', '9000010002', 'A+', 'Male', '1994-08-20', 'Sector 9', 'Ahmedabad', 'Gujarat', '380001', 'None'),
('Sneha', 'Verma', 's.verma@example.com', '9000010003', 'B+', 'Female', '1990-06-15', 'Lane 4', 'Pune', 'Maharashtra', '411001', 'None'),
('Vikram', 'Singh', 'vikram.s@example.com', '9000010004', 'AB+', 'Male', '1989-09-18', 'MG Road', 'Chennai', 'Tamil Nadu', '600001', 'Asthma'),
('Nisha', 'Patel', 'nisha.p@example.com', '9000010005', 'A-', 'Female', '1998-02-14', 'Cross St', 'Bengaluru', 'Karnataka', '560001', 'None'),
('Rohit', 'Kumar', 'rohit.k@example.com', '9000010006', 'B-', 'Male', '1990-05-30', 'Hill View', 'Mumbai', 'Maharashtra', '400001', 'None'),
('Sonia', 'Gupta', 'sonia.g@example.com', '9000010007', 'O+', 'Female', '1996-11-01', 'Park Lane', 'Delhi', 'Delhi', '110001', 'None'),
('Mayank', 'Desai', 'mayank.d@example.com', '9000010008', 'A+', 'Male', '1994-08-09', 'Main Road', 'Surat', 'Gujarat', '395001', 'None'),
('Isha', 'Nair', 'isha.n@example.com', '9000010009', 'B+', 'Female', '1993-04-21', 'Ocean St', 'Kochi', 'Kerala', '682001', 'None'),
('Aditya', 'Verma', 'aditya.v@example.com', '9000010010', 'O-', 'Male', '1991-06-02', 'Lake Rd', 'Lucknow', 'Uttar Pradesh', '226001', 'None');

INSERT INTO hospital (name, registration_number, email, phone, address, city, state, zip_code, contact_person, contact_person_phone, contact_person_email, hospital_type, bed_capacity)
VALUES
('Metro Hospital', 'MET-001', 'metro@example.com', '0801110001', '10 Metro Rd', 'Hyderabad', 'Telangana', '500010', 'Dr. Sen', '9001001001', 'sen@metro.com', 'General', 200),
('RiverCare', 'RIV-002', 'river@example.com', '0801110002', '22 River St', 'Ahmedabad', 'Gujarat', '380020', 'Dr. Lee', '9001001002', 'lee@river.com', 'Specialty', 150),
('Green Valley', 'GVH-101', 'gvh@example.com', '0801110003', '5 Green Ln', 'Mumbai', 'Maharashtra', '400010', 'Dr. Kapoor', '9001001003', 'kapoor@gvh.com', 'General', 250),
('Hope Care', 'HCC-202', 'hcc@example.com', '0801110004', '18 Hope Ave', 'Bengaluru', 'Karnataka', '560010', 'Dr. Rao', '9001001004', 'rao@hcc.com', 'Specialty', 120),
('Sapphire Medical', 'SAP-303', 'sapphire@example.com', '0801110005', '77 Sapphire Rd', 'Chennai', 'Tamil Nadu', '600010', 'Dr. Nair', '9001001005', 'nair@sapphire.com', 'General', 300),
('Lotus Hospital', 'LOT-404', 'lotus@example.com', '0801110006', '12 Lotus St', 'Delhi', 'Delhi', '110010', 'Dr. Amit', '9001001006', 'amit@lotus.com', 'General', 180),
('City Health', 'CH-505', 'ch@example.com', '0801110007', '44 City Rd', 'Kochi', 'Kerala', '682010', 'Dr. Raghav', '9001001007', 'raghav@ch.com', 'Specialty', 140),
('Unity Care', 'UC-606', 'uc@example.com', '0801110008', '88 Unity St', 'Lucknow', 'Uttar Pradesh', '226010', 'Dr. Thomas', '9001001008', 'thomas@uc.com', 'General', 160),
('Sunrise Hospital', 'SUN-707', 'sunrise@example.com', '0801110009', '33 Sunrise Rd', 'Pune', 'Maharashtra', '411020', 'Dr. Mehta', '9001001009', 'mehta@sunrise.com', 'Specialty', 210),
('Central Medical', 'CEN-808', 'central@example.com', '0801110010', '2 Central Ln', 'Surat', 'Gujarat', '395010', 'Dr. Iyer', '9001001010', 'iyer@central.com', 'General', 190);

INSERT INTO recipient_request (hospital_id, doctor_name, doctor_contact_number, blood_type, units_requested, urgency_level, patient_name, patient_age, patient_gender, diagnosis_reason, required_by_date)
VALUES
(1, 'Dr. Sen', '9002002001', 'O+', 2, 'normal', 'Patient A', 45, 'Male', 'Surgery', CURRENT_DATE + 2),
(2, 'Dr. Lee', '9002002002', 'A+', 1, 'urgent', 'Patient B', 60, 'Female', 'Trauma', CURRENT_DATE + 1),
(3, 'Dr. Kapoor', '9002002003', 'B+', 3, 'normal', 'Patient C', 32, 'Male', 'Transfusion', CURRENT_DATE + 3),
(4, 'Dr. Rao', '9002002004', 'AB+', 1, 'emergency', 'Patient D', 25, 'Female', 'Hemorrhage', CURRENT_DATE),
(5, 'Dr. Nair', '9002002005', 'O-', 2, 'urgent', 'Patient E', 70, 'Female', 'Critical Care', CURRENT_DATE + 1),
(6, 'Dr. Amit', '9002002006', 'A-', 1, 'normal', 'Patient F', 54, 'Male', 'Surgery', CURRENT_DATE + 4),
(7, 'Dr. Raghav', '9002002007', 'B-', 1, 'urgent', 'Patient G', 40, 'Male', 'Severe Anemia', CURRENT_DATE + 1),
(8, 'Dr. Thomas', '9002002008', 'O+', 2, 'normal', 'Patient H', 29, 'Female', 'Procedure', CURRENT_DATE + 5),
(9, 'Dr. Mehta', '9002002009', 'A+', 1, 'urgent', 'Patient I', 35, 'Female', 'Internal Injury', CURRENT_DATE + 2),
(10, 'Dr. Iyer', '9002002010', 'AB-', 1, 'normal', 'Patient J', 67, 'Male', 'Surgery', CURRENT_DATE + 3);

INSERT INTO blood_donation (donor_id, donation_date, location, units_ml, status)
VALUES
(1, CURRENT_DATE - 20, 'Camp A', 450, 'collected'),
(2, CURRENT_DATE - 15, 'Camp B', 450, 'collected'),
(3, CURRENT_DATE - 10, 'Camp C', 450, 'collected'),
(4, CURRENT_DATE - 30, 'Drive North', 450, 'collected'),
(5, CURRENT_DATE - 5,  'Drive East', 450, 'collected'),
(6, CURRENT_DATE - 40, 'Camp D', 450, 'collected'),
(7, CURRENT_DATE - 12, 'Camp E', 450, 'collected'),
(8, CURRENT_DATE - 7,  'Camp F', 450, 'collected'),
(9, CURRENT_DATE - 18, 'Drive South', 450, 'collected'),
(10,CURRENT_DATE - 25, 'Camp G', 450, 'collected');

INSERT INTO blood_inventory (bag_number, donor_id, blood_type, collection_date, expiry_date, volume_ml, component_type, storage_location, testing_status, status)
VALUES
('BAG-1001', 1, 'O+', CURRENT_DATE - 20, CURRENT_DATE + 40, 450, 'whole', 'Fridge A1', 'tested', 'available'),
('BAG-1002', 2, 'A+', CURRENT_DATE - 15, CURRENT_DATE + 35, 450, 'whole', 'Fridge A1', 'tested', 'available'),
('BAG-1003', 3, 'B+', CURRENT_DATE - 10, CURRENT_DATE + 30, 450, 'rbcs', 'Fridge B1', 'tested', 'available'),
('BAG-1004', 4, 'AB+', CURRENT_DATE - 30, CURRENT_DATE + 10, 450, 'whole', 'Fridge B2', 'tested', 'available'),
('BAG-1005', 5, 'A-', CURRENT_DATE - 5, CURRENT_DATE + 55, 450, 'plasma', 'Freezer P1', 'tested', 'available'),
('BAG-1006', 6, 'B-', CURRENT_DATE - 40, CURRENT_DATE - 5, 450, 'whole', 'Fridge C1', 'tested', 'expired'),
('BAG-1007', 7, 'O+', CURRENT_DATE - 12, CURRENT_DATE + 48, 450, 'whole', 'Fridge C2', 'tested', 'available'),
('BAG-1008', 8, 'A+', CURRENT_DATE - 7, CURRENT_DATE + 63, 450, 'plasma', 'Freezer P2', 'tested', 'available'),
('BAG-1009', 9, 'B+', CURRENT_DATE - 18, CURRENT_DATE + 42, 450, 'whole', 'Fridge D1', 'tested', 'available'),
('BAG-1010',10, 'O-', CURRENT_DATE - 25, CURRENT_DATE + 20, 450, 'rbcs', 'Fridge D2', 'tested', 'available');

INSERT INTO transaction_log (request_id, bag_id, units_ml, transaction_type, issued_by, remarks)
VALUES
(1, 1, 450, 'issue', 'Admin', 'Issued for surgery'),
(2, 2, 450, 'issue', 'Admin', 'Emergency requirement'),
(3, 3, 450, 'issue', 'Admin', 'Routine transfusion'),
(4, 4, 450, 'issue', 'Admin', 'Emergency trauma case'),
(5, 5, 450, 'issue', 'Admin', 'Urgent need'),
(6, 6, 450, 'issue', 'Admin', 'Issued despite near expiry'),
(7, 7, 450, 'issue', 'Admin', 'Severe anemia case'),
(8, 8, 450, 'issue', 'Admin', 'Procedure support'),
(9, 9, 450, 'issue', 'Admin', 'Internal injury'),
(10,10,450, 'issue', 'Admin', 'Surgery scheduled');
