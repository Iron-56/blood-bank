
DROP TABLE IF EXISTS transaction_log CASCADE;
DROP TABLE IF EXISTS blood_donation CASCADE;
DROP TABLE IF EXISTS blood_inventory CASCADE;
DROP TABLE IF EXISTS recipient_request CASCADE;
DROP TABLE IF EXISTS hospital CASCADE;
DROP TABLE IF EXISTS donor CASCADE;

CREATE TABLE donor (
  donor_id         SERIAL PRIMARY KEY,
  first_name       VARCHAR(80) NOT NULL,
  last_name        VARCHAR(80) NOT NULL,
  email            VARCHAR(150) UNIQUE,
  phone            VARCHAR(30),
  blood_type       VARCHAR(5) NOT NULL,
  gender           VARCHAR(10),
  date_of_birth    DATE,
  address          TEXT,
  city             VARCHAR(80),
  state            VARCHAR(80),
  zip_code         VARCHAR(20),
  last_donation_date DATE,
  total_donations  INT DEFAULT 0 CHECK (total_donations >= 0),
  status           VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','unavailable')),
  medical_history  TEXT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE recipient_request (
  request_id        SERIAL PRIMARY KEY,
  hospital_id       INT REFERENCES hospital(hospital_id) ON DELETE CASCADE,
  hospital_name     VARCHAR(200),
  doctor_name       VARCHAR(120),
  contact_number    VARCHAR(30),
  blood_type        VARCHAR(5) NOT NULL,
  units_requested   INT NOT NULL CHECK (units_requested > 0),
  units_fulfilled   INT DEFAULT 0 CHECK (units_fulfilled >= 0),
  urgency_level     VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('normal','urgent','emergency')),
  patient_name      VARCHAR(150),
  patient_age       INT,
  patient_gender    VARCHAR(10),
  diagnosis_reason  TEXT,
  required_by_date  DATE,
  request_date      DATE DEFAULT CURRENT_DATE,
  request_status    VARCHAR(20) DEFAULT 'pending' CHECK (request_status IN ('pending','approved','rejected','fulfilled')),
  approved_by       VARCHAR(120),
  rejection_reason  TEXT,
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blood_inventory (
  bag_id            SERIAL PRIMARY KEY,
  bag_number        VARCHAR(100) UNIQUE NOT NULL,
  donor_id          INT REFERENCES donor(donor_id) ON DELETE SET NULL,
  donor_name        VARCHAR(200),
  blood_type        VARCHAR(5) NOT NULL,
  collection_date   DATE NOT NULL,
  expiry_date       DATE NOT NULL,
  volume_ml         INT CHECK (volume_ml > 0),
  component_type    VARCHAR(60),
  storage_location  VARCHAR(150),
  testing_status    VARCHAR(40) DEFAULT 'pending' CHECK (testing_status IN ('pending','tested','failed')),
  status            VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','reserved','assigned','expired','used')),
  assigned_to_request INT REFERENCES recipient_request(request_id) ON DELETE SET NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blood_donation (
  donation_id     SERIAL PRIMARY KEY,
  donor_id        INT REFERENCES donor(donor_id) ON DELETE CASCADE,
  donation_date   DATE NOT NULL,
  location        VARCHAR(200),
  units_ml        INT CHECK (units_ml > 0),
  status          VARCHAR(30) DEFAULT 'recorded' CHECK (status IN ('recorded','collected','rejected')),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_log (
  transaction_id  SERIAL PRIMARY KEY,
  request_id      INT REFERENCES recipient_request(request_id) ON DELETE CASCADE,
  bag_id          INT REFERENCES blood_inventory(bag_id) ON DELETE CASCADE,
  issued_by       VARCHAR(120),
  issue_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks         TEXT
);

CREATE INDEX IF NOT EXISTS idx_blood_inventory_type_status ON blood_inventory(blood_type, status);
CREATE INDEX IF NOT EXISTS idx_req_status_priority ON recipient_request(request_status, urgency_level);
CREATE INDEX IF NOT EXISTS idx_donor_blood_type ON donor(blood_type);

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


INSERT INTO donor(first_name,last_name,email,phone,blood_type,gender,date_of_birth,city,state,zip_code,medical_history)
VALUES
 ('Aish','Kumar','aish@example.com','9000010001','O+','Female','1998-02-10','CityA','StateX','500001','None'),
 ('Rahul','Patel','rahul@example.com','9000010002','A+','Male','1994-08-20','CityB','StateY','500002','None'),
 ('Sneha','Verma','sneha@example.com','9000010003','B+','Female','1990-06-15','CityC','StateZ','500003','None');

INSERT INTO hospital(name,registration_number,email,phone,address,city,state,zip_code,contact_person,contact_person_phone,contact_person_email,hospital_type,bed_capacity)
VALUES
 ('Metro Hospital','MET-001','metro@example.com','080100200','10 Metro Rd','CityA','StateX','500010','Dr. Sen','0809000001','sen@example.com','General',300),
 ('RiverCare','RIV-002','river@example.com','080200300','22 River St','CityB','StateY','500020','Dr. Lee','0809000002','lee@example.com','Specialty',120);

INSERT INTO blood_donation(donor_id, donation_date, location, units_ml, status)
VALUES
 (1, CURRENT_DATE - INTERVAL '12 days', 'Camp A', 450, 'collected'),
 (2, CURRENT_DATE - INTERVAL '20 days', 'Camp B', 450, 'collected');

INSERT INTO blood_inventory(bag_number, donor_id, donor_name, blood_type, collection_date, expiry_date, volume_ml, component_type, storage_location, testing_status, status)
VALUES
 ('BAG-SEED-001', 1, 'Aish Kumar', 'O+', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE + INTERVAL '30 days', 450, 'whole', 'Fridge 1', 'tested', 'available'),
 ('BAG-SEED-002', 2, 'Rahul Patel', 'A+', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '2 days', 450, 'whole', 'Fridge 1', 'tested', 'available');

INSERT INTO recipient_request(hospital_id, hospital_name, doctor_name, contact_number, blood_type, units_requested, urgency_level, patient_name, patient_age, patient_gender, diagnosis_reason, required_by_date)
VALUES (1, 'Metro Hospital', 'Dr. Sen', '0809000001', 'O+', 1, 'normal', 'Patient Alpha', 56, 'Male', 'Surgery', CURRENT_DATE + INTERVAL '1 day');


INSERT INTO donor(first_name,last_name,email,phone,blood_type,gender,date_of_birth,city,state,zip_code,medical_history)
VALUES
 ('Ananya','Sharma','ananya.sharma@example.com','9000010010','A+','Female','1997-03-12','Mumbai','Maharashtra','400001','None'),
 ('Karan','Mehta','karan.mehta@example.com','9000010011','B+','Male','1995-07-22','Delhi','Delhi','110001','None'),
 ('Priya','Rao','priya.rao@example.com','9000010012','O-','Female','1992-12-05','Bengaluru','Karnataka','560001','None'),
 ('Vikram','Singh','vikram.singh@example.com','9000010013','AB+','Male','1989-09-18','Chennai','Tamil Nadu','600001','Asthma'),
 ('Nisha','Patel','nisha.patel@example.com','9000010014','A-','Female','1998-02-14','Ahmedabad','Gujarat','380001','None'),
 ('Rohit','Kumar','rohit.kumar@example.com','9000010015','B-','Male','1990-05-30','Pune','Maharashtra','411001','None'),
 ('Sonia','Gupta','sonia.gupta@example.com','9000010016','O+','Female','1996-11-01','Hyderabad','Telangana','500001','None'),
 ('Mayank','Desai','mayank.desai@example.com','9000010017','A+','Male','1994-08-09','Surat','Gujarat','395001','None'),
 ('Isha','Nair','isha.nair@example.com','9000010018','B+','Female','1993-04-21','Kochi','Kerala','682001','None'),
 ('Aditya','Verma','aditya.verma@example.com','9000010019','O+','Male','1991-06-02','Lucknow','Uttar Pradesh','226001','None'),
 ('Rhea','Khan','rhea.khan@example.com','9000010020','AB-','Female','1999-10-10','Bhopal','Madhya Pradesh','462001','None'),
 ('Siddharth','Joshi','siddharth.joshi@example.com','9000010021','O-','Male','1988-01-25','Indore','Madhya Pradesh','452001','None'),
 ('Anil','Bhat','anil.bhat@example.com','9000010022','A+','Male','1987-12-12','Jaipur','Rajasthan','302001','None'),
 ('Megha','Reddy','megha.reddy@example.com','9000010023','B+','Female','1995-03-03','Vijayawada','Andhra Pradesh','520001','None'),
 ('Kavya','Shiv','kavya.shiv@example.com','9000010024','O+','Female','1996-07-07','Vadodara','Gujarat','390001','None'),
 ('Arnav','Chopra','arnav.chopra@example.com','9000010025','A-','Male','1992-02-20','Nagpur','Maharashtra','440001','None'),
 ('Tanya','Mittal','tanya.mittal@example.com','9000010026','B-','Female','1994-09-09','Dehradun','Uttarakhand','248001','None');

INSERT INTO hospital(name,registration_number,email,phone,address,city,state,zip_code,contact_person,contact_person_phone,contact_person_email,hospital_type,bed_capacity)
VALUES
 ('Green Valley Hospital','GVH-101','gvh@example.com','0807007001','5 Green St','Mumbai','Maharashtra','400010','Dr. Kapoor','0807007002','kapoor@gvh.com','General',180),
 ('Hope Care Center','HCC-202','hcc@example.com','0807007003','18 Hope Ave','Bengaluru','Karnataka','560010','Dr. Rao','0807007004','rao@hcc.com','Specialty',90),
 ('Sapphire Medical','SAP-303','sapphire@example.com','0807007005','77 Sapphire Rd','Chennai','Tamil Nadu','600010','Dr. Nair','0807007006','nair@sapphire.com','General',220);

INSERT INTO blood_donation(donor_id, donation_date, location, units_ml, status)
VALUES
 (4, CURRENT_DATE - INTERVAL '25 days', 'Camp North', 450, 'collected'),
 (5, CURRENT_DATE - INTERVAL '90 days', 'Camp East', 450, 'collected'),
 (6, CURRENT_DATE - INTERVAL '10 days', 'Drive South', 450, 'collected'),
 (7, CURRENT_DATE - INTERVAL '40 days', 'Drive West', 450, 'collected'),
 (8, CURRENT_DATE - INTERVAL '5 days', 'Camp City', 450, 'collected'),
 (9, CURRENT_DATE - INTERVAL '60 days', 'Camp Urban', 450, 'collected'),
 (10, CURRENT_DATE - INTERVAL '15 days', 'Camp Central', 450, 'collected');

INSERT INTO blood_inventory(bag_number, donor_id, donor_name, blood_type, collection_date, expiry_date, volume_ml, component_type, storage_location, testing_status, status)
VALUES
 ('BAG-1001', 4, 'Vikram Singh', 'AB+', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '15 days', 450, 'whole', 'Fridge B1', 'tested', 'available'),
 ('BAG-1002', 5, 'Nisha Patel', 'A-', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE - INTERVAL '1 day', 450, 'whole', 'Fridge B1', 'tested', 'available'),
 ('BAG-1003', 6, 'Rohit Kumar', 'B-', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '50 days', 450, 'whole', 'Fridge B2', 'tested', 'available'),
 ('BAG-1004', 7, 'Sonia Gupta', 'O+', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '2 days', 450, 'whole', 'Fridge B2', 'tested', 'available'),
 ('BAG-1005', 8, 'Mayank Desai', 'A+', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '80 days', 450, 'plasma', 'Freezer P1', 'tested', 'available'),
 ('BAG-1006', 9, 'Isha Nair', 'B+', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '0 days', 450, 'rbcs', 'Fridge C1', 'tested', 'available'),
 ('BAG-1007', 10, 'Aditya Verma', 'O+', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '35 days', 450, 'whole', 'Fridge C1', 'tested', 'available'),
 ('BAG-1008', 11, 'Rhea Khan', 'AB-', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '88 days', 450, 'whole', 'Fridge C2', 'tested', 'available'),
 ('BAG-1009', 12, 'Siddharth Joshi', 'O-', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '40 days', 450, 'whole', 'Fridge C2', 'tested', 'available'),
 ('BAG-1010', 13, 'Anil Bhat', 'A+', CURRENT_DATE - INTERVAL '32 days', CURRENT_DATE + INTERVAL '10 days', 450, 'whole', 'Fridge D1', 'tested', 'available'),
 ('BAG-1011', 14, 'Megha Reddy', 'B+', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '70 days', 450, 'plasma', 'Freezer P2', 'tested', 'available'),
 ('BAG-1012', 15, 'Kavya Shiv', 'O+', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '85 days', 450, 'rbcs', 'Fridge D2', 'tested', 'available'),
 ('BAG-1013', 16, 'Arnav Chopra', 'A-', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '5 days', 450, 'whole', 'Fridge D2', 'tested', 'available'),
 ('BAG-1014', 1, 'Abhijith Raj', 'O+', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '40 days', 450, 'whole', 'Fridge A1', 'tested', 'available'),
 ('BAG-1015', 2, 'Meera Singh', 'A+', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '5 days', 450, 'whole', 'Fridge A1', 'tested', 'available'),
 ('BAG-1016', 3, 'Ravi Kumar', 'B+', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 450, 'whole', 'Fridge A2', 'tested', 'available'),
 ('BAG-1017', 4, 'Vikram Singh', 'AB+', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '2 days', 450, 'whole', 'Fridge E1', 'tested', 'available'),
 ('BAG-1018', 5, 'Nisha Patel', 'A-', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE + INTERVAL '12 days', 450, 'plasma', 'Freezer P3', 'tested', 'available'),
 ('BAG-1019', 6, 'Rohit Kumar', 'B-', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '75 days', 450, 'rbcs', 'Fridge E2', 'tested', 'available'),
 ('BAG-1020', 7, 'Sonia Gupta', 'O+', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '30 days', 450, 'whole', 'Fridge E2', 'tested', 'available'),
 ('BAG-1021', 8, 'Mayank Desai', 'A+', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '5 days', 450, 'whole', 'Fridge F1', 'tested', 'available'),
 ('BAG-1022', 9, 'Isha Nair', 'B+', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '90 days', 450, 'plasma', 'Freezer P4', 'tested', 'available'),
 ('BAG-1023', 10, 'Aditya Verma', 'O+', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '100 days', 450, 'rbcs', 'Fridge F2', 'tested', 'available');

INSERT INTO recipient_request(hospital_id, hospital_name, doctor_name, contact_number, blood_type, units_requested, urgency_level, patient_name, patient_age, patient_gender, diagnosis_reason, required_by_date)
VALUES
 (3, 'Sapphire Medical', 'Dr. Nair', '0807007006', 'A+', 2, 'urgent', 'Patient Beta', 64, 'Female', 'Trauma', CURRENT_DATE + INTERVAL '1 day'),
 (4, 'Green Valley Hospital', 'Dr. Kapoor', '0807007002', 'O+', 1, 'normal', 'Patient Gamma', 30, 'Male', 'Surgery', CURRENT_DATE + INTERVAL '2 days'),
 (5, 'Hope Care Center', 'Dr. Rao', '0807007004', 'B+', 1, 'emergency', 'Patient Delta', 50, 'Male', 'Hemorrhage', CURRENT_DATE),
 (1, 'Metro Hospital', 'Dr. Sen', '0809000001', 'O+', 3, 'normal', 'Patient Epsilon', 45, 'Female', 'Transfusion', CURRENT_DATE + INTERVAL '3 days'),
 (2, 'RiverCare', 'Dr. Lee', '0809000002', 'A-', 1, 'urgent', 'Patient Zeta', 70, 'Male', 'Surgery', CURRENT_DATE + INTERVAL '1 day'),
 (3, 'Sapphire Medical', 'Dr. Nair', '0807007006', 'AB+', 1, 'normal', 'Patient Eta', 22, 'Female', 'Condition', CURRENT_DATE + INTERVAL '4 days'),
 (4, 'Green Valley Hospital', 'Dr. Kapoor', '0807007002', 'A+', 2, 'urgent', 'Patient Theta', 36, 'Female', 'Treatment', CURRENT_DATE + INTERVAL '2 days'),
 (5, 'Hope Care Center', 'Dr. Rao', '0807007004', 'O-', 1, 'normal', 'Patient Iota', 28, 'Male', 'Emergency', CURRENT_DATE + INTERVAL '1 day'),
 (1, 'Metro Hospital', 'Dr. Sen', '0809000001', 'B+', 2, 'normal', 'Patient Kappa', 60, 'Female', 'Anemia', CURRENT_DATE + INTERVAL '5 days');




