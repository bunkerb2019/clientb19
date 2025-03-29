export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Remove the leading '#' if it's there
    hex = hex.replace(/^#/, '');
  
    // If shorthand notation is used (e.g. "03F"), convert to full form ("0033FF")
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
  
    // Check if we now have a valid 6-character hex string
    if (hex.length !== 6) {
      return null;
    }
  
    // Parse the r, g, b values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    return { r, g, b };
  }