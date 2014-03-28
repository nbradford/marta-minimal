# Marta Minimal

Minimal App for Marta's Realtime Rail API

## Todo

1. Fix the geolocation 
    * Tt was working at some point, but I have no idea where it broke
2. Autorefresh more reasonably
    * The refresh rate is a little high as it sucks data.
    * Get rid of seconds? Larger Increments? Or estimate seconds in between?
3. Autorefresh off in Background 
    * Again a data drain, as the autorefresh doesn't pause for some reason
    * In addition, on resume, the autorefresh doesn't restart