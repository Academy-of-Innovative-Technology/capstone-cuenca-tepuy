const directories = [
  {
    property: "latitude",
    paths: ["latitude", "Latitude", ""],
  },
  {
    property: "longitude",
    paths: ["longitude", "Longitude", ""],
  },
  {
    property: "address",
    paths: ["address", "Address"],
  },
  {
    property: "name",
    paths: ["name", "provider", "center_name"],
  },
  {
    property: "contact.name",
    paths: ["contact.name"],
  },
  {
    property: "contact.phone",
    paths: ["contact.phone"],
  },
  {
    property: "contact.email",
    paths: ["contact.email"],
  },
  {
    property: "contact.website",
    paths: ["contact.website"],
  },
];

class DataStandardizer {
  constructor(data, directories) {
    this.data = data;
    this.directories = directories;
  }

  async process() {
    const result = {};

    for (const entry of this.directories) {
      let value = this.tryPaths(entry.paths);

      // Fallback for lat/lng using Mapbox
      if (value === null && this.isLocationProperty(entry.property)) {
        value = await this.fetchMapboxFallback(entry.property);
      }

      result[entry.property] = value;
    }

    return result;
  }

  tryPaths(paths) {
    for (const path of paths) {
      const value = this.getValueByPath(this.data, path);

      if (value !== undefined && value !== null) {
        return value;
      }
    }
    return null;
  }

  isLocationProperty(property) {
    return property === "latitude" || property === "longitude";
  }

  flattenAddress(addressObj) {
    if (!addressObj || typeof addressObj !== "object") return null;

    const parts = [
      addressObj.street,
      addressObj.city,
      addressObj.state,
      addressObj.zip,
    ].filter(Boolean); // remove null/undefined

    return parts.join(", ");
  }

  async fetchMapboxFallback(property) {
    let address = this.extractAddress();

    // If address is an object → flatten it
    if (typeof address === "object") {
      address = this.flattenAddress(address);
    }

    if (!address || !API_KEYS?.MAPBOX_API_TOKEN_ACCESS_KEY) {
      return null;
    }

    try {
      const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}&access_token=${API_KEYS.MAPBOX_API_TOKEN_ACCESS_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      const coords = data?.features?.[0]?.geometry?.coordinates;

      if (!coords) return null;

      if (property === "latitude") return coords[1];
      if (property === "longitude") return coords[0];

      return null;
    } catch (error) {
      console.error("Mapbox fallback failed:", error);
      return null;
    }
  }

  extractAddress() {
    return (
      this.getValueByPath(this.data, "address") ||
      this.getValueByPath(this.data, "location.address") ||
      this.getValueByPath(this.data, "Coordinates.address") ||
      null
    );
  }

  getValueByPath(obj, path) {
    if (!path) return undefined;

    const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let current = obj;

    for (const part of parts) {
      if (current == null) return undefined;
      current = current[part];
    }

    return current;
  }
}
