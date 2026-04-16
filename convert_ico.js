const fs = require('fs');
const path = require('path');

// Simple script to use PNG as ICO if no conversion lib available, or just rely on png.
// Most modern browsers accept PNG favicons, but we can also write a basic ICO header.
// Actually, it's safer to just use the PNG and update index.html. But user said "If favicon needs .ico, generate it from 2nd image".
// I'll try to use a Python script with Pillow to generate .ico
