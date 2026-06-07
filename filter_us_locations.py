#!/usr/bin/env python3
"""
Filter script to remove all non-US locations from JSON/GeoJSON files in the Data folder.
Keeps only locations with coordinates within the USA bounding box (including Alaska/Hawaii).
"""

import json
import os
from pathlib import Path

# US bounding box (lat, lng ranges)
# Continental US: lat 24-50, lng -125 to -66
# Alaska: lat 51-72, lng -180 to -130
# Hawaii: lat 18-23, lng -161 to -154
CONTINENTAL_US = {"lat_min": 24, "lat_max": 50, "lng_min": -125, "lng_max": -66}
ALASKA = {"lat_min": 51, "lat_max": 72, "lng_min": -180, "lng_max": -130}
HAWAII = {"lat_min": 18, "lat_max": 23, "lng_min": -161, "lng_max": -154}

def is_us_coordinate(lng, lat):
    """Check if a coordinate is within the USA."""
    # Continental US
    if CONTINENTAL_US["lat_min"] <= lat <= CONTINENTAL_US["lat_max"] and CONTINENTAL_US["lng_min"] <= lng <= CONTINENTAL_US["lng_max"]:
        return True
    # Alaska
    if ALASKA["lat_min"] <= lat <= ALASKA["lat_max"] and ALASKA["lng_min"] <= lng <= ALASKA["lng_max"]:
        return True
    # Hawaii
    if HAWAII["lat_min"] <= lat <= HAWAII["lat_max"] and HAWAII["lng_min"] <= lng <= HAWAII["lng_max"]:
        return True
    return False

def extract_coordinates(obj):
    """Extract coordinates from various GeoJSON/JSON formats."""
    # GeoJSON Feature: geometry.coordinates
    if isinstance(obj, dict):
        if "geometry" in obj and "coordinates" in obj["geometry"]:
            coords = obj["geometry"]["coordinates"]
            if isinstance(coords, list) and len(coords) >= 2:
                return (coords[0], coords[1])  # (lng, lat)
        # Flat object with lat/lng fields
        if "coordinates" in obj and isinstance(obj["coordinates"], dict):
            lat = obj["coordinates"].get("lat")
            lng = obj["coordinates"].get("lng")
            if lat is not None and lng is not None:
                return (lng, lat)
        # Direct lat/lng fields
        if "lat" in obj and "lng" in obj:
            lat = obj.get("lat")
            lng = obj.get("lng")
            if lat is not None and lng is not None:
                return (lng, lat)
    return None

def filter_features(data):
    """Filter out non-US locations from GeoJSON/JSON data."""
    if isinstance(data, list):
        # Array of features
        filtered = []
        removed = 0
        for item in data:
            coords = extract_coordinates(item)
            if coords:
                lng, lat = coords
                if is_us_coordinate(lng, lat):
                    filtered.append(item)
                else:
                    removed += 1
                    print(f"  Removed: {item.get('@id') or item.get('id') or 'unknown'} at ({lng}, {lat})")
            else:
                filtered.append(item)
        return filtered, removed
    elif isinstance(data, dict):
        # GeoJSON FeatureCollection
        if "features" in data:
            filtered_features = []
            removed = 0
            for feature in data["features"]:
                coords = extract_coordinates(feature)
                if coords:
                    lng, lat = coords
                    if is_us_coordinate(lng, lat):
                        filtered_features.append(feature)
                    else:
                        removed += 1
                        print(f"  Removed: {feature.get('@id') or feature.get('id') or 'unknown'} at ({lng}, {lat})")
                else:
                    filtered_features.append(feature)
            data["features"] = filtered_features
            return data, removed
    return data, 0

def process_file(file_path):
    """Process a single JSON/GeoJSON file."""
    print(f"\nProcessing: {file_path.name}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        filtered_data, removed_count = filter_features(data)
        
        if removed_count > 0:
            # Backup original
            backup_path = file_path.with_suffix(file_path.suffix + '.bak')
            with open(backup_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"  Backed up to: {backup_path.name}")
            
            # Write filtered data
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(filtered_data, f, indent=2)
            print(f"  ✓ Removed {removed_count} non-US location(s)")
            print(f"  ✓ Saved filtered data to: {file_path.name}")
        else:
            print(f"  ✓ No non-US locations found")
        
        return removed_count
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0

def main():
    """Main entry point."""
    data_dir = Path(__file__).parent / "Data"
    
    if not data_dir.exists():
        print(f"Error: Data directory not found at {data_dir}")
        return
    
    json_files = list(data_dir.glob("*.json")) + list(data_dir.glob("*.geojson"))
    
    if not json_files:
        print("No JSON/GeoJSON files found in Data folder")
        return
    
    print(f"Found {len(json_files)} JSON/GeoJSON files in Data folder")
    print("=" * 60)
    
    total_removed = 0
    for file_path in sorted(json_files):
        removed = process_file(file_path)
        total_removed += removed
    
    print("\n" + "=" * 60)
    print(f"Summary: Removed {total_removed} total non-US location(s)")
    print("Backups created with .bak extension for all modified files")

if __name__ == "__main__":
    main()
