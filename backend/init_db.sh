#!/bin/bash

if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

DB_NAME="blood_bank"

if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    read -p "Database '$DB_NAME' already exists. Drop and recreate? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping existing database..."
        dropdb $DB_NAME
    else
        echo "Setup cancelled."
        exit 1
    fi
fi

echo "Creating database '$DB_NAME'..."
createdb $DB_NAME

if [ $? -ne 0 ]; then
    echo "Failed to create database. Please check your PostgreSQL installation."
    exit 1
fi

psql -d $DB_NAME -f database/schema.sql

if [ $? -eq 0 ]; then
    echo "Database setup completed successfully!"
    echo ""
    echo "Database Statistics:"
    psql -d $DB_NAME -c "SELECT 
        (SELECT COUNT(*) FROM donor) as donors,
        (SELECT COUNT(*) FROM hospital) as hospitals,
        (SELECT COUNT(*) FROM blood_inventory) as inventory_items,
        (SELECT COUNT(*) FROM recipient_request) as requests;"
    echo ""
    echo "Done"
else
    echo "Failed to load schema. Please check the SQL file for errors."
    exit 1
fi
