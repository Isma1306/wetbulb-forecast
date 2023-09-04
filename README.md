# wetbulb-forecast

A tiny app that calculates and shows the wet bulb temperature for a location.

if you want to know about the web-bulb temperature check here: https://en.wikipedia.org/wiki/Wet-bulb_temperature

the app uses data from https://open-meteo.com thanks for the data!!!

the BE takes the calls and calculates the wet-bulb temp using the following equation:

Tw = T _ arctan[0.151977 _ (rh% + 8.313659)^(1/2)] + arctan(T + rh%) - arctan(rh% - 1.676331) + 0.00391838 _(rh%)^(3/2) _ arctan(0.023101 \* rh%) - 4.686035

that as far as I know it is a good aproximation. Here you can read more about it: https://journals.ametsoc.org/view/journals/apme/50/11/jamc-d-11-0143.1.xml
