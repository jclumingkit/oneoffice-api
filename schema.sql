-- Start: Public
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public
  AUTHORIZATION postgres;
DO $$
DECLARE
    objectname text;
    objecttype text;
    enumname text;
    enumvalue text;
    funcname text;
BEGIN
    FOR objectname, objecttype IN
        SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public'
    LOOP
        IF objecttype = 'BASE TABLE' THEN
            EXECUTE 'DROP TABLE IF EXISTS ' || objectname || ' CASCADE';
        ELSIF objecttype = 'VIEW' THEN
            EXECUTE 'DROP VIEW IF EXISTS ' || objectname || ' CASCADE';
        END IF;
    END LOOP;
    FOR enumname, enumvalue IN
        SELECT t.typname, e.enumlabel
        FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || enumname || ' CASCADE';
    END LOOP;
    FOR funcname IN
        SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || funcname || ' CASCADE';
    END LOOP;
END $$;

CREATE TABLE app_source_table (
    app_source_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL ,
    app_source_name VARCHAR(4000) NOT NULL,
    app_source_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE app_source_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow READ for anon users" ON "public"."app_source_table"
AS PERMISSIVE FOR SELECT
USING (true);
-- End: Public

-- Start: Transaction
DROP SCHEMA IF EXISTS transaction_schema CASCADE;
CREATE SCHEMA transaction_schema
  AUTHORIZATION postgres;
DO $$
DECLARE
    objectname text;
    objecttype text;
    enumname text;
    enumvalue text;
    funcname text;
BEGIN
    FOR objectname, objecttype IN
        SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'transaction_schema'
    LOOP
        IF objecttype = 'BASE TABLE' THEN
            EXECUTE 'DROP TABLE IF EXISTS ' || objectname || ' CASCADE';
        ELSIF objecttype = 'VIEW' THEN
            EXECUTE 'DROP VIEW IF EXISTS ' || objectname || ' CASCADE';
        END IF;
    END LOOP;
    FOR enumname, enumvalue IN
        SELECT t.typname, e.enumlabel
        FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'transaction_schema'
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || enumname || ' CASCADE';
    END LOOP;
    FOR funcname IN
        SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'transaction_schema'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || funcname || ' CASCADE';
    END LOOP;
END $$;

CREATE TABLE transaction_schema.transaction_table (
    transaction_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL ,
    transaction_reference_id VARCHAR(4000) NOT NULL,
    transaction_service_name VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    transaction_payment_channel VARCHAR(50),
    transaction_total_amount BIGINT NOT NULL,
    transaction_status VARCHAR(20) DEFAULT 'PENDING_PAYMENT' NOT NULL,
    transaction_app_source_user_id UUID NOT NULL,
    transaction_app_source UUID REFERENCES app_source_table(app_source_id) NOT NULL
);

ALTER TABLE transaction_schema.transaction_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow READ for anon users" ON "transaction_schema"."transaction_table"
AS PERMISSIVE FOR SELECT
USING (true);

CREATE POLICY "Allow CREATE for anon users" ON "transaction_schema"."transaction_table"
AS PERMISSIVE FOR INSERT
TO anon
WITH CHECK (1=1);

CREATE POLICY "Allow UPDATE for anon users" ON "transaction_schema"."transaction_table"
AS PERMISSIVE FOR UPDATE
TO anon
USING (true);
-- End: Transaction

-- Start: Address
DROP SCHEMA IF EXISTS address_schema CASCADE;
CREATE SCHEMA address_schema
  AUTHORIZATION postgres;
DO $$
DECLARE
    objectname text;
    objecttype text;
    enumname text;
    enumvalue text;
    funcname text;
BEGIN
    FOR objectname, objecttype IN
        SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'address_schema'
    LOOP
        IF objecttype = 'BASE TABLE' THEN
            EXECUTE 'DROP TABLE IF EXISTS ' || objectname || ' CASCADE';
        ELSIF objecttype = 'VIEW' THEN
            EXECUTE 'DROP VIEW IF EXISTS ' || objectname || ' CASCADE';
        END IF;
    END LOOP;
    FOR enumname, enumvalue IN
        SELECT t.typname, e.enumlabel
        FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'address_schema'
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || enumname || ' CASCADE';
    END LOOP;
    FOR funcname IN
        SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'address_schema'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || funcname || ' CASCADE';
    END LOOP;
END $$;

CREATE TABLE address_schema.region_table(
  region_id UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY NOT NULL,
  region VARCHAR(4000) NOT NULL,
  region_is_disabled BOOLEAN DEFAULT false NOT NULL,
  region_is_available BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE address_schema.province_table(
  province_id UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY NOT NULL,
  province VARCHAR(4000) NOT NULL,
  province_is_disabled BOOLEAN DEFAULT false NOT NULL,
  province_is_available BOOLEAN DEFAULT true NOT NULL,

  province_region_id UUID REFERENCES address_schema.region_table(region_id) NOT NULL
);

CREATE TABLE address_schema.city_table(
  city_id UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY NOT NULL,
  city VARCHAR(4000) NOT NULL,
  city_is_disabled BOOLEAN DEFAULT false NOT NULL,
  city_is_available BOOLEAN DEFAULT true NOT NULL,

  city_province_id UUID REFERENCES address_schema.province_table(province_id) NOT NULL
);

CREATE TABLE address_schema.barangay_table(
  barangay_id UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY NOT NULL,
  barangay VARCHAR(4000) NOT NULL,
  barangay_zip_code VARCHAR(4000) NOT NULL,
  barangay_is_disabled BOOLEAN DEFAULT false NOT NULL,
  barangay_is_available BOOLEAN DEFAULT true NOT NULL,

  barangay_city_id UUID REFERENCES address_schema.city_table(city_id) NOT NULL
);

ALTER TABLE address_schema.region_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE address_schema.province_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE address_schema.city_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE address_schema.barangay_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow READ for anon users" ON "address_schema"."region_table"
AS PERMISSIVE FOR SELECT
USING (true);

CREATE POLICY "Allow READ for anon users" ON "address_schema"."province_table"
AS PERMISSIVE FOR SELECT
USING (true);

CREATE POLICY "Allow READ for anon users" ON "address_schema"."city_table"
AS PERMISSIVE FOR SELECT
USING (true);

CREATE POLICY "Allow READ for anon users" ON "address_schema"."barangay_table"
AS PERMISSIVE FOR SELECT
USING (true);
-- End: Address

INSERT INTO app_source_table(app_source_id, app_source_name) VALUES ('ba9e641e-d7fe-4d61-b9ee-85c919f457ca', 'Keep'), ('d513a2b5-c223-4f7b-a19f-165ad29655ec', 'Formsly'), ('5e42d2be-6789-4d46-8357-fc5a4e59631c', 'HR App');

