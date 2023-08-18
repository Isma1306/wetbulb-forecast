# wetbulb-forecast
A tiny app that calculates and shows the wet bulb temperature for a location.

if you want to know about the web-bulb temperature check here: https://en.wikipedia.org/wiki/Wet-bulb_temperature

the app uses data from https://open-meteo.com thanks for the data!!!

the BE takes the calls and calculates the wet-bulb temp using the following equation:

Tw = T * arctan[0.151977 * (rh% + 8.313659)^(1/2)] + arctan(T + rh%) - arctan(rh% - 1.676331) + 0.00391838 *(rh%)^(3/2) * arctan(0.023101 * rh%) - 4.686035

that as far as I know it is a good aproximation.
